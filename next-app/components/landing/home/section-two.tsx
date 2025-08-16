import { CtaLink } from "@/components/shared/cta-link";
import { DynamicImage } from "@/components/shared/dynamic-image";
import computerLight from "../../../public/computer-light.png";
import computerDark from "../../../public/computer.png";

export function SectionTwo() {
	return (
		<section className="border border-border bg-card rounded-md container lg:pb-0 overflow-hidden mb-12 group">
			<div className="flex flex-col lg:space-x-12 lg:flex-row">
				<DynamicImage
					lightSrc={computerLight}
					darkSrc={computerDark}
					height={446}
					width={836}
					className="-mb-[1px] object-contain lg:w-1/2"
					alt="3D Studio Overview"
					quality={90}
				/>

				<div className="xl:mt-6 lg:max-w-[40%] md:ml-8 md:mb-8 flex flex-col justify-center p-8 md:pl-0 relative">
					<h3 className="font-medium text-xl md:text-2xl mb-4 text-foreground font-sans">
						3D Studio Overview
					</h3>

					<p className="text-muted-foreground mb-8 lg:mb-4 text-sm font-sans">
						Transform your creative workflow with our AI-powered 3D
						studio. Generate stunning 3D models from 2D images,
						collaborate in real-time, and optimize your assets for
						peak performance across all platforms and devices.
					</p>

					<div className="flex flex-col space-y-2">
						<div className="flex space-x-2 items-center ">
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
							<span className="text-primary text-sm font-sans">
								AI Model Generation
							</span>
						</div>

						<div className="flex space-x-2 items-center">
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
							<span className="text-primary text-sm font-sans">
								Real-time Collaboration
							</span>
						</div>

						<div className="flex space-x-2 items-center">
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
							<span className="text-primary text-sm font-sans">
								Performance Optimization
							</span>
						</div>

						<div className="flex space-x-2 items-center">
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
							<span className="text-primary text-sm font-sans">
								Cross-platform asset delivery and optimization
							</span>
						</div>
					</div>

					<div className="absolute bottom-0 right-0">
						<CtaLink text="Launch your 3D studio" />
					</div>
				</div>
			</div>
		</section>
	);
}
