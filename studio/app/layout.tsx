import type { Metadata } from "next";
import "../styles/globals.css";
import { NetworkProvider } from "@/providers/network-provider";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/providers/react-query-provider";
import { ViewTransitions } from "next-view-transitions";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";

export const metadata: Metadata = {
	title: {
		default: "AeroPlanar | 3D Model Generator",
		template: "%s | AeroPlanar",
	},
	description: "Generate 3D models from 2D images using AI.",
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
								<AuthProvider>
									<main className="bg-background overflow-x-hidden font-sans antialiased min-h-screen">
										{children}
									</main>
									<Toaster position="top-right" richColors />
								</AuthProvider>
							</ThemeProvider>
						</ReactQueryProvider>
					</NetworkProvider>
				</body>
			</html>
		</ViewTransitions>
	);
}
