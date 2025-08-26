// import { SubscribeInput } from "@/components/subscribe-input";
import Link from "next/link";
// import { GithubStars } from "./github-stars";
// import { StatusWidget } from "./status-widget";
import { SocialLinks } from "../shared/social-links";
import Image from "next/image";

export function Footer() {
	return (
		<footer className="border-t border-border px-4 md:px-6 pt-10 md:pt-16 overflow-hidden md:max-h-[820px]" style={{backgroundColor: '#000208'}}>
			<div className="container">
				<div className="flex justify-between items-center border-border border-b pb-10 md:pb-16 mb-12">
					<Link
						href="/"
					>
						<Image
							src="/logo.png"
							alt="AeroPlanar Logo"
							width={64}
							height={64}
							className="h-16 w-auto"
						/>
						<span className="sr-only">AeroPlanar</span>
					</Link>

					<span className="font-normal md:text-2xl text-right" style={{color: '#c3b383'}}>
						Build the future with 3D.
					</span>
				</div>

				<div className="flex flex-col md:flex-row w-full">
					<div className="flex flex-col space-y-8 md:space-y-0 md:flex-row md:w-6/12 justify-between leading-8">
						<div>
							<span className="font-medium text-foreground">
								Features
							</span>
							<ul>
								<li className="transition-colors text-muted-foreground hover:text-foreground">
									<Link href="/studio">3D Studio</Link>
								</li>
								<li className="transition-colors text-muted-foreground hover:text-foreground">
									<Link href="/library">Asset Library</Link>
								</li>
								<li className="transition-colors text-muted-foreground hover:text-foreground">
									<Link href="/collaboration">
										Collaboration
									</Link>
								</li>
								<li className="transition-colors text-muted-foreground hover:text-foreground">
									<Link href="/optimization">
										Optimization
									</Link>
								</li>
								<li className="transition-colors text-muted-foreground hover:text-foreground">
									<Link href="/analytics">Analytics</Link>
								</li>
								<li className="transition-colors text-muted-foreground hover:text-foreground">
									<Link href="/pricing">Pricing</Link>
								</li>
								<li className="transition-colors text-muted-foreground hover:text-foreground">
									<Link href="/api">API</Link>
								</li>
								<li className="transition-colors text-muted-foreground hover:text-foreground">
									<Link href="/download">Download</Link>
								</li>
							</ul>
						</div>

						<div>
							<span className="font-medium text-foreground">
								Resources
							</span>
							<ul>
								<li className="transition-colors text-muted-foreground hover:text-foreground">
									<Link href="https://github.com/Aerovity/AeroPlanar">
										Github
									</Link>
								</li>
								<li className="transition-colors text-muted-foreground hover:text-foreground">
									<Link href="/support">Support</Link>
								</li>
								<li className="transition-colors text-muted-foreground hover:text-foreground">
									<Link href="/policy">Privacy policy</Link>
								</li>
								<li className="transition-colors text-muted-foreground hover:text-foreground">
									<Link href="/terms">
										Terms and Conditions
									</Link>
								</li>
								<li className="transition-colors text-muted-foreground hover:text-foreground">
									<Link href="/branding">Branding</Link>
								</li>
							</ul>
						</div>

						<div>
							<span className="font-medium text-foreground">
								Company
							</span>
							<ul>
								<li className="transition-colors text-muted-foreground hover:text-foreground">
									<Link href="/story">Story</Link>
								</li>
								<li className="transition-colors text-muted-foreground hover:text-foreground">
									<Link href="/updates">Updates</Link>
								</li>
								<li className="transition-colors text-muted-foreground hover:text-foreground">
									<Link href="/open-startup">
										Open startup
									</Link>
								</li>
								<li className="transition-colors text-muted-foreground hover:text-foreground">
									<Link href="/oss-friends">OSS friends</Link>
								</li>
							</ul>
						</div>
					</div>

					<div className="md:w-6/12 flex mt-8 md:mt-0 md:justify-end">
						<div className="flex md:items-end flex-col">
							<div className="flex items-start md:items-center flex-col md:flex-row space-y-6 md:space-y-0 mb-8">
								{/* <GithubStars /> */}
								<SocialLinks />
							</div>

							{/* <div className="mb-8">
								<SubscribeInput />
							</div> */}

							{/* <div className="md:mr-0 mt-auto mr-auto">
								<StatusWidget />
							</div> */}
						</div>
					</div>
				</div>
			</div>

		</footer>
	);
}
