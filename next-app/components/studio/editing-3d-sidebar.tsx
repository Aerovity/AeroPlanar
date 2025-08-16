"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { 
  Paintbrush, 
  Lightbulb, 
  Filter,
  Move3d,
  Sun,
  Zap,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Maximize2,
  Minimize2,
  Waves,
  Zap as PinchIcon,
  Mountain,
  Minus,
  MousePointer
} from 'lucide-react'

interface Editing3DSidebarProps {
  selectedModelId: string | null
  onToolSelect: (tool: string, options?: any) => void
  activeTool: string | null
}

// Brush textures
const brushTextures = [
  { id: 'rough', name: 'Rough', color: '#8B4513' },
  { id: 'smooth', name: 'Smooth', color: '#C0C0C0' },
  { id: 'metallic', name: 'Metallic', color: '#4A4A4A' },
  { id: 'wood', name: 'Wood', color: '#DEB887' },
  { id: 'stone', name: 'Stone', color: '#696969' }
]

// Lighting filters
const lightingFilters = [
  { id: 'natural', name: 'Natural', icon: Sun },
  { id: 'dramatic', name: 'Dramatic', icon: Zap },
  { id: 'soft', name: 'Soft', icon: Sparkles },
  { id: 'cool', name: 'Cool', icon: Filter },
  { id: 'warm', name: 'Warm', icon: Lightbulb }
]

