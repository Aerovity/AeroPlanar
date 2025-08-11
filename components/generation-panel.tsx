"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadZone } from "./upload-zone"
import { SpotlightButton } from "@/components/ui/spotlight-button"
import { Wand2, Settings, Image, MessageSquare, Layers } from 'lucide-react'

interface GenerationPanelProps {
  onGenerate: (file: File, options: GenerationOptions) => Promise<void>
  onGenerateFromText: (prompt: string, options: GenerationOptions) => Promise<void>
  onGenerateMultimodal: (file: File, prompt: string, options: GenerationOptions) => Promise<void>
  onGenerateTextToImage: (prompt: string, negativePrompt?: string) => Promise<void>
  onUpload3DModel?: (file: File) => Promise<void>
  isGenerating?: boolean
}

export interface GenerationOptions {
  modelVersion: string
  style?: string
  textureResolution: number
  remesh: string
}

export function GenerationPanel({ onGenerate, onGenerateFromText, onGenerateMultimodal, onGenerateTextToImage, onUpload3DModel, isGenerating }: GenerationPanelProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [textPrompt, setTextPrompt] = useState<string>("")
  const [negativePrompt, setNegativePrompt] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("image")
  const [options, setOptions] = useState<GenerationOptions>({
    modelVersion: "v2.0-20240919",
    style: "none",
    textureResolution: 1024,
    remesh: "none"
  })

  const handleUpload = async (file: File) => {
    setSelectedFile(file)
    
    // Check if it's a 3D model file
    const is3DModel = file.name.toLowerCase().match(/\.(glb|gltf|obj|fbx|dae|3ds|ply|stl)$/)
    
    if (is3DModel && onUpload3DModel) {
      // If it's a 3D model, upload it directly to the scene
      await onUpload3DModel(file)
    }
    // Don't automatically generate images - let user configure options first
  }

  const handleGenerate = async () => {
    if (activeTab === "image" && selectedFile) {
      await onGenerate(selectedFile, options)
    }
    // Text-to-image, text-to-3D, and multimodal modes are coming soon - no backend calls
  }

  const canGenerate = () => {
    if (activeTab === "image") {
      return selectedFile && !selectedFile.name.toLowerCase().match(/\.(glb|gltf|obj|fbx|dae|3ds|ply|stl)$/)
    }
    // Text-to-image and multimodal modes are disabled (coming soon)
    return false
  }

  const getGenerateButtonText = () => {
    if (activeTab === "image") {
      if (isGenerating) return "Generating..."
      if (!selectedFile) return "Upload an image first"
      if (selectedFile.name.toLowerCase().match(/\.(glb|gltf|obj|fbx|dae|3ds|ply|stl)$/)) return "3D Model Uploaded"
      return "Generate from Image"
    } else if (activeTab === "text-to-image" || activeTab === "multimodal") {
      return "🚀 Soon Available"
    }
    return "Generate"
  }

  return (
    <Card className="bg-black/40 border-gray-800/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white">
          <Wand2 className="w-5 h-5 text-blue-400" />
          AI 3D Generation
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Generation Mode Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-gray-900/50">
            <TabsTrigger value="image" className="flex items-center gap-2 text-xs">
              <Image className="w-3 h-3" />
              Image
            </TabsTrigger>
            <TabsTrigger value="text-to-image" className="flex items-center gap-2 text-xs">
              <Wand2 className="w-3 h-3" />
              T2I
            </TabsTrigger>
            <TabsTrigger value="multimodal" className="flex items-center gap-2 text-xs">
              <Layers className="w-3 h-3" />
              Both
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="space-y-4 mt-4">
            <UploadZone onUpload={handleUpload} isUploading={isGenerating} accept3DModels={true} />
          </TabsContent>

          <TabsContent value="text-to-image" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Describe the image you want to create</Label>
              <Textarea
                placeholder="e.g., A majestic dragon flying over mountains, a cyberpunk city at night, a beautiful sunset over the ocean..."
                value={textPrompt}
                onChange={(e) => setTextPrompt(e.target.value)}
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 min-h-[80px] resize-none"
                disabled={isGenerating}
                maxLength={1024}
              />
              <p className="text-xs text-gray-400">
                {textPrompt.length}/1024 characters • Be descriptive for better results
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Negative prompt (optional)</Label>
              <Textarea
                placeholder="e.g., blurry, low quality, distorted, ugly, bad anatomy..."
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 min-h-[60px] resize-none"
                disabled={isGenerating}
                maxLength={255}
              />
              <p className="text-xs text-gray-400">
                {negativePrompt.length}/255 characters • What you don't want in the image
              </p>
            </div>
          </TabsContent>


          <TabsContent value="multimodal" className="space-y-4 mt-4">
            <UploadZone onUpload={handleUpload} isUploading={isGenerating} accept3DModels={true} />
            <div className="space-y-2">
              <Label className="text-gray-300">Additional text description</Label>
              <Textarea
                placeholder="e.g., Make it more futuristic, add metallic textures, change the color to blue..."
                value={textPrompt}
                onChange={(e) => setTextPrompt(e.target.value)}
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 min-h-[80px] resize-none"
                disabled={isGenerating}
              />
              <p className="text-xs text-gray-400">
                Describe modifications or enhancements to apply to the uploaded image
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Status Display */}
        {(selectedFile || textPrompt.trim()) && (
          <div className="p-3 bg-blue-600/10 border border-blue-500/30 rounded-lg">
            {selectedFile && (
              <p className="text-sm text-blue-300 font-medium">Image: {selectedFile.name}</p>
            )}
            {textPrompt.trim() && (
              <p className="text-sm text-blue-300 font-medium">Prompt: {textPrompt.slice(0, 50)}{textPrompt.length > 50 ? '...' : ''}</p>
            )}
            {negativePrompt.trim() && (
              <p className="text-sm text-blue-300 font-medium">Negative: {negativePrompt.slice(0, 30)}{negativePrompt.length > 30 ? '...' : ''}</p>
            )}
            <p className="text-xs text-blue-400 mt-1">
              {activeTab === "text-to-image" 
                ? "Ready to generate image" 
                : selectedFile?.name.toLowerCase().match(/\.(glb|gltf|obj|fbx|dae|3ds|ply|stl)$/) 
                  ? "3D model uploaded to scene" 
                  : "Ready to generate 3D model"}
            </p>
          </div>
        )}
        
        {/* Generate Button */}
        <div className="pt-2">
          <SpotlightButton
            onClick={handleGenerate}
            disabled={activeTab !== "image" || !canGenerate() || isGenerating}
            className={`w-full ${(activeTab !== "image" || !canGenerate()) ? 'opacity-50 cursor-not-allowed' : 'animate-pulse'}`}
          >
            {getGenerateButtonText()}
          </SpotlightButton>
          
          {/* Coming Soon Notice */}
          {(activeTab === "text-to-image" || activeTab === "multimodal") && (
            <div className="mt-3 p-3 bg-orange-600/10 border border-orange-500/30 rounded-lg">
              <p className="text-sm text-orange-300 font-medium flex items-center gap-2">
                🚀 <span>Coming Soon!</span>
              </p>
              <p className="text-xs text-orange-400 mt-1">
                {activeTab === "text-to-image" 
                  ? "Text-to-Image generation is currently in development. Stay tuned for updates!"
                  : "Multimodal (Image + Text) generation is coming soon with enhanced AI capabilities."}
              </p>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <Settings className="w-4 h-4" />
            Generation Settings
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Model Version</Label>
              <Select
                value={options.modelVersion}
                onValueChange={(value) => setOptions(prev => ({ ...prev, modelVersion: value }))}
              >
                <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="v2.0-20240919">v2.0 (Latest)</SelectItem>
                  <SelectItem value="v1.4-20240625">v1.4 (Stable)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-gray-300">Style</Label>
              <Select
                value={options.style}
                onValueChange={(value) => setOptions(prev => ({ ...prev, style: value }))}
              >
                <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="cartoon">Cartoon</SelectItem>
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="stylized">Stylized</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-gray-300">Texture Resolution: {options.textureResolution}px</Label>
              <Slider
                value={[options.textureResolution]}
                onValueChange={([value]) => setOptions(prev => ({ ...prev, textureResolution: value }))}
                min={512}
                max={2048}
                step={256}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label className="text-gray-300">Remesh</Label>
              <Select
                value={options.remesh}
                onValueChange={(value) => setOptions(prev => ({ ...prev, remesh: value }))}
              >
                <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="quad">Quad</SelectItem>
                  <SelectItem value="triangle">Triangle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
