import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Spotlight } from "@/components/ui/spotlight-new";
import { MouseSpotlight } from "@/components/shared/mouse-spotlight";

export default function StudioPage() {
	return (
		<div className="landing-page-bg">
			<MouseSpotlight />
			<div className="container mx-auto px-4 overflow-hidden md:overflow-visible relative z-10">
				<Header />
				<div className="relative min-h-screen flex items-center justify-center">
					<Spotlight />
					<div className="text-center z-10">
						<h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
							Soon Available
						</h1>
						<p className="text-xl md:text-2xl text-gray-400 mt-6 max-w-2xl mx-auto">
							We're working hard to bring you an amazing studio experience. 
							Stay tuned for updates!
						</p>
					</div>
				</div>
				<Footer />
			</div>
		</div>
	);
}