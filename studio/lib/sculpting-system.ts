import * as THREE from 'three'

export interface BrushTool {
  type: 'push' | 'pull' | 'inflate' | 'deflate' | 'smooth' | 'pinch' | 'crease' | 'flatten' | 'grab'
  size: number
  intensity: number
  falloff: 'linear' | 'smooth' | 'sharp'
  symmetry?: {
    enabled: boolean
    axis: 'x' | 'y' | 'z'
  }
}

export interface SculptingTarget {
  mesh: THREE.Mesh
  originalGeometry: THREE.BufferGeometry
  vertices: Float32Array
  normals: Float32Array
  isModified: boolean
}

export class SculptingSystem {
  private targets = new Map<string, SculptingTarget>()
  private raycaster = new THREE.Raycaster()
  private tempVector = new THREE.Vector3()
  private tempVector2 = new THREE.Vector3()
  private tempVector3 = new THREE.Vector3()
  
  constructor() {
    // Initialize the sculpting system
  }

  registerTarget(id: string, mesh: THREE.Mesh): void {
    if (!mesh.geometry) return

    // Clone the geometry to avoid modifying the original
    const geometry = mesh.geometry.clone()
    const vertices = geometry.attributes.position.array as Float32Array
    const normals = geometry.attributes.normal.array as Float32Array

    this.targets.set(id, {
      mesh,
      originalGeometry: mesh.geometry.clone(),
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      isModified: false
    })
  }

  unregisterTarget(id: string): void {
    this.targets.delete(id)
  }

  applyBrush(
    targetId: string,
    brush: BrushTool,
    worldPosition: THREE.Vector3,
    camera: THREE.Camera
  ): boolean {
    const target = this.targets.get(targetId)
    if (!target) return false

    // Set up raycasting to find affected vertices
    const mouse = new THREE.Vector2()
    this.raycaster.setFromCamera(mouse, camera)

    // Find vertices within brush radius
    const affectedVertices = this.getVerticesInRadius(target, worldPosition, brush.size)
    
    if (affectedVertices.length === 0) return false

    // Apply brush effect to affected vertices
    this.applyBrushEffect(target, brush, affectedVertices, worldPosition)

    // Apply symmetry if enabled
    if (brush.symmetry?.enabled) {
      this.applySymmetry(target, brush, affectedVertices, worldPosition)
    }

    // Update geometry
    this.updateGeometry(target)
    target.isModified = true

    return true
  }

  private getVerticesInRadius(
    target: SculptingTarget,
    worldPosition: THREE.Vector3,
    radius: number
  ): Array<{ index: number; distance: number; weight: number }> {
    const affected: Array<{ index: number; distance: number; weight: number }> = []
    const vertices = target.vertices
    const mesh = target.mesh
    
    // Transform world position to local space
    const localPosition = mesh.worldToLocal(worldPosition.clone())

    for (let i = 0; i < vertices.length; i += 3) {
      this.tempVector.set(vertices[i], vertices[i + 1], vertices[i + 2])
      const distance = this.tempVector.distanceTo(localPosition)
      
      if (distance <= radius) {
        const weight = this.calculateFalloff(distance, radius, 'smooth')
        affected.push({
          index: i / 3,
          distance,
          weight
        })
      }
    }

    return affected
  }

  private calculateFalloff(distance: number, radius: number, type: BrushTool['falloff']): number {
    const normalized = Math.min(distance / radius, 1)
    
    switch (type) {
      case 'linear':
        return 1 - normalized
      case 'smooth':
        return Math.cos(normalized * Math.PI * 0.5)
      case 'sharp':
        return Math.pow(1 - normalized, 2)
      default:
        return 1 - normalized
    }
  }

