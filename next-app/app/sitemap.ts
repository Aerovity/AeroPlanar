import type { MetadataRoute } from "next";

export const baseUrl = "https://aeroplanar.io";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const routes = ["", "/(landing)"].map((route) => ({
		url: `${baseUrl}${route}`,
		lastModified: new Date().toISOString().split("T")[0],
	}));

	return [...routes];
}
