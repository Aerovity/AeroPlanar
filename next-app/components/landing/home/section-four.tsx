"use client";

import { CtaLink } from "@/components/shared/cta-link";
import { DynamicImage } from "@/components/shared/dynamic-image";
import { motion } from "motion/react";
import { ModelViewer3D } from "@/components/shared/model-viewer-3d";
import inboxActionsLight from "../../../public/inbox-actions-light.png";
import inboxActionsDark from "../../../public/inbox-actions.png";
import inboxSuggestedLight from "../../../public/inbox-suggested-light.png";
import inboxSuggestedDark from "../../../public/inbox-suggested.png";

export function SectionFour() {
	return (
		<section className="flex justify-between space-y-12 lg:space-y-0 lg:space-x-8 flex-col lg:flex-row overflow-hidden mb-12 relative">
			<div className="border border-border md:basis-2/3 bg-card rounded-md p-10 flex justify-between md:space-x-8 md:flex-row flex-col group">
				<div className="flex flex-col md:basis-1/2">
					<h4 className="font-medium text-xl md:text-2xl mb-4">
						3D Asset Library
					</h4>

					<p className="text-[#878787] md:mb-4 text-sm">
						Organize and manage your 3D models, textures, and materials in a centralized library. 
						Share assets with your team and access pre-built architectural components.
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
								Model categorization & tagging
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
								Texture and material management
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
							<span className="text-primary">Version control for 3D assets</span>
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
							<span className="text-primary">Team collaboration tools</span>
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
								Cloud storage integration
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
							<span className="text-primary">Batch processing tools</span>
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
								Asset usage analytics
							</span>
						</div>

						<div className="absolute bottom-6">
							<CtaLink text="Explore asset library" />
						</div>
					</div>
				</div>

				<div className="md:basis-1/2 md:mt-0 flex items-center justify-center">
					<ModelViewer3D />
				</div>
			</div>

			<div className="border border-border basis-1/3 bg-card rounded-md p-10 flex flex-col relative group">
				<h4 className="font-medium text-xl md:text-2xl mb-4">Team Collaboration</h4>
				<ul className="list-decimal list-inside text-[#878787] text-sm space-y-2 leading-relaxed">
					<li>
						Share 3D projects instantly with team members and clients
						using secure collaboration links.
					</li>
					<li>
						Real-time commenting and feedback system on specific 
						model elements and design iterations.
					</li>
					<li>
						Version history tracking with automatic saves and 
						rollback capabilities for all project changes.
					</li>
				</ul>

				<div className="flex flex-col space-y-2 mb-6">
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
						<span className="text-primary">Real-time collaboration</span>
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
							Instant project sharing
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
							Automatically syncs changes across
							all team members
						</span>
					</div>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 1.4 }}
					viewport={{ once: true }}
					className="xl:absolute bottom-[100px]"
				>
					<DynamicImage
						lightSrc={inboxActionsLight}
						darkSrc={inboxActionsDark}
						height={33}
						width={384}
						className="object-contain scale-[0.9] 2x:scale-100"
						quality={90}
						alt="Inbox actions"
					/>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, x: 20 }}
					whileInView={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.3, delay: 1.8 }}
					viewport={{ once: true }}
					className="xl:absolute mt-4 xl:mt-0 bottom-[140px] right-10"
				>
					<DynamicImage
						lightSrc={inboxSuggestedLight}
						darkSrc={inboxSuggestedDark}
						height={19}
						width={106}
						className="object-contain"
						quality={90}
						alt="Inbox suggested"
					/>
				</motion.div>

				<div className="absolute bottom-6">
					<CtaLink text="Start collaborating" />
				</div>
			</div>
		</section>
	);
}
