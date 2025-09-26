import type { Metadata } from "next";
import "../styles/globals.css";
import { NetworkProvider } from "@/providers/network-provider";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/providers/react-query-provider";
import { ViewTransitions } from "next-view-transitions";
import { baseUrl } from "./sitemap";
import { ThemeProvider } from "@/providers/theme-provider";
import { Footer } from "@/components/layout/footer";
import { FooterCTA } from "@/components/layout/footer-cta";
import { BackToTop } from "@/components/shared/back-to-top";
import { MouseSpotlight } from "@/components/shared/mouse-spotlight";
import OG from "./og.png";

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),
	title: {
		default: "AeroPlanar | 3D Model Generator",
		template: "%s | AeroPlanar",
	},
	description: "Generate 3D models from 2D images using AI.",
	openGraph: {
		title: "AeroPlanar | 3D Model Generator",
		description: "Generate 3D models from 2D images using AI.",
		url: baseUrl,
		siteName: "Generate 3D models from 2D images using AI",
		locale: "en",
		type: "website",

		images: [
			{
				url: "OG",
				width: 800,
				height: 600,
			},
			{
				url: "OG",
				width: 1800,
				height: 1600,
			},
		],
	},
	twitter: {
		title: "AeroPlanar | 3D Model Generator",
		description: "Generate 3D models from 2D images using AI",
		images: [
			{
				url: "OG",
				width: 800,
				height: 600,
			},
			{
				url: "OG",
				width: 1800,
				height: 1600,
			},
		],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ViewTransitions>
			<html lang="en" suppressHydrationWarning>
				<body className="font-sans antialiased">
					<NetworkProvider>
						<ReactQueryProvider>
							<ThemeProvider
								attribute="class"
								defaultTheme="system"
								enableSystem
								disableTransitionOnChange
							>
								{/* <AuthProvider> */}
								<main className="bg-background overflow-x-hidden font-sans antialiased min-h-screen landing-page-bg">
									<MouseSpotlight />
									<div className="container mx-auto px-4 overflow-hidden md:overflow-visible relative z-10">
										{children}
										<FooterCTA />
										<Footer />
										<BackToTop />
									</div>
								</main>
								<Toaster position="top-right" richColors />
								{/* </AuthProvider> */}
							</ThemeProvider>
						</ReactQueryProvider>
					</NetworkProvider>
				</body>
			</html>
		</ViewTransitions>
	);
}
