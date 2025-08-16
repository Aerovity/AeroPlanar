import type { Metadata } from "next";
import "../styles/globals.css";
import { NetworkProvider } from "@/providers/network-provider";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/providers/react-query-provider";
import { ViewTransitions } from "next-view-transitions";
import { baseUrl } from "./sitemap";
import { ThemeProvider } from "@/components/providers/theme-provider";

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
				url: "https://picsum.photos/800/600",
				width: 800,
				height: 600,
			},
			{
				url: "https://picsum.photos/1800/1600",
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
				url: "https://picsum.photos/800/600",
				width: 800,
				height: 600,
			},
			{
				url: "https://picsum.photos/1800/1600",
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
				<body
					className="font-sans antialiased"
				>
					<NetworkProvider>
						<ReactQueryProvider>
							<ThemeProvider
								attribute="class"
								defaultTheme="system"
								enableSystem
								disableTransitionOnChange
							>
								<main className="bg-background overflow-x-hidden font-sans antialiased min-h-screen">
									{children}
								</main>
								<Toaster position="top-right" richColors />
							</ThemeProvider>
						</ReactQueryProvider>
					</NetworkProvider>
				</body>
			</html>
		</ViewTransitions>
	);
}
