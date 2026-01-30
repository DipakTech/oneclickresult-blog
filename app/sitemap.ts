import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  // Fetch published articles from Convex
  // Note: We need to use the Convex HTTP API here since we can't use hooks in route handlers
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
  
  let articles: Array<{ slug: string; _creationTime: number; _id: string }> = []
  
  if (convexUrl) {
    try {
      const response = await fetch(`${convexUrl}/api/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: 'documents:getPublishedDocuments',
          args: {},
        }),
      })
      
      if (response.ok) {
        articles = await response.json()
      }
    } catch (error) {
      console.error('Failed to fetch articles for sitemap:', error)
    }
  }

  return [
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
    ...articles.map((article) => ({
      url: `${baseUrl}/articles/${article.slug || article._id}`,
      lastModified: new Date(article._creationTime),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