export function Editing3DSidebar({ selectedModelId, onToolSelect, activeTool }: Editing3DSidebarProps) {
  const [brushSize, setBrushSize] = useState([0.5])
  const [brushIntensity, setBrushIntensity] = useState([0.7])
  const [selectedTexture, setSelectedTexture] = useState('rough')
  const [lightIntensity, setLightIntensity] = useState([1.0])
  const [sculptingMode, setSculptingMode] = useState(false)
  const [sculptingSize, setSculptingSize] = useState([1.0])
  const [sculptingIntensity, setSculptingIntensity] = useState([0.5])

  const handleMaterialBrushSelect = (textureId: string) => {
    setSelectedTexture(textureId)
    onToolSelect('brush', { 
      texture: textureId, 
      size: brushSize[0], 
      intensity: brushIntensity[0] 
    })
  }

  const handleLightCreate = () => {
    onToolSelect('light-create', { intensity: lightIntensity[0] })
  }

  const handleLightingFilter = (filter: string) => {
    onToolSelect(`lighting-filter-${filter}`, { filter, intensity: lightIntensity[0] })
  }



  return (
    <div className="space-y-4">
      {/* Tool Header */}
      <Card className="bg-black/40 border-gray-800/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white text-sm">
            <Move3d className="w-4 h-4 text-white" />
            3D Editing Tools
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Advanced Sculpting Toggle - Available for all models */}
      <Card className="bg-black/40 border-gray-800/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white text-sm">
            <Move3d className="w-4 h-4 text-white" />
            Advanced Sculpting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Enable Advanced Sculpting</span>
            <Switch
              checked={sculptingMode}
              onCheckedChange={(checked) => {
                setSculptingMode(checked)
                onToolSelect('sculpting-mode', { enabled: checked })
              }}
            />
          </div>
          {sculptingMode && (
            <div className="space-y-3">
              <p className="text-xs text-gray-400">
                SculptGL-inspired vertex manipulation tools
              </p>
              
              {/* Sculpting Tools - Individual button+label pairs */}
              <div className="grid grid-cols-3 gap-3">
                {/* Push Tool */}
                <div className="flex flex-col items-center space-y-1">
                  <Button
                    variant={activeTool === 'sculpt-push' ? "default" : "outline"}
                    size="sm"
                    className={`w-full justify-center ${
                      activeTool === 'sculpt-push'
                        ? "bg-purple-600 border-purple-500"
                        : "bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800/50"
                    }`}
                    onClick={() => onToolSelect('sculpt-push', { type: 'push', size: sculptingSize[0], intensity: sculptingIntensity[0] })}
                  >
                    <ArrowUp className="w-3 h-3 text-white" />
                  </Button>
                  <span className="text-xs text-gray-400 text-center">Push</span>
                </div>
                
                {/* Pull Tool */}
                <div className="flex flex-col items-center space-y-1">
                  <Button
                    variant={activeTool === 'sculpt-pull' ? "default" : "outline"}
                    size="sm"
                    className={`w-full justify-center ${
                      activeTool === 'sculpt-pull'
                        ? "bg-purple-600 border-purple-500"
                        : "bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800/50"
                    }`}
                    onClick={() => onToolSelect('sculpt-pull', { type: 'pull', size: sculptingSize[0], intensity: sculptingIntensity[0] })}
                  >
                    <ArrowDown className="w-3 h-3 text-white" />
                  </Button>
                  <span className="text-xs text-gray-400 text-center">Pull</span>
                </div>
                
                {/* Inflate Tool */}
                <div className="flex flex-col items-center space-y-1">
                  <Button
                    variant={activeTool === 'sculpt-inflate' ? "default" : "outline"}
                    size="sm"
                    className={`w-full justify-center ${
                      activeTool === 'sculpt-inflate'
                        ? "bg-purple-600 border-purple-500"
                        : "bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800/50"
                    }`}
                    onClick={() => onToolSelect('sculpt-inflate', { type: 'inflate', size: sculptingSize[0] * 1.2, intensity: sculptingIntensity[0] * 0.3 })}
                  >
                    <Maximize2 className="w-3 h-3 text-white" />
                  </Button>
                  <span className="text-xs text-gray-400 text-center">Inflate</span>
                </div>
                
                {/* Deflate Tool */}
                <div className="flex flex-col items-center space-y-1">
                  <Button
                    variant={activeTool === 'sculpt-deflate' ? "default" : "outline"}
                    size="sm"
                    className={`w-full justify-center ${
                      activeTool === 'sculpt-deflate'
                        ? "bg-purple-600 border-purple-500"
                        : "bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800/50"
                    }`}
                    onClick={() => onToolSelect('sculpt-deflate', { type: 'deflate', size: sculptingSize[0] * 1.2, intensity: sculptingIntensity[0] * 0.3 })}
                  >
                    <Minimize2 className="w-3 h-3 text-white" />
                  </Button>
                  <span className="text-xs text-gray-400 text-center">Deflate</span>
                </div>
                
                {/* Smooth Tool */}
                <div className="flex flex-col items-center space-y-1">
                  <Button
                    variant={activeTool === 'sculpt-smooth' ? "default" : "outline"}
                    size="sm"
                    className={`w-full justify-center ${
                      activeTool === 'sculpt-smooth'
                        ? "bg-purple-600 border-purple-500"
                        : "bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800/50"
                    }`}
                    onClick={() => onToolSelect('sculpt-smooth', { type: 'smooth', size: sculptingSize[0] * 1.5, intensity: sculptingIntensity[0] * 0.7 })}
                  >
                    <Waves className="w-3 h-3 text-white" />
                  </Button>
                  <span className="text-xs text-gray-400 text-center">Smooth</span>
                </div>
                
                {/* Pinch Tool */}
                <div className="flex flex-col items-center space-y-1">
                  <Button
                    variant={activeTool === 'sculpt-pinch' ? "default" : "outline"}
                    size="sm"
                    className={`w-full justify-center ${
                      activeTool === 'sculpt-pinch'
                        ? "bg-purple-600 border-purple-500"
                        : "bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800/50"
                    }`}
                    onClick={() => onToolSelect('sculpt-pinch', { type: 'pinch', size: sculptingSize[0] * 0.8, intensity: sculptingIntensity[0] * 0.6 })}
                  >
                    <PinchIcon className="w-3 h-3 text-white" />
                  </Button>
                  <span className="text-xs text-gray-400 text-center">Pinch</span>
                </div>
                
                {/* Crease Tool */}
                <div className="flex flex-col items-center space-y-1">
                  <Button
                    variant={activeTool === 'sculpt-crease' ? "default" : "outline"}
                    size="sm"
                    className={`w-full justify-center ${
                      activeTool === 'sculpt-crease'
                        ? "bg-purple-600 border-purple-500"
                        : "bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800/50"
                    }`}
                    onClick={() => onToolSelect('sculpt-crease', { type: 'crease', size: sculptingSize[0] * 0.6, intensity: sculptingIntensity[0] * 0.8 })}
                  >
                    <Mountain className="w-3 h-3 text-white" />
                  </Button>
                  <span className="text-xs text-gray-400 text-center">Crease</span>
                </div>
                
                {/* Flatten Tool */}
                <div className="flex flex-col items-center space-y-1">
                  <Button
                    variant={activeTool === 'sculpt-flatten' ? "default" : "outline"}
                    size="sm"
                    className={`w-full justify-center ${
                      activeTool === 'sculpt-flatten'
                        ? "bg-purple-600 border-purple-500"
                        : "bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800/50"
                    }`}
                    onClick={() => onToolSelect('sculpt-flatten', { type: 'flatten', size: sculptingSize[0] * 1.5, intensity: sculptingIntensity[0] * 0.5 })}
                  >
                    <Minus className="w-3 h-3 text-white" />
                  </Button>
                  <span className="text-xs text-gray-400 text-center">Flatten</span>
                </div>
                
                {/* Grab Tool */}
                <div className="flex flex-col items-center space-y-1">
                  <Button
                    variant={activeTool === 'sculpt-grab' ? "default" : "outline"}
                    size="sm"
                    className={`w-full justify-center ${
                      activeTool === 'sculpt-grab'
                        ? "bg-purple-600 border-purple-500"
                        : "bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800/50"
                    }`}
                    onClick={() => onToolSelect('sculpt-grab', { type: 'grab', size: sculptingSize[0] * 2.0, intensity: 1.0 })}
                  >
                    <MousePointer className="w-3 h-3 text-white" />
                  </Button>
                  <span className="text-xs text-gray-400 text-center">Grab</span>
                </div>
              </div>
              
              {/* Sculpting Tool Controls */}
              <div className="space-y-3 mt-4">
                {/* Sculpting Size */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-300">Sculpting Size</label>
                  <Slider
                    value={sculptingSize}
                    onValueChange={setSculptingSize}
                    max={3}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">{sculptingSize[0].toFixed(1)}</span>
                </div>

                {/* Sculpting Intensity */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-300">Sculpting Intensity</label>
                  <Slider
                    value={sculptingIntensity}
                    onValueChange={setSculptingIntensity}
                    max={1}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">{sculptingIntensity[0].toFixed(1)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {!selectedModelId && (
        <Card className="bg-black/40 border-amber-500/30 backdrop-blur-sm">
          <CardContent className="pt-4 text-center">
            <p className="text-amber-300 text-sm">Select a model to start editing</p>
          </CardContent>
        </Card>
      )}

      {selectedModelId && (
        <>
          {/* Brush Tools */}
          <Card className="bg-black/40 border-gray-800/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white text-sm">
                <Paintbrush className="w-4 h-4 text-white" />
                Brush Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Texture Selection */}
              <div className="grid grid-cols-5 gap-2">
                {brushTextures.map((texture) => (
                  <Button
                    key={texture.id}
                    variant={selectedTexture === texture.id ? "default" : "outline"}
                    size="sm"
                    className={`h-8 w-full p-1 ${
                      selectedTexture === texture.id
                        ? "bg-blue-600 border-blue-500"
                        : "bg-gray-900/50 border-gray-700 hover:bg-gray-800/50"
                    }`}
                    onClick={() => handleMaterialBrushSelect(texture.id)}
                    title={texture.name}
                  >
                    <div 
                      className="w-4 h-4 rounded-sm border border-white/20"
                      style={{ backgroundColor: texture.color }}
                    />
                  </Button>
                ))}
              </div>
              
              {/* Brush Size */}
              <div className="space-y-2">
                <label className="text-xs text-gray-300">Brush Size</label>
                <Slider
                  value={brushSize}
                  onValueChange={(value) => {
                    setBrushSize(value)
                    if (activeTool === 'brush') {
                      handleMaterialBrushSelect(selectedTexture)
                    }
                  }}
                  max={2}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Brush Intensity */}
              <div className="space-y-2">
                <label className="text-xs text-gray-300">Intensity</label>
                <Slider
                  value={brushIntensity}
                  onValueChange={(value) => {
                    setBrushIntensity(value)
                    if (activeTool === 'brush') {
                      handleMaterialBrushSelect(selectedTexture)
                    }
                  }}
                  max={1}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>


          {/* Lighting Tools */}
          <Card className="bg-black/40 border-gray-800/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white text-sm">
                <Lightbulb className="w-4 h-4 text-white" />
                Lighting Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Create Light Button */}
              <Button
                variant={activeTool === 'light-create' ? "default" : "outline"}
                className={`w-full justify-start ${
                  activeTool === 'light-create'
                    ? "bg-yellow-600 border-yellow-500"
                    : "bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800/50"
                }`}
                onClick={handleLightCreate}
              >
                <Lightbulb className="w-4 h-4 mr-2 text-white" />
                Create Light
              </Button>

              <Separator className="bg-gray-700" />

              {/* Lighting Filters */}
              <div className="space-y-2">
                <label className="text-xs text-gray-300">Scene Lighting Filters</label>
                <div className="grid grid-cols-1 gap-2">
                  {lightingFilters.map((filter) => {
                    const Icon = filter.icon
                    return (
                      <Button
                        key={filter.id}
                        variant={activeTool === `lighting-filter-${filter.id}` ? "default" : "outline"}
                        size="sm"
                        className={`justify-start ${
                          activeTool === `lighting-filter-${filter.id}`
                            ? "bg-blue-600 border-blue-500"
                            : "bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800/50"
                        }`}
                        onClick={() => handleLightingFilter(filter.id)}
                      >
                        <Icon className="w-3 h-3 mr-2 text-white" />
                        {filter.name}
                      </Button>
                    )
                  })}
                </div>
              </div>

              {/* Light Intensity */}
              <div className="space-y-2">
                <label className="text-xs text-gray-300">Light Intensity</label>
                <Slider
                  value={lightIntensity}
                  onValueChange={(value) => {
                    setLightIntensity(value)
                    if (activeTool?.startsWith('light')) {
                      if (activeTool === 'light-create') {
                        handleLightCreate()
                      } else if (activeTool.startsWith('lighting-filter')) {
                        const filterId = activeTool.replace('lighting-filter-', '')
                        handleLightingFilter(filterId)
                      }
                    }
                  }}
                  max={3}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Active Tool Status */}
          {activeTool && (
            <Card className="bg-black/40 border-green-500/30 backdrop-blur-sm">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-600 text-white">
                    Active Tool
                  </Badge>
                  <span className="text-green-300 text-sm capitalize">
                    {activeTool.replace('-', ' ')}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}