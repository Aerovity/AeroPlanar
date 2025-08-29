"use client";

import { Progress } from "@/components/custom-ui/progress";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export function ExportToast() {
	const [progress, setProgress] = useState(0);
	const { ref, inView } = useInView({
		triggerOnce: true,
	});

	useEffect(() => {
		if (!inView) return;

		const timer = setInterval(() => {
			setProgress((oldProgress) => {
				if (oldProgress === 100) {
					clearInterval(timer);
					return 100;
				}
				return Math.min(oldProgress + 25, 100);
			});
		}, 300);

		return () => {
			clearInterval(timer);
		};
	}, [inView]);

	return (
		<div
			ref={ref}
			className="w-full darK:bg-[#121212] flex flex-col border border-border p-4 space-y-3"
		>
			<div className="flex items-center space-x-2">
				<Loader2 className="animate-spin size-5 text-[#c3b383]" />
				<span className="text-sm font-medium text-[#c3b383]">
					Exporting model
				</span>
			</div>

			<Progress value={progress} className="w-full h-0.5" style={{"--progress-foreground": "#c3b383"} as React.CSSProperties} />

			<span className="text-xs text-[#878787]">
				Please do not close browser until completed
			</span>
		</div>
	);
}
