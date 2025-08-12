"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Grid, Environment, PerspectiveCamera } from "@react-three/drei"
import { Suspense } from "react"
import { Model3D } from "@/components/model-3d"
import { Primitive3D } from "@/components/primitive-3d"
import { GenerationPanel, type GenerationOptions } from "@/components/generation-panel"
import { ArchitecturePanel } from "@/components/architecture-panel"
import { Editing3DSidebar } from "@/components/editing-3d-sidebar"
import { ResizeToolbar } from "@/components/resize-toolbar"
import { ModelStats } from "@/components/model-stats"
import { ScenePerformanceMonitor } from "@/components/scene-performance-monitor"
import { PerformanceLimitDialog } from "@/components/performance-limit-dialog"
import { SpotlightButton } from "@/components/ui/spotlight-button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { useScenePerformance, estimateModelImpact } from "@/hooks/use-scene-performance"
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
  const [currentView, setCurrentView] = useState<'generation' | 'architecture' | '3d-editing'>('generation')
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [isDeforming, setIsDeforming] = useState(false)
  const [deformStartPoint, setDeformStartPoint] = useState<any>(null)
  const [dynamicLights, setDynamicLights] = useState<any[]>([])
  const [currentLightingFilter, setCurrentLightingFilter] = useState<string>('natural')
  const [toolSettings, setToolSettings] = useState<any>({
    brush: { texture: 'rough', size: 0.5, intensity: 0.7 },
    deform: { strength: 0.3 },
    smudge: { intensity: 0.7 },
    light: { intensity: 1.0 }
  })
  const [sculptingEnabled, setSculptingEnabled] = useState(false)
  const [currentSculptBrush, setCurrentSculptBrush] = useState<any>(null)
  const [clipboard, setClipboard] = useState<any>(null)
  const [showPerformanceDialog, setShowPerformanceDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)
  const [performanceDialogData, setPerformanceDialogData] = useState<{
    warningLevel: 'none' | 'low' | 'medium' | 'high' | 'critical'
    warnings: string[]
    suggestions: string[]
    isBlocking: boolean
  }>({ warningLevel: 'none', warnings: [], suggestions: [], isBlocking: false })

  const selectedModel = useMemo(() => 
    models.find((m) => m.id === selectedModelId), 
    [models, selectedModelId]
  )

  // Performance monitoring
  const scenePerformance = useScenePerformance(models)

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
      
      // Estimate model complexity based on file size (rough approximation)
      const fileSizeMB = file.size / (1024 * 1024)
      const estimatedFaces = Math.min(200000, Math.max(5000, Math.floor(fileSizeMB * 10000)))

      // Create model data
      const newModel = {
        id: `uploaded-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ""),
        url: modelUrl,
        position: [Math.random() * 20 - 10, 0, Math.random() * 20 - 10],
        size: [2, 2, 2] as [number, number, number],
        originalSize: [2, 2, 2] as [number, number, number],
        status: "ready",
        faces: estimatedFaces,
        vertices: Math.floor(estimatedFaces * 0.6),
        topology: "Triangle",
      }

      // Check performance impact before adding
      checkPerformanceBeforeAdding(estimatedFaces, () => {
        setModels((prev) => [...prev, newModel])
        setSelectedModelId(newModel.id)

        toast({
          title: "3D Model Uploaded!",
          description: "Your model has been added to the scene. Use arrow keys or transform gizmo to reposition it.",
        })
      })
    } catch (error) {
      console.error("Error uploading 3D model:", error)
      toast({
        title: "Upload Failed",
        description: "Please try again with a different file.",
        variant: "destructive",
      })
    }
  }, [scenePerformance])

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

            // Generate model data with estimated complexity
            const estimatedFaces = Math.floor(Math.random() * 50000) + 10000
            const newModel = {
              id: taskId,
              name: modelName,
              url: modelUrl,
              position: [Math.random() * 20 - 10, 0, Math.random() * 20 - 10],
              size: [2, 2, 2] as [number, number, number],
              originalSize: [2, 2, 2] as [number, number, number],
              status: "ready",
              faces: estimatedFaces,
              vertices: Math.floor(estimatedFaces * 0.5),
              topology: "Triangle",
            }

            // Check performance impact before adding generated model
            checkPerformanceBeforeAdding(estimatedFaces, () => {
              setModels((prev) => [...prev, newModel])
              setSelectedModelId(taskId)

              toast({
                title: "3D Model Generated!",
                description:
                  "Your model has been added to the scene. Use arrow keys or transform gizmo to reposition it.",
              })
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
      status: 'ready',
      faces: primitive.faces || 1000,
      vertices: primitive.vertices || 500
    }

    // Check performance impact before adding
    checkPerformanceBeforeAdding(newModel.faces || 1000, () => {
      setModels(prev => [...prev, newModel])
      setSelectedModelId(newModel.id)
      
      toast({
        title: `${primitive.name} Added`,
        description: "Primitive object added to the scene.",
      })
    })
  }

  // Performance checking and scene management functions
  const checkPerformanceBeforeAdding = (estimatedFaces: number, proceedCallback: () => void) => {
    const impact = estimateModelImpact(scenePerformance, estimatedFaces)
    
    if (impact.wouldExceedLimits || impact.projectedWarningLevel === 'critical') {
      setPerformanceDialogData({
        warningLevel: impact.projectedWarningLevel,
        warnings: impact.warnings,
        suggestions: ['Remove some models to free up performance', 'Try using simpler models'],
        isBlocking: impact.wouldExceedLimits
      })
      setPendingAction(() => proceedCallback)
      setShowPerformanceDialog(true)
    } else if (impact.warnings.length > 0) {
      setPerformanceDialogData({
        warningLevel: impact.projectedWarningLevel,
        warnings: impact.warnings,
        suggestions: ['Monitor performance after adding this model'],
        isBlocking: false
      })
      setPendingAction(() => proceedCallback)
      setShowPerformanceDialog(true)
    } else {
      proceedCallback()
    }
  }

  const handleClearScene = () => {
    setModels([])
    setSelectedModelId(null)
    toast({
      title: "Scene Cleared",
      description: "All models have been removed from the scene.",
    })
  }

  const handleOptimizeScene = () => {
    // Remove models with more than 50k faces or keep only the 20 smallest models
    const sortedModels = models
      .filter(model => (model.faces || 0) < 50000)
      .sort((a, b) => (a.faces || 0) - (b.faces || 0))
      .slice(0, Math.min(20, models.length))
    
    const removedCount = models.length - sortedModels.length
    setModels(sortedModels)
    
    if (selectedModelId && !sortedModels.find(m => m.id === selectedModelId)) {
      setSelectedModelId(null)
    }
    
    toast({
      title: "Scene Optimized",
      description: `Removed ${removedCount} high-complexity models to improve performance.`,
    })
  }

  const handleRemoveLargestModel = () => {
    if (models.length === 0) return
    
    const largestModel = models.reduce((largest, current) => 
      (current.faces || 0) > (largest.faces || 0) ? current : largest
    )
    
    handleDeleteModel(largestModel.id)
    toast({
      title: "Largest Model Removed",
      description: `Removed ${largestModel.name} (${(largestModel.faces || 0).toLocaleString()} faces) to improve performance.`,
    })
  }

  const handlePerformanceDialogProceed = () => {
    if (pendingAction) {
      pendingAction()
      setPendingAction(null)
    }
    setShowPerformanceDialog(false)
  }

  const handlePerformanceDialogClose = () => {
    setPendingAction(null)
    setShowPerformanceDialog(false)
  }

  const handleSculptingToolSelect = (brushConfig: any) => {
    setCurrentSculptBrush(brushConfig)
    setSculptingEnabled(true)
    toast({
      title: "Sculpting Brush Selected",
      description: `${brushConfig.type.charAt(0).toUpperCase() + brushConfig.type.slice(1)} brush active - Size: ${brushConfig.size.toFixed(1)}, Intensity: ${brushConfig.intensity.toFixed(1)}`,
    })
  }

  const handleToolSelect = (tool: string, options?: any) => {
    setActiveTool(tool)
    
    // Handle sculpting mode toggle
    if (tool === 'sculpting-mode') {
      setSculptingEnabled(options?.enabled || false)
      if (!options?.enabled) {
        setCurrentSculptBrush(null)
      }
      toast({
        title: options?.enabled ? "Sculpting Mode Enabled" : "Sculpting Mode Disabled",
        description: options?.enabled ? "Advanced SculptGL-inspired vertex manipulation tools are now active" : "Returned to standard editing mode",
      })
      return
    }
    
    // Handle sculpting tools
    if (tool.startsWith('sculpt-')) {
      const brushType = tool.replace('sculpt-', '')
      setCurrentSculptBrush({
        type: brushType,
        size: options?.size || 1.0,
        intensity: options?.intensity || 0.5,
        falloff: 'smooth'
      })
      toast({
        title: `${brushType.charAt(0).toUpperCase() + brushType.slice(1)} Sculpting Tool`,
        description: `Selected ${brushType} brush - Size: ${(options?.size || 1.0).toFixed(1)}, Intensity: ${(options?.intensity || 0.5).toFixed(1)}`,
      })
      return
    }
    
    // Update tool settings
    if (options) {
      setToolSettings(prev => ({
        ...prev,
        [tool.split('-')[0]]: options
      }))
    }
    
    // Tool-specific actions
    switch (tool) {
      case 'brush':
        toast({
          title: "Brush Tool Selected",
          description: `Texture: ${options?.texture}, Size: ${options?.size?.toFixed(1)}, Intensity: ${options?.intensity?.toFixed(1)}`,
        })
        break
      case 'scissors':
        toast({
          title: "Scissors Tool Active",
          description: "Click and drag across an object to cut it into separate parts.",
        })
        break
      case 'light-create':
        toast({
          title: "Light Creation Tool",
          description: "Click in the scene to place a new light source.",
        })
        break
      case 'smudge':
        toast({
          title: "Smudge Tool Active",
          description: "Click and drag on model surfaces to smudge and deform them.",
        })
        break
      case 'deform':
        toast({
          title: "Deform Tool Active",
          description: "Click on a model, then click and drag in empty space to deform it.",
        })
        break
      default:
        if (tool.startsWith('lighting-filter')) {
          const filterName = tool.replace('lighting-filter-', '')
          setCurrentLightingFilter(filterName)
          toast({
            title: `${filterName.charAt(0).toUpperCase() + filterName.slice(1)} Lighting Applied`,
            description: "Scene lighting has been updated with new filter.",
          })
        }
    }
  }

  const handleSceneClick = (event: any) => {
    if (activeTool === 'light-create' && event.point) {
      const newLight = {
        id: `light-${Date.now()}`,
        position: [event.point.x, event.point.y + 2, event.point.z],
        intensity: toolSettings.light.intensity,
        color: '#ffffff',
        type: 'point'
      }
      
      setDynamicLights(prev => [...prev, newLight])
      
      toast({
        title: "Light Created!",
        description: `New light placed at (${event.point.x.toFixed(1)}, ${event.point.y.toFixed(1)}, ${event.point.z.toFixed(1)})`,
      })
    }
  }

  const handleDeformStart = (event: any) => {
    if (activeTool === 'deform' && selectedModelId) {
      setIsDeforming(true)
      setDeformStartPoint(event.point)
      event.stopPropagation()
    }
  }

  const handleDeformEnd = () => {
    setIsDeforming(false)
    setDeformStartPoint(null)
  }

  const handleDeformMove = (event: any) => {
    if (isDeforming && selectedModelId && deformStartPoint) {
      const selectedModel = models.find(m => m.id === selectedModelId)
      if (!selectedModel) return

      const distance = Math.sqrt(
        Math.pow(event.point.x - deformStartPoint.x, 2) +
        Math.pow(event.point.y - deformStartPoint.y, 2) +
        Math.pow(event.point.z - deformStartPoint.z, 2)
      )

      const deformStrength = toolSettings.deform.strength * distance
      const direction = {
        x: (event.point.x - deformStartPoint.x) / distance,
        y: (event.point.y - deformStartPoint.y) / distance,
        z: (event.point.z - deformStartPoint.z) / distance
      }

      const newPosition: [number, number, number] = [
        selectedModel.position[0] + direction.x * deformStrength,
        selectedModel.position[1] + direction.y * deformStrength,
        selectedModel.position[2] + direction.z * deformStrength
      ]

      handleModelPositionChange(selectedModelId, newPosition)
    }
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
          frameloop="always"
          onClick={handleSceneClick}
          onPointerDown={handleDeformStart}
          onPointerMove={handleDeformMove}
          onPointerUp={handleDeformEnd}
        >
          <PerspectiveCamera makeDefault position={[20, 20, 20]} fov={60} />

          {/* Dynamic lighting setup based on filter */}
          <ambientLight 
            intensity={
              currentLightingFilter === 'soft' ? 0.8 : 
              currentLightingFilter === 'dramatic' ? 0.05 : 
              currentLightingFilter === 'warm' ? 0.4 :
              currentLightingFilter === 'cool' ? 0.4 : 0.3
            } 
            color={
              currentLightingFilter === 'warm' ? "#ff9966" : 
              currentLightingFilter === 'cool' ? "#6699ff" : "#ffffff"
            } 
          />
          <directionalLight
            position={[20, 20, 10]}
            intensity={
              currentLightingFilter === 'dramatic' ? 3.0 : 
              currentLightingFilter === 'soft' ? 0.4 : 
              currentLightingFilter === 'warm' ? 1.5 :
              currentLightingFilter === 'cool' ? 1.5 : 1.2
            }
            color={
              currentLightingFilter === 'warm' ? "#ffcc88" : 
              currentLightingFilter === 'cool' ? "#88ccff" : 
              currentLightingFilter === 'dramatic' ? "#ffffff" : "#ffffff"
            }
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
          <pointLight 
            position={[-20, 10, -20]} 
            intensity={
              currentLightingFilter === 'dramatic' ? 1.2 : 
              currentLightingFilter === 'soft' ? 0.2 :
              currentLightingFilter === 'warm' ? 0.8 : 0.4
            } 
            color={
              currentLightingFilter === 'warm' ? "#ff6633" : 
              currentLightingFilter === 'cool' ? "#3366ff" : "#3b82f6"
            } 
          />
          <pointLight 
            position={[20, 10, 20]} 
            intensity={
              currentLightingFilter === 'dramatic' ? 1.2 : 
              currentLightingFilter === 'soft' ? 0.2 :
              currentLightingFilter === 'cool' ? 0.8 : 0.4
            } 
            color={
              currentLightingFilter === 'cool' ? "#3399ff" : 
              currentLightingFilter === 'warm' ? "#ff9933" : "#8b5cf6"
            } 
          />

          {/* Scene ambient lighting based on filter */}
          <ambientLight 
            intensity={
              currentLightingFilter === 'natural' ? 0.4 :
              currentLightingFilter === 'dramatic' ? 0.1 :
              currentLightingFilter === 'soft' ? 0.6 :
              currentLightingFilter === 'cool' ? 0.3 :
              currentLightingFilter === 'warm' ? 0.5 : 0.4
            }
            color={
              currentLightingFilter === 'natural' ? "#ffffff" :
              currentLightingFilter === 'dramatic' ? "#4c1d95" :
              currentLightingFilter === 'soft' ? "#fef3c7" :
              currentLightingFilter === 'cool' ? "#93c5fd" :
              currentLightingFilter === 'warm' ? "#fed7aa" : "#ffffff"
            }
          />

          {/* Directional light based on filter */}
          <directionalLight
            position={[10, 10, 5]}
            intensity={
              currentLightingFilter === 'natural' ? 1.0 :
              currentLightingFilter === 'dramatic' ? 1.5 :
              currentLightingFilter === 'soft' ? 0.8 :
              currentLightingFilter === 'cool' ? 0.9 :
              currentLightingFilter === 'warm' ? 1.2 : 1.0
            }
            color={
              currentLightingFilter === 'natural' ? "#ffffff" :
              currentLightingFilter === 'dramatic' ? "#8b5cf6" :
              currentLightingFilter === 'soft' ? "#fbbf24" :
              currentLightingFilter === 'cool' ? "#60a5fa" :
              currentLightingFilter === 'warm' ? "#f97316" : "#ffffff"
            }
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          {/* Dynamic user-created lights */}
          {dynamicLights.map((light) => (
            <group key={light.id}>
              <pointLight
                position={light.position}
                intensity={light.intensity}
                color={light.color}
                distance={20}
                decay={2}
                castShadow
              />
              {/* Visual representation of the light */}
              <mesh position={light.position}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshBasicMaterial color={light.color} transparent opacity={0.8} />
              </mesh>
              <mesh position={light.position}>
                <sphereGeometry args={[0.4, 16, 16]} />
                <meshBasicMaterial color={light.color} transparent opacity={0.2} wireframe />
              </mesh>
            </group>
          ))}

          {/* Environment for better reflections - Dynamic based on lighting filter */}
          <Environment 
            preset={
              currentLightingFilter === 'natural' ? "city" :
              currentLightingFilter === 'dramatic' ? "night" :
              currentLightingFilter === 'soft' ? "dawn" :
              currentLightingFilter === 'cool' ? "forest" :
              currentLightingFilter === 'warm' ? "sunset" : "city"
            } 
          />

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
                activeTool: selectedModelId === model.id ? activeTool : null,
                toolSettings,
                onToolApply: (toolType: string, data: any) => {
                  // Handle tool application results
                  switch (toolType) {
                    case 'brush':
                      toast({
                        title: "Brush Applied!",
                        description: `Applied ${data.material} texture to ${model.name}`,
                      })
                      break
                    case 'scissors':
                      // Create a duplicate model with offset for scissors effect
                      const cutModel = {
                        ...model,
                        id: `cut-${Date.now()}`,
                        name: `${model.name} (Cut)`,
                        position: [model.position[0] + 2, model.position[1], model.position[2]] as [number, number, number]
                      }
                      setModels(prev => [...prev, cutModel])
                      toast({
                        title: "Object Cut!",
                        description: `${model.name} has been split into two parts`,
                      })
                      break
                    case 'smudge':
                      toast({
                        title: "Surface Smudged!",
                        description: `Applied smudge effect to ${model.name}`,
                      })
                      break
                    case 'deform':
                      toast({
                        title: "Object Deformed!",
                        description: `Applied deformation to ${model.name}`,
                      })
                      break
                    case 'deform-start':
                      setIsDeforming(true)
                      setDeformStartPoint(data.point)
                      toast({
                        title: "Deform Mode Active",
                        description: "Click and drag in empty space to deform the selected object.",
                      })
                      break
                  }
                },
              }
              
              if (model.type === 'primitive') {
                return (
                  <Primitive3D
                    {...commonProps}
                    type={model.primitiveType}
                    sculptingEnabled={sculptingEnabled}
                    currentBrush={currentSculptBrush}
                    primitiveId={model.id}
                  />
                )
              } else {
                return (
                  <Model3D
                    {...commonProps}
                    url={model.url}
                    sculptingEnabled={sculptingEnabled}
                    currentBrush={currentSculptBrush}
                    modelId={model.id}
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
                  <div className="relative">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-gray-800/50 rounded-full">
                      <Palette className="w-4 h-4 mr-2" />
                      Texture
                    </Button>
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
                      Soon Available
                    </div>
                  </div>
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
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`${currentView === '3d-editing' ? 'text-white' : 'text-gray-400'} hover:bg-gray-800/50 rounded-full`}
                      onClick={() => setCurrentView('3d-editing')}
                    >
                      <Grid3x3 className="w-4 h-4 mr-2" />
                      3D Editing
                    </Button>
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-blue-400 whitespace-nowrap">
                      Beta
                    </div>
                  </div>
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
            ) : currentView === '3d-editing' ? (
              <Editing3DSidebar
                selectedModelId={selectedModelId}
                onToolSelect={handleToolSelect}
                onSculptingToolSelect={handleSculptingToolSelect}
                activeTool={activeTool}
              />
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

                {/* Scene Performance Monitor */}
                <div className="mt-4">
                  <ScenePerformanceMonitor 
                    performance={scenePerformance}
                    onClearScene={handleClearScene}
                    onOptimizeScene={handleOptimizeScene}
                    onRemoveLargestModel={handleRemoveLargestModel}
                  />
                </div>

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
            ) : currentView === '3d-editing' ? (
              <>
                <ModelStats selectedModel={selectedModel} />

                {/* 3D Editing Instructions */}
                <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-4">
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Grid3x3 className="w-4 h-4 text-purple-400" />
                    3D Editing Mode
                  </h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="text-purple-300 font-medium">Active Tools:</div>
                    {sculptingEnabled && currentSculptBrush ? (
                      <div className="bg-purple-900/30 p-2 rounded-lg border border-purple-500/30">
                        <div className="text-purple-200 capitalize font-medium">Sculpting: {currentSculptBrush.type}</div>
                        <div className="text-xs text-purple-300 mt-1">
                          Size: {currentSculptBrush.size?.toFixed(1)} | Intensity: {currentSculptBrush.intensity?.toFixed(1)}
                          {currentSculptBrush.symmetry?.enabled && ` | Symmetry: ${currentSculptBrush.symmetry.axis.toUpperCase()}`}
                        </div>
                      </div>
                    ) : activeTool ? (
                      <div className="bg-purple-900/30 p-2 rounded-lg border border-purple-500/30">
                        <span className="text-purple-200 capitalize">{activeTool.replace('-', ' ')}</span>
                      </div>
                    ) : (
                      <div className="text-gray-400">No tool selected</div>
                    )}
                    
                    <div className="mt-3 space-y-1">
                      <div className="text-purple-300 font-medium">Mode: {sculptingEnabled ? 'Advanced Sculpting' : 'Standard Tools'}</div>
                      <div className="text-white font-medium mb-2 mt-2">Instructions:</div>
                      <div>• Select a model from the scene</div>
                      <div>• Choose tools from the left sidebar</div>
                      {sculptingEnabled ? (
                        <>
                          <div>• <strong>Sculpting Brushes:</strong> Advanced vertex manipulation</div>
                          <div>• <strong>Push/Pull:</strong> Click and drag to move vertices along normals</div>
                          <div>• <strong>Inflate/Deflate:</strong> Expand or contract mesh areas</div>
                          <div>• <strong>Smooth:</strong> Average vertex positions for smoothing</div>
                          <div>• <strong>Pinch/Crease:</strong> Create sharp details or indentations</div>
                          <div>• <strong>Flatten/Grab:</strong> Flatten surfaces or grab and move vertices</div>
                          <div>• <strong>Symmetry:</strong> Mirror edits across X, Y, or Z axis</div>
                        </>
                      ) : (
                        <>
                          <div>• <strong>Material Brushes:</strong> Click on models to apply textures</div>
                          <div>• <strong>Scissors:</strong> Click on models to cut/duplicate them</div>
                          <div>• <strong>Lights:</strong> Click empty space to create lights</div>
                          <div>• <strong>Lighting Filters:</strong> Apply instantly to scene</div>
                          <div>• <strong>Deform:</strong> Click model, then drag in empty space to deform</div>
                          <div>• <strong>Smudge:</strong> Click models for random effects</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Light Management */}
                {dynamicLights.length > 0 && (
                  <div className="mt-4 bg-black/40 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-4">
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400" />
                      Scene Lights ({dynamicLights.length})
                    </h3>
                    <div className="space-y-2">
                      {dynamicLights.map((light, index) => (
                        <div
                          key={light.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-gray-900/50"
                        >
                          <div className="flex-1">
                            <p className="text-white text-sm">Light {index + 1}</p>
                            <p className="text-gray-400 text-xs">
                              Pos: ({light.position[0].toFixed(1)}, {light.position[1].toFixed(1)}, {light.position[2].toFixed(1)})
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setDynamicLights(prev => prev.filter(l => l.id !== light.id))
                              toast({
                                title: "Light Removed",
                                description: "Light source has been deleted from the scene.",
                              })
                            }}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                            title="Remove Light"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Scene Performance Monitor */}
                <div className="mt-4">
                  <ScenePerformanceMonitor 
                    performance={scenePerformance}
                    onClearScene={handleClearScene}
                    onOptimizeScene={handleOptimizeScene}
                    onRemoveLargestModel={handleRemoveLargestModel}
                  />
                </div>
              </>
            ) : (
              <>
                <ModelStats selectedModel={selectedModel} />

                {/* Scene Performance Monitor */}
                <div className="mt-4">
                  <ScenePerformanceMonitor 
                    performance={scenePerformance}
                    onClearScene={handleClearScene}
                    onOptimizeScene={handleOptimizeScene}
                    onRemoveLargestModel={handleRemoveLargestModel}
                  />
                </div>

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

      {/* Performance Limit Dialog */}
      <PerformanceLimitDialog
        isOpen={showPerformanceDialog}
        onClose={handlePerformanceDialogClose}
        onProceed={handlePerformanceDialogProceed}
        onClearScene={handleClearScene}
        onRemoveLargestModel={handleRemoveLargestModel}
        warningLevel={performanceDialogData.warningLevel}
        warnings={performanceDialogData.warnings}
        suggestions={performanceDialogData.suggestions}
        isBlocking={performanceDialogData.isBlocking}
        currentPerformance={{
          totalFaces: scenePerformance.totalFaces,
          totalModels: scenePerformance.totalModels,
          performanceScore: scenePerformance.performanceScore
        }}
      />
    </div>
  )
}
