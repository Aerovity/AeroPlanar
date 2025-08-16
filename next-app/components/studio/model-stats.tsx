"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Box, Triangle, Dot } from "lucide-react";

interface ModelStatsProps {
	selectedModel?: {
		id: string;
		name: string;
		faces?: number;
		vertices?: number;
		topology?: string;
		status?: string;
	};
}

export function ModelStats({ selectedModel }: ModelStatsProps) {
	if (!selectedModel) {
		return (
			<Card className="bg-black/40 border-gray-800/50 backdrop-blur-sm">
				<CardHeader>
					<CardTitle className="text-white text-sm">
						Model Information
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-gray-400 text-sm">
						Select a model to view details
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-black/40 border-gray-800/50 backdrop-blur-sm">
			<CardHeader className="pb-3">
				<CardTitle className="text-white text-sm flex items-center justify-between">
					Model Information
					<Badge
						variant="secondary"
						className="bg-blue-600 text-white"
					>
						{selectedModel.status || "Ready"}
					</Badge>
				</CardTitle>
			</CardHeader>

			<CardContent className="space-y-4">
				<div>
					<h4 className="text-white font-medium mb-2">
						{selectedModel.name}
					</h4>
				</div>

				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-gray-300">
							<Box className="w-4 h-4" />
							<span className="text-sm">Topology</span>
						</div>
						<span className="text-white text-sm font-medium">
							{selectedModel.topology || "Triangle"}
						</span>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-gray-300">
							<Triangle className="w-4 h-4" />
							<span className="text-sm">Faces</span>
						</div>
						<span className="text-white text-sm font-medium">
							{selectedModel.faces?.toLocaleString() || "N/A"}
						</span>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-gray-300">
							<Dot className="w-4 h-4" />
							<span className="text-sm">Vertices</span>
						</div>
						<span className="text-white text-sm font-medium">
							{selectedModel.vertices?.toLocaleString() || "N/A"}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
