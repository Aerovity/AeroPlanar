import { useCallback, useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { SculptingSystem, BrushTool } from '@/lib/sculpting-system'

export interface UseSculptingOptions {
  onSculptingChange?: (targetId: string, isModified: boolean) => void
}

export function useSculpting(options: UseSculptingOptions = {}) {
  const sculptingSystemRef = useRef<SculptingSystem>(new SculptingSystem())
  const { camera, gl } = useThree()
  const isActiveRef = useRef(false)
  const currentBrushRef = useRef<BrushTool | null>(null)
  const currentTargetRef = useRef<string | null>(null)

  const sculptingSystem = sculptingSystemRef.current

  // Register a mesh for sculpting
  const registerMesh = useCallback((id: string, mesh: THREE.Mesh) => {
    sculptingSystem.registerTarget(id, mesh)
  }, [sculptingSystem])

  // Unregister a mesh from sculpting
  const unregisterMesh = useCallback((id: string) => {
    sculptingSystem.unregisterTarget(id)
  }, [sculptingSystem])

  // Set the active brush tool
  const setBrush = useCallback((brush: BrushTool | null) => {
    currentBrushRef.current = brush
  }, [])

  // Set the current target for sculpting
  const setTarget = useCallback((targetId: string | null) => {
    currentTargetRef.current = targetId
  }, [])

  // Start sculpting mode
  const startSculpting = useCallback(() => {
    isActiveRef.current = true
    if (gl.domElement) {
      gl.domElement.style.cursor = 'crosshair'
    }
  }, [gl])

  // Stop sculpting mode
  const stopSculpting = useCallback(() => {
    isActiveRef.current = false
    if (gl.domElement) {
      gl.domElement.style.cursor = 'default'
    }
  }, [gl])

  // Apply sculpting at a world position
  const sculptAtPosition = useCallback((worldPosition: THREE.Vector3) => {
    if (!isActiveRef.current || !currentBrushRef.current || !currentTargetRef.current) {
      return false
    }

    const success = sculptingSystem.applyBrush(
      currentTargetRef.current,
      currentBrushRef.current,
      worldPosition,
      camera
    )

    if (success && options.onSculptingChange) {
      const history = sculptingSystem.getTargetHistory(currentTargetRef.current)
      if (history) {
        options.onSculptingChange(currentTargetRef.current, history.isModified)
      }
    }

    return success
  }, [sculptingSystem, camera, options])

  // Reset a target to its original state
  const resetTarget = useCallback((targetId: string) => {
    const success = sculptingSystem.resetTarget(targetId)
    if (success && options.onSculptingChange) {
      options.onSculptingChange(targetId, false)
    }
    return success
  }, [sculptingSystem, options])

  // Get modification status of a target
  const getTargetStatus = useCallback((targetId: string) => {
    return sculptingSystem.getTargetHistory(targetId)
  }, [sculptingSystem])

  // Create a brush from configuration
  const createBrush = useCallback((config: {
    type: string
    size: number
    intensity: number
    falloff?: string
    symmetry?: { enabled: boolean; axis: string }
  }): BrushTool => {
    return SculptingSystem.createBrushFromConfig(config)
  }, [])

  // Handle mouse events for sculpting
  const handlePointerDown = useCallback((event: any) => {
    if (event.object && currentBrushRef.current && currentTargetRef.current && isActiveRef.current) {
      const worldPosition = event.point
      sculptAtPosition(worldPosition)
    }
  }, [sculptAtPosition])

  const handlePointerMove = useCallback((event: any) => {
    if (event.buttons === 1 && event.object && currentBrushRef.current && currentTargetRef.current && isActiveRef.current) {
      const worldPosition = event.point
      sculptAtPosition(worldPosition)
    }
  }, [sculptAtPosition])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gl.domElement) {
        gl.domElement.style.cursor = 'default'
      }
    }
  }, [gl])

  return {
    // Core functions
    registerMesh,
    unregisterMesh,
    setBrush,
    setTarget,
    startSculpting,
    stopSculpting,
    sculptAtPosition,
    resetTarget,
    getTargetStatus,
    createBrush,
    
    // Event handlers for components
    handlePointerDown,
    handlePointerMove,
    
    // State
    isActive: isActiveRef.current,
    currentBrush: currentBrushRef.current,
    currentTarget: currentTargetRef.current,
  }
}

// Predefined brush configurations
export const PREDEFINED_BRUSHES = {
  push: {
    type: 'push',
    size: 1.0,
    intensity: 0.5,
    falloff: 'smooth'
  },
  pull: {
    type: 'pull', 
    size: 1.0,
    intensity: 0.5,
    falloff: 'smooth'
  },
  inflate: {
    type: 'inflate',
    size: 1.2,
    intensity: 0.3,
    falloff: 'smooth'
  },
  deflate: {
    type: 'deflate',
    size: 1.2,
    intensity: 0.3,
    falloff: 'smooth'
  },
  smooth: {
    type: 'smooth',
    size: 1.5,
    intensity: 0.7,
    falloff: 'smooth'
  },
  pinch: {
    type: 'pinch',
    size: 0.8,
    intensity: 0.6,
    falloff: 'sharp'
  },
  crease: {
    type: 'crease',
    size: 0.6,
    intensity: 0.8,
    falloff: 'sharp'
  },
  flatten: {
    type: 'flatten',
    size: 1.5,
    intensity: 0.5,
    falloff: 'linear'
  },
  grab: {
    type: 'grab',
    size: 2.0,
    intensity: 1.0,
    falloff: 'linear'
  }
} as const