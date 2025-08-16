import { ThemeToggle } from "@/components/ui/theme-toggle";
import Image from "next/image";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="absolute top-4 right-4">
				<ThemeToggle />
			</div>
			<div className="bg-muted relative hidden lg:block">
				<img
					src="/placeholder.svg"
					alt="Image"
					className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
				/>
			</div>
			{children}
		</div>
	);
}
