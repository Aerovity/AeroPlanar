"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { UploadZone } from "./upload-zone"
import { SpotlightButton } from "@/components/ui/spotlight-button"
import { Wand2, Settings } from 'lucide-react'

interface GenerationPanelProps {
  onGenerate: (file: File, options: GenerationOptions) => Promise<void>
  onUpload3DModel?: (file: File) => Promise<void>
  isGenerating?: boolean
}

export interface GenerationOptions {
  modelVersion: string
  style?: string
  textureResolution: number
  remesh: string
}

export function GenerationPanel({ onGenerate, onUpload3DModel, isGenerating }: GenerationPanelProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
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
    if (selectedFile) {
      await onGenerate(selectedFile, options)
    }
  }

  return (
    <Card className="bg-black/40 border-gray-800/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white">
          <Wand2 className="w-5 h-5 text-blue-400" />
          Image to 3D Generation
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <UploadZone onUpload={handleUpload} isUploading={isGenerating} accept3DModels={true} />
        
        {/* Generate Button - Moved to top for better visibility */}
        <div className="pt-2">
          {selectedFile && (
            <div className="mb-4 p-3 bg-blue-600/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-300 font-medium">Selected: {selectedFile.name}</p>
              <p className="text-xs text-blue-400">
                {selectedFile.name.toLowerCase().match(/\.(glb|gltf|obj|fbx|dae|3ds|ply|stl)$/) 
                  ? "3D model uploaded to scene" 
                  : "Ready to generate 3D model"}
              </p>
            </div>
          )}
          
          <SpotlightButton
            onClick={handleGenerate}
            disabled={!selectedFile || isGenerating || (selectedFile && selectedFile.name.toLowerCase().match(/\.(glb|gltf|obj|fbx|dae|3ds|ply|stl)$/))}
            className={`w-full ${!selectedFile || (selectedFile && selectedFile.name.toLowerCase().match(/\.(glb|gltf|obj|fbx|dae|3ds|ply|stl)$/)) ? 'opacity-50 cursor-not-allowed' : 'animate-pulse'}`}
          >
            {isGenerating ? "Generating..." : 
             selectedFile && selectedFile.name.toLowerCase().match(/\.(glb|gltf|obj|fbx|dae|3ds|ply|stl)$/) ? "3D Model Uploaded" :
             selectedFile ? "Generate 3D Model" : "Upload an image first"}
          </SpotlightButton>
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
