"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { type Story, StoryCard } from "./story-card";
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/custom-ui/button";

const ReactHlsPlayer = dynamic(() => import("react-hls-player"), {
	ssr: false,
});

const stories = [
	{
		id: 1,
		title: "\"AI Generation helped me a lot creating 3D website components, and all that with just 1 click\"",
		description:
			"AI Generation helped me a lot creating 3D website components, and all that with just 1 click",
		name: "Mohammed el Amine Attoui",
		company: "Web Developer",
		country: "London",
		src: "/placeholder-user.jpg",
		content: [
			{
				type: "paragraph",
				content:
					"AI Generation helped me a lot creating 3D website components, and all that with just 1 click. The ability to quickly generate complex 3D models for web integration has revolutionized my development workflow.",
			},
		],
	},
	{
		id: 2,
		title: "\"Creating 3D maquettes for my presentation saved a lot in my project\"",
		description:
			"Using 3D generation and the maquette builder I started creating amazing concepts for my projects as well as using the AI to find inspiration",
		name: "Tiny Hamdad",
		company: "Architecture Student",
		country: "Paris",
		src: "/placeholder-user.jpg",
		content: [
			{
				type: "paragraph",
				content:
					"Creating 3D maquettes for my presentation saved a lot in my project. Using 3D generation and the maquette builder I started creating amazing concepts for my projects as well as using the AI to find inspiration.",
			},
		],
	},
	{
		id: 3,
		title: "\"This will be the revolution for Indie VR devs\"",
		description:
			"Many VR devs struggle to transform our sketches to 3D models - this might be the solution. It helped a lot working in my future VR projects",
		name: "Pear Streatham",
		company: "VR Game Developer",
		country: "San Francisco",
		src: "/placeholder-user.jpg",
		content: [
			{
				type: "paragraph",
				content:
					"This will be the revolution for Indie VR devs. As many VR developers struggle to transform our sketches to 3D models, this might be the solution. It helped a lot working in my future VR projects.",
			},
		],
	},
	{
		id: 4,
		title: "\"3D modelling became so easy\"",
		description:
			"While working on my brand I always would've loved seeing my clothes before production in 3D and here is my solution",
		name: "Amine Bazine",
		company: "Clothing Brand Designer",
		country: "Paris",
		src: "/placeholder-user.jpg",
		content: [
			{
				type: "paragraph",
				content:
					"3D modelling became so easy. While working on my brand I always would've loved seeing my clothes before production in 3D and here is my solution.",
			},
		],
	},
];

function Video({ src }: { src: string }) {
	const playerRef = useRef<HTMLVideoElement>(null!);
	const [isPlaying, setPlaying] = useState(false);

	const togglePlay = () => {
		if (isPlaying) {
			playerRef.current?.pause();
		} else {
			playerRef.current?.play();
		}

		setPlaying((prev) => !prev);
	};

	return (
		<div className="w-full h-[280px] relative">
			<ReactHlsPlayer
				src={src}
				onClick={togglePlay}
				autoPlay={false}
				poster="https://cdn.midday.ai/guy-cover.png"
				playerRef={playerRef}
				className="w-full"
			/>

			{!isPlaying && (
				<div className="absolute bottom-4 left-4 space-x-4 items-center justify-center z-30 transition-all">
					<Button
						size="icon"
						type="button"
						className="rounded-full size-10 md:size-14 transition ease-in-out hover:scale-110 hover:bg-white bg-white"
						onClick={togglePlay}
					>
						<Icons.Play size={24} className="text-black" />
					</Button>
				</div>
			)}
		</div>
	);
}

export default function SectionStories() {
	const [selectedStory, setSelectedStory] = useState<Story | null>(null);

	return (
		<Dialog>
			<div className="relative mt-20 pb-20">
				<div className="w-full h-full flex items-center flex-col z-10 relative">
					<h2 className="text-[56px] text-center font-medium mt-12">
						What our users say
					</h2>

					<div className="flex mt-20 -space-x-4">
						{stories.map((story, index) => (
							<div
								key={story.id}
								className={`transform ${
									index % 2 === 0 ? "rotate-3" : "-rotate-3"
								} ${
									index % 2 === 0
										? "translate-y-3"
										: "-translate-y-3"
								} hover:z-10 hover:-translate-y-5 transition-all duration-300`}
							>
								<DialogTrigger asChild>
									<div
										onClick={() => setSelectedStory(story)}
									>
										<StoryCard {...story} />
									</div>
								</DialogTrigger>
							</div>
						))}
					</div>
				</div>

				<div className="dotted-bg w-[calc(100vw+1400px)] h-full absolute top-0 -left-[1200px] z-0" />
			</div>

			<DialogContent className="max-w-[550px] !p-6 pt-10 max-h-[calc(100vh-200px)] overflow-y-auto">
				<DialogHeader className="sr-only">
					<DialogTitle>{selectedStory?.title}</DialogTitle>
				</DialogHeader>

				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-4">
						<Avatar className="size-6">
							<AvatarImage
								src={selectedStory?.src ?? ""}
								width={24}
								height={24}
								alt={selectedStory?.name ?? ""}
							/>
						</Avatar>
						<div>
							<p>{selectedStory?.name}</p>
							<div className="flex items-center gap-2 text-[#878787]">
								<p className="text-sm">
									{selectedStory?.company}
								</p>
								{selectedStory?.country && (
									<>
										•
										<p className="text-sm">
											{selectedStory?.country}
										</p>
									</>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="space-y-4">
					{selectedStory?.video && (
						<Video src={selectedStory?.video} />
					)}

					{selectedStory?.content?.map((item, index: number) =>
						item.type === "heading" ? (
							<h2
								key={index.toString()}
								className="text-2xl font-medium"
							>
								{item.content}
							</h2>
						) : (
							<div
								key={index.toString()}
								className={
									item.type === "question"
										? "text-[#878787]"
										: ""
								}
							>
								{item.content}
							</div>
						)
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
