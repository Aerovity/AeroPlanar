"use client"

import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Upload, Save, User, Camera } from "lucide-react"
import { Footer } from "@/components/landing/footer"
import { Spotlight } from "@/components/ui/spotlight-new"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { SpotlightButton } from "@/components/ui/spotlight-button"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  username: string | null
  avatar_url: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
  email: string | null
}

export default function AccountPage() {
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
  })
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    getProfile()
  }, [])

  const getProfile = async () => {
    try {
      setLoading(true)
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        throw userError
      }

      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      // Get profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError
      }

      if (profileData) {
        setProfile(profileData)
        setFormData({
          first_name: profileData.first_name || "",
          last_name: profileData.last_name || "",
          username: profileData.username || "",
        })
        setAvatarUrl(profileData.avatar_url)
        console.log('Profile loaded:', profileData)
        console.log('Avatar URL:', profileData.avatar_url)
      }
    } catch (error: any) {
      console.error('Error loading user data:', error)
      toast.error('Error loading profile data')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return
      }

      if (!user) {
        toast.error('You must be logged in to upload an avatar')
        return
      }

      const file = event.target.files[0]
      
      // File validation
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB')
        return
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }

      setUploading(true)
      toast.loading('Uploading avatar...', { id: 'avatar-upload' })

      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}-${Math.random()}.${fileExt}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      if (!publicUrlData?.publicUrl) {
        throw new Error('Failed to get public URL')
      }

      // Update profile with public URL (not file path)
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          avatar_url: publicUrlData.publicUrl,
          updated_at: new Date().toISOString(),
        })

      if (updateError) {
        throw updateError
      }

      setAvatarUrl(publicUrlData.publicUrl)
      toast.success('Avatar uploaded successfully!', { id: 'avatar-upload' })
      
      // Refresh profile
      await getProfile()

    } catch (error: any) {
      console.error('Error uploading avatar:', error)
      toast.error('Error uploading avatar: ' + error.message, { id: 'avatar-upload' })
    } finally {
      setUploading(false)
      // Clear the input
      if (event.target) {
        event.target.value = ''
      }
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('You must be logged in to update your profile')
      return
    }

    try {
      setSaving(true)
      toast.loading('Saving changes...', { id: 'profile-save' })

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          username: formData.username,
          updated_at: new Date().toISOString(),
        })

      if (error) {
        throw error
      }

      toast.success('Profile updated successfully!', { id: 'profile-save' })
      await getProfile()

    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast.error('Error updating profile: ' + error.message, { id: 'profile-save' })
    } finally {
      setSaving(false)
    }
  }

  // Get avatar image URL (now stored as public URL directly)
  const getAvatarUrl = () => {
    return avatarUrl
  }

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#000208' }}>
        <NavBar items={[]} />
        <Spotlight />
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-2xl mx-auto space-y-8 pt-20">
            {/* Loading skeleton */}
            <div className="text-center space-y-2">
              <div className="h-8 bg-gray-700/50 rounded-lg animate-pulse w-64 mx-auto"></div>
              <div className="h-4 bg-gray-700/30 rounded-lg animate-pulse w-80 mx-auto"></div>
            </div>

            <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <div className="h-6 bg-gray-700/50 rounded animate-pulse w-32"></div>
                <div className="h-4 bg-gray-700/30 rounded animate-pulse w-full max-w-md"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <div className="h-20 w-20 bg-gray-700/50 rounded-full animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Please sign in to access your account.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#000208' }}>
      <NavBar items={[]} />
      <Spotlight />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto space-y-8 pt-20">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-white">Account Settings</h1>
            <p className="text-gray-300">Manage your profile and account preferences</p>
          </div>

          {/* Profile Picture Card */}
          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Camera className="h-5 w-5" />
                Profile Picture
              </CardTitle>
              <CardDescription className="text-gray-300">
                Upload a profile picture to personalize your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={getAvatarUrl() || undefined} alt="Profile" />
                    <AvatarFallback className="bg-gray-700 text-white text-xl">
                      {formData.first_name?.[0] || formData.username?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="absolute bottom-0 right-0">
                    <SpotlightButton 
                      type="button" 
                      disabled={uploading}
                      className="h-8 w-8 p-0 rounded-full bg-gradient-to-br from-black to-neutral-800 hover:from-neutral-900 hover:to-black text-[#c3b383] border border-[#c3b383]/30 cursor-pointer"
                      onClick={() => {
                        const fileInput = document.getElementById('avatar-upload') as HTMLInputElement
                        if (fileInput) {
                          fileInput.click()
                        }
                      }}
                    >
                      <Upload className="h-4 w-4" />
                    </SpotlightButton>
                    
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                      disabled={uploading}
                    />
                  </div>
                </div>
              </div>
              
              <p className="text-center text-xs text-gray-400">
                {uploading ? 'Uploading...' : 'Click the upload button to change your profile picture'}
              </p>
            </CardContent>
          </Card>

          {/* Profile Information Card */}
          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-gray-300">
                Update your personal information and display preferences
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSave}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name" className="text-white">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="text-white">Last Name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Choose a username"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Email Address</Label>
                  <Input
                    value={user.email || ''}
                    disabled
                    className="bg-gray-700 border-gray-600 text-gray-300"
                  />
                  <p className="text-xs text-gray-400">
                    Email cannot be changed. Contact support if you need to update your email address.
                  </p>
                </div>

                {profile?.is_admin && (
                  <div className="p-4 bg-amber-900/30 border border-amber-600 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                      <span className="text-sm font-medium text-amber-200">Admin Account</span>
                    </div>
                    <p className="text-xs text-amber-300 mt-1">
                      You have administrative privileges on this platform.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-gray-800/50 border-t border-gray-700">
                <SpotlightButton 
                  type="submit" 
                  disabled={saving} 
                  className="ml-auto bg-gradient-to-br from-black to-neutral-800 hover:from-neutral-900 hover:to-black text-[#c3b383] font-medium w-auto px-4 py-2 h-auto border border-[#c3b383]/30"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </SpotlightButton>
              </CardFooter>
            </form>
          </Card>

          {/* Account Information */}
          {profile && (
            <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Account Information</CardTitle>
                <CardDescription className="text-gray-300">
                  View your account details and status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-gray-400">Account Created</Label>
                    <p className="font-medium text-white">
                      {new Date(profile.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long', 
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Last Updated</Label>
                    <p className="font-medium text-white">
                      {new Date(profile.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long', 
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-400">User ID</Label>
                    <p className="font-mono text-xs bg-gray-800 text-gray-300 p-2 rounded border border-gray-600">
                      {user.id}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Account Type</Label>
                    <p className="font-medium text-white">
                      {profile.is_admin ? 'Administrator' : 'Standard User'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}