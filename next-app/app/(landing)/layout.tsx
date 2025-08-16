import { Footer } from "@/components/landing/footer";
import { FooterCTA } from "@/components/landing/footer-cta";
import { Header } from "@/components/landing/header";
import { BackToTop } from "@/components/shared/back-to-top";

export default function LandingPageLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="container mx-auto px-4 overflow-hidden md:overflow-visible">
			<Header />
			{children}
			<FooterCTA />
			<Footer />
			<BackToTop />
		</div>
	);
}
