
import { Hero } from "@/components/landing/home/hero";
import { TopTextSection } from "@/components/landing/home/top-text-section";
import { SectionFive } from "@/components/landing/home/section-five";
import { SectionFour } from "@/components/landing/home/section-four";
import { SectionOne } from "@/components/landing/home/section-one";
import { SectionSeven } from "@/components/landing/home/section-seven";
import { SectionSix } from "@/components/landing/home/section-six";
import { SectionThree } from "@/components/landing/home/section-three";
import { SectionTwo } from "@/components/landing/home/section-two";
import { Testimonials } from "@/components/landing/home/testimonials";
import SectionStories from "@/components/landing/home/section-stories";
import VibeCodingTweetsSection from "@/components/landing/home/vibe-coding-tweets-section";
import TestimonialsSection from "@/components/landing/home/testimonials-section";
import FAQSection from "@/components/landing/home/faq-section";
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
