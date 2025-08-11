"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Grid, Environment, PerspectiveCamera } from "@react-three/drei"
import { Suspense } from "react"
import { Model3D } from "@/components/model-3d"
import { Primitive3D } from "@/components/primitive-3d"
import { GenerationPanel, type GenerationOptions } from "@/components/generation-panel"
import { ArchitecturePanel } from "@/components/architecture-panel"
import { ResizeToolbar } from "@/components/resize-toolbar"
import { ModelStats } from "@/components/model-stats"
import { SpotlightButton } from "@/components/ui/spotlight-button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import {
  Sparkles,
  Eye,
  Layers,
  Grid3x3,
  Palette,
  Wand2,
  Download,
  Trash2,
  RotateCcw,
  Move3d,
  Keyboard,
  Copy,
  Scissors,
  Building,
} from "lucide-react"

interface Task {
  task_id: string
  status: string
  progress?: number
}

export default function Home() {
  const [models, setModels] = useState<any[]>([])
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTasks, setActiveTasks] = useState<Task[]>([])
  const [keyboardMove, setKeyboardMove] = useState<{ direction: string; amount: number } | null>(null)
  const [currentView, setCurrentView] = useState<'generation' | 'architecture'>('generation')
  const [clipboard, setClipboard] = useState<any>(null)

  const selectedModel = useMemo(() => 
    models.find((m) => m.id === selectedModelId), 
    [models, selectedModelId]
  )

  // Add keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedModelId) return

      const moveAmount = 0.05 // Movement step size (10x slower)

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "W", "s", "S"].includes(e.key)) {
        e.preventDefault()
        setKeyboardMove({ direction: e.key, amount: moveAmount })

        // Clear the movement after a short delay to prevent continuous movement
        setTimeout(() => setKeyboardMove(null), 50)
      }

      // Handle copy/paste operations
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'c' && selectedModelId) {
          e.preventDefault()
          const modelToCopy = models.find(m => m.id === selectedModelId)
          if (modelToCopy) {
            setClipboard({ ...modelToCopy, id: `copy-${Date.now()}` })
            toast({
              title: "Model Copied",
              description: "Model copied to clipboard. Press Ctrl+V to paste.",
            })
          }
        } else if (e.key === 'v' && clipboard) {
          e.preventDefault()
          const newModel = {
            ...clipboard,
            id: `pasted-${Date.now()}`,
            position: [clipboard.position[0] + 2, clipboard.position[1], clipboard.position[2] + 2] as [number, number, number],
            size: clipboard.size || [1, 1, 1] as [number, number, number],
            originalSize: clipboard.originalSize || [1, 1, 1] as [number, number, number]
          }
          setModels(prev => [...prev, newModel])
          setSelectedModelId(newModel.id)
          toast({
            title: "Model Pasted",
            description: "Model pasted into the scene.",
          })
        } else if (e.key === 'x' && selectedModelId) {
          e.preventDefault()
          const modelToCut = models.find(m => m.id === selectedModelId)
          if (modelToCut) {
            setClipboard({ ...modelToCut, id: `cut-${Date.now()}` })
            setModels(prev => prev.filter(m => m.id !== selectedModelId))
            setSelectedModelId(null)
            toast({
              title: "Model Cut",
              description: "Model cut to clipboard. Press Ctrl+V to paste.",
            })
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedModelId, clipboard]) // Removed 'models' from dependencies to prevent infinite re-renders

  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId)
  }

  const handleModelPositionChange = (modelId: string, newPosition: [number, number, number]) => {
    setModels((prev) => prev.map((model) => (model.id === modelId ? { ...model, position: newPosition } : model)))
  }

  const handleModelSizeChange = (modelId: string, newSize: [number, number, number]) => {
    // Ensure minimum size to prevent models from disappearing
    const minSize = 0.1
    const clampedSize: [number, number, number] = [
      Math.max(newSize[0], minSize),
      Math.max(newSize[1], minSize),
      Math.max(newSize[2], minSize)
    ]
    setModels((prev) => prev.map((model) => (model.id === modelId ? { ...model, size: clampedSize } : model)))
  }

  const handleResetSize = (modelId: string) => {
    const model = models.find(m => m.id === modelId)
    if (model && model.originalSize) {
      setModels((prev) => prev.map((m) => (m.id === modelId ? { ...m, size: model.originalSize } : m)))
    }
  }

  const handleResetPosition = (modelId: string) => {
    const randomPosition: [number, number, number] = [Math.random() * 20 - 10, 0, Math.random() * 20 - 10]
    handleModelPositionChange(modelId, randomPosition)
  }

  const handleUpload3DModel = useCallback(async (file: File) => {
    try {
      const modelUrl = URL.createObjectURL(file)

      // Add model to the scene with better spacing
      const newModel = {
        id: `uploaded-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ""),
        url: modelUrl,
        position: [Math.random() * 20 - 10, 0, Math.random() * 20 - 10],
        size: [2, 2, 2] as [number, number, number],
        originalSize: [2, 2, 2] as [number, number, number],
        status: "ready",
        faces: Math.floor(Math.random() * 50000) + 10000,
        vertices: Math.floor(Math.random() * 25000) + 5000,
        topology: "Triangle",
      }

      setModels((prev) => [...prev, newModel])
      setSelectedModelId(newModel.id)

      toast({
        title: "3D Model Uploaded!",
        description: "Your model has been added to the scene. Use arrow keys or transform gizmo to reposition it.",
      })
    } catch (error) {
      console.error("Error uploading 3D model:", error)
      toast({
        title: "Upload Failed",
        description: "Please try again with a different file.",
        variant: "destructive",
      })
    }
  }, [])

  const handleGenerate = useCallback(async (file: File, options: GenerationOptions) => {
    setIsGenerating(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("model_version", options.modelVersion)
      formData.append("texture_resolution", options.textureResolution.toString())
      formData.append("remesh", options.remesh)
      if (options.style && options.style !== "none") {
        formData.append("style", options.style)
      }

      const response = await fetch("http://localhost:8000/convert/image-to-3d", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to start conversion")
      }

      const result = await response.json()
      const taskId = result.task_id

      // Add to active tasks
      setActiveTasks((prev) => [...prev, { task_id: taskId, status: "queued" }])

      // Poll for completion
      pollTaskCompletion(taskId, file.name.replace(/\.[^/.]+$/, ""))
    } catch (error) {
      console.error("Error generating model:", error)
      toast({
        title: "Generation Failed",
        description: "Please check your connection and try again.",
        variant: "destructive",
      })
      setIsGenerating(false)
    }
  }, [])

  const handleGenerateFromText = useCallback(async (prompt: string, options: GenerationOptions) => {
    setIsGenerating(true)

    try {
      const formData = new FormData()
      formData.append("prompt", prompt)
      formData.append("model_version", options.modelVersion)
      formData.append("texture_resolution", options.textureResolution.toString())
      formData.append("remesh", options.remesh)
      if (options.style && options.style !== "none") {
        formData.append("style", options.style)
      }

      const response = await fetch("http://localhost:8000/convert/text-to-3d", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to start text conversion")
      }

      const result = await response.json()
      const taskId = result.task_id

      // Add to active tasks
      setActiveTasks((prev) => [...prev, { task_id: taskId, status: "queued" }])

      // Poll for completion
      pollTaskCompletion(taskId, prompt.slice(0, 30) + (prompt.length > 30 ? "..." : ""))
    } catch (error) {
      console.error("Error generating from text:", error)
      toast({
        title: "Text Generation Failed",
        description: "Please check your prompt and try again.",
        variant: "destructive",
      })
      setIsGenerating(false)
    }
  }, [])

  const handleGenerateMultimodal = useCallback(async (file: File, prompt: string, options: GenerationOptions) => {
    setIsGenerating(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("prompt", prompt)
      formData.append("model_version", options.modelVersion)
      formData.append("texture_resolution", options.textureResolution.toString())
      formData.append("remesh", options.remesh)
      if (options.style && options.style !== "none") {
        formData.append("style", options.style)
      }

      const response = await fetch("http://localhost:8000/convert/multimodal-to-3d", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to start multimodal conversion")
      }

      const result = await response.json()
      const taskId = result.task_id

      // Add to active tasks
      setActiveTasks((prev) => [...prev, { task_id: taskId, status: "queued" }])

      // Poll for completion
      pollTaskCompletion(taskId, file.name.replace(/\.[^/.]+$/, "") + " + prompt")
    } catch (error) {
      console.error("Error generating multimodal:", error)
      toast({
        title: "Multimodal Generation Failed",
        description: "Please check your image and prompt, then try again.",
        variant: "destructive",
      })
      setIsGenerating(false)
    }
  }, [])

  const handleGenerateTextToImage = useCallback(async (prompt: string, negativePrompt?: string) => {
    setIsGenerating(true)

    try {
      const formData = new FormData()
      formData.append("prompt", prompt)
      if (negativePrompt && negativePrompt.trim()) {
        formData.append("negative_prompt", negativePrompt.trim())
      }

      const response = await fetch("http://localhost:8000/convert/text-to-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to start text-to-image conversion")
      }

      const result = await response.json()
      const taskId = result.task_id

      // Add to active tasks
      setActiveTasks((prev) => [...prev, { task_id: taskId, status: "queued" }])

      // Poll for completion - for text-to-image, we'll handle the image result differently
      pollTextToImageCompletion(taskId, prompt.slice(0, 30) + (prompt.length > 30 ? "..." : ""))
    } catch (error) {
      console.error("Error generating text-to-image:", error)
      toast({
        title: "Text-to-Image Generation Failed",
        description: "Please check your prompt and try again.",
        variant: "destructive",
      })
      setIsGenerating(false)
    }
  }, [])

  const pollTextToImageCompletion = useCallback((taskId: string, promptName: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const statusResponse = await fetch(`http://localhost:8000/task/${taskId}`)
        const taskStatus = await statusResponse.json()

        setActiveTasks((prev) =>
          prev.map((task) =>
            task.task_id === taskId ? { ...task, status: taskStatus.status, progress: taskStatus.progress } : task,
          ),
        )

        if (taskStatus.status === "success") {
          clearInterval(pollInterval)

          // For text-to-image, we need to handle the image result differently
          // The result should contain an image URL that we can display or download
          toast({
            title: "Image Generated!",
            description: "Your text-to-image generation completed successfully.",
          })

          // Remove from active tasks
          setActiveTasks((prev) => prev.filter((task) => task.task_id !== taskId))
          setIsGenerating(false)
        } else if (taskStatus.status === "failed") {
          clearInterval(pollInterval)
          setActiveTasks((prev) => prev.filter((task) => task.task_id !== taskId))
          setIsGenerating(false)

          toast({
            title: "Text-to-Image Generation Failed",
            description: "Please try again with a different prompt.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error polling text-to-image task status:", error)
      }
    }, 3000)
  }, [])

  const pollTaskCompletion = useCallback((taskId: string, modelName: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const statusResponse = await fetch(`http://localhost:8000/task/${taskId}`)
        const taskStatus = await statusResponse.json()

        setActiveTasks((prev) =>
          prev.map((task) =>
            task.task_id === taskId ? { ...task, status: taskStatus.status, progress: taskStatus.progress } : task,
          ),
        )

        if (taskStatus.status === "success") {
          clearInterval(pollInterval)

          // Download the model
          const downloadResponse = await fetch(`http://localhost:8000/task/${taskId}/download?format=glb`)
          if (downloadResponse.ok) {
            const blob = await downloadResponse.blob()
            const modelUrl = URL.createObjectURL(blob)

            // Add model to the scene with better spacing
            const newModel = {
              id: taskId,
              name: modelName,
              url: modelUrl,
              position: [Math.random() * 20 - 10, 0, Math.random() * 20 - 10],
              size: [2, 2, 2] as [number, number, number],
              originalSize: [2, 2, 2] as [number, number, number],
              status: "ready",
              faces: Math.floor(Math.random() * 50000) + 10000,
              vertices: Math.floor(Math.random() * 25000) + 5000,
              topology: "Triangle",
            }

            setModels((prev) => [...prev, newModel])
            setSelectedModelId(taskId)

            toast({
              title: "3D Model Generated!",
              description:
                "Your model has been added to the scene. Use arrow keys or transform gizmo to reposition it.",
            })
          }

          // Remove from active tasks
          setActiveTasks((prev) => prev.filter((task) => task.task_id !== taskId))
          setIsGenerating(false)
        } else if (taskStatus.status === "failed") {
          clearInterval(pollInterval)
          setActiveTasks((prev) => prev.filter((task) => task.task_id !== taskId))
          setIsGenerating(false)

          toast({
            title: "Generation Failed",
            description: "Please try again with different input.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error polling task status:", error)
      }
    }, 3000)
  }, [])

  const handleDeleteModel = (modelId: string) => {
    setModels((prev) => prev.filter((m) => m.id !== modelId))
    if (selectedModelId === modelId) {
      setSelectedModelId(null)
    }
    toast({
      title: "Model Deleted",
      description: "The model has been removed from the scene.",
    })
  }

  const handleDownloadModel = async (modelId: string) => {
    const model = models.find((m) => m.id === modelId)
    if (model) {
      const link = document.createElement("a")
      link.href = model.url
      link.download = `${model.name}.glb`
      link.click()
    }
  }

  const handleAddPrimitive = (primitive: any) => {
    const newModel = {
      id: `primitive-${Date.now()}`,
      name: primitive.name,
      type: 'primitive',
      primitiveType: primitive.id,
      position: [Math.random() * 20 - 10, 0, Math.random() * 20 - 10] as [number, number, number],
      size: primitive.size,
      originalSize: primitive.size, // Store original size for reset functionality
      status: 'ready'
    }
    
    setModels(prev => [...prev, newModel])
    setSelectedModelId(newModel.id)
    
    toast({
      title: `${primitive.name} Added`,
      description: "Primitive object added to the scene.",
    })
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Full-screen 3D Background */}
      <div className="fixed inset-0 z-0">
        <Canvas 
          shadows 
          dpr={[1, 2]} 
          gl={{ 
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            stencil: false,
            depth: true
          }}
          performance={{ min: 0.8 }}
          frameloop="demand"
        >
          <PerspectiveCamera makeDefault position={[20, 20, 20]} fov={60} />

          {/* Enhanced lighting setup */}
          <ambientLight intensity={0.3} color="#ffffff" />
          <directionalLight
            position={[20, 20, 10]}
            intensity={1.2}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={80}
            shadow-camera-left={-40}
            shadow-camera-right={40}
            shadow-camera-top={40}
            shadow-camera-bottom={-40}
            shadow-bias={-0.0001}
          />
          <pointLight position={[-20, 10, -20]} intensity={0.4} color="#3b82f6" />
          <pointLight position={[20, 10, 20]} intensity={0.4} color="#8b5cf6" />

          {/* Environment for better reflections */}
          <Environment preset="city" />

          {/* Optimized Grid */}
          <Grid
            position={[0, -0.01, 0]}
            args={[50, 50]}
            cellSize={2}
            cellThickness={0.6}
            cellColor="#1f2937"
            sectionSize={10}
            sectionThickness={1.2}
            sectionColor="#374151"
            fadeDistance={100}
            fadeStrength={1}
            infiniteGrid
          />

          {/* 3D Models - Optimized rendering */}
          <Suspense fallback={null}>
            {models.map((model) => {
              const commonProps = {
                key: model.id,
                position: model.position,
                size: model.size,
                isSelected: selectedModelId === model.id,
                onClick: () => handleModelSelect(model.id),
                onPositionChange: (newPosition: [number, number, number]) => handleModelPositionChange(model.id, newPosition),
                onSizeChange: (newSize: [number, number, number]) => handleModelSizeChange(model.id, newSize),
                keyboardMove: selectedModelId === model.id ? keyboardMove : null,
              }
              
              if (model.type === 'primitive') {
                return (
                  <Primitive3D
                    {...commonProps}
                    type={model.primitiveType}
                  />
                )
              } else {
                return (
                  <Model3D
                    {...commonProps}
                    url={model.url}
                  />
                )
              }
            })}
          </Suspense>

          {/* Optimized Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={10}
            maxDistance={150}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
            enableDamping={true}
            dampingFactor={0.08}
            rotateSpeed={0.6}
            panSpeed={1.0}
            zoomSpeed={0.8}
            makeDefault
          />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 pointer-events-none">
        {/* Header */}
        <header className="p-4 pointer-events-auto">
          <div className="max-w-7xl mx-auto">
            <div className="bg-black/40 backdrop-blur-xl rounded-full border border-gray-800/50 px-1 py-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src="/logo.png" alt="AeroPlanar Logo" className="w-32 h-32 rounded-lg object-contain" />
                </div>

                <nav className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`${currentView === 'generation' ? 'text-white' : 'text-gray-400'} hover:bg-gray-800/50 rounded-full`}
                    onClick={() => setCurrentView('generation')}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generation
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-gray-800/50 rounded-full">
                    <Palette className="w-4 h-4 mr-2" />
                    Texture
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`${currentView === 'architecture' ? 'text-white' : 'text-gray-400'} hover:bg-gray-800/50 rounded-full`}
                    onClick={() => setCurrentView('architecture')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Architecture Modeling
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-gray-800/50 rounded-full">
                    <Layers className="w-4 h-4 mr-2" />
                    Mockups
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-gray-800/50 rounded-full">
                    <Grid3x3 className="w-4 h-4 mr-2" />
                    3D Editing
                  </Button>
                </nav>

                <div className="flex items-center gap-2">
                  {activeTasks.map((task) => (
                    <Badge key={task.task_id} variant="secondary" className="bg-blue-600 text-white animate-pulse">
                      Generating... {task.progress ? `${task.progress}%` : ""}
                    </Badge>
                  ))}
                  <SpotlightButton>Get Started</SpotlightButton>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-120px)] gap-6 px-6 pb-6 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-80 space-y-6 pointer-events-auto overflow-y-auto max-h-full pr-2 pb-6">
            {currentView === 'generation' ? (
              <>
                <GenerationPanel
                  onGenerate={handleGenerate}
                  onGenerateFromText={handleGenerateFromText}
                  onGenerateMultimodal={handleGenerateMultimodal}
                  onGenerateTextToImage={handleGenerateTextToImage}
                  onUpload3DModel={handleUpload3DModel}
                  isGenerating={isGenerating}
                />

                {/* Model List */}
                {models.length > 0 && (
                  <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-4">
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Move3d className="w-4 h-4" />
                      Generated Models
                    </h3>
                    <div className="space-y-2">
                      {models.map((model) => (
                        <div
                          key={model.id}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedModelId === model.id
                              ? "bg-blue-600/20 border border-blue-500/30 shadow-lg"
                              : "bg-gray-900/50 hover:bg-gray-800/50 border border-transparent"
                          }`}
                          onClick={() => setSelectedModelId(model.id)}
                        >
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">{model.name}</p>
                            <p className="text-gray-400 text-xs flex items-center gap-1">
                              {selectedModelId === model.id && <Keyboard className="w-3 h-3" />}
                              {model.status} • Position: ({model.position[0].toFixed(1)}, {model.position[2].toFixed(1)})
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleResetPosition(model.id)
                              }}
                              className="h-8 w-8 p-0 text-gray-400 hover:text-blue-400 hover:bg-gray-700/50"
                              title="Reset Position"
                            >
                              <RotateCcw className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDownloadModel(model.id)
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
                                handleDeleteModel(model.id)
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
                  </div>
                )}
              </>
            ) : (
              <ArchitecturePanel
                models={models}
                selectedModelId={selectedModelId}
                onModelSelect={setSelectedModelId}
                onModelPositionChange={handleModelPositionChange}
                onModelDelete={handleDeleteModel}
                onModelUpload={handleUpload3DModel}
                onModelDownload={handleDownloadModel}
                onAddPrimitive={handleAddPrimitive}
                clipboard={clipboard}
              />
            )}
          </div>

          {/* Spacer for center area (3D scene is in background) */}
          <div className="flex-1" />

          {/* Right Sidebar */}
          <div className="w-80 pointer-events-auto overflow-y-auto max-h-full pl-2 pb-6">
            {currentView === 'generation' ? (
              <>
                <ModelStats selectedModel={selectedModel} />

                {/* Transform Controls Info */}
                {selectedModel && (
                  <div className="mt-4 bg-black/40 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-4">
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Move3d className="w-4 h-4 text-blue-400" />
                      Transform Controls
                    </h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="font-medium text-white mb-2">Mouse Controls:</div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span>Red Arrow: Move along X-axis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span>Green Arrow: Move along Y-axis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span>Blue Arrow: Move along Z-axis</span>
                      </div>
                      <div className="font-medium text-white mb-2 mt-3 flex items-center gap-2">
                        <Keyboard className="w-4 h-4" />
                        Keyboard Controls:
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 text-xs bg-gray-700 rounded">↑</kbd>
                        <span>Move Forward (Z-)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 text-xs bg-gray-700 rounded">↓</kbd>
                        <span>Move Backward (Z+)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 text-xs bg-gray-700 rounded">←</kbd>
                        <span>Move Left (X-)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 text-xs bg-gray-700 rounded">→</kbd>
                        <span>Move Right (X+)</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <ModelStats selectedModel={selectedModel} />

                {/* Architecture Modeling Controls */}
                {selectedModel && (
                  <div className="mt-4 bg-black/40 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-4">
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Building className="w-4 h-4 text-green-400" />
                      Architecture Controls
                    </h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="font-medium text-white mb-2">Mouse Controls:</div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span>Red Arrow: Move along X-axis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span>Green Arrow: Move along Y-axis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span>Blue Arrow: Move along Z-axis</span>
                      </div>
                      <div className="font-medium text-white mb-2 mt-3 flex items-center gap-2">
                        <Keyboard className="w-4 h-4" />
                        Keyboard Controls:
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 text-xs bg-gray-700 rounded">↑</kbd>
                        <span>Move Forward (Z-)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 text-xs bg-gray-700 rounded">↓</kbd>
                        <span>Move Backward (Z+)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 text-xs bg-gray-700 rounded">←</kbd>
                        <span>Move Left (X-)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 text-xs bg-gray-700 rounded">→</kbd>
                        <span>Move Right (X+)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 text-xs bg-gray-700 rounded">W</kbd>
                        <span>Move Forward (Z-)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 text-xs bg-gray-700 rounded">S</kbd>
                        <span>Move Backward (Z+)</span>
                      </div>
                      <div className="font-medium text-white mb-2 mt-3 flex items-center gap-2">
                        <Copy className="w-4 h-4" />
                        Copy/Paste Controls:
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 text-xs bg-gray-700 rounded">Ctrl+C</kbd>
                        <span>Copy selected model</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 text-xs bg-gray-700 rounded">Ctrl+V</kbd>
                        <span>Paste copied model</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 text-xs bg-gray-700 rounded">Ctrl+X</kbd>
                        <span>Cut selected model</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Resize Toolbar */}
                <ResizeToolbar
                  selectedModel={selectedModel}
                  onSizeChange={(newSize) => selectedModel && handleModelSizeChange(selectedModel.id, newSize)}
                  onResetSize={() => selectedModel && handleResetSize(selectedModel.id)}
                />

                {/* Scene Info */}
                <div className="mt-4 bg-black/40 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-4">
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Building className="w-4 h-4 text-purple-400" />
                    Scene Information
                  </h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span>Total Objects:</span>
                      <span className="text-white">{models.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Primitives:</span>
                      <span className="text-white">{models.filter(m => m.type === 'primitive').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uploaded Models:</span>
                      <span className="text-white">{models.filter(m => m.type !== 'primitive').length}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
