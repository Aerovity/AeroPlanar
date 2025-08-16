import { useMemo } from 'react'

export interface PerformanceLimits {
  maxTotalFaces: number
  maxTotalModels: number
  maxModelFaces: number
  warningTotalFaces: number
  warningTotalModels: number
  warningModelFaces: number
}

export interface ScenePerformance {
  totalFaces: number
  totalVertices: number
  totalModels: number
  averageFacesPerModel: number
  largestModelFaces: number
  estimatedMemoryUsage: number // in MB
  performanceScore: number // 0-100, higher is better
  warningLevel: 'none' | 'low' | 'medium' | 'high' | 'critical'
  canAddModel: boolean
  warnings: string[]
  suggestions: string[]
}

// Performance limits based on typical browser/WebGL performance
const DEFAULT_LIMITS: PerformanceLimits = {
  maxTotalFaces: 1000000,      // 1M faces hard limit
  maxTotalModels: 100,         // 100 models hard limit
  maxModelFaces: 200000,       // 200K faces per model
  warningTotalFaces: 500000,   // 500K faces warning
  warningTotalModels: 50,      // 50 models warning
  warningModelFaces: 100000,   // 100K faces per model warning
}

export function useScenePerformance(
  models: any[],
  customLimits?: Partial<PerformanceLimits>
): ScenePerformance {
  const limits = { ...DEFAULT_LIMITS, ...customLimits }

  return useMemo(() => {
    // Calculate basic metrics
    const totalFaces = models.reduce((sum, model) => sum + (model.faces || 0), 0)
    const totalVertices = models.reduce((sum, model) => sum + (model.vertices || 0), 0)
    const totalModels = models.length
    const averageFacesPerModel = totalModels > 0 ? totalFaces / totalModels : 0
    const largestModelFaces = Math.max(...models.map(model => model.faces || 0), 0)

    // Estimate memory usage (rough calculation)
    // Assumes ~32 bytes per vertex (position + normal + UV) + ~12 bytes per face
    const estimatedMemoryUsage = Math.round(
      (totalVertices * 32 + totalFaces * 12) / (1024 * 1024)
    )

    // Calculate performance score (0-100)
    const faceScore = Math.max(0, 100 - (totalFaces / limits.maxTotalFaces) * 100)
    const modelCountScore = Math.max(0, 100 - (totalModels / limits.maxTotalModels) * 100)
    const complexityScore = Math.max(0, 100 - (largestModelFaces / limits.maxModelFaces) * 100)
    const performanceScore = Math.round((faceScore + modelCountScore + complexityScore) / 3)

    // Determine warning level
    let warningLevel: ScenePerformance['warningLevel'] = 'none'
    const warnings: string[] = []
    const suggestions: string[] = []

    // Check various thresholds
    const faceRatio = totalFaces / limits.maxTotalFaces
    const modelRatio = totalModels / limits.maxTotalModels
    const complexityRatio = largestModelFaces / limits.maxModelFaces

    if (faceRatio > 0.9 || modelRatio > 0.9 || complexityRatio > 0.9) {
      warningLevel = 'critical'
      warnings.push('Scene is at critical performance limits')
      suggestions.push('Remove some models or reduce complexity before adding more')
    } else if (faceRatio > 0.75 || modelRatio > 0.75 || complexityRatio > 0.75) {
      warningLevel = 'high'
      warnings.push('Scene performance is heavily impacted')
      suggestions.push('Consider removing complex models to improve performance')
    } else if (faceRatio > 0.5 || modelRatio > 0.5 || complexityRatio > 0.5) {
      warningLevel = 'medium'
      warnings.push('Scene may experience performance issues')
      suggestions.push('Monitor performance and consider optimizing models')
    } else if (faceRatio > 0.3 || modelRatio > 0.3) {
      warningLevel = 'low'
      warnings.push('Scene complexity is increasing')
    }

    // Specific warnings
    if (totalFaces > limits.warningTotalFaces) {
      warnings.push(`Total faces (${totalFaces.toLocaleString()}) exceeds recommended limit`)
    }
    if (totalModels > limits.warningTotalModels) {
      warnings.push(`Model count (${totalModels}) exceeds recommended limit`)
    }
    if (largestModelFaces > limits.warningModelFaces) {
      warnings.push(`Largest model (${largestModelFaces.toLocaleString()} faces) is very complex`)
    }

    // Performance suggestions
    if (estimatedMemoryUsage > 100) {
      suggestions.push(`High memory usage (~${estimatedMemoryUsage}MB). Consider lower-poly models`)
    }
    if (averageFacesPerModel > 50000) {
      suggestions.push('Average model complexity is high. Try using simpler models')
    }

    // Determine if new models can be added
    const canAddModel = (
      totalFaces < limits.maxTotalFaces &&
      totalModels < limits.maxTotalModels &&
      warningLevel !== 'critical'
    )

    return {
      totalFaces,
      totalVertices,
      totalModels,
      averageFacesPerModel: Math.round(averageFacesPerModel),
      largestModelFaces,
      estimatedMemoryUsage,
      performanceScore,
      warningLevel,
      canAddModel,
      warnings,
      suggestions,
    }
  }, [models, limits])
}

// Helper function to estimate faces for a new model before adding
export function estimateModelImpact(
  currentPerformance: ScenePerformance,
  newModelFaces: number,
  limits: PerformanceLimits = DEFAULT_LIMITS
): {
  canAdd: boolean
  wouldExceedLimits: boolean
  projectedWarningLevel: ScenePerformance['warningLevel']
  warnings: string[]
} {
  const projectedFaces = currentPerformance.totalFaces + newModelFaces
  const projectedModels = currentPerformance.totalModels + 1

  const wouldExceedLimits = (
    projectedFaces > limits.maxTotalFaces ||
    projectedModels > limits.maxTotalModels ||
    newModelFaces > limits.maxModelFaces
  )

  const faceRatio = projectedFaces / limits.maxTotalFaces
  const modelRatio = projectedModels / limits.maxTotalModels

  let projectedWarningLevel: ScenePerformance['warningLevel'] = 'none'
  const warnings: string[] = []

  if (faceRatio > 0.9 || modelRatio > 0.9) {
    projectedWarningLevel = 'critical'
    warnings.push('Adding this model would critically impact performance')
  } else if (faceRatio > 0.75 || modelRatio > 0.75) {
    projectedWarningLevel = 'high'
    warnings.push('Adding this model would significantly impact performance')
  } else if (faceRatio > 0.5 || modelRatio > 0.5) {
    projectedWarningLevel = 'medium'
    warnings.push('Adding this model may cause performance issues')
  } else if (faceRatio > 0.3 || modelRatio > 0.3) {
    projectedWarningLevel = 'low'
    warnings.push('Scene complexity will increase')
  }

  const canAdd = !wouldExceedLimits && projectedWarningLevel !== 'critical'

  return {
    canAdd,
    wouldExceedLimits,
    projectedWarningLevel,
    warnings,
  }
}