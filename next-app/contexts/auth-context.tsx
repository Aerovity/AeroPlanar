"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

interface Profile {
  id: string
  first_name?: string
  last_name?: string
  username?: string
  avatar_url?: string
  is_admin?: boolean
  credits?: number
  updated_at?: string
  created_at?: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in fetchProfile:', error)
      return null
    }
  }

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
    }
  }

  useEffect(() => {
    const getSession = async () => {
      try {
        setLoading(true)
        
        // Try to get session with timeout
        let session = null
        
        try {
          const sessionPromise = supabase.auth.getSession()
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Session fetch timeout')), 5000)
          )
          
          const result = await Promise.race([sessionPromise, timeoutPromise]) as any
          session = result.data?.session
        } catch (timeoutError) {
          console.warn('getSession timeout, trying fallback recovery...')
          // Don't throw, just continue to fallback
          throw timeoutError
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id)
          setProfile(profileData)
        } else {
          setProfile(null)
        }
      } catch (error) {
        console.error('Error getting session:', error)
        
        // Fallback: try to recover from localStorage 
        try {
          // Check multiple possible localStorage keys Supabase might use
          const keys = [
            'supabase.auth.token',
            `sb-${supabase.supabaseUrl.split('//')[1].split('.')[0]}-auth-token`,
            'sb-auth-token'
          ]
          
          for (const key of keys) {
            const storedAuth = localStorage.getItem(key)
            if (storedAuth) {
              const parsedAuth = JSON.parse(storedAuth)
              
              // Try different possible structures
              const sessionData = parsedAuth?.currentSession || parsedAuth?.session || parsedAuth
              
              if (sessionData?.user && sessionData?.access_token) {
                setUser(sessionData.user)
                setSession(sessionData)
                
                // Only fetch profile if we have a valid user
                try {
                  const profileData = await fetchProfile(sessionData.user.id)
                  setProfile(profileData)
                } catch (profileError) {
                  console.warn('Could not fetch profile during fallback:', profileError)
                  setProfile(null)
                }
                return
              }
            }
          }
        } catch (fallbackError) {
          console.warn('Fallback auth recovery failed:', fallbackError)
        }
        
        // Clear state if everything fails
        setSession(null)
        setUser(null)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (event === 'SIGNED_IN' && session?.user) {
        // Force fresh profile fetch on sign in
        const profileData = await fetchProfile(session.user.id)
        setProfile(profileData)
      } else if (event === 'SIGNED_OUT' || !session?.user) {
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signOut = async () => {
    try {
      // Immediately clear local state for instant UI feedback
      setLoading(true)
      setUser(null)
      setProfile(null)
      setSession(null)
      
      // Navigate immediately
      router.push('/')
      
      // Sign out from Supabase with timeout
      const signOutPromise = supabase.auth.signOut()
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign out timeout')), 3000)
      )
      
      try {
        await Promise.race([signOutPromise, timeoutPromise])
      } catch (error) {
        console.error('Sign out timeout or error:', error)
        // Still continue - local state is already cleared
      }
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signOut,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}