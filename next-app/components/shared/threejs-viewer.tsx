"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function TreeModel() {
	const { scene } = useGLTF("/treeglb");
	const meshRef = useRef<THREE.Group>(null);

	useFrame((state) => {
		if (meshRef.current) {
			meshRef.current.rotation.y += 0.005;
		}
	});

	return (
		<group ref={meshRef}>
			<primitive object={scene} scale={2} />
		</group>
	);
}

function ThreeJSViewer() {
	return (
		<div className="w-full h-[400px] rounded-lg overflow-hidden">
			<Canvas
				camera={{ position: [0, 0, 5], fov: 45 }}
				className="bg-transparent"
			>
				<ambientLight intensity={0.6} />
				<directionalLight position={[10, 10, 5]} intensity={1} />
				<Suspense fallback={null}>
					<TreeModel />
					<OrbitControls
						enablePan={false}
						enableZoom={true}
						minDistance={3}
						maxDistance={8}
						autoRotate={false}
					/>
				</Suspense>
			</Canvas>
		</div>
	);
}

// Preload the model
useGLTF.preload("/treeglb");

export default ThreeJSViewer;