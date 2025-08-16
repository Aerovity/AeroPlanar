import { Testimonials } from "@/components/landing/home/testimonials";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/custom-ui/button";
import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import FAQSection from "@/components/landing/home/faq-section";

export const metadata: Metadata = {
	title: "Pricing",
	description: "AeroPlanar's pricing",
};

export default function Page() {
	return (
		<>
			<div className="container">
				<div>
					<div className="flex items-center flex-col text-center relative">
						<h1 className="mt-24 font-medium text-center text-5xl mb-4">
							Simple, transparent pricing
						</h1>
						<p className="text-md text-muted-foreground mb-12 max-w-2xl">
							Choose the plan that's right for you and start your
							14-day trial today.
						</p>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl mt-8">
							{/* Starter Plan */}
							<div className="flex flex-col p-8 border bg-card rounded-md">
								<h2 className="text-xl mb-2 text-left">
									Starter
								</h2>
								<div className="mt-4 flex items-baseline">
									<span className="text-[40px] font-medium tracking-tight">
										$29
									</span>
									<span className="ml-1 text-2xl font-medium">
										/mo
									</span>
									<span className="ml-2 text-sm text-muted-foreground">
										Excl. VAT
									</span>
								</div>
								<p className="mt-4 text-[#878787] text-left text-sm">
									For freelancers and solo founders who need
									the essentials.
								</p>

								<div className="mt-8">
									<h3 className="text-xs font-medium uppercase tracking-wide text-left text-[#878787] font-mono">
										INCLUDING
									</h3>
									<ul className="mt-4 space-y-2">
										<li className="flex items-start">
											<Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
											<span className="text-sm">
												Send up to 10 invoices per month
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
											<span className="text-sm">
												2 connected banks
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
											<span className="text-sm">
												Unlimited bank accounts
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
											<span className="text-sm">
												Financial overview
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
											<span className="text-sm">
												Time Tracker
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
											<span className="text-sm">
												50 inbox items per month
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
											<span className="text-sm">
												Customer management
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
											<span className="text-sm">
												Export CSV & reports
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
											<span className="text-sm">
												Assistant
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
											<span className="text-sm">
												10GB Vault Storage
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
											<span className="text-sm">
												2 users
											</span>
										</li>
									</ul>
								</div>

								<div className="mt-8 border-t-[1px] border-border pt-8">
									<Link href="https://app.aeroplanar.io">
										<Button
											variant="outline"
											className="w-full h-12 border border-primary"
										>
											Start 14 day trial
										</Button>
									</Link>
								</div>
							</div>

							{/* Pro Plan */}
							<div className="flex flex-col p-8 border border-primary bg-card rounded-md relative">
								<div className="absolute top-0 right-0 mr-4 mt-4 rounded-full text-[#878787] text-[9px] font-normal border px-2 py-1 font-mono">
									Limited offer
								</div>
								<h2 className="text-xl text-left mb-2">Pro</h2>
								<div className="mt-1 flex items-baseline">
									<span className="text-[40px] font-medium tracking-tight line-through text-[#878787]">
										$99
									</span>

									<span className="ml-1 text-[40px] font-medium tracking-tight">
										49
									</span>

									<span className="ml-1 text-xl font-medium">
										/mo
									</span>
									<span className="ml-2 text-xs text-muted-foreground">
										Excl. VAT
									</span>
								</div>
								<p className="mt-4 text-[#878787] text-left text-sm">
									For growing teams and businesses that need
									more flexibility.
								</p>

								<div className="mt-8">
									<h3 className="text-xs font-medium uppercase tracking-wide text-left text-[#878787] font-mono">
										INCLUDING
									</h3>
									<ul className="mt-4 space-y-2">
										<li className="flex items-start">
											<Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
											<span className="text-sm">
												Send up to 50 invoices per month
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
											<span className="text-sm">
												10 connected banks
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
											<span className="text-sm">
												Unlimited bank accounts
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
											<span className="text-sm">
												Financial overview
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
											<span className="text-sm">
												Time Tracker
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
											<span className="text-sm">
												500 inbox items per month
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
											<span className="text-sm">
												Customer management
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
											<span className="text-sm">
												Export CSV & reports
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
											<span className="text-sm">
												Assistant
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
											<span className="text-sm">
												100GB Vault Storage
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
											<span className="text-sm">
												10 users
											</span>
										</li>
									</ul>
								</div>

								<div className="mt-8 border-t border-border pt-8">
									<Link href="https://app.aeroplanar.io">
										<Button className="w-full h-12">
											Start 14 day trial
										</Button>
									</Link>
								</div>
							</div>
						</div>

						<div className="mt-4 flex w-full max-w-5xl items-center justify-between">
							<p className="mt-4 text-xs text-muted-foreground font-mono">
								14 day trial (No credit card required)
							</p>

							<p className="mt-4 text-xs text-muted-foreground font-mono hidden md:block">
								Need more? Feel free to{" "}
								<Link href="/support" className="underline">
									contact us
								</Link>
								.
							</p>
						</div>
					</div>
				</div>

				<div className="container max-w-[800px] mt-32">
					<FAQSection />
				</div>
			</div>

			<Testimonials />
		</>
	);
}
