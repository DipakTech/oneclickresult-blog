import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Try to fetch articles, but don't fail if we can't
  // In a production setup, you'd use Convex HTTP API here
  // For now, we'll just return the static routes
  try {
    // This would be replaced with actual Convex HTTP API call in production
    // For build time, we'll skip dynamic articles to avoid build errors
    console.log('Sitemap: Skipping dynamic articles during build');
  } catch (error) {
    console.error('Failed to fetch articles for sitemap:', error);
  }

  return routes;
}
