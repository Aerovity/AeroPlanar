"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export function StorageSetupCheck() {
  const [status, setStatus] = useState<{
    table: boolean;
    bucket: boolean;
    policies: boolean;
    loading: boolean;
  }>({
    table: false,
    bucket: false,
    policies: false,
    loading: true,
  });

  const supabase = createClient();

  const checkSetup = async () => {
    setStatus(prev => ({ ...prev, loading: true }));

    try {
      // Check if shared_mockups table exists
      const { data: tableData, error: tableError } = await supabase
        .from('shared_mockups')
        .select('id')
        .limit(1);

      // Check if storage bucket exists
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      const sharedMockupsBucket = buckets?.find(b => b.id === 'shared-mockups');

      // Try to upload a test file to check policies
      let policiesWork = false;
      if (sharedMockupsBucket) {
        try {
          const testFile = new Blob(['test'], { type: 'text/plain' });
          const { error: uploadError } = await supabase.storage
            .from('shared-mockups')
            .upload('test/test.txt', testFile);
          
          if (!uploadError) {
            // Clean up test file
            await supabase.storage.from('shared-mockups').remove(['test/test.txt']);
            policiesWork = true;
          }
        } catch (e) {
          policiesWork = false;
        }
      }

      setStatus({
        table: !tableError,
        bucket: !!sharedMockupsBucket,
        policies: policiesWork,
        loading: false,
      });

    } catch (error) {
      console.error('Setup check failed:', error);
      setStatus({
        table: false,
        bucket: false,
        policies: false,
        loading: false,
      });
    }
  };

  useEffect(() => {
    checkSetup();
  }, []);

  const allGood = status.table && status.bucket && status.policies;

  if (status.loading) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Checking mockup sharing setup...
        </AlertDescription>
      </Alert>
    );
  }

  if (allGood) {
    return (
      <Alert className="border-green-600 bg-green-50 dark:bg-green-900/20">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          ✅ Mockup sharing is fully configured and ready to use!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      <Alert className="border-red-600 bg-red-50 dark:bg-red-900/20">
        <XCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 dark:text-red-200">
          Mockup sharing setup incomplete. Please check the following:
        </AlertDescription>
      </Alert>

      <div className="space-y-2 text-sm">
        <div className={`flex items-center gap-2 ${status.table ? 'text-green-600' : 'text-red-600'}`}>
          {status.table ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          Database table: {status.table ? 'Created' : 'Missing'}
        </div>

        <div className={`flex items-center gap-2 ${status.bucket ? 'text-green-600' : 'text-red-600'}`}>
          {status.bucket ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          Storage bucket: {status.bucket ? 'Created' : 'Missing'}
        </div>

        <div className={`flex items-center gap-2 ${status.policies ? 'text-green-600' : 'text-red-600'}`}>
          {status.policies ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          Storage policies: {status.policies ? 'Working' : 'Not configured'}
        </div>
      </div>

      <div className="bg-gray-900/50 rounded-lg p-3 text-xs text-gray-300">
        <p className="font-medium mb-2">Setup Instructions:</p>
        
        {!status.table && (
          <div className="mb-3">
            <p className="text-yellow-400 mb-1">1. Create the database table:</p>
            <pre className="bg-black/30 p-2 rounded text-xs overflow-x-auto">
{`CREATE TABLE public.shared_mockups (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_size integer NOT NULL CHECK (file_size <= 26214400),
  preview_image_url text,
  is_public boolean DEFAULT true,
  view_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT shared_mockups_pkey PRIMARY KEY (id),
  CONSTRAINT shared_mockups_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);`}
            </pre>
          </div>
        )}

        {!status.bucket && (
          <div className="mb-3">
            <p className="text-yellow-400 mb-1">2. Create the storage bucket:</p>
            <pre className="bg-black/30 p-2 rounded text-xs overflow-x-auto">
{`INSERT INTO storage.buckets (id, name, public) 
VALUES ('shared-mockups', 'shared-mockups', true);`}
            </pre>
          </div>
        )}

        {!status.policies && (
          <div className="mb-3">
            <p className="text-yellow-400 mb-1">3. Create storage policies:</p>
            <pre className="bg-black/30 p-2 rounded text-xs overflow-x-auto">
{`CREATE POLICY "Allow authenticated uploads" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'shared-mockups' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Allow public downloads" ON storage.objects
  FOR SELECT USING (bucket_id = 'shared-mockups');

CREATE POLICY "Allow users to delete own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'shared-mockups' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );`}
            </pre>
          </div>
        )}
      </div>

      <Button onClick={checkSetup} variant="outline" size="sm">
        Recheck Setup
      </Button>
    </div>
  );
}