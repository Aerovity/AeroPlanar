"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Icons } from "./icons";

export function CtaLink({
	text,
	className,
}: {
	text: string;
	className?: string;
}) {
	const shouldApplyCustomColor = 
		text === "Explore asset library" || 
		text === "Start collaborating" || 
		text === "Start managing projects" ||
		text === "Start AI rendering" ||
		text === "Export your model";
	
	const shouldRedirectToSignIn = 
		text === "Start AI rendering" ||
		text === "Export your model";
	
	return (
		<Link
			href={shouldRedirectToSignIn ? "/sign-in" : "https://aeroplanar.com"}
			className={cn(
				"font-medium text-sm items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden xl:flex",
				shouldApplyCustomColor && "text-[#c3b383]",
				className
			)}
		>
			<span>{text}</span>
			<Icons.ArrowOutward className={shouldApplyCustomColor ? "text-[#c3b383]" : ""} />
		</Link>
	);
}
