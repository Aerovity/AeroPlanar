import { Hero } from "@/components/home/hero";
import { TopTextSection } from "@/components/home/top-text-section";
import { SectionFive } from "@/components/home/section-five";
import { SectionFour } from "@/components/home/section-four";
import { SectionOne } from "@/components/home/section-one";
import { SectionSeven } from "@/components/home/section-seven";
import { SectionSix } from "@/components/home/section-six";
import { SectionThree } from "@/components/home/section-three";
import { SectionTwo } from "@/components/home/section-two";
import { Testimonials } from "@/components/home/testimonials";
import SectionStories from "@/components/home/section-stories";
import VibeCodingTweetsSection from "@/components/home/vibe-coding-tweets-section";
import TestimonialsSection from "@/components/home/testimonials-section";
import FAQSection from "@/components/home/faq-section";
import { Spotlight } from "@/components/ui/spotlight-new";
import { NavBar } from "@/components/ui/tubelight-navbar";

export const revalidate = 1800;

export default function Home() {
	return (
		<>
			<NavBar items={[]} />
			<div className="relative" id="hero">
				<Hero />
				<Spotlight />
			</div>
			<div id="testimonials">
				<SectionStories />
			</div>
			<div id="about">
				<SectionOne />
			</div>
			<SectionTwo />
			<SectionThree />
			<SectionFour />
			<SectionFive />
			<div id="faq">
				<FAQSection />
			</div>
		</>
	);
}
