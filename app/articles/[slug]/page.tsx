import { Metadata } from 'next';
import ArticleContent from './ArticleContent';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

type Props = {
    params: Promise<{ slug: string }>;
};

// Generate metadata for SEO (Server Component)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    
    // For now, we'll use default metadata
    // In production, you'd fetch the article data here using Convex HTTP API
    const title = `Article | My Blog`;
    const description = 'Read our latest article on technology and development.';
    
    return {
        title,
        description,
        keywords: ['blog', 'article', 'developer', 'technology'],
        authors: [{ name: 'Blog Author' }],
        openGraph: {
            title,
            description,
            url: `${baseUrl}/articles/${slug}`,
            siteName: 'My Blog',
            type: 'article',
            images: [
                {
                    url: `${baseUrl}/og-default.png`,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [`${baseUrl}/og-default.png`],
        },
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: `${baseUrl}/articles/${slug}`,
        },
    };
}

// Server Component (page)
export default async function ArticlePage({ params }: Props) {
    const { slug } = await params;
    
    return <ArticleContent slug={slug} />;
}
