"use client"

import { useRef, useState, useEffect, useCallback, memo } from "react"
import { useThree } from "@react-three/fiber"
import type { Group, Mesh } from "three"
import * as THREE from "three"

interface Primitive3DProps {
  type: 'cube' | 'flat-cube' | 'globe'
  position: [number, number, number]
  size: [number, number, number]
  isSelected?: boolean
  onClick?: () => void
  onPositionChange?: (newPosition: [number, number, number]) => void
  onSizeChange?: (newSize: [number, number, number]) => void
  keyboardMove?: { direction: string; amount: number } | null
  activeTool?: string | null
  toolSettings?: any
  onToolApply?: (toolType: string, point: any) => void
}

function Primitive3DComponent({ 
  type, 
  position, 
  size, 
  isSelected, 
  onClick, 
  onPositionChange, 
  onSizeChange,
  keyboardMove,
  activeTool,
  toolSettings,
  onToolApply
}: Primitive3DProps) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const [isDragging, setIsDragging] = useState<string | null>(null)
  const [currentPosition, setCurrentPosition] = useState<[number, number, number]>(position)
  const [currentSize, setCurrentSize] = useState<[number, number, number]>(size)
  const [gizmoHovered, setGizmoHovered] = useState<string | null>(null)
  const [appliedMaterial, setAppliedMaterial] = useState<any>(null)
  const { gl } = useThree()

  // Update local state when props change
  useEffect(() => {
    setCurrentPosition(position)
  }, [position])

  useEffect(() => {
    setCurrentSize(size)
  }, [size])

  // Handle keyboard movement
  useEffect(() => {
    if (keyboardMove) {
      const { direction, amount } = keyboardMove
      const [x, y, z] = currentPosition
      let newPosition: [number, number, number] = [x, y, z]

      switch (direction) {
        case "ArrowUp":
          newPosition = [x, y + amount, z] // Up
          break
        case "ArrowDown":
          newPosition = [x, y - amount, z] // Down
          break
        case "ArrowLeft":
          newPosition = [x - amount, y, z] // Left
          break
        case "ArrowRight":
          newPosition = [x + amount, y, z] // Right
          break
        case "w":
        case "W":
          newPosition = [x, y, z - amount] // Forward
          break
        case "s":
        case "S":
          newPosition = [x, y, z + amount] // Backward
          break
      }

      setCurrentPosition(newPosition)
      onPositionChange?.(newPosition)
    }
  }, [keyboardMove]) // Removed all dependencies except keyboardMove to prevent infinite re-renders

  // Handle transform gizmo interactions
  const handleGizmoPointerDown = (axis: string) => (e: any) => {
    e.stopPropagation?.()
    if (e.preventDefault) {
      e.preventDefault()
    }
    setIsDragging(axis)
    gl.domElement.style.cursor = "grabbing"
  }

  const handleGizmoPointerUp = (e: any) => {
    e.stopPropagation?.()
    if (e.preventDefault) {
      e.preventDefault()
    }
    setIsDragging(null)
    gl.domElement.style.cursor = "default"
  }

  const handleGizmoPointerMove = (e: any) => {
    if (!isDragging) return

    e.stopPropagation?.()
    if (e.preventDefault) {
      e.preventDefault()
    }

    const sensitivity = 0.02
    const scaleSensitivity = 0.01
    const [x, y, z] = currentPosition
    const [sx, sy, sz] = currentSize

    let newPosition: [number, number, number] = [x, y, z]
    let newSize: [number, number, number] = [sx, sy, sz]

    switch (isDragging) {
      case "x":
        newPosition = [x + e.movementX * sensitivity, y, z]
        break
      case "y":
        newPosition = [x, y - e.movementY * sensitivity, z]
        break
      case "z":
        newPosition = [x, y, z + e.movementX * sensitivity]
        break
      case "scale":
        const scaleChange = e.movementX * scaleSensitivity
        newSize = [sx + scaleChange, sy + scaleChange, sz + scaleChange]
        // Ensure minimum size
        newSize = newSize.map(s => Math.max(0.1, s)) as [number, number, number]
        break
    }

    if (isDragging === "scale") {
      setCurrentSize(newSize)
      onSizeChange?.(newSize)
    } else {
      setCurrentPosition(newPosition)
      onPositionChange?.(newPosition)
    }
  }

  // Create material based on brush texture
  const createBrushMaterial = (textureType: string) => {
    const materials = {
      rough: new THREE.MeshStandardMaterial({ 
        color: 0x8B4513, 
        roughness: 0.9, 
        metalness: 0.1,
      }),
      smooth: new THREE.MeshStandardMaterial({ 
        color: 0xC0C0C0, 
        roughness: 0.1, 
        metalness: 0.8,
      }),
      metallic: new THREE.MeshStandardMaterial({ 
        color: 0x4A4A4A, 
        roughness: 0.2, 
        metalness: 1.0,
      }),
      wood: new THREE.MeshStandardMaterial({ 
        color: 0xDEB887, 
        roughness: 0.8, 
        metalness: 0.0,
      }),
      stone: new THREE.MeshStandardMaterial({ 
        color: 0x696969, 
        roughness: 0.9, 
        metalness: 0.1,
      })
    }
    return materials[textureType as keyof typeof materials] || materials.rough
  }

  // Handle tool interactions
  const handleToolInteraction = (e: any) => {
    if (!activeTool || !isSelected) return

    e.stopPropagation()

    switch (activeTool) {
      case 'brush':
        if (toolSettings?.brush) {
          const newMaterial = createBrushMaterial(toolSettings.brush.texture)
          setAppliedMaterial(newMaterial)
          onToolApply?.('brush', { position: currentPosition, material: toolSettings.brush.texture })
        }
        break
      
      case 'scissors':
        onToolApply?.('scissors', { position: currentPosition, point: e.point })
        break

      case 'smudge':
        // Smudge effect - slight scale variation
        const randomScaleVariation = 1 + (Math.random() - 0.5) * 0.1 * (toolSettings?.smudge?.intensity || 0.7)
        const newSize: [number, number, number] = [
          currentSize[0] * randomScaleVariation,
          currentSize[1] * randomScaleVariation,
          currentSize[2] * randomScaleVariation
        ]
        setCurrentSize(newSize)
        onSizeChange?.(newSize)
        onToolApply?.('smudge', { position: currentPosition, intensity: toolSettings?.smudge?.intensity })
        break

      case 'deform':
        // Deform effect - position offset
        const deformStrength = toolSettings?.deform?.strength || 0.3
        const offset = (Math.random() - 0.5) * deformStrength
        const newPos: [number, number, number] = [
          currentPosition[0] + offset,
          currentPosition[1] + offset * 0.5,
          currentPosition[2] + offset
        ]
        setCurrentPosition(newPos)
        onPositionChange?.(newPos)
        onToolApply?.('deform', { oldPosition: currentPosition, newPosition: newPos })
        break
    }
  }

  // Handle model click
  const handleClick = (e: any) => {
    e.stopPropagation?.()
    if (e.preventDefault) {
      e.preventDefault()
    }
    
    if (activeTool && isSelected) {
      handleToolInteraction(e)
    } else {
      onClick?.()
    }
  }

  const renderPrimitive = () => {
    const getMaterial = () => {
      if (appliedMaterial) {
        return appliedMaterial
      }
      // Default materials based on selection/hover state
      if (isSelected) {
        return new THREE.MeshStandardMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.8 })
      } else if (hovered) {
        return new THREE.MeshStandardMaterial({ color: 0x6b7280, transparent: true, opacity: 0.8 })
      }
      
      // Default type-based materials
      const typeColors = {
        'cube': 0x8b5cf6,
        'flat-cube': 0x10b981,
        'globe': 0xf59e0b
      }
      return new THREE.MeshStandardMaterial({ 
        color: typeColors[type], 
        transparent: true, 
        opacity: 0.8 
      })
    }

    switch (type) {
      case 'cube':
        return (
          <mesh>
            <boxGeometry args={currentSize} />
            <primitive object={getMaterial()} />
          </mesh>
        )
      case 'flat-cube':
        return (
          <mesh>
            <boxGeometry args={currentSize} />
            <primitive object={getMaterial()} />
          </mesh>
        )
      case 'globe':
        return (
          <mesh>
            <sphereGeometry args={[currentSize[0] / 2, 32, 32]} />
            <primitive object={getMaterial()} />
          </mesh>
        )
      default:
        return null
    }
  }

  return (
    <group position={currentPosition} onPointerMove={handleGizmoPointerMove} onPointerUp={handleGizmoPointerUp}>
      <group
        ref={groupRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {renderPrimitive()}

        {/* Selection highlight */}
        {isSelected && (
          <mesh>
            <sphereGeometry args={[Math.max(...currentSize) * 0.8, 32, 32]} />
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} wireframe />
          </mesh>
        )}

        {/* Hover effect */}
        {hovered && !isSelected && (
          <mesh>
            <sphereGeometry args={[Math.max(...currentSize) * 0.7, 32, 32]} />
            <meshBasicMaterial color="#6b7280" transparent opacity={0.05} wireframe />
          </mesh>
        )}
      </group>

      {/* Inline Transform Gizmo - Only show when selected */}
      {isSelected && (
        <group>
          {/* X Axis - Red */}
          <group>
            <mesh
              position={[currentSize[0] * 0.8, 0, 0]}
              onPointerDown={handleGizmoPointerDown("x")}
              onPointerOver={() => setGizmoHovered("x")}
              onPointerOut={() => setGizmoHovered(null)}
            >
              <cylinderGeometry args={[0.05, 0.05, currentSize[0] * 1.6, 8]} />
              <meshBasicMaterial color={gizmoHovered === "x" ? "#ff6b6b" : "#ff4444"} transparent opacity={0.8} />
            </mesh>
            <mesh position={[currentSize[0] * 1.6, 0, 0]} onPointerDown={handleGizmoPointerDown("x")}>
              <coneGeometry args={[0.15, 0.4, 8]} />
              <meshBasicMaterial color={gizmoHovered === "x" ? "#ff6b6b" : "#ff4444"} transparent opacity={0.8} />
            </mesh>
          </group>

          {/* Y Axis - Green */}
          <group>
            <mesh
              position={[0, currentSize[1] * 0.8, 0]}
              onPointerDown={handleGizmoPointerDown("y")}
              onPointerOver={() => setGizmoHovered("y")}
              onPointerOut={() => setGizmoHovered(null)}
            >
              <cylinderGeometry args={[0.05, 0.05, currentSize[1] * 1.6, 8]} />
              <meshBasicMaterial color={gizmoHovered === "y" ? "#6bff6b" : "#44ff44"} transparent opacity={0.8} />
            </mesh>
            <mesh position={[0, currentSize[1] * 1.6, 0]} onPointerDown={handleGizmoPointerDown("y")}>
              <coneGeometry args={[0.15, 0.4, 8]} />
              <meshBasicMaterial color={gizmoHovered === "y" ? "#6bff6b" : "#44ff44"} transparent opacity={0.8} />
            </mesh>
          </group>

          {/* Z Axis - Blue */}
          <group>
            <mesh
              position={[0, 0, currentSize[2] * 0.8]}
              rotation={[Math.PI / 2, 0, 0]}
              onPointerDown={handleGizmoPointerDown("z")}
              onPointerOver={() => setGizmoHovered("z")}
              onPointerOut={() => setGizmoHovered(null)}
            >
              <cylinderGeometry args={[0.05, 0.05, currentSize[2] * 1.6, 8]} />
              <meshBasicMaterial color={gizmoHovered === "z" ? "#6b6bff" : "#4444ff"} transparent opacity={0.8} />
            </mesh>
            <mesh position={[0, 0, currentSize[2] * 1.6]} rotation={[Math.PI / 2, 0, 0]} onPointerDown={handleGizmoPointerDown("z")}>
              <coneGeometry args={[0.15, 0.4, 8]} />
              <meshBasicMaterial color={gizmoHovered === "z" ? "#6b6bff" : "#4444ff"} transparent opacity={0.8} />
            </mesh>
          </group>

          {/* Center sphere */}
          <mesh onPointerDown={handleGizmoPointerDown("center")}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color={gizmoHovered === "center" ? "#ffffff" : "#cccccc"} transparent opacity={0.6} />
          </mesh>

          {/* Resize handles - Corner cubes */}
          <mesh 
            position={[currentSize[0] * 0.5, currentSize[1] * 0.5, currentSize[2] * 0.5]}
            onPointerDown={handleGizmoPointerDown("scale")}
            onPointerOver={() => setGizmoHovered("scale")}
            onPointerOut={() => setGizmoHovered(null)}
          >
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshBasicMaterial color={gizmoHovered === "scale" ? "#ffff00" : "#ffaa00"} transparent opacity={0.8} />
          </mesh>

          {/* Axis labels */}
          <mesh position={[currentSize[0] * 1.8, 0, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.1]} />
            <meshBasicMaterial color="#ff4444" />
          </mesh>
          <mesh position={[0, currentSize[1] * 1.8, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.1]} />
            <meshBasicMaterial color="#44ff44" />
          </mesh>
          <mesh position={[0, 0, currentSize[2] * 1.8]}>
            <boxGeometry args={[0.3, 0.3, 0.1]} />
            <meshBasicMaterial color="#4444ff" />
          </mesh>
        </group>
      )}
    </group>
  )
}

export const Primitive3D = memo(Primitive3DComponent)
