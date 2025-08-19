"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ResizeToolbarProps {
	selectedModel: any;
	onSizeChange: (newSize: [number, number, number]) => void;
	onResetSize: () => void;
}

export function ResizeToolbar({
	selectedModel,
	onSizeChange,
	onResetSize,
}: ResizeToolbarProps) {
	const [uniformScale, setUniformScale] = useState(1);
	const [xScale, setXScale] = useState(selectedModel?.size?.[0] || 1);
	const [yScale, setYScale] = useState(selectedModel?.size?.[1] || 1);
	const [zScale, setZScale] = useState(selectedModel?.size?.[2] || 1);

	// Update local state when selectedModel changes
	useEffect(() => {
		if (selectedModel) {
			const currentSize = selectedModel.size || [1, 1, 1];
			setXScale(currentSize[0]);
			setYScale(currentSize[1]);
			setZScale(currentSize[2]);

			// Calculate uniform scale based on original size
			const originalSize = selectedModel.originalSize || [1, 1, 1];
			const avgScale =
				(currentSize[0] / originalSize[0] +
					currentSize[1] / originalSize[1] +
					currentSize[2] / originalSize[2]) /
				3;
			setUniformScale(avgScale);
		}
	}, [selectedModel]);

	if (!selectedModel) {
		return (
			<Card className="[#080c0c]/15 border-gray-800/50 backdrop-blur-sm">
				<CardHeader className="pb-4">
					<CardTitle className="flex items-center gap-2 text-white">
						Resize Toolbar
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm" style={{color: "#c3b383"}}>
						Select an object to resize
					</p>
				</CardContent>
			</Card>
		);
	}

	const handleUniformScale = (value: number[]) => {
		const scale = Math.max(value[0], 0.1); // Ensure minimum scale
		setUniformScale(scale);
		const originalSize = selectedModel.originalSize || [1, 1, 1];
		const newSize: [number, number, number] = [
			originalSize[0] * scale,
			originalSize[1] * scale,
			originalSize[2] * scale,
		];
		onSizeChange(newSize);
	};

	const handleAxisScale = (axis: "x" | "y" | "z", value: number) => {
		// Ensure minimum value
		const clampedValue = Math.max(value, 0.1);

		let newSize: [number, number, number] = [
			selectedModel.size?.[0] || 1,
			selectedModel.size?.[1] || 1,
			selectedModel.size?.[2] || 1,
		];

		switch (axis) {
			case "x":
				newSize[0] = clampedValue;
				setXScale(clampedValue);
				break;
			case "y":
				newSize[1] = clampedValue;
				setYScale(clampedValue);
				break;
			case "z":
				newSize[2] = clampedValue;
				setZScale(clampedValue);
				break;
		}

		onSizeChange(newSize);
	};

	const handleQuickResize = (multiplier: number) => {
		const currentSize = selectedModel.size || [1, 1, 1];
		const newSize: [number, number, number] = [
			currentSize[0] * multiplier,
			currentSize[1] * multiplier,
			currentSize[2] * multiplier,
		];
		onSizeChange(newSize);
		setUniformScale(uniformScale * multiplier);
	};

	const handleReset = () => {
		const originalSize = selectedModel.originalSize || [1, 1, 1];
		onSizeChange(originalSize);
		setUniformScale(1);
		setXScale(originalSize[0]);
		setYScale(originalSize[1]);
		setZScale(originalSize[2]);
		onResetSize();
	};

	return (
		<Card className="[#080c0c]/15 border-gray-800/50 backdrop-blur-sm">
			<CardHeader className="pb-4">
				<CardTitle className="flex items-center gap-2 text-white">
					Resize Toolbar
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Object Info */}
				<div className="[#080c0c]/15 rounded-lg p-3">
					<p className="text-white text-sm font-medium">
						{selectedModel.name}
					</p>
					<p className="text-gray-400 text-xs">
						Current Size:{" "}
						{selectedModel.size?.[0]?.toFixed(2) || "1.00"} ×{" "}
						{selectedModel.size?.[1]?.toFixed(2) || "1.00"} ×{" "}
						{selectedModel.size?.[2]?.toFixed(2) || "1.00"}
					</p>
				</div>

				{/* Uniform Scale */}
				<div className="space-y-2">
					<Label className="text-gray-300 text-sm flex items-center gap-2">
						<span>📐</span>
						Uniform Scale
					</Label>
					<Slider
						value={[uniformScale]}
						onValueChange={handleUniformScale}
						min={0.1}
						max={5}
						step={0.1}
						className="mt-2"
					/>
					<div className="flex justify-between text-xs text-gray-400">
						<span>0.1x</span>
						<span>{uniformScale.toFixed(1)}x</span>
						<span>5x</span>
					</div>
				</div>

				{/* Individual Axis Scales */}
				<div className="space-y-3">
					<Label className="text-gray-300 text-sm">
						Individual Axes
					</Label>

					<div className="space-y-2">
						<Label className="text-red-400 text-xs">
							X Axis (Width)
						</Label>
						<div className="flex gap-2">
							<Slider
								value={[xScale]}
								onValueChange={(value) =>
									handleAxisScale("x", value[0])
								}
								min={0.1}
								max={10}
								step={0.1}
								className="flex-1"
							/>
							<Input
								type="number"
								value={xScale.toFixed(1)}
								onChange={(e) =>
									handleAxisScale(
										"x",
										parseFloat(e.target.value) || 1
									)
								}
								className="w-16 h-8 text-xs [#080c0c]/15 border-gray-700 text-white"
								step={0.1}
								min={0.1}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label className="text-green-400 text-xs">
							Y Axis (Height)
						</Label>
						<div className="flex gap-2">
							<Slider
								value={[yScale]}
								onValueChange={(value) =>
									handleAxisScale("y", value[0])
								}
								min={0.1}
								max={10}
								step={0.1}
								className="flex-1"
							/>
							<Input
								type="number"
								value={yScale.toFixed(1)}
								onChange={(e) =>
									handleAxisScale(
										"y",
										parseFloat(e.target.value) || 1
									)
								}
								className="w-16 h-8 text-xs [#080c0c]/15 border-gray-700 text-white"
								step={0.1}
								min={0.1}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label className="text-blue-400 text-xs">
							Z Axis (Depth)
						</Label>
						<div className="flex gap-2">
							<Slider
								value={[zScale]}
								onValueChange={(value) =>
									handleAxisScale("z", value[0])
								}
								min={0.1}
								max={10}
								step={0.1}
								className="flex-1"
							/>
							<Input
								type="number"
								value={zScale.toFixed(1)}
								onChange={(e) =>
									handleAxisScale(
										"z",
										parseFloat(e.target.value) || 1
									)
								}
								className="w-16 h-8 text-xs [#080c0c]/15 border-gray-700 text-white"
								step={0.1}
								min={0.1}
							/>
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="space-y-2">
					<Label className="text-gray-300 text-sm">
						Quick Actions
					</Label>
					<div className="grid grid-cols-2 gap-2">
						<Button
							size="sm"
							variant="outline"
							onClick={() => handleQuickResize(0.5)}
							className="[#080c0c]/15 border-gray-700 text-white hover:[#080c0c]/10"
						>
							<span className="mr-2">➖</span>
							Half Size
						</Button>
						<Button
							size="sm"
							variant="outline"
							onClick={() => handleQuickResize(2)}
							className="[#080c0c]/15 border-gray-700 text-white hover:[#080c0c]/10"
						>
							<span className="mr-2">➕</span>
							Double Size
						</Button>
					</div>
					<Button
						size="sm"
						variant="outline"
						onClick={handleReset}
						className="w-full [#080c0c]/15 border-gray-700 text-white hover:[#080c0c]/10"
					>
						<span className="mr-2">🔄</span>
						Reset to Original
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
