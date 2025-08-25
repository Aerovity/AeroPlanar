"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Share, Upload, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ShareMockupDialogProps {
  children: React.ReactNode;
  sceneData?: any; // The 3D scene data to be exported
}

export function ShareMockupDialog({ children, sceneData }: ShareMockupDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [glbFile, setGlbFile] = useState<File | null>(null);
  const supabase = createClient();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (25MB limit)
    if (file.size > 25 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 25MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.name.toLowerCase().endsWith('.glb') && !file.name.toLowerCase().endsWith('.gltf')) {
      toast({
        title: "Invalid file type",
        description: "Please select a .glb or .gltf file",
        variant: "destructive",
      });
      return;
    }

    setGlbFile(file);
  };

  const handleShare = async () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your mockup",
        variant: "destructive",
      });
      return;
    }

    if (!glbFile) {
      toast({
        title: "File required",
        description: "Please select a .glb file to share",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("Please sign in to share mockups");
      }

      // Check if user already has a shared mockup (one per user limit)
      const { data: existingMockup } = await supabase
        .from('shared_mockups')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingMockup) {
        toast({
          title: "Limit reached",
          description: "You can only share one mockup at a time. Please delete your existing mockup first.",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      setUploadProgress(30);

      // Upload GLB file to Supabase Storage
      const fileName = `${user.id}/${Date.now()}_${glbFile.name}`;
      
      console.log('Uploading file:', fileName);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('shared-mockups')
        .upload(fileName, glbFile);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('Upload successful:', uploadData);

      setUploadProgress(70);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('shared-mockups')
        .getPublicUrl(fileName);

      setUploadProgress(90);

      // Save mockup data to database
      console.log('Saving to database...');
      
      const { error: dbError } = await supabase
        .from('shared_mockups')
        .insert({
          user_id: user.id,
          name: name.trim(),
          description: description.trim() || null,
          file_url: publicUrl,
          file_size: glbFile.size,
          is_public: true,
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error(`Database error: ${dbError.message}`);
      }

      console.log('Database save successful');

      setUploadProgress(100);

      toast({
        title: "Mockup shared successfully!",
        description: "Your mockup is now available in the gallery",
      });

      // Reset form
      setName("");
      setDescription("");
      setGlbFile(null);
      setOpen(false);

    } catch (error: any) {
      console.error('Error sharing mockup:', error);
      toast({
        title: "Failed to share mockup",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-[#0a0e0f] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Share className="w-5 h-5" />
            Share Your Mockup
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">
              Mockup Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for your mockup..."
              className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
              disabled={isUploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">
              Description (optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your mockup..."
              className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 resize-none"
              rows={3}
              disabled={isUploading}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">
              GLB File * (Max 25MB)
            </Label>
            <p className="text-xs text-gray-500">
              💡 Tip: Use the download button to export your scene as GLB first, then select it here to share.
            </p>
            <div className="relative">
              <input
                type="file"
                accept=".glb,.gltf"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              <div className="flex items-center justify-center w-full h-20 border-2 border-dashed border-gray-700 rounded-lg bg-gray-900/30 hover:bg-gray-900/50 transition-colors">
                <div className="text-center">
                  {glbFile ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">{glbFile.name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Select GLB file</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {glbFile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setGlbFile(null)}
                className="text-gray-400 hover:text-red-400 h-auto p-1"
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
                Remove file
              </Button>
            )}
          </div>

          {isUploading && (
            <div className="space-y-2">
              <Label className="text-gray-300">Upload Progress</Label>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isUploading}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleShare}
              disabled={isUploading || !name.trim() || !glbFile}
              className="bg-[#c3b383] hover:bg-[#b5a374] text-black"
            >
              {isUploading ? "Sharing..." : "Share Mockup"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}