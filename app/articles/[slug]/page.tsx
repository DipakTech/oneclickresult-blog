import { Metadata } from "next";
import ArticleContent from "./ArticleContent";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import JsonLd from "@/components/JsonLd";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://blog.oneclickresult.com";
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

const client = convexUrl ? new ConvexHttpClient(convexUrl) : null;

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate metadata for SEO (Server Component)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Fetch article data using Convex HTTP API
  let article = null;
  if (client) {
    try {
      article = await client.query(api.documents.getArticleBySlug, { slug });
    } catch (error) {
      console.error("Error fetching article metadata:", error);
    }
  }

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  const title = article.metaTitle || article.title;
  const description = article.metaDescription || "Read our latest article.";

  // Construct dynamic OG image URL
  const ogImageUrl = new URL(`${baseUrl}/api/og`);
  ogImageUrl.searchParams.set("title", title);
  ogImageUrl.searchParams.set("description", description);
  const ogImageString = ogImageUrl.toString();

  return {
    title,
    description,
    keywords: article.metaKeywords || ["blog", "article"],
    authors: [{ name: article.authorName || "Blog Author" }],
    openGraph: {
      title,
      description,
      url: `${baseUrl}/articles/${slug}`,
      siteName: "My Blog",
      type: "article",
      images: [
        {
          url: ogImageString,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageString],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: article.canonicalUrl || `${baseUrl}/articles/${slug}`,
    },
  };
}

// Server Component (page)

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  let article = null;
  if (client) {
    try {
      article = await client.query(api.documents.getArticleBySlug, { slug });
    } catch (error) {
      console.error("Error fetching article for JSON-LD:", error);
    }
  }

  const jsonLd = article
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: article.metaTitle || article.title,
        description: article.metaDescription,
        image: article.coverImageUrl ? [article.coverImageUrl] : [],
        datePublished: article._creationTime
          ? new Date(article._creationTime).toISOString()
          : undefined,
        dateModified: article.lastModified
          ? new Date(article.lastModified).toISOString()
          : undefined,
        author: [
          {
            "@type": "Person",
            name: article.authorName || "Blog Author",
            url: "https://blog.oneclickresult.com",
          },
        ],
      }
    : null;

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <ArticleContent slug={slug} />
    </>
  );
}