  private applyBrushEffect(
    target: SculptingTarget,
    brush: BrushTool,
    affectedVertices: Array<{ index: number; distance: number; weight: number }>,
    worldPosition: THREE.Vector3
  ): void {
    const vertices = target.vertices
    const normals = target.normals
    const mesh = target.mesh
    
    // Transform world position to local space
    const localPosition = mesh.worldToLocal(worldPosition.clone())

    for (const vertex of affectedVertices) {
      const i = vertex.index * 3
      const weight = vertex.weight * brush.intensity

      this.tempVector.set(vertices[i], vertices[i + 1], vertices[i + 2])
      this.tempVector2.set(normals[i], normals[i + 1], normals[i + 2])

      switch (brush.type) {
        case 'push':
          this.tempVector.addScaledVector(this.tempVector2, weight)
          break
          
        case 'pull':
          this.tempVector.addScaledVector(this.tempVector2, -weight)
          break
          
        case 'inflate':
          // Calculate direction from center to vertex
          this.tempVector3.copy(this.tempVector).sub(localPosition).normalize()
          this.tempVector.addScaledVector(this.tempVector3, weight)
          break
          
        case 'deflate':
          // Calculate direction from vertex to center
          this.tempVector3.copy(localPosition).sub(this.tempVector).normalize()
          this.tempVector.addScaledVector(this.tempVector3, weight)
          break
          
        case 'smooth':
          this.applySmoothEffect(target, vertex, weight)
          continue
          
        case 'pinch':
          // Move vertex toward brush center
          this.tempVector3.copy(localPosition).sub(this.tempVector)
          this.tempVector.addScaledVector(this.tempVector3, weight * 0.1)
          break
          
        case 'crease':
          // Enhanced normal-based displacement
          this.tempVector.addScaledVector(this.tempVector2, weight * 2)
          break
          
        case 'flatten':
          // Project vertex onto plane perpendicular to normal at brush center
          const planeNormal = this.tempVector2.clone()
          const pointOnPlane = localPosition.clone()
          const vectorToPlane = this.tempVector.clone().sub(pointOnPlane)
          const projectedDistance = vectorToPlane.dot(planeNormal)
          this.tempVector.addScaledVector(planeNormal, -projectedDistance * weight)
          break
          
        case 'grab':
          // Move vertex directly toward brush position
          this.tempVector3.copy(localPosition).sub(this.tempVector)
          this.tempVector.addScaledVector(this.tempVector3, weight * 0.5)
          break
      }

      // Update vertex position
      vertices[i] = this.tempVector.x
      vertices[i + 1] = this.tempVector.y
      vertices[i + 2] = this.tempVector.z
    }
  }

  private applySmoothEffect(
    target: SculptingTarget,
    vertex: { index: number; distance: number; weight: number },
    weight: number
  ): void {
    const vertices = target.vertices
    const geometry = target.mesh.geometry as THREE.BufferGeometry
    
    if (!geometry.index) return

    const index = geometry.index.array
    const i = vertex.index * 3

    // Find neighboring vertices
    const neighbors: number[] = []
    for (let j = 0; j < index.length; j += 3) {
      const triangle = [index[j], index[j + 1], index[j + 2]]
      if (triangle.includes(vertex.index)) {
        for (const neighborIndex of triangle) {
          if (neighborIndex !== vertex.index && !neighbors.includes(neighborIndex)) {
            neighbors.push(neighborIndex)
          }
        }
      }
    }

    // Calculate average position of neighbors
    this.tempVector.set(0, 0, 0)
    for (const neighborIndex of neighbors) {
      const ni = neighborIndex * 3
      this.tempVector.add(this.tempVector2.set(vertices[ni], vertices[ni + 1], vertices[ni + 2]))
    }
    
    if (neighbors.length > 0) {
      this.tempVector.divideScalar(neighbors.length)
      
      // Interpolate between current position and average
      const currentPos = this.tempVector2.set(vertices[i], vertices[i + 1], vertices[i + 2])
      currentPos.lerp(this.tempVector, weight)
      
      vertices[i] = currentPos.x
      vertices[i + 1] = currentPos.y
      vertices[i + 2] = currentPos.z
    }
  }

