"use client"

import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Upload, Camera, Save, User } from "lucide-react"
import { Footer } from "@/components/landing/footer"
import { Spotlight } from "@/components/ui/spotlight-new"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { SpotlightButton } from "@/components/ui/spotlight-button"

export default function AccountPage() {
  const { user, profile, loading, refreshProfile } = useAuth()
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        username: profile.username || "",
      })
    }
  }, [profile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) {
      return
    }

    const file = e.target.files[0]
    
    // Check file size (max 2MB for faster uploads)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB')
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}-${Date.now()}.${fileExt}`

    setUploading(true)

    try {
      // Compress image if needed
      const compressedFile = await compressImage(file)
      
      // Upload image to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, compressedFile, { 
          upsert: true,
          cacheControl: '3600'
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: urlData.publicUrl })
        .eq('id', user.id)

      if (updateError) {
        throw updateError
      }

      await refreshProfile()
      toast.success('Profile picture updated successfully!')
    } catch (error: any) {
      toast.error('Error uploading avatar: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  // Image compression function
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      
      img.onload = () => {
        const maxSize = 400 // Max width/height
        let { width, height } = img
        
        // Calculate new dimensions
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height
            height = maxSize
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob!], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            resolve(compressedFile)
          },
          'image/jpeg',
          0.8 // 80% quality
        )
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          username: formData.username,
        })
        .eq('id', user.id)

      if (error) {
        throw error
      }

      await refreshProfile()
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      toast.error('Error updating profile: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
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
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
                  <AvatarFallback className="bg-gray-700 text-white text-lg">
                    {formData.first_name?.[0] || formData.username?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Label htmlFor="avatar-upload" className="cursor-pointer block">
                    <SpotlightButton 
                      type="button" 
                      disabled={uploading}
                      className="bg-gradient-to-br from-black to-neutral-800 hover:from-neutral-900 hover:to-black text-[#c3b383] font-medium w-auto px-4 py-2 h-auto border border-[#c3b383]/30"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Change Picture'}
                    </SpotlightButton>
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="hidden"
                      onChange={handleAvatarUpload}
                      disabled={uploading}
                    />
                  </Label>
                  <p className="text-xs text-gray-400">
                    JPG, PNG or WebP. Max file size 2MB for faster uploads.
                  </p>
                </div>
              </div>
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
                    {profile?.created_at 
                      ? new Date(profile.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long', 
                          day: 'numeric'
                        })
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400">Last Updated</Label>
                  <p className="font-medium text-white">
                    {profile?.updated_at 
                      ? new Date(profile.updated_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long', 
                          day: 'numeric'
                        })
                      : 'N/A'}
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
                    {profile?.is_admin ? 'Administrator' : 'Standard User'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}