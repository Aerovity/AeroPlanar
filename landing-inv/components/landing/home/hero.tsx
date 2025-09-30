import { Button } from "@/components/custom-ui/button";
import Link from "next/link";
import { HeroImage } from "./hero-image";
import { Metrics } from "./metrics";
import { WordAnimation } from "./word-animation";

export function Hero() {
	return (
		<section className="mt-[60px] lg:mt-[80px] min-h-[530px] relative lg:h-[calc(100vh-300px)]">
			<div className="flex flex-col container max-w-none pl-8 lg:pl-16">
				<div className="mt-8">
					<Link href="/updates/aeroplanar-v1">
					<Button
						variant="outline"
						className="rounded-full bg-background/80 backdrop-blur-sm border-[#c3b383] flex space-x-2 items-center hover:bg-[#c3b383]/10 transition-all duration-300 shadow-lg shadow-muted/20"
					>
						<span className="font-mono text-xs" style={{color: '#c3b383'}}>
							AeroPlanar v1.0
						</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width={12}
							height={12}
							fill="none"
						>
							<path
								fill="#c3b383"
								d="M8.783 6.667H.667V5.333h8.116L5.05 1.6 6 .667 11.333 6 6 11.333l-.95-.933 3.733-3.733Z"
							/>
						</svg>
					</Button>
					</Link>
				</div>

				<h2 className="mt-6 md:mt-10 max-w-[580px] text-muted-foreground leading-tight text-[24px] md:text-[36px] font-medium">
					AI-powered 3D modeling, Real-time collaboration, Asset
					optimization, Performance monitoring & intelligent tools
					designed for <WordAnimation />
				</h2>

				<div className="mt-8 md:mt-10">
					<div className="flex items-center space-x-4">
						<Link
							href="https://cal.com/aeroplanar/demo"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Button variant="outline" className="h-11 px-6">
								Watch Demo
							</Button>
						</Link>

						<a href="#register-beta">
							<Button className="h-11 px-5">Register for Beta</Button>
						</a>
					</div>
				</div>

				<p className="text-xs text-muted-foreground mt-4 font-mono">
					Start free trial, no credit card required.
				</p>
			</div>

			<HeroImage />
			<Metrics />
		</section>
	);
}
