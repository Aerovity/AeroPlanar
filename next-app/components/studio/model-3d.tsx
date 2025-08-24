"use client";

import { useGLTF, Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef, useState, useEffect, memo } from "react";
import type { Group } from "three";
import * as THREE from "three";
import { useSculpting } from "@/hooks/use-sculpting";

interface Model3DProps {
	url: string;
	position: [number, number, number];
	size?: [number, number, number];
	isSelected?: boolean;
	onClick?: () => void;
	onPositionChange?: (newPosition: [number, number, number]) => void;
	onSizeChange?: (newSize: [number, number, number]) => void;
	keyboardMove?: { direction: string; amount: number } | null;
	activeTool?: string | null;
	toolSettings?: any;
	onToolApply?: (toolType: string, point: any) => void;
	sculptingEnabled?: boolean;
	currentBrush?: any;
	modelId?: string;
	onMeshModified?: (modelId: string, mesh: THREE.Mesh | null) => void;
}

function Model3DComponent({
	url,
	position,
	size = [2, 2, 2],
	isSelected,
	onClick,
	onPositionChange,
	onSizeChange,
	keyboardMove,
	activeTool,
	toolSettings,
	onToolApply,
	sculptingEnabled,
	currentBrush,
	modelId,
	onMeshModified,
}: Model3DProps) {
	const groupRef = useRef<Group>(null);
	const [hovered, setHovered] = useState(false);
	const [error, setError] = useState(false);
	const [isDragging, setIsDragging] = useState<string | null>(null);
	const [currentPosition, setCurrentPosition] =
		useState<[number, number, number]>(position);
	const [currentSize, setCurrentSize] =
		useState<[number, number, number]>(size);
	const [gizmoHovered, setGizmoHovered] = useState<string | null>(null);
	const [baseScale, setBaseScale] = useState<number>(1);
	const [modelCenter, setModelCenter] = useState<[number, number, number]>([
		0, 0, 0,
	]);
	const [appliedMaterials, setAppliedMaterials] = useState<Map<string, any>>(
		new Map()
	);
	const { gl } = useThree();
	const sculpting = useSculpting({
		onSculptingChange: (targetId, isModified) => {
			console.log(`Model ${targetId} sculpting changed:`, isModified);

			// Notify parent component about mesh modifications
			if (onMeshModified && modelId && isModified) {
				// Find the modified mesh from the scene
				let modifiedMesh: THREE.Mesh | null = null;
				scene.traverse((child: any) => {
					if (child.isMesh && child.userData?.targetId === targetId) {
						modifiedMesh = child;
					}
				});

				if (modifiedMesh) {
					onMeshModified(modelId, modifiedMesh);
				}
			}
		},
	});

	// Load the 3D model
	const gltf = useGLTF(url, undefined, undefined, (error) => {
		console.error("Error loading 3D model:", error);
		setError(true);
	});

	// Get a unique scene instance for this component
	const scene = gltf.scene.clone();
	const [sceneReady, setSceneReady] = useState(false);

	// Calculate initial base scale and center when model loads
	useEffect(() => {
		if (scene) {
			// Get the bounding box of the model
			const box = new THREE.Box3().setFromObject(scene);
			const size = box.getSize(new THREE.Vector3());

			// Calculate scale to fit within a 2x2x2 cube (much larger than before)
			const maxDimension = Math.max(size.x, size.y, size.z);
			const calculatedBaseScale = (2 / maxDimension) * 5; // 10x bigger than original

			setBaseScale(calculatedBaseScale);

			// Center the model
			const center = box.getCenter(new THREE.Vector3());
			setModelCenter([center.x, center.y, center.z]);

			// Apply initial scaling
			scene.scale.set(
				calculatedBaseScale,
				calculatedBaseScale,
				calculatedBaseScale
			);
			scene.position.set(
				-center.x * calculatedBaseScale,
				-center.y * calculatedBaseScale,
				-center.z * calculatedBaseScale
			);

			setSceneReady(true);
		}
	}, [gltf.scene]);

	// Apply size changes to the model
	useEffect(() => {
		if (scene && baseScale > 0) {
			scene.scale.set(
				baseScale * currentSize[0],
				baseScale * currentSize[1],
				baseScale * currentSize[2]
			);
		}
	}, [scene, baseScale, currentSize]);

	// Update position and size when props change
	useEffect(() => {
		setCurrentPosition(position);
	}, [position]);

	useEffect(() => {
		setCurrentSize(size);
	}, [size]);

	// Register/unregister mesh for sculpting
	useEffect(() => {
		if (sceneReady && scene && modelId && sculptingEnabled) {
			// Find the first mesh in the scene
			let targetMesh: THREE.Mesh | null = null;
			scene.traverse((child) => {
				if (child instanceof THREE.Mesh && !targetMesh) {
					targetMesh = child;
				}
			});

			if (targetMesh) {
				sculpting.registerMesh(modelId, targetMesh);

				// Set as current target if selected
				if (isSelected) {
					sculpting.setTarget(modelId);
				}
			}

			return () => {
				sculpting.unregisterMesh(modelId);
			};
		}
	}, [sceneReady, scene, modelId, sculptingEnabled, sculpting]);

	// Update sculpting target when selection changes
	useEffect(() => {
		if (modelId && sculptingEnabled) {
			if (isSelected) {
				sculpting.setTarget(modelId);
			} else if (sculpting.currentTarget === modelId) {
				sculpting.setTarget(null);
			}
		}
	}, [isSelected, modelId, sculptingEnabled, sculpting]);

	// Update brush when it changes
	useEffect(() => {
		if (currentBrush && sculptingEnabled) {
			const brush = sculpting.createBrush(currentBrush);
			sculpting.setBrush(brush);
		}
	}, [currentBrush, sculptingEnabled, sculpting]);

	// Start/stop sculpting based on sculpting mode
	useEffect(() => {
		if (sculptingEnabled && isSelected) {
			sculpting.startSculpting();
		} else {
			sculpting.stopSculpting();
		}
	}, [sculptingEnabled, isSelected, sculpting]);

	// Handle keyboard movement
	useEffect(() => {
		if (isSelected && keyboardMove) {
			const { direction, amount } = keyboardMove;
			const [x, y, z] = currentPosition;
			let newPosition: [number, number, number] = [x, y, z];

			switch (direction) {
				case "ArrowUp":
					newPosition = [x, y + amount, z]; // Move up (positive Y)
					break;
				case "ArrowDown":
					newPosition = [x, y - amount, z]; // Move down (negative Y)
					break;
				case "ArrowLeft":
					newPosition = [x - amount, y, z]; // Move left (negative X)
					break;
				case "ArrowRight":
					newPosition = [x + amount, y, z]; // Move right (positive X)
					break;
				case "w":
				case "W":
					newPosition = [x, y, z - amount]; // Move forward (negative Z)
					break;
				case "s":
				case "S":
					newPosition = [x, y, z + amount]; // Move backward (positive Z)
					break;
			}

			setCurrentPosition(newPosition);
			onPositionChange?.(newPosition);
		}
	}, [keyboardMove, isSelected, onPositionChange]); // Removed currentPosition from dependencies

	// Handle transform gizmo interactions
	const handleGizmoPointerDown = (axis: string) => (e: any) => {
		e.stopPropagation();
		if (e.preventDefault) {
			e.preventDefault();
		}
		setIsDragging(axis);
		gl.domElement.style.cursor = "grabbing";
	};

	const handleGizmoPointerUp = (e: any) => {
		e.stopPropagation();
		if (e.preventDefault) {
			e.preventDefault();
		}
		setIsDragging(null);
		gl.domElement.style.cursor = "default";
	};

	const handleGizmoPointerMove = (e: any) => {
		if (!isDragging) return;

		e.stopPropagation();
		if (e.preventDefault) {
			e.preventDefault();
		}

		const sensitivity = 0.02;
		const scaleSensitivity = 0.01;
		const [x, y, z] = currentPosition;
		const [sx, sy, sz] = currentSize;

		let newPosition: [number, number, number] = [x, y, z];
		let newSize: [number, number, number] = [sx, sy, sz];

		switch (isDragging) {
			case "x":
				newPosition = [x + e.movementX * sensitivity, y, z];
				break;
			case "y":
				newPosition = [x, y - e.movementY * sensitivity, z];
				break;
			case "z":
				newPosition = [x, y, z + e.movementX * sensitivity];
				break;
			case "scale":
				const scaleChange = e.movementX * scaleSensitivity;
				newSize = [
					sx + scaleChange,
					sy + scaleChange,
					sz + scaleChange,
				];
				// Ensure minimum size to prevent models from disappearing
				newSize = newSize.map((s) => Math.max(0.1, s)) as [
					number,
					number,
					number
				];
				break;
		}

		if (isDragging === "scale") {
			setCurrentSize(newSize);
			onSizeChange?.(newSize);
		} else {
			setCurrentPosition(newPosition);
			onPositionChange?.(newPosition);
		}
	};

	// Create material based on brush texture
	const createBrushMaterial = (textureType: string) => {
		const materials = {
			rough: new THREE.MeshStandardMaterial({
				color: 0x8b4513,
				roughness: 0.9,
				metalness: 0.1,
				name: "rough-material",
			}),
			smooth: new THREE.MeshStandardMaterial({
				color: 0xc0c0c0,
				roughness: 0.1,
				metalness: 0.8,
				name: "smooth-material",
			}),
			metallic: new THREE.MeshStandardMaterial({
				color: 0x4a4a4a,
				roughness: 0.2,
				metalness: 1.0,
				name: "metallic-material",
			}),
			wood: new THREE.MeshStandardMaterial({
				color: 0xdeb887,
				roughness: 0.8,
				metalness: 0.0,
				name: "wood-material",
			}),
			stone: new THREE.MeshStandardMaterial({
				color: 0x696969,
				roughness: 0.9,
				metalness: 0.1,
				name: "stone-material",
			}),
		};
		return (
			materials[textureType as keyof typeof materials] || materials.rough
		);
	};

	// Handle tool interactions
	const handleToolInteraction = (e: any) => {
		if (!activeTool || !isSelected) return;

		e.stopPropagation();

		// Handle sculpting tools differently
		if (sculptingEnabled && e.point) {
			sculpting.sculptAtPosition(e.point);
			return;
		}

		switch (activeTool) {
			case "brush":
				if (toolSettings?.brush) {
					// Apply brush texture to the entire model
					const newMaterial = createBrushMaterial(
						toolSettings.brush.texture
					);

					scene.traverse((child: any) => {
						if (child.isMesh) {
							child.material = newMaterial;
						}
					});

					setAppliedMaterials(
						(prev) => new Map(prev.set("brush", newMaterial))
					);
					onToolApply?.("brush", {
						position: currentPosition,
						material: toolSettings.brush.texture,
					});
				}
				break;

			case "scissors":
				// For scissors, we'll create a simple split effect by duplicating and offsetting
				onToolApply?.("scissors", {
					position: currentPosition,
					point: e.point,
				});
				break;

			case "smudge":
				// Smudge effect - we'll simulate this with a slight scale variation
				if (scene) {
					const randomScaleVariation =
						1 +
						(Math.random() - 0.5) *
							0.1 *
							(toolSettings?.smudge?.intensity || 0.7);
					scene.scale.multiplyScalar(randomScaleVariation);
					onToolApply?.("smudge", {
						position: currentPosition,
						intensity: toolSettings?.smudge?.intensity,
					});
				}
				break;

			case "deform":
				// Start deform mode - this will be handled by click and drag
				onToolApply?.("deform-start", {
					position: currentPosition,
					point: e.point,
				});
				break;
		}
	};

	// Handle model click
	const handleClick = (e: any) => {
		e.stopPropagation();

		if (activeTool && isSelected) {
			handleToolInteraction(e);
		} else {
			onClick?.();
		}
	};

	if (error) {
		return (
			<group position={currentPosition}>
				<mesh>
					<boxGeometry args={[2, 2, 2]} />
					<meshBasicMaterial
						color="#ef4444"
						transparent
						opacity={0.7}
					/>
				</mesh>
				<Html position={[0, 2.5, 0]} center>
					<div className="bg-red-500/80 text-white text-xs px-2 py-1 rounded">
						Error Loading Model
					</div>
				</Html>
			</group>
		);
	}

	return (
		<group
			position={currentPosition}
			onPointerMove={handleGizmoPointerMove}
			onPointerUp={handleGizmoPointerUp}
		>
			<group
				ref={groupRef}
				onClick={handleClick}
				onPointerOver={() => setHovered(true)}
				onPointerOut={() => setHovered(false)}
				onPointerDown={
					sculptingEnabled ? sculpting.handlePointerDown : undefined
				}
				onPointerMove={
					sculptingEnabled ? sculpting.handlePointerMove : undefined
				}
			>
				<primitive object={scene} />

				{/* Selection highlight - Much larger to encompass the actual model */}
				{isSelected && (
					<mesh>
						<sphereGeometry
							args={[
								Math.max(
									8,
									Math.max(...currentSize) * baseScale * 1.5
								),
								32,
								32,
							]}
						/>
						<meshBasicMaterial
							color={sculptingEnabled ? "#8b5cf6" : "#3b82f6"}
							transparent
							opacity={sculptingEnabled ? 0.15 : 0.1}
							wireframe
						/>
					</mesh>
				)}

				{/* Hover effect */}
				{hovered && !isSelected && (
					<mesh>
						<sphereGeometry
							args={[
								Math.max(
									7,
									Math.max(...currentSize) * baseScale * 1.3
								),
								32,
								32,
							]}
						/>
						<meshBasicMaterial
							color="#6b7280"
							transparent
							opacity={0.05}
							wireframe
						/>
					</mesh>
				)}

				{/* Sculpting Mode Indicator */}
				{sculptingEnabled && isSelected && currentBrush && (
					<mesh
						position={[
							0,
							Math.max(...currentSize) * baseScale * 2,
							0,
						]}
					>
						<sphereGeometry args={[0.1, 8, 8]} />
						<meshBasicMaterial color="#8b5cf6" />
					</mesh>
				)}
			</group>

			{/* Inline Transform Gizmo - Only show when selected and not in sculpting mode */}
			{isSelected && !sculptingEnabled && (
				<group>
					{/* Calculate gizmo scale based on model size and base scale */}
					{(() => {
						const effectiveSize = Math.max(...currentSize) * baseScale;
						const gizmoScale = Math.max(1, effectiveSize * 0.3);
						
						return (
							<>
								{/* X Axis - Red */}
								<group>
									<mesh
										position={[gizmoScale * 0.8, 0, 0]}
										onPointerDown={handleGizmoPointerDown("x")}
										onPointerOver={() => setGizmoHovered("x")}
										onPointerOut={() => setGizmoHovered(null)}
									>
										<cylinderGeometry
											args={[0.05, 0.05, gizmoScale * 1.6, 8]}
										/>
										<meshBasicMaterial
											color={
												gizmoHovered === "x" ? "#ff6b6b" : "#ff4444"
											}
											transparent
											opacity={0.8}
										/>
									</mesh>
									<mesh
										position={[gizmoScale * 1.6, 0, 0]}
										onPointerDown={handleGizmoPointerDown("x")}
									>
										<coneGeometry args={[0.15, 0.4, 8]} />
										<meshBasicMaterial
											color={
												gizmoHovered === "x" ? "#ff6b6b" : "#ff4444"
											}
											transparent
											opacity={0.8}
										/>
									</mesh>
								</group>

								{/* Y Axis - Green */}
								<group>
									<mesh
										position={[0, gizmoScale * 0.8, 0]}
										onPointerDown={handleGizmoPointerDown("y")}
										onPointerOver={() => setGizmoHovered("y")}
										onPointerOut={() => setGizmoHovered(null)}
									>
										<cylinderGeometry
											args={[0.05, 0.05, gizmoScale * 1.6, 8]}
										/>
										<meshBasicMaterial
											color={
												gizmoHovered === "y" ? "#6bff6b" : "#44ff44"
											}
											transparent
											opacity={0.8}
										/>
									</mesh>
									<mesh
										position={[0, gizmoScale * 1.6, 0]}
										onPointerDown={handleGizmoPointerDown("y")}
									>
										<coneGeometry args={[0.15, 0.4, 8]} />
										<meshBasicMaterial
											color={
												gizmoHovered === "y" ? "#6bff6b" : "#44ff44"
											}
											transparent
											opacity={0.8}
										/>
									</mesh>
								</group>

								{/* Z Axis - Blue */}
								<group>
									<mesh
										position={[0, 0, gizmoScale * 0.8]}
										rotation={[Math.PI / 2, 0, 0]}
										onPointerDown={handleGizmoPointerDown("z")}
										onPointerOver={() => setGizmoHovered("z")}
										onPointerOut={() => setGizmoHovered(null)}
									>
										<cylinderGeometry
											args={[0.05, 0.05, gizmoScale * 1.6, 8]}
										/>
										<meshBasicMaterial
											color={
												gizmoHovered === "z" ? "#6b6bff" : "#4444ff"
											}
											transparent
											opacity={0.8}
										/>
									</mesh>
									<mesh
										position={[0, 0, gizmoScale * 1.6]}
										rotation={[Math.PI / 2, 0, 0]}
										onPointerDown={handleGizmoPointerDown("z")}
									>
										<coneGeometry args={[0.15, 0.4, 8]} />
										<meshBasicMaterial
											color={
												gizmoHovered === "z" ? "#6b6bff" : "#4444ff"
											}
											transparent
											opacity={0.8}
										/>
									</mesh>
								</group>

								{/* Center sphere */}
								<mesh onPointerDown={handleGizmoPointerDown("center")}>
									<sphereGeometry args={[0.2, 16, 16]} />
									<meshBasicMaterial
										color={
											gizmoHovered === "center"
												? "#ffffff"
												: "#cccccc"
										}
										transparent
										opacity={0.6}
									/>
								</mesh>

								{/* Resize handles - Corner cubes */}
								<mesh
									position={[
										gizmoScale * 0.5,
										gizmoScale * 0.5,
										gizmoScale * 0.5,
									]}
									onPointerDown={handleGizmoPointerDown("scale")}
									onPointerOver={() => setGizmoHovered("scale")}
									onPointerOut={() => setGizmoHovered(null)}
								>
									<boxGeometry args={[0.2, 0.2, 0.2]} />
									<meshBasicMaterial
										color={
											gizmoHovered === "scale" ? "#ffff00" : "#ffaa00"
										}
										transparent
										opacity={0.8}
									/>
								</mesh>

								{/* Axis labels */}
								<Html position={[gizmoScale * 1.8, 0, 0]} center>
									<div className="text-red-400 text-xs font-bold bg-black/50 px-1 rounded">
										X
									</div>
								</Html>
								<Html position={[0, gizmoScale * 1.8, 0]} center>
									<div className="text-green-400 text-xs font-bold bg-black/50 px-1 rounded">
										Y
									</div>
								</Html>
								<Html position={[0, 0, gizmoScale * 1.8]} center>
									<div className="text-blue-400 text-xs font-bold bg-black/50 px-1 rounded">
										Z
									</div>
								</Html>
							</>
						);
					})()}
				</group>
			)}
		</group>
	);
}

export const Model3D = memo(Model3DComponent);
