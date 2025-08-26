"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ResetPasswordFormContent() {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [resetComplete, setResetComplete] = React.useState(false);
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setResetComplete(true);
      toast.success("Password updated successfully!");
      
      // Redirect to sign in after a brief delay
      setTimeout(() => {
        router.push('/sign-in');
      }, 2000);
    } catch (error: any) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (resetComplete) {
    return (
      <div className="mx-auto w-full max-w-md rounded-none p-4 md:rounded-2xl md:p-8" style={{backgroundColor: '#080c0c'}}>
        <div className="flex flex-col items-center mb-4">
          <img 
            src="/logo.png" 
            alt="AeroPlanar Logo" 
            className="h-32 w-auto"
          />
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
            Password Reset Complete!
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Your password has been updated successfully. You will be redirected to the sign-in page shortly.
          </p>
          <div className="pt-4">
            <Link 
              href="/sign-in"
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Go to Sign In Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-none p-4 md:rounded-2xl md:p-8" style={{backgroundColor: '#080c0c'}}>
      <div className="flex flex-col items-center mb-4">
        <img 
          src="/logo.png" 
          alt="AeroPlanar Logo" 
          className="h-32 w-auto"
        />
      </div>
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Reset Your Password
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Enter your new password below. Make sure it's at least 6 characters long.
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-white mb-2">New Password</label>
          <input 
            id="password" 
            placeholder="Enter your new password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            required
            minLength={6}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">Confirm Password</label>
          <input 
            id="confirmPassword" 
            placeholder="Confirm your new password" 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            required
            minLength={6}
          />
        </div>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Updating Password...' : 'Update Password →'}
          <BottomGradient />
        </button>
      </form>
      
      <div className="text-center text-sm">
        Remember your password?{" "}
        <Link href="/sign-in" className="underline underline-offset-4 hover:text-primary">
          Sign in here
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordFormContent />
    </Suspense>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};