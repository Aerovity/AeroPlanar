"use client"

import { useGLTF, Html } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useRef, useState, useEffect, memo } from "react"
import type { Group } from "three"
import * as THREE from "three"

interface Model3DProps {
  url: string
  position: [number, number, number]
  size?: [number, number, number]
  isSelected?: boolean
  onClick?: () => void
  onPositionChange?: (newPosition: [number, number, number]) => void
  onSizeChange?: (newSize: [number, number, number]) => void
  keyboardMove?: { direction: string; amount: number } | null
}

function Model3DComponent({ url, position, size = [2, 2, 2], isSelected, onClick, onPositionChange, onSizeChange, keyboardMove }: Model3DProps) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const [error, setError] = useState(false)
  const [isDragging, setIsDragging] = useState<string | null>(null)
  const [currentPosition, setCurrentPosition] = useState<[number, number, number]>(position)
  const [currentSize, setCurrentSize] = useState<[number, number, number]>(size)
  const [gizmoHovered, setGizmoHovered] = useState<string | null>(null)
  const [baseScale, setBaseScale] = useState<number>(1)
  const [modelCenter, setModelCenter] = useState<[number, number, number]>([0, 0, 0])
  const { gl } = useThree()

  // Load the 3D model
  const gltf = useGLTF(url, undefined, undefined, (error) => {
    console.error("Error loading 3D model:", error)
    setError(true)
  })

  // Get a unique scene instance for this component
  const scene = gltf.scene.clone()

  // Calculate initial base scale and center when model loads
  useEffect(() => {
    if (scene) {
      // Get the bounding box of the model
      const box = new THREE.Box3().setFromObject(scene)
      const size = box.getSize(new THREE.Vector3())

      // Calculate scale to fit within a 2x2x2 cube (much larger than before)
      const maxDimension = Math.max(size.x, size.y, size.z)
      const calculatedBaseScale = (2 / maxDimension) * 5 // 10x bigger than original

      setBaseScale(calculatedBaseScale)

      // Center the model
      const center = box.getCenter(new THREE.Vector3())
      setModelCenter([center.x, center.y, center.z])

      // Apply initial scaling
      scene.scale.set(calculatedBaseScale, calculatedBaseScale, calculatedBaseScale)
      scene.position.set(-center.x * calculatedBaseScale, -center.y * calculatedBaseScale, -center.z * calculatedBaseScale)
    }
  }, [gltf.scene])

  // Apply size changes to the model
  useEffect(() => {
    if (scene && baseScale > 0) {
      scene.scale.set(
        baseScale * currentSize[0],
        baseScale * currentSize[1], 
        baseScale * currentSize[2]
      )
    }
  }, [scene, baseScale, currentSize])

  // Update position and size when props change
  useEffect(() => {
    setCurrentPosition(position)
  }, [position])

  useEffect(() => {
    setCurrentSize(size)
  }, [size])

  // Handle keyboard movement
  useEffect(() => {
    if (isSelected && keyboardMove) {
      const { direction, amount } = keyboardMove
      const [x, y, z] = currentPosition
      let newPosition: [number, number, number] = [x, y, z]

      switch (direction) {
        case "ArrowUp":
          newPosition = [x, y + amount, z] // Move up (positive Y)
          break
        case "ArrowDown":
          newPosition = [x, y - amount, z] // Move down (negative Y)
          break
        case "ArrowLeft":
          newPosition = [x - amount, y, z] // Move left (negative X)
          break
        case "ArrowRight":
          newPosition = [x + amount, y, z] // Move right (positive X)
          break
        case "w":
        case "W":
          newPosition = [x, y, z - amount] // Move forward (negative Z)
          break
        case "s":
        case "S":
          newPosition = [x, y, z + amount] // Move backward (positive Z)
          break
      }

      setCurrentPosition(newPosition)
      onPositionChange?.(newPosition)
    }
  }, [keyboardMove, isSelected, onPositionChange]) // Removed currentPosition from dependencies

  // Handle transform gizmo interactions
  const handleGizmoPointerDown = (axis: string) => (e: any) => {
    e.stopPropagation()
    e.preventDefault()
    setIsDragging(axis)
    gl.domElement.style.cursor = "grabbing"
  }

  const handleGizmoPointerUp = (e: any) => {
    e.stopPropagation()
    e.preventDefault()
    setIsDragging(null)
    gl.domElement.style.cursor = "default"
  }

  const handleGizmoPointerMove = (e: any) => {
    if (!isDragging) return

    e.stopPropagation()
    e.preventDefault()

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
        // Ensure minimum size to prevent models from disappearing
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

  // Handle model click
  const handleClick = (e: any) => {
    e.stopPropagation()
    onClick?.()
  }

  if (error) {
    return (
      <group position={currentPosition}>
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.7} />
        </mesh>
        <Html position={[0, 2.5, 0]} center>
          <div className="bg-red-500/80 text-white text-xs px-2 py-1 rounded">Error Loading Model</div>
        </Html>
      </group>
    )
  }

  return (
    <group position={currentPosition} onPointerMove={handleGizmoPointerMove} onPointerUp={handleGizmoPointerUp}>
      <group
        ref={groupRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <primitive object={scene} />

        {/* Selection highlight */}
        {isSelected && (
          <mesh>
            <sphereGeometry args={[3, 32, 32]} />
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} wireframe />
          </mesh>
        )}

        {/* Hover effect */}
        {hovered && !isSelected && (
          <mesh>
            <sphereGeometry args={[2.8, 32, 32]} />
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
              position={[1.5, 0, 0]}
              onPointerDown={handleGizmoPointerDown("x")}
              onPointerOver={() => setGizmoHovered("x")}
              onPointerOut={() => setGizmoHovered(null)}
            >
              <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
              <meshBasicMaterial color={gizmoHovered === "x" ? "#ff6b6b" : "#ff4444"} transparent opacity={0.8} />
            </mesh>
            <mesh position={[3, 0, 0]} onPointerDown={handleGizmoPointerDown("x")}>
              <coneGeometry args={[0.15, 0.4, 8]} />
              <meshBasicMaterial color={gizmoHovered === "x" ? "#ff6b6b" : "#ff4444"} transparent opacity={0.8} />
            </mesh>
          </group>

          {/* Y Axis - Green */}
          <group>
            <mesh
              position={[0, 1.5, 0]}
              onPointerDown={handleGizmoPointerDown("y")}
              onPointerOver={() => setGizmoHovered("y")}
              onPointerOut={() => setGizmoHovered(null)}
            >
              <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
              <meshBasicMaterial color={gizmoHovered === "y" ? "#6bff6b" : "#44ff44"} transparent opacity={0.8} />
            </mesh>
            <mesh position={[0, 3, 0]} onPointerDown={handleGizmoPointerDown("y")}>
              <coneGeometry args={[0.15, 0.4, 8]} />
              <meshBasicMaterial color={gizmoHovered === "y" ? "#6bff6b" : "#44ff44"} transparent opacity={0.8} />
            </mesh>
          </group>

          {/* Z Axis - Blue */}
          <group>
            <mesh
              position={[0, 0, 1.5]}
              rotation={[Math.PI / 2, 0, 0]}
              onPointerDown={handleGizmoPointerDown("z")}
              onPointerOver={() => setGizmoHovered("z")}
              onPointerOut={() => setGizmoHovered(null)}
            >
              <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
              <meshBasicMaterial color={gizmoHovered === "z" ? "#6b6bff" : "#4444ff"} transparent opacity={0.8} />
            </mesh>
            <mesh position={[0, 0, 3]} rotation={[Math.PI / 2, 0, 0]} onPointerDown={handleGizmoPointerDown("z")}>
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
            position={[3, 3, 3]}
            onPointerDown={handleGizmoPointerDown("scale")}
            onPointerOver={() => setGizmoHovered("scale")}
            onPointerOut={() => setGizmoHovered(null)}
          >
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshBasicMaterial color={gizmoHovered === "scale" ? "#ffff00" : "#ffaa00"} transparent opacity={0.8} />
          </mesh>

          {/* Axis labels */}
          <Html position={[3.5, 0, 0]} center>
            <div className="text-red-400 text-xs font-bold bg-black/50 px-1 rounded">X</div>
          </Html>
          <Html position={[0, 3.5, 0]} center>
            <div className="text-green-400 text-xs font-bold bg-black/50 px-1 rounded">Y</div>
          </Html>
          <Html position={[0, 0, 3.5]} center>
            <div className="text-blue-400 text-xs font-bold bg-black/50 px-1 rounded">Z</div>
          </Html>
        </group>
      )}


    </group>
  )
}

export const Model3D = memo(Model3DComponent)
