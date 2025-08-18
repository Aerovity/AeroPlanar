export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="relative min-h-svh">
			<img
				src="/sign.jpeg"
				alt="Sign up background"
				className="absolute inset-0 h-full w-full object-cover"
			/>
			<div className="relative z-10 flex items-center justify-center min-h-svh">
				{children}
			</div>
		</div>
	);
}
