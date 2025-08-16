import { Metadata } from "next";

export const metadata: Metadata = {
	title: "About",
	description:
		"Learn more about AeroPlanar and our mission to revolutionize 3D modeling with AI.",
};

export default function About() {
	return (
		<div className="container mx-auto px-4 py-16">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold tracking-tight mb-4">
						About AeroPlanar
					</h1>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						We're revolutionizing 3D modeling with AI-powered tools
						that make professional 3D creation accessible to
						everyone.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
					<div>
						<h2 className="text-2xl font-bold mb-4">Our Mission</h2>
						<p className="text-muted-foreground leading-relaxed">
							At AeroPlanar, we believe that creating stunning 3D
							models should be intuitive and accessible to
							creators of all skill levels. Our AI-powered
							platform bridges the gap between complex 3D software
							and creative vision, enabling artists, designers,
							and developers to bring their ideas to life faster
							than ever before.
						</p>
					</div>
					<div>
						<h2 className="text-2xl font-bold mb-4">Our Vision</h2>
						<p className="text-muted-foreground leading-relaxed">
							We envision a world where 3D creation is as simple
							as describing your idea. Through advanced AI
							technology and user-centered design, we're building
							tools that understand your creative intent and help
							you achieve professional results without the steep
							learning curve traditionally associated with 3D
							modeling.
						</p>
					</div>
				</div>

				<div className="bg-card rounded-2xl p-8 border">
					<h2 className="text-2xl font-bold mb-6">
						Why Choose AeroPlanar?
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="text-center">
							<div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-6 h-6 text-primary-foreground"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
							<h3 className="font-semibold mb-2">AI-Powered</h3>
							<p className="text-sm text-muted-foreground">
								Leverage cutting-edge AI to accelerate your 3D
								modeling workflow.
							</p>
						</div>
						<div className="text-center">
							<div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-6 h-6 text-primary-foreground"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
									/>
								</svg>
							</div>
							<h3 className="font-semibold mb-2">
								User-Friendly
							</h3>
							<p className="text-sm text-muted-foreground">
								Intuitive interface designed for creators, not
								just engineers.
							</p>
						</div>
						<div className="text-center">
							<div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-6 h-6 text-primary-foreground"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
							</div>
							<h3 className="font-semibold mb-2">
								Collaborative
							</h3>
							<p className="text-sm text-muted-foreground">
								Real-time collaboration features for teams and
								communities.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
