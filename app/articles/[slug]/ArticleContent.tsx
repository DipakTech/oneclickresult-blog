"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import CoverImage from "../../../components/CoverImage";
import dynamic from "next/dynamic";
import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

const Editor = dynamic(() => import("../../../components/Editor"), { ssr: false });

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Helper to extract text content from Tiptap JSON
function extractTextFromContent(content: string | undefined): string {
    if (!content) return '';
    try {
        const json = JSON.parse(content);
        let text = '';
        
        function traverse(node: any) {
            if (node.type === 'text') {
                text += node.text + ' ';
            }
            if (node.content && Array.isArray(node.content)) {
                node.content.forEach(traverse);
            }
        }
        
        traverse(json);
        return text.trim();
    } catch {
        return '';
    }
}

export default function ArticleContent({ slug }: { slug: string }) {
    const document = useQuery(api.documents.getArticleBySlug, { slug });

    if (document === undefined) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (document === null) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-white gap-4">
                <div className="text-2xl text-gray-500">Article not found</div>
                <Link href="/articles" className="text-blue-600 hover:underline">
                    Back to Articles
                </Link>
            </div>
        );
    }

    const publicationDate = new Date(document._creationTime);
    const formattedDate = publicationDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Extract description from content
    const textContent = extractTextFromContent(document.content);
    const description = textContent.substring(0, 160) + (textContent.length > 160 ? '...' : '');

    // JSON-LD Structured Data
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: document.title,
        description: description,
        image: document.coverImageUrl || `${baseUrl}/og-default.png`,
        datePublished: publicationDate.toISOString(),
        dateModified: publicationDate.toISOString(),
        author: {
            '@type': 'Person',
            name: 'Blog Author',
        },
        publisher: {
            '@type': 'Organization',
            name: 'My Blog',
            logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/logo.png`,
            },
        },
        url: `${baseUrl}/articles/${slug}`,
    };

    return (
        <>
            {/* JSON-LD Structured Data - Valid in body */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

        <article className="min-h-screen bg-white pb-20">
             {/* Navigation Overlay */}
            <Link 
                href="/articles"
                className="fixed top-6 left-6 z-50 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:shadow-md transition-all text-gray-700 hover:text-black"
                title="Back to Articles"
            >
                <ArrowLeft className="w-5 h-5" />
            </Link>

            {/* Cover Image - Full width banner */}
            <CoverImage
                url={document.coverImageUrl}
                documentId={document._id}
                editable={false}
            >
                <h1 className="text-5xl font-bold text-white leading-tight drop-shadow-md">
                    {document.title}
                </h1>
            </CoverImage>

            <div className="max-w-5xl mx-auto px-6 mt-12">
                {/* Header Section */}
                <header className="mb-16">
                    <div className="flex items-center gap-3 text-gray-500 text-sm ">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={publicationDate.toISOString()} className="font-medium">
                            {formattedDate}
                        </time>
                        <span className="text-gray-300">•</span>
                        <span>5 min read</span>
                    </div>
                </header>

                {/* Content Section */}
                <article className="
                    prose prose-xl max-w-none
                    prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
                    prose-h1:text-4xl prose-h1:mb-4 prose-h1:mt-10 prose-h1:leading-tight
                    prose-h2:text-3xl prose-h2:mb-3 prose-h2:mt-10 prose-h2:leading-snug
                    prose-h3:text-2xl prose-h3:mb-2 prose-h3:mt-8 prose-h3:leading-snug
                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
                    prose-ul:my-6 prose-ul:space-y-2
                    prose-ol:my-6 prose-ol:space-y-2
                    prose-li:text-gray-700 prose-li:leading-relaxed prose-li:text-lg
                    prose-li:marker:text-blue-600
                    prose-strong:text-gray-900 prose-strong:font-semibold
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                    prose-code:text-pink-600 prose-code:bg-gray-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                    prose-pre:bg-gray-900 prose-pre:text-gray-100
                    prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:italic prose-blockquote:text-gray-600
                    prose-img:rounded-xl prose-img:shadow-2xl
                ">
                     <Editor
                        documentId={document._id}
                        initialContent={document.content}
                        editable={false}
                    />
                </article>
            </div>
        </article>
        </>
    );
}
