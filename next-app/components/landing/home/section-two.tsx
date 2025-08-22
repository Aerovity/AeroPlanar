import { DynamicImage } from "@/components/shared/dynamic-image";
import computerLight from "../../../public/computer-light.png";
import computerDark from "../../../public/computer12.jpg";

export function SectionTwo() {
	return (
		<section className="relative mb-12 group">
			<div className="border border-border bg-card rounded-md container p-8 md:p-10 md:pb-0 overflow-hidden">
				<div className="flex flex-col md:space-x-12 md:flex-row">
					<div className="relative mt-8 md:mt-0 md:max-w-[60%]">
						<DynamicImage
							lightSrc={computerLight}
							darkSrc={computerDark}
							height={446}
							width={836}
							className="-mb-[32px] md:-mb-[1px] object-contain mt-8 md:mt-0"
							alt="3D Studio Overview"
							quality={90}
						/>
					</div>

					<div className="xl:mt-6 md:max-w-[40%] md:ml-8 md:mb-8">
						<h3 className="font-medium text-xl md:text-2xl mb-4 text-foreground font-sans">
							3D Studio Overview
						</h3>

						<p className="text-muted-foreground md:mb-4 text-sm font-sans">
							Transform your creative workflow with our AI-powered 3D studio. Generate stunning 3D models from 2D images, collaborate in real-time, and optimize your assets for peak performance across all platforms and devices.
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
									AI Model Generation
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
									Real-time Collaboration
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
									Performance Optimization
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
									Cross-platform asset delivery and optimization
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
