"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const faqs = [
	{
		question: "How does AeroPlanar differ from traditional 3D tools?",
		answer: (
			<>
				AeroPlanar focuses on intuitive, AI-powered 3D creation.
				<br />
				<br />
				While traditional tools require extensive technical knowledge,
				AeroPlanar lets you create professional 3D models through
				natural interaction.
				<br />
				<br />
				It gives you creative freedom without the complexity.
			</>
		),
	},
	{
		question: "Is it free to use?",
		answer: (
			<>
				Yes — we offer a generous free tier to get you started.
				<br />
				<br />
				Pro and Team plans with advanced features coming soon.
			</>
		),
	},
	{
		question: "What file formats does AeroPlanar support?",
		answer: (
			<>
				AeroPlanar supports all standard 3D formats.
				<br />
				<br />
				Import and export your models in OBJ, STL, GLTF, and more.
				<br />
				<br />
				Your creative workflow stays flexible and compatible.
			</>
		),
	},
	{
		question: "Where are my 3D models stored?",
		answer: (
			<>
				Your models and project history live{" "}
				<strong>on your device</strong> — not in the cloud.
			</>
		),
	},
	{
		question: "How does AeroPlanar handle performance?",
		answer: (
			<>
				AeroPlanar is optimized for smooth, real-time 3D editing with{" "}
				<strong>intelligent performance monitoring</strong>.
				<br />
				<br />
				Your models are{" "}
				<strong>
					rendered efficiently using modern GPU acceleration
				</strong>{" "}
				with automatic quality adjustments.
				<br />
				<br />
				We maintain fluid interaction even with complex geometries.
			</>
		),
	},
	{
		question: "Can I use AeroPlanar for professional projects?",
		answer: (
			<>
				Absolutely.
				<br />
				<br />
				AeroPlanar produces professional-quality 3D models suitable for
				games, visualization, and production workflows.
			</>
		),
	},
];

interface FAQSectionProps {
	onOpenInstall?: () => void;
}

export default function FAQSection({ onOpenInstall }: FAQSectionProps) {
	return (
		<section className="py-16 md:py-24 font-sans">
			<div className="max-w-4xl mx-auto px-4 sm:px-6">
				<h2 className="text-center mb-12 md:mb-16 font-semibold text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground">
					Frequently Asked Questions
				</h2>

				<Accordion
					type="single"
					collapsible
					className="w-full space-y-4"
				>
					{faqs.map((faq, index) => (
						<AccordionItem
							key={index}
							value={`item-${index}`}
							className="border border-border rounded-md bg-card overflow-hidden"
						>
							<AccordionTrigger className="px-5 py-4 hover:no-underline">
								<span className="text-left font-medium text-foreground text-lg">
									{faq.question}
								</span>
							</AccordionTrigger>
							<AccordionContent className="px-5 pb-4 pt-0">
								<div className="text-muted-foreground text-base leading-relaxed">
									{faq.answer}
								</div>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>

				{/* Call to action */}
				<div className="mt-12 md:mt-16 text-center">
					<p className="text-muted-foreground mb-6 text-lg leading-relaxed">
						Ready to revolutionize your 3D workflow? Start creating
						in minutes.
					</p>

					{onOpenInstall && (
						<Button
							onClick={onOpenInstall}
							className="font-sans font-semibold"
							size="lg"
						>
							<Download className="mr-2 h-4 w-4" />
							Get Started
						</Button>
					)}
				</div>
			</div>
		</section>
	);
}
