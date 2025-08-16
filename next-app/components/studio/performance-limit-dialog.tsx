"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	AlertTriangle,
	XCircle,
	RotateCcw,
	TrendingDown,
	Activity,
} from "lucide-react";

interface PerformanceLimitDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onProceed?: () => void;
	onClearScene?: () => void;
	onRemoveLargestModel?: () => void;
	warningLevel: "none" | "low" | "medium" | "high" | "critical";
	warnings: string[];
	suggestions: string[];
	isBlocking?: boolean;
	currentPerformance?: {
		totalFaces: number;
		totalModels: number;
		performanceScore: number;
	};
}

export function PerformanceLimitDialog({
	isOpen,
	onClose,
	onProceed,
	onClearScene,
	onRemoveLargestModel,
	warningLevel,
	warnings,
	suggestions,
	isBlocking = false,
	currentPerformance,
}: PerformanceLimitDialogProps) {
	const isCritical = warningLevel === "critical" || isBlocking;

	const dialogTitle = isCritical
		? "⚠️ Performance Limit Reached"
		: "🔍 Performance Warning";

	const dialogIcon = isCritical ? XCircle : AlertTriangle;
	const dialogIconColor = isCritical ? "text-red-500" : "text-yellow-500";

	return (
		<AlertDialog open={isOpen} onOpenChange={onClose}>
			<AlertDialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
				<AlertDialogHeader>
					<AlertDialogTitle className="flex items-center gap-2 text-white">
						{dialogTitle}
					</AlertDialogTitle>
					<AlertDialogDescription asChild>
						<div className="space-y-3">
							{/* Performance Summary */}
							{currentPerformance && (
								<div className="bg-black/30 p-3 rounded-lg">
									<div className="flex items-center gap-2 mb-2">
										<Activity className="w-4 h-4 text-white" />
										<span className="text-sm font-medium text-gray-200">
											Current Scene Status
										</span>
									</div>
									<div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
										<div>
											Models:{" "}
											{currentPerformance.totalModels}
										</div>
										<div>
											Score:{" "}
											{
												currentPerformance.performanceScore
											}
											/100
										</div>
										<div>
											Faces:{" "}
											{currentPerformance.totalFaces.toLocaleString()}
										</div>
									</div>
								</div>
							)}

							{/* Warnings */}
							{warnings.length > 0 && (
								<Alert className="bg-red-900/20 border-red-600/30">
									<AlertTriangle className="w-4 h-4 text-white" />
									<AlertDescription className="text-red-200 text-sm">
										<div className="space-y-1">
											{warnings.map((warning, index) => (
												<div key={index}>
													• {warning}
												</div>
											))}
										</div>
									</AlertDescription>
								</Alert>
							)}

							{/* Suggestions */}
							{suggestions.length > 0 && (
								<div className="text-sm text-gray-300">
									<div className="font-medium text-white mb-1">
										Recommendations:
									</div>
									<div className="space-y-1">
										{suggestions.map(
											(suggestion, index) => (
												<div key={index}>
													• {suggestion}
												</div>
											)
										)}
									</div>
								</div>
							)}

							{/* Critical warning message */}
							{isCritical && (
								<div className="bg-red-900/30 border border-red-600/50 rounded-lg p-3">
									<div className="text-red-200 text-sm">
										<div className="font-medium mb-1">
											Action Required
										</div>
										<div>
											Your browser may become unresponsive
											if you proceed. Please reduce scene
											complexity first.
										</div>
									</div>
								</div>
							)}
						</div>
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter className="flex-col space-y-2">
					{/* Quick action buttons for critical situations */}
					{isCritical && (
						<div className="w-full space-y-2">
							<div className="text-xs text-gray-400 text-center">
								Quick Actions:
							</div>
							<div className="flex gap-2">
								{onRemoveLargestModel && (
									<Button
										size="sm"
										variant="outline"
										onClick={() => {
											onRemoveLargestModel();
											onClose();
										}}
										className="flex-1 h-8 text-xs bg-orange-900/20 border-orange-600/30 text-orange-300 hover:bg-orange-900/30"
									>
										<TrendingDown className="w-3 h-3 mr-1 text-white" />
										Remove Largest
									</Button>
								)}
								{onClearScene && (
									<Button
										size="sm"
										variant="outline"
										onClick={() => {
											onClearScene();
											onClose();
										}}
										className="flex-1 h-8 text-xs bg-gray-900/20 border-gray-600/30 text-gray-300 hover:bg-gray-900/30"
									>
										<RotateCcw className="w-3 h-3 mr-1 text-white" />
										Clear Scene
									</Button>
								)}
							</div>
						</div>
					)}

					{/* Main action buttons */}
					<div className="flex gap-2 w-full">
						<AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
							Cancel
						</AlertDialogCancel>

						{!isCritical && onProceed && (
							<AlertDialogAction
								onClick={onProceed}
								className="bg-yellow-600 hover:bg-yellow-700 text-white"
							>
								Proceed Anyway
							</AlertDialogAction>
						)}

						{isCritical && (
							<AlertDialogAction
								onClick={onClose}
								className="bg-red-600 hover:bg-red-700 text-white"
							>
								I Understand
							</AlertDialogAction>
						)}
					</div>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
