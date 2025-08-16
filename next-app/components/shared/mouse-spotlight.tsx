"use client";

import { useEffect, useState } from "react";

export function MouseSpotlight() {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({ x: e.clientX, y: e.clientY });
		};

		window.addEventListener("mousemove", handleMouseMove);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	return (
		<div
			className="fixed inset-0 pointer-events-none z-20"
			style={{
				background: `radial-gradient(circle 600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.015) 25%, rgba(255, 255, 255, 0.008) 50%, transparent 70%)`,
			}}
		/>
	);
}