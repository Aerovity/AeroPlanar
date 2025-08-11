"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  AlertTriangle, 
  Zap, 
  Trash2, 
  RotateCcw, 
  TrendingDown,
  Info,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react'
import { type ScenePerformance } from '@/hooks/use-scene-performance'

interface ScenePerformanceMonitorProps {
  performance: ScenePerformance
  onClearScene?: () => void
  onOptimizeScene?: () => void
  onRemoveLargestModel?: () => void
}

const warningColors = {
  none: 'text-green-400',
  low: 'text-yellow-400',
  medium: 'text-orange-400', 
  high: 'text-red-400',
  critical: 'text-red-600'
}

const warningIcons = {
  none: CheckCircle,
  low: Info,
  medium: AlertTriangle,
  high: AlertTriangle,
  critical: XCircle
}

export function ScenePerformanceMonitor({ 
  performance, 
  onClearScene, 
  onOptimizeScene,
  onRemoveLargestModel 
}: ScenePerformanceMonitorProps) {
  const WarningIcon = warningIcons[performance.warningLevel]
  
  return (
    <Card className="bg-black/40 border-gray-800/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            Scene Performance
          </div>
          <Badge 
            variant="secondary" 
            className={`${warningColors[performance.warningLevel]} bg-gray-800/50`}
          >
            <WarningIcon className="w-3 h-3 mr-1" />
            {performance.warningLevel === 'none' ? 'Optimal' : performance.warningLevel}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Performance Score */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Performance Score</span>
            <span className="text-white text-sm font-medium">{performance.performanceScore}/100</span>
          </div>
          <Progress 
            value={performance.performanceScore} 
            className="h-2 bg-gray-800"
          />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Faces:</span>
              <span className="text-white">{performance.totalFaces.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Models:</span>
              <span className="text-white">{performance.totalModels}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Memory Est:</span>
              <span className="text-white">~{performance.estimatedMemoryUsage}MB</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Avg Complexity:</span>
              <span className="text-white">{performance.averageFacesPerModel.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Largest Model:</span>
              <span className="text-white">{performance.largestModelFaces.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Can Add More:</span>
              <span className={performance.canAddModel ? "text-green-400" : "text-red-400"}>
                {performance.canAddModel ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        {/* Warnings */}
        {performance.warnings.length > 0 && (
          <Alert className="bg-yellow-900/20 border-yellow-600/30">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200 text-xs">
              <div className="space-y-1">
                {performance.warnings.map((warning, index) => (
                  <div key={index}>• {warning}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Suggestions */}
        {performance.suggestions.length > 0 && (
          <Alert className="bg-blue-900/20 border-blue-600/30">
            <Info className="w-4 h-4 text-blue-400" />
            <AlertDescription className="text-blue-200 text-xs">
              <div className="space-y-1">
                {performance.suggestions.map((suggestion, index) => (
                  <div key={index}>• {suggestion}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        {(performance.warningLevel === 'high' || performance.warningLevel === 'critical') && (
          <div className="space-y-2">
            <div className="text-xs text-gray-400 font-medium">Quick Actions:</div>
            <div className="flex gap-2 flex-wrap">
              {onRemoveLargestModel && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRemoveLargestModel}
                  className="h-7 text-xs bg-red-900/20 border-red-600/30 text-red-300 hover:bg-red-900/30"
                >
                  <TrendingDown className="w-3 h-3 mr-1" />
                  Remove Largest
                </Button>
              )}
              {onOptimizeScene && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onOptimizeScene}
                  className="h-7 text-xs bg-blue-900/20 border-blue-600/30 text-blue-300 hover:bg-blue-900/30"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Optimize
                </Button>
              )}
              {onClearScene && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onClearScene}
                  className="h-7 text-xs bg-gray-900/20 border-gray-600/30 text-gray-300 hover:bg-gray-900/30"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Clear Scene
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Performance Tips */}
        {performance.performanceScore < 60 && (
          <div className="mt-3 p-2 bg-gray-900/50 rounded-lg">
            <div className="text-xs text-gray-400 font-medium mb-1">💡 Performance Tips:</div>
            <div className="text-xs text-gray-300 space-y-1">
              <div>• Use lower-poly models when possible</div>
              <div>• Remove unused models from the scene</div>
              <div>• Consider using primitives instead of complex meshes</div>
              {performance.estimatedMemoryUsage > 50 && (
                <div>• High memory usage detected - restart browser if sluggish</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}