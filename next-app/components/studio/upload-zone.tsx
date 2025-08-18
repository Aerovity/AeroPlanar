"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpotlightButton } from "@/components/ui/spotlight-button";
import { toast } from "@/hooks/use-toast";

interface UploadZoneProps {
	onUpload: (file: File) => Promise<void>;
	isUploading?: boolean;
	accept3DModels?: boolean;
}

export function UploadZone({
	onUpload,
	isUploading,
	accept3DModels = false,
}: UploadZoneProps) {
	const [preview, setPreview] = useState<string | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			const file = acceptedFiles[0];
			if (file) {
				setSelectedFile(file);

				// Create preview
				const reader = new FileReader();
				reader.onload = () => setPreview(reader.result as string);
				reader.readAsDataURL(file);

				try {
					await onUpload(file);
					toast({
						title: "Image uploaded successfully",
						description:
							"Configure your settings and click 'Generate 3D Model' to start conversion.",
					});
				} catch (error) {
					toast({
						title: "Upload failed",
						description: "Please try again with a different image.",
						variant: "destructive",
					});
				}
			}
		},
		[onUpload]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: accept3DModels
			? {
					"image/*": [".png", ".jpg", ".jpeg", ".webp"],
					"model/gltf-binary": [".glb"],
					"model/gltf+json": [".gltf"],
					"application/octet-stream": [
						".obj",
						".fbx",
						".dae",
						".3ds",
						".ply",
						".stl",
					],
			  }
			: {
					"image/*": [".png", ".jpg", ".jpeg", ".webp"],
			  },
		maxFiles: 1,
		disabled: isUploading,
	});

	return (
		<div className="space-y-4">
			<div
				{...getRootProps()}
				className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300
          ${
				isDragActive
					? "border-white bg-white/10"
					: "border-gray-700 hover:border-white [#080c0c]/20"
			}
          ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
			>
				<input {...getInputProps()} />

				{preview ? (
					<div className="space-y-4">
						<img
							src={preview || "/placeholder.svg"}
							alt="Preview"
							className="max-w-full max-h-48 mx-auto rounded-lg"
						/>
						<p className="text-sm text-gray-400">
							{isUploading
								? "Converting to 3D..."
								: "Click to upload a different file"}
						</p>
						<p className="text-xs text-green-400 font-medium">
							✓{" "}
							{selectedFile &&
							(selectedFile.name.toLowerCase().includes(".glb") ||
								selectedFile.name
									.toLowerCase()
									.includes(".gltf") ||
								selectedFile.name
									.toLowerCase()
									.includes(".obj"))
								? "3D Model ready for viewing"
								: "Image ready for generation"}
						</p>
					</div>
				) : (
					<div className="space-y-4">
						{isUploading ? (
							<Loader2 className="w-12 h-12 mx-auto text-white animate-spin" />
						) : (
							<div className="w-12 h-12 mx-auto text-gray-400 [#080c0c]/15 rounded-full flex items-center justify-center">
								{isDragActive ? (
									<Upload className="w-6 h-6 text-white" />
								) : (
									<ImageIcon className="w-6 h-6 text-white" />
								)}
							</div>
						)}

						<div>
							<p className="text-lg font-medium text-white mb-2">
								{isDragActive
									? "Drop your file here"
									: accept3DModels
									? "Upload an image or 3D model"
									: "Upload an image"}
							</p>
							<p className="text-sm text-gray-400">
								Drag and drop or click to select •{" "}
								{accept3DModels
									? "PNG, JPG, WEBP, GLB, GLTF, OBJ, FBX, DAE, 3DS, PLY, STL"
									: "PNG, JPG, WEBP"}{" "}
								up to 10MB
							</p>
						</div>
					</div>
				)}
			</div>

			{!preview && !isUploading && (
				<div className="flex justify-center">
					<SpotlightButton
						onClick={() =>
							(
								document.querySelector(
									'input[type="file"]'
								) as HTMLInputElement
							)?.click()
						}
					>
						Choose Image
					</SpotlightButton>
				</div>
			)}
		</div>
	);
}
