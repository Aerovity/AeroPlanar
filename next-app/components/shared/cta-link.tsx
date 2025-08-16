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
	return (
		<Link
			href="https://aeroplanar.com"
			className={cn(
				"font-medium text-sm items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden xl:flex",
				className
			)}
		>
			<span>{text}</span>
			<Icons.ArrowOutward />
		</Link>
	);
}
