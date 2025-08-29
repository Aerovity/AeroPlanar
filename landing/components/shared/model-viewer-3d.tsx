"use client";

import { useEffect, useState } from "react";

export function ModelViewer3D() {
	const [isLoading, setIsLoading] = useState(true);
	const [modelViewerLoaded, setModelViewerLoaded] = useState(false);

	useEffect(() => {
		// Load model-viewer web component from CDN
		const script = document.createElement('script');
		script.type = 'module';
		script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
		script.onload = () => {
			setModelViewerLoaded(true);
			setIsLoading(false);
		};
		script.onerror = () => {
			setIsLoading(false);
			setModelViewerLoaded(false);
		};
		
		if (!document.querySelector('script[src*="model-viewer"]')) {
			document.head.appendChild(script);
		} else {
			setModelViewerLoaded(true);
			setIsLoading(false);
		}

		return () => {
			// Cleanup is handled by the browser
		};
	}, []);

	if (isLoading) {
		return (
			<div className="w-full h-[400px] rounded-lg overflow-hidden flex items-center justify-center relative" style={{backgroundColor: '#000000'}}>
				<div className="flex flex-col items-center gap-4 text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
					<div className="text-white">
						<p className="text-sm font-medium">Exporting transactions</p>
						<p className="text-xs text-gray-300 mt-2">Please do not close browser until completed</p>
					</div>
				</div>
			</div>
		);
	}

	if (!modelViewerLoaded) {
		return (
			<div className="w-full h-[400px] rounded-lg overflow-hidden flex items-center justify-center relative" style={{backgroundColor: '#000000'}}>
				<div className="flex flex-col items-center gap-4 text-center">
					<div className="text-4xl">🌳</div>
					<div className="text-sm text-gray-400">
						<p>3D Tree Model</p>
						<p className="text-xs mt-1">Interactive viewer unavailable</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full h-[400px] rounded-lg overflow-hidden relative" style={{backgroundColor: '#000000'}}>
			<model-viewer
				src="/tree.glb"
				alt="3D Tree Model"
				auto-rotate
				camera-controls
				style={{
					width: '100%',
					height: '100%',
					backgroundColor: 'transparent'
				}}
				loading="eager"
				reveal="auto"
				shadow-intensity="1"
				camera-orbit="45deg 60deg 20m"
				min-camera-orbit="auto auto 12m"
				max-camera-orbit="auto auto 35m"
				scale="0.3 0.3 0.3"
				field-of-view="45deg"
			></model-viewer>
			<div className="absolute bottom-4 left-4 text-xs text-gray-400">
				Drag to rotate • Auto-rotating • Scroll to zoom
			</div>
		</div>
	);
}