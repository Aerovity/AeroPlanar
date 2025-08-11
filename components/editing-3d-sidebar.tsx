"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { 
  Paintbrush, 
  Scissors, 
  Lightbulb, 
  Filter,
  Move3d,
  RotateCcw,
  Sun,
  Zap,
  Sparkles,
  Hand
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
  const [deformStrength, setDeformStrength] = useState([0.3])
  const [lightIntensity, setLightIntensity] = useState([1.0])

  const handleBrushSelect = (texture: string) => {
    setSelectedTexture(texture)
    onToolSelect('brush', { 
      texture, 
      size: brushSize[0], 
      intensity: brushIntensity[0] 
    })
  }

  const handleScissorsSelect = () => {
    onToolSelect('scissors')
  }

  const handleLightCreate = () => {
    onToolSelect('light-create', { intensity: lightIntensity[0] })
  }

  const handleLightingFilter = (filter: string) => {
    onToolSelect('lighting-filter', { filter, intensity: lightIntensity[0] })
  }

  const handleSmudgeSelect = () => {
    onToolSelect('smudge', { intensity: brushIntensity[0] })
  }

  const handleDeformSelect = () => {
    onToolSelect('deform', { strength: deformStrength[0] })
  }

  return (
    <div className="space-y-4">
      {/* Tool Header */}
      <Card className="bg-black/40 border-gray-800/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white text-sm">
            <Move3d className="w-4 h-4 text-blue-400" />
            3D Editing Tools
          </CardTitle>
        </CardHeader>
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
                <Paintbrush className="w-4 h-4 text-green-400" />
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
                    onClick={() => handleBrushSelect(texture.id)}
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
                      handleBrushSelect(selectedTexture)
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
                      handleBrushSelect(selectedTexture)
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

          {/* Object Tools */}
          <Card className="bg-black/40 border-gray-800/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white text-sm">
                <Scissors className="w-4 h-4 text-red-400" />
                Object Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={activeTool === 'scissors' ? "default" : "outline"}
                className={`w-full justify-start ${
                  activeTool === 'scissors'
                    ? "bg-red-600 border-red-500"
                    : "bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800/50"
                }`}
                onClick={handleScissorsSelect}
              >
                <Scissors className="w-4 h-4 mr-2" />
                Cut Object
              </Button>
              
              <Button
                variant={activeTool === 'smudge' ? "default" : "outline"}
                className={`w-full justify-start ${
                  activeTool === 'smudge'
                    ? "bg-purple-600 border-purple-500"
                    : "bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800/50"
                }`}
                onClick={handleSmudgeSelect}
              >
                <Hand className="w-4 h-4 mr-2" />
                Smudge Tool
              </Button>
              
              <Button
                variant={activeTool === 'deform' ? "default" : "outline"}
                className={`w-full justify-start ${
                  activeTool === 'deform'
                    ? "bg-orange-600 border-orange-500"
                    : "bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800/50"
                }`}
                onClick={handleDeformSelect}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Deform Tool
              </Button>

              {/* Deform Strength (only show when deform is active) */}
              {activeTool === 'deform' && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs text-gray-300">Deform Strength</label>
                  <Slider
                    value={deformStrength}
                    onValueChange={(value) => {
                      setDeformStrength(value)
                      handleDeformSelect()
                    }}
                    max={1}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lighting Tools */}
          <Card className="bg-black/40 border-gray-800/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white text-sm">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
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
                <Lightbulb className="w-4 h-4 mr-2" />
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
                        <Icon className="w-3 h-3 mr-2" />
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