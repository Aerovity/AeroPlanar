"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UploadZone } from "./upload-zone"
import { SpotlightButton } from "@/components/ui/spotlight-button"
import JSZip from 'jszip'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter'
import { 
  Building, 
  Upload, 
  Copy, 
  Scissors, 
  Trash2, 
  Download, 
  RotateCcw, 
  Move3d, 
  Keyboard,
  Box,
  Square,
  Globe,
  Plus,
  FolderOpen,
  Package
} from 'lucide-react'
import { toast } from "@/hooks/use-toast"

interface ArchitecturePanelProps {
  models: any[]
  selectedModelId: string | null
  onModelSelect: (id: string) => void
  onModelPositionChange: (id: string, position: [number, number, number]) => void
  onModelDelete: (id: string) => void
  onModelUpload: (file: File) => Promise<void>
  onModelDownload: (id: string) => void
  onAddPrimitive: (primitive: any) => void
  clipboard: any
}

// Simple 3D objects library
const simpleObjects = [
  {
    id: 'cube',
    name: 'Cube',
    icon: Box,
    type: 'primitive',
    size: [2, 2, 2]
  },
  {
    id: 'flat-cube',
    name: 'Flat Cube',
    icon: Square,
    type: 'primitive',
    size: [4, 0.2, 4]
  },
  {
    id: 'globe',
    name: 'Globe',
    icon: Globe,
    type: 'primitive',
    size: [2, 2, 2]
  }
]

export function ArchitecturePanel({
  models,
  selectedModelId,
  onModelSelect,
  onModelPositionChange,
  onModelDelete,
  onModelUpload,
  onModelDownload,
  onAddPrimitive,
  clipboard
}: ArchitecturePanelProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    try {
      await onModelUpload(file)
    } finally {
      setIsUploading(false)
    }
  }

  const handleAddPrimitive = (primitive: any) => {
    onAddPrimitive(primitive)
  }

  const handleCopy = () => {
    if (selectedModelId) {
      const modelToCopy = models.find(m => m.id === selectedModelId)
      if (modelToCopy) {
        // This is handled by the parent component via keyboard shortcuts
        toast({
          title: "Model Copied",
          description: "Press Ctrl+V to paste the model.",
        })
      }
    }
  }

  const handleCut = () => {
    if (selectedModelId) {
      // This is handled by the parent component via keyboard shortcuts
      toast({
        title: "Model Cut",
        description: "Press Ctrl+V to paste the model.",
      })
    }
  }

  const handleDownloadSceneAsGLB = async () => {
    if (models.length === 0) {
      toast({
        title: "No Models",
        description: "Add some models to the scene before downloading.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Preparing Scene Export",
      description: "Creating combined GLB file, this may take a moment...",
    })

    try {
      const scene = new THREE.Scene()
      const loader = new GLTFLoader()
      const exporter = new GLTFExporter()

      // Load all models and add them to scene
      const loadPromises = models.map(async (model) => {
        try {
          if (model.type === 'primitive') {
            // Create primitive geometry - use the exact same approach as Primitive3D component
            let geometry
            const [width, height, depth] = model.size
            
            switch (model.primitiveType) {
              case 'cube':
                geometry = new THREE.BoxGeometry(width, height, depth)
                break
              case 'flat-cube':
                geometry = new THREE.BoxGeometry(width, height, depth)
                break
              case 'globe':
                geometry = new THREE.SphereGeometry(width / 2, 32, 32) // Same as Primitive3D
                break
              default:
                geometry = new THREE.BoxGeometry(width, height, depth)
            }

            const material = new THREE.MeshStandardMaterial({ 
              color: 0x888888,
              roughness: 0.4,
              metalness: 0.1 
            })
            const mesh = new THREE.Mesh(geometry, material)
            mesh.position.set(...model.position)
            
            // For primitives, don't apply additional scaling - the geometry already uses the correct size
            // This matches how Primitive3D component works
            mesh.name = model.name
            scene.add(mesh)
          } else if (model.url) {
            // Load GLB/GLTF model
            return new Promise((resolve, reject) => {
              loader.load(
                model.url,
                (gltf) => {
                  // Clone the scene to avoid modifying original
                  const clonedScene = gltf.scene.clone()
                  clonedScene.position.set(...model.position)
                  
                  // Apply proper scaling - models are displayed with large base scale in viewer
                  // We need to match the visual scale from the scene
                  const displayScale = model.size || [2, 2, 2]
                  const baseScaleFactor = 5 // This matches the 5x multiplier from model-3d.tsx line 50
                  clonedScene.scale.set(
                    displayScale[0] * baseScaleFactor,
                    displayScale[1] * baseScaleFactor,
                    displayScale[2] * baseScaleFactor
                  )
                  
                  clonedScene.name = model.name
                  scene.add(clonedScene)
                  resolve(clonedScene)
                },
                undefined,
                reject
              )
            })
          }
        } catch (error) {
          console.error(`Error processing model ${model.name}:`, error)
        }
      })

      // Wait for all models to load
      await Promise.allSettled(loadPromises)

      // Export the combined scene as GLB
      exporter.parse(
        scene,
        (gltf) => {
          const blob = new Blob([gltf as ArrayBuffer], { type: 'application/octet-stream' })
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.download = 'complete_scene.glb'
          link.click()
          
          toast({
            title: "Scene Exported!",
            description: "Complete scene downloaded as single GLB file.",
          })
        },
        (error) => {
          console.error('Export error:', error)
          toast({
            title: "Export Failed",
            description: "Could not export scene. Please try again.",
            variant: "destructive",
          })
        },
        { binary: true }
      )
    } catch (error) {
      console.error('Scene export error:', error)
      toast({
        title: "Export Failed",
        description: "Could not create scene export. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDownloadAll = () => {
    // Create a zip file with all models (legacy function for individual files)
    const zip = new JSZip()
    
    models.forEach((model, index) => {
      if (model.type === 'primitive') {
        // For primitives, create a simple JSON description
        const primitiveData = {
          type: model.primitiveType,
          name: model.name,
          position: model.position,
          size: model.size
        }
        zip.file(`${model.name}_${index}.json`, JSON.stringify(primitiveData, null, 2))
      } else if (model.url) {
        // For uploaded models, try to download the file
        fetch(model.url)
          .then(response => response.blob())
          .then(blob => {
            zip.file(`${model.name}_${index}.glb`, blob)
          })
          .catch(error => {
            console.error('Error downloading model:', error)
          })
      }
    })
    
    zip.generateAsync({ type: 'blob' }).then(content => {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(content)
      link.download = 'architecture_models.zip'
      link.click()
    })
    
    toast({
      title: "Download All (Individual)",
      description: "Downloading all models as separate files in zip...",
    })
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="bg-black/40 border-gray-800/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-white">
            <Upload className="w-5 h-5 text-blue-400" />
            Upload 3D Models
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UploadZone 
            onUpload={handleUpload} 
            isUploading={isUploading} 
            accept3DModels={true}
          />
        </CardContent>
      </Card>

      {/* Object Library */}
      <Card className="bg-black/40 border-gray-800/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-white">
            <Building className="w-5 h-5 text-green-400" />
            Object Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {simpleObjects.map((obj) => {
              const Icon = obj.icon
              return (
                <Button
                  key={obj.id}
                  variant="outline"
                  className="justify-start bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800/50"
                  onClick={() => handleAddPrimitive(obj)}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {obj.name}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Model Management */}
      {models.length > 0 && (
        <Card className="bg-black/40 border-gray-800/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <Move3d className="w-4 h-4" />
              Scene Objects ({models.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {models.map((model) => (
                <div
                  key={model.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedModelId === model.id
                      ? "bg-blue-600/20 border border-blue-500/30 shadow-lg"
                      : "bg-gray-900/50 hover:bg-gray-800/50 border border-transparent"
                  }`}
                  onClick={() => onModelSelect(model.id)}
                >
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{model.name}</p>
                    <p className="text-gray-400 text-xs flex items-center gap-1">
                      {selectedModelId === model.id && <Keyboard className="w-3 h-3" />}
                      Position: ({model.position[0].toFixed(1)}, {model.position[2].toFixed(1)})
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        onModelPositionChange(model.id, [Math.random() * 20 - 10, 0, Math.random() * 20 - 10])
                      }}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-blue-400 hover:bg-gray-700/50"
                      title="Random Position"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        onModelDownload(model.id)
                      }}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700/50"
                      title="Download Model"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        onModelDelete(model.id)
                      }}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-gray-700/50"
                      title="Delete Model"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="bg-black/40 border-gray-800/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-white">
            <Plus className="w-5 h-5 text-purple-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800/50"
              onClick={handleCopy}
              disabled={!selectedModelId}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800/50"
              onClick={handleCut}
              disabled={!selectedModelId}
            >
              <Scissors className="w-4 h-4 mr-2" />
              Cut
            </Button>
          </div>
          
          <div className="mt-4 space-y-2">
            <SpotlightButton
              onClick={handleDownloadSceneAsGLB}
              className="w-full"
            >
              <Package className="w-4 h-4 mr-2" />
              Download Complete Scene (GLB)
            </SpotlightButton>
            <Button
              variant="outline"
              onClick={handleDownloadAll}
              className="w-full bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800/50"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Download Individual Files (ZIP)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clipboard Status */}
      {clipboard && (
        <Card className="bg-black/40 border-blue-500/30 backdrop-blur-sm">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-blue-300 text-sm">
              <Copy className="w-4 h-4" />
              Clipboard: {clipboard.name}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
