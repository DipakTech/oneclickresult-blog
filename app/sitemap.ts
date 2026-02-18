import { MetadataRoute } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://blog.oneclickresult.com";

  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (convexUrl) {
      const client = new ConvexHttpClient(convexUrl);
      // Using "any" cast because the generated types might not be perfectly aligned with the client-side usage here,
      // but getPublishedDocuments is a valid query.
      const documents = await client.query(
        api.documents.getPublishedDocuments,
        {},
      );

      const articleRoutes = documents.map((doc: any) => ({
        url: `${baseUrl}/articles/${doc.slug}`,
        lastModified: new Date(doc.lastModified || doc._creationTime),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

      return [...routes, ...articleRoutes];
    }
  } catch (error) {
    console.error("Failed to fetch articles for sitemap:", error);
  }

  return routes;
}
