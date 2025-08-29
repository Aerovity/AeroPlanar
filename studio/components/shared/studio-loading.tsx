"use client";

import { useEffect, useState } from "react";
import { Spotlight } from "@/components/ui/spotlight-new";

export function StudioLoading() {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					clearInterval(timer);
					return 100;
				}
				return prev + Math.random() * 15 + 5;
			});
		}, 200);

		return () => clearInterval(timer);
	}, []);

	return (
		<div className="min-h-screen landing-page-bg flex items-center justify-center relative">
			<Spotlight />
			<div className="text-center z-10">
				<h1 className="text-4xl md:text-6xl font-medium mb-8">
					<span className="text-white">Loading </span>
					<span style={{color: '#c3b383'}}>3D Studio</span>
				</h1>
				
				<div className="w-80 md:w-96 mx-auto">
					<div className="bg-white/10 rounded-full h-2 overflow-hidden backdrop-blur-sm">
						<div 
							className="h-full bg-white transition-all duration-300 ease-out rounded-full"
							style={{ width: `${Math.min(progress, 100)}%` }}
						/>
					</div>
					<p className="text-white/70 text-sm mt-4">{Math.round(Math.min(progress, 100))}%</p>
				</div>
			</div>
		</div>
	);
}