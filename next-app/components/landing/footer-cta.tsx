"use client";

import { Button } from "@/components/custom-ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function FooterCTA() {
	const pathname = usePathname();

	if (pathname.includes("pitch")) {
		return null;
	}

	return (
		<div className="border border-border md:container text-center px-10 py-14 mx-4 md:mx-auto md:px-24 md:py-20 mb-32 mt-24 flex items-center flex-col rounded-3xl shadow-lg shadow-muted/20" style={{backgroundColor: '#000208'}}>
			<span className="text-6xl	md:text-8xl font-medium text-foreground">
				Transform your ideas with AeroPlanar.
			</span>
			<p className="mt-6" style={{color: '#c3b383'}}>
				AI-powered 3D modeling, Real-time collaboration, Asset
				optimization, Performance monitoring & intelligent tools <br />{" "}
				for modern creators.
			</p>

			<div className="mt-10 md:mb-8">
				<div className="flex items-center space-x-4">
					<Link
						href="https://cal.com/aeroplanar/demo"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Button
							variant="outline"
							className="h-12 px-6 hidden md:block"
						>
							Talk to founders
						</Button>
					</Link>

					<a href="https://app.aeroplanar.io">
						<Button className="h-12 px-5">Start free trial</Button>
					</a>
				</div>
			</div>
		</div>
	);
}
