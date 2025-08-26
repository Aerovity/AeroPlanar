import { Link } from "next-view-transitions";
import { FaGithub } from "react-icons/fa";
import { FaLinkedinIn, FaProductHunt, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa6";

export function SocialLinks() {
	return (
		<ul className="flex space-x-4 items-center md:ml-5">
			<li>
				<Link target="_blank" rel="noreferrer" href="/">
					<span className="sr-only">Twitter</span>
					<FaXTwitter size={22} className="fill-[#878787]" />
				</Link>
			</li>
			<li>
				<Link target="_blank" rel="noreferrer" href="/">
					<span className="sr-only">Producthunt</span>
					<FaProductHunt size={22} className="fill-[#878787]" />
				</Link>
			</li>
			<li>
				<Link target="_blank" rel="noreferrer" href="/">
					<span className="sr-only">Discord</span>
					<FaDiscord size={24} className="fill-[#878787]" />
				</Link>
			</li>
			<li>
				<Link target="_blank" rel="noreferrer" href="https://github.com/Aerovity/AeroPlanar">
					<span className="sr-only">Github</span>
					<FaGithub size={22} className="fill-[#878787]" />
				</Link>
			</li>
			<li>
				<Link target="_blank" rel="noreferrer" href="/">
					<span className="sr-only">LinkedIn</span>
					<FaLinkedinIn size={22} className="fill-[#878787]" />
				</Link>
			</li>
			<li>
				<Link target="_blank" rel="noreferrer" href="/">
					<span className="sr-only">Youtube</span>
					<FaYoutube size={22} className="fill-[#878787]" />
				</Link>
			</li>
		</ul>
	);
}