  private applySymmetry(
    target: SculptingTarget,
    brush: BrushTool,
    affectedVertices: Array<{ index: number; distance: number; weight: number }>,
    worldPosition: THREE.Vector3
  ): void {
    if (!brush.symmetry?.enabled) return

    const vertices = target.vertices
    const axis = brush.symmetry.axis
    
    // Find mirrored vertices
    for (const vertex of affectedVertices) {
      const i = vertex.index * 3
      const mirroredVertex = this.findMirroredVertex(target, vertex.index, axis)
      
      if (mirroredVertex !== -1) {
        const mi = mirroredVertex * 3
        
        // Mirror the displacement
        let deltaX = vertices[i] - target.originalGeometry.attributes.position.array[i]
        let deltaY = vertices[i + 1] - target.originalGeometry.attributes.position.array[i + 1]
        let deltaZ = vertices[i + 2] - target.originalGeometry.attributes.position.array[i + 2]
        
        // Apply axis mirroring
        switch (axis) {
          case 'x':
            deltaX = -deltaX
            break
          case 'y':
            deltaY = -deltaY
            break
          case 'z':
            deltaZ = -deltaZ
            break
        }
        
        vertices[mi] = target.originalGeometry.attributes.position.array[mi] + deltaX
        vertices[mi + 1] = target.originalGeometry.attributes.position.array[mi + 1] + deltaY
        vertices[mi + 2] = target.originalGeometry.attributes.position.array[mi + 2] + deltaZ
      }
    }
  }

  private findMirroredVertex(target: SculptingTarget, vertexIndex: number, axis: 'x' | 'y' | 'z'): number {
    const vertices = target.originalGeometry.attributes.position.array as Float32Array
    const i = vertexIndex * 3
    const targetPos = [vertices[i], vertices[i + 1], vertices[i + 2]]
    
    // Create mirrored position
    const mirroredPos = [...targetPos]
    switch (axis) {
      case 'x':
        mirroredPos[0] = -mirroredPos[0]
        break
      case 'y':
        mirroredPos[1] = -mirroredPos[1]
        break
      case 'z':
        mirroredPos[2] = -mirroredPos[2]
        break
    }
    
    // Find closest vertex to mirrored position
    let closestIndex = -1
    let closestDistance = Infinity
    
    for (let j = 0; j < vertices.length; j += 3) {
      if (j / 3 === vertexIndex) continue
      
      const distance = Math.sqrt(
        Math.pow(vertices[j] - mirroredPos[0], 2) +
        Math.pow(vertices[j + 1] - mirroredPos[1], 2) +
        Math.pow(vertices[j + 2] - mirroredPos[2], 2)
      )
      
      if (distance < closestDistance && distance < 0.01) { // Small threshold for mirrored vertices
        closestDistance = distance
        closestIndex = j / 3
      }
    }
    
    return closestIndex
  }

  private updateGeometry(target: SculptingTarget): void {
    const geometry = target.mesh.geometry as THREE.BufferGeometry
    
    // Update position attribute
    geometry.attributes.position.array = target.vertices
    geometry.attributes.position.needsUpdate = true
    
    // Recalculate normals for proper lighting
    geometry.computeVertexNormals()
    
    // Update bounding sphere for proper culling
    geometry.computeBoundingSphere()
  }

  resetTarget(targetId: string): boolean {
    const target = this.targets.get(targetId)
    if (!target) return false

    // Reset to original geometry
    const originalVertices = target.originalGeometry.attributes.position.array as Float32Array
    target.vertices.set(originalVertices)
    
    this.updateGeometry(target)
    target.isModified = false
    
    return true
  }

  getTargetHistory(targetId: string): { isModified: boolean } | null {
    const target = this.targets.get(targetId)
    return target ? { isModified: target.isModified } : null
  }

  // Helper method to convert a brush tool configuration to the internal format
  static createBrushFromConfig(config: {
    type: string
    size: number
    intensity: number
    falloff?: string
    symmetry?: { enabled: boolean; axis: string }
  }): BrushTool {
    return {
      type: config.type as BrushTool['type'],
      size: config.size,
      intensity: config.intensity,
      falloff: (config.falloff as BrushTool['falloff']) || 'smooth',
      symmetry: config.symmetry ? {
        enabled: config.symmetry.enabled,
        axis: config.symmetry.axis as 'x' | 'y' | 'z'
      } : undefined
    }
  }
}