
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
import { SectionVideo } from "@/components/landing/home/section-video";
import VibeCodingTweetsSection from "@/components/landing/home/vibe-coding-tweets-section";
import TestimonialsSection from "@/components/landing/home/testimonials-section";
import FAQSection from "@/components/landing/home/faq-section";

export const revalidate = 1800;

export default function Home() {
	return (
		<>
			<Hero />
			<SectionStories />
			<SectionOne />
			<SectionTwo />
			<SectionThree />
			<SectionFour />
			<SectionFive />
			<SectionSix />
			<SectionSeven />
			<SectionVideo />
			<FAQSection />
		</>
	);
}
