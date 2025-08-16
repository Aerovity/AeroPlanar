"use client";

import { useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type * as THREE from "three";

interface TransformGizmoProps {
	position: [number, number, number];
	onTransform: (newPosition: [number, number, number]) => void;
	visible: boolean;
}

export function TransformGizmo({
	position,
	onTransform,
	visible,
}: TransformGizmoProps) {
	const [isDragging, setIsDragging] = useState<string | null>(null);
	const [hovered, setHovered] = useState<string | null>(null);
	const gizmoRef = useRef<THREE.Group>(null);
	const { camera, gl } = useThree();

	const handlePointerDown = (axis: string) => (e: any) => {
		e.stopPropagation();
		setIsDragging(axis);
		gl.domElement.style.cursor = "grabbing";
	};

	const handlePointerUp = () => {
		setIsDragging(null);
		gl.domElement.style.cursor = "default";
	};

	const handlePointerMove = (e: any) => {
		if (!isDragging) return;

		const sensitivity = 0.01;
		const [x, y, z] = position;

		switch (isDragging) {
			case "x":
				onTransform([x + e.movementX * sensitivity, y, z]);
				break;
			case "y":
				onTransform([x, y - e.movementY * sensitivity, z]);
				break;
			case "z":
				onTransform([
					x,
					y,
					z + e.movementZ * sensitivity || e.movementX * sensitivity,
				]);
				break;
		}
	};

	if (!visible) return null;

	return (
		<group
			ref={gizmoRef}
			position={position}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
		>
			{/* X Axis - Red */}
			<group>
				<mesh
					position={[1.5, 0, 0]}
					onPointerDown={handlePointerDown("x")}
					onPointerOver={() => setHovered("x")}
					onPointerOut={() => setHovered(null)}
				>
					<cylinderGeometry args={[0.05, 0.05, 3, 8]} />
					<meshBasicMaterial
						color={hovered === "x" ? "#ff6b6b" : "#ff4444"}
						transparent
						opacity={0.8}
					/>
				</mesh>
				<mesh
					position={[3, 0, 0]}
					onPointerDown={handlePointerDown("x")}
				>
					<coneGeometry args={[0.15, 0.4, 8]} />
					<meshBasicMaterial
						color={hovered === "x" ? "#ff6b6b" : "#ff4444"}
						transparent
						opacity={0.8}
					/>
				</mesh>
			</group>

			{/* Y Axis - Green */}
			<group>
				<mesh
					position={[0, 1.5, 0]}
					onPointerDown={handlePointerDown("y")}
					onPointerOver={() => setHovered("y")}
					onPointerOut={() => setHovered(null)}
				>
					<cylinderGeometry args={[0.05, 0.05, 3, 8]} />
					<meshBasicMaterial
						color={hovered === "y" ? "#6bff6b" : "#44ff44"}
						transparent
						opacity={0.8}
					/>
				</mesh>
				<mesh
					position={[0, 3, 0]}
					onPointerDown={handlePointerDown("y")}
				>
					<coneGeometry args={[0.15, 0.4, 8]} />
					<meshBasicMaterial
						color={hovered === "y" ? "#6bff6b" : "#44ff44"}
						transparent
						opacity={0.8}
					/>
				</mesh>
			</group>

			{/* Z Axis - Blue */}
			<group>
				<mesh
					position={[0, 0, 1.5]}
					rotation={[Math.PI / 2, 0, 0]}
					onPointerDown={handlePointerDown("z")}
					onPointerOver={() => setHovered("z")}
					onPointerOut={() => setHovered(null)}
				>
					<cylinderGeometry args={[0.05, 0.05, 3, 8]} />
					<meshBasicMaterial
						color={hovered === "z" ? "#6b6bff" : "#4444ff"}
						transparent
						opacity={0.8}
					/>
				</mesh>
				<mesh
					position={[0, 0, 3]}
					rotation={[Math.PI / 2, 0, 0]}
					onPointerDown={handlePointerDown("z")}
				>
					<coneGeometry args={[0.15, 0.4, 8]} />
					<meshBasicMaterial
						color={hovered === "z" ? "#6b6bff" : "#4444ff"}
						transparent
						opacity={0.8}
					/>
				</mesh>
			</group>

			{/* Center sphere */}
			<mesh onPointerDown={handlePointerDown("center")}>
				<sphereGeometry args={[0.2, 16, 16]} />
				<meshBasicMaterial
					color={hovered === "center" ? "#ffffff" : "#cccccc"}
					transparent
					opacity={0.6}
				/>
			</mesh>

			{/* Axis labels */}
			<Html position={[3.5, 0, 0]} center>
				<div className="text-red-400 text-xs font-bold bg-black/50 px-1 rounded">
					X
				</div>
			</Html>
			<Html position={[0, 3.5, 0]} center>
				<div className="text-green-400 text-xs font-bold bg-black/50 px-1 rounded">
					Y
				</div>
			</Html>
			<Html position={[0, 0, 3.5]} center>
				<div className="text-blue-400 text-xs font-bold bg-black/50 px-1 rounded">
					Z
				</div>
			</Html>
		</group>
	);
}
