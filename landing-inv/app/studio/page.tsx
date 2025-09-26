"use client";

import { Header } from "@/components/landing/header";
import { Spotlight } from "@/components/ui/spotlight-new";

export default function StudioPage() {
	return (
		<div className="min-h-screen bg-background relative overflow-hidden">
			<Spotlight />
			<Header />
			<div className="flex items-center justify-center min-h-screen px-4">
				<div className="text-center max-w-4xl mx-auto">
					<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent mb-6">
						Coming Soon
					</h1>
					<p className="text-xl md:text-2xl text-gray-400 mt-6 max-w-2xl mx-auto">
						We're working hard to bring you an amazing studio experience.
						Stay tuned for updates!
					</p>
				</div>
			</div>
		</div>
	);
}