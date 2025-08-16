"use client";

import { CtaLink } from "@/components/shared/cta-link";
import { DynamicImage } from "@/components/shared/dynamic-image";
import { motion } from "motion/react";
import breakdownLight from "../../../public/breakdown-light.png";
import breakdownDark from "../../../public/breakdown.png";
import timeFormatLight from "../../../public/time-format-light.png";
import timeFormatDark from "../../../public/time-format.png";
import blackholeImage from "../../../public/blackhole.jpeg";

export function SectionThree() {
	return (
		<section className="relative mb-12 group">
			<div className="border border-border bg-card rounded-md container p-8 md:p-10 md:pb-0 overflow-hidden">
				<div className="flex flex-col md:space-x-12 md:flex-row">
					<div className="xl:mt-6 md:max-w-[40%] md:mr-8 md:mb-8">
						<h3 className="font-medium text-xl md:text-2xl mb-4 text-foreground font-sans">
							Advanced 3D Project Management
						</h3>

						<p className="text-muted-foreground md:mb-4 text-sm font-sans">
							Monitor model complexity, track performance metrics,
							optimize rendering workflows and
							<br />
							generate comprehensive project reports for your 3D creations.
						</p>

						<div className="flex flex-col space-y-2">
							<div className="flex space-x-2 items-center mt-8 text-sm">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width={18}
									height={13}
									fill="none"
								>
									<path
										fill="currentColor"
										d="M6.55 13 .85 7.3l1.425-1.425L6.55 10.15 15.725.975 17.15 2.4 6.55 13Z"
									/>
								</svg>
								<span className="text-primary">
									Real-time model performance monitoring
								</span>
							</div>
							<div className="flex space-x-2 items-center text-sm">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width={18}
									height={13}
									fill="none"
								>
									<path
										fill="currentColor"
										d="M6.55 13 .85 7.3l1.425-1.425L6.55 10.15 15.725.975 17.15 2.4 6.55 13Z"
									/>
								</svg>
								<span className="text-primary">
									Automated geometry optimization
								</span>
							</div>

							<div className="flex space-x-2 items-center text-sm">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width={18}
									height={13}
									fill="none"
								>
									<path
										fill="currentColor"
										d="M6.55 13 .85 7.3l1.425-1.425L6.55 10.15 15.725.975 17.15 2.4 6.55 13Z"
									/>
								</svg>
								<span className="text-primary">
									Project timeline and milestone tracking
								</span>
							</div>

							<div className="flex space-x-2 items-center text-sm">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width={18}
									height={13}
									fill="none"
								>
									<path
										fill="currentColor"
										d="M6.55 13 .85 7.3l1.425-1.425L6.55 10.15 15.725.975 17.15 2.4 6.55 13Z"
									/>
								</svg>
								<span className="text-primary">
									Collaborative project sharing
								</span>
							</div>

							<div className="flex space-x-2 items-center text-sm">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width={18}
									height={13}
									fill="none"
								>
									<path
										fill="currentColor"
										d="M6.55 13 .85 7.3l1.425-1.425L6.55 10.15 15.725.975 17.15 2.4 6.55 13Z"
									/>
								</svg>
								<span className="text-primary">
									Export in multiple 3D formats
								</span>
							</div>
						</div>

						<div className="absolute bottom-6">
							<CtaLink text="Start managing projects" />
						</div>
					</div>

					<div className="relative mt-8 md:mt-0">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: 0.7 }}
							viewport={{ once: true }}
							className="absolute -left-[80px] top-[200px]"
						>
							<DynamicImage
								lightSrc={timeFormatLight}
								darkSrc={timeFormatDark}
								height={142}
								width={135}
								className="object-contain"
								quality={90}
								alt="Time format"
							/>
						</motion.div>

						<div className="scale-75 md:scale-100">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: 1.2 }}
								viewport={{ once: true }}
								className="absolute -right-[65px] md:-right-[15px] md:-top-[20px]"
							>
								<DynamicImage
									lightSrc={breakdownLight}
									darkSrc={breakdownDark}
									height={124}
									width={238}
									className="object-contain"
									quality={90}
									alt="Breakdown"
								/>
							</motion.div>
						</div>
						<img
							src={blackholeImage.src || blackholeImage}
							height={400}
							className="-mb-[32px] md:-mb-[1px] object-contain mt-8 md:mt-0"
							alt="Black Hole Project Management"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
