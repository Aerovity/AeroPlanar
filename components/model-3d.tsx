"use client"

import { useGLTF, Html } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef, useState, useEffect } from "react"
import { Mesh, Group, Box3, Vector3 } from "three"
import * as THREE from "three"

interface Model3DProps {
  url: string
  position: [number, number, number]
  isSelected?: boolean
  onClick?: () => void
}

export function Model3D({ url, position, isSelected, onClick }: Model3DProps) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const [error, setError] = useState(false)
  const [isRotating, setIsRotating] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  
  // Load the 3D model
  const { scene } = useGLTF(url, undefined, undefined, (error) => {
    console.error('Error loading 3D model:', error)
    setError(true)
  })

  // Scale model to fit one grid square (5x bigger)
  useEffect(() => {
    if (scene) {
      // Get the bounding box of the model
      const box = new THREE.Box3().setFromObject(scene)
      const size = box.getSize(new THREE.Vector3())
      
      // Calculate scale to fit within a 1x1x1 cube, then multiply by 5 to make it bigger
      const maxDimension = Math.max(size.x, size.y, size.z)
      const scale = (1 / maxDimension) * 5
      
      scene.scale.set(scale, scale, scale)
    }
  }, [scene])
  
  // Handle mouse/touch drag for rotation
  const handlePointerDown = (e: any) => {
    e.stopPropagation()
    setIsDragging(true)
  }
  
  const handlePointerUp = () => {
    setIsDragging(false)
  }
  
  const handlePointerMove = (e: any) => {
    if (isDragging && groupRef.current) {
      const sensitivity = 0.01
      groupRef.current.rotation.y += e.movementX * sensitivity
      groupRef.current.rotation.x += e.movementY * sensitivity
    }
  }
  
  // Toggle rotation animation
  const handleDoubleClick = (e: any) => {
    e.stopPropagation()
    setIsRotating(!isRotating)
  }
  
  // Animate selected models
  useFrame((state) => {
    if (groupRef.current && isSelected && isRotating && !isDragging) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  if (error) {
    return (
      <group position={position}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0, 0, 1.1]}>
          <textGeometry args={["Error", { size: 0.1, height: 0.01 }]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    )
  }

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onDoubleClick={handleDoubleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive
        object={scene.clone()}
      />
      
      {/* Hover tooltip */}
      {hovered && (
        <Html position={[0, 1.2, 0]} center>
          <div className="bg-black/80 text-white text-xs px-2 py-1 rounded">
            Double-click to {isRotating ? 'stop' : 'start'} rotation
          </div>
        </Html>
      )}
    </group>
  )
}
