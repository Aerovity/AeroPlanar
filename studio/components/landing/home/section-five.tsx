"use client";

import { motion } from "motion/react";
import renderLight from "../../../public/render.png";
import renderDark from "../../../public/render.png";
import { CtaLink } from "@/components/shared/cta-link";
import { DynamicImage } from "@/components/shared/dynamic-image";
import { ExportToast } from "@/components/shared/export-toast";

export function SectionFive() {
	return (
		<section className="flex justify-between space-y-12 lg:space-y-0 lg:space-x-8 flex-col lg:flex-row overflow-hidden mb-12">
			<div className="border border-border lg:basis-2/3 bg-card rounded-md p-10 flex lg:space-x-8 lg:flex-row flex-col-reverse lg:items-start group">
				<DynamicImage
					lightSrc={renderLight}
					darkSrc={renderDark}
					quality={90}
					alt="AI Rendering"
					className="mt-8 lg:mt-0 basis-1/2 object-contain max-w-[70%] sm:max-w-[50%] md:max-w-[35%]"
				/>

				<div className="flex flex-col basis-1/2 relative h-full">
					<h4 className="font-medium text-xl md:text-2xl mb-4">
						AI Rendering Engine
					</h4>

					<p className="text-[#878787] mb-4 text-sm">
						Transform your concepts with our advanced AI rendering capabilities.
					</p>

					<p className="text-[#878787] text-sm">
						Generate photorealistic renders, apply intelligent lighting,
						and create stunning visualizations from your 3D models with
						just a few clicks.
					</p>

					<div className="flex flex-col space-y-2 h-full">
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
								AI-powered lighting optimization
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
							<span className="text-primary">Photorealistic material rendering</span>
						</div>

						<div className="absolute bottom-0 left-0">
							<CtaLink text="Start AI rendering" className="text-[#c3b383] hover:text-[#c3b383]" />
						</div>
					</div>
				</div>
			</div>

			<div className="border border-border basis-1/3 bg-card rounded-lg p-10 flex flex-col group">
				<h4 className="font-medium text-xl md:text-2xl mb-4">
					Multi-Format Export
				</h4>
				<p className="text-[#878787] text-sm mb-8">
					Export your 3D models in any format you need. Whether it's 
					OBJ, FBX, GLTF, or STL, AeroPlanar ensures your models are 
					optimized and ready for use in any platform or application.
				</p>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="mt-auto"
				>
					<ExportToast />
				</motion.div>

				<div className="mt-8 hidden md:flex">
					<CtaLink text="Export your models" className="text-[#c3b383] hover:text-[#c3b383]" />
				</div>
			</div>
		</section>
	);
}
