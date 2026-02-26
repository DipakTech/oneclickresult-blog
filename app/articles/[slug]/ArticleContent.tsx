"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import ArticleHeader from "../../../components/ArticleHeader";
import TableOfContents from "../../../components/TableOfContents";
import BlogCard from "../../../components/BlogCard"; // Reuse for related
import dynamic from "next/dynamic";
import { ArrowLeft, User, Share2, Bookmark } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";

import ThemeToggle from "../../../components/ThemeToggle";

const Editor = dynamic(() => import("../../../components/Editor"), { ssr: false });

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

function extractTextFromContent(content: string | undefined): string {
    if (!content) return '';
    try {
        const json = JSON.parse(content);
        let text = '';
        function traverse(node: any) {
            if (node.type === 'text') text += node.text + ' ';
            if (node.content && Array.isArray(node.content)) node.content.forEach(traverse);
        }
        traverse(json);
        return text.trim();
    } catch {
        return '';
    }
}


import { processContentForTOC } from "../../../lib/toc";


export default function ArticleContent({ slug }: { slug: string }) {
    const document = useQuery(api.documents.getArticleBySlug, { slug });
    const allDocs = useQuery(api.documents.getPublishedDocuments, {}) ?? [];
    const incrementViewCount = useMutation(api.documents.incrementViewCount);
    const contentRef = useRef<HTMLDivElement>(null);

    // Track view count
    useEffect(() => {
        if (document && document._id) {
            incrementViewCount({ id: document._id }).catch((e) => console.error(e));
        }
    }, [document?._id]);

    // Inject copy buttons into code blocks
    const addCopyButton = useCallback((pre: HTMLPreElement) => {
        if (pre.querySelector('.code-copy-btn')) return;

        pre.style.position = 'relative';

        const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
        const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

        const btn = window.document.createElement('button');
        btn.className = 'code-copy-btn';
        btn.setAttribute('aria-label', 'Copy code');
        btn.setAttribute('title', 'Copy code');
        btn.innerHTML = copyIcon;

        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const code = pre.querySelector('code');
            const text = code?.textContent || pre.textContent || '';
            try {
                await navigator.clipboard.writeText(text);
                btn.innerHTML = checkIcon;
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.innerHTML = copyIcon;
                    btn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });

        pre.appendChild(btn);
    }, []);

    useEffect(() => {
        const container = contentRef.current;
        if (!container) return;

        // Process any existing pre blocks
        const processExistingBlocks = () => {
            container.querySelectorAll('pre').forEach((pre) => {
                addCopyButton(pre as HTMLPreElement);
            });
        };

        // Initial scan
        processExistingBlocks();

        // Watch for dynamically added pre blocks (TipTap renders async)
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                // Check added nodes
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof HTMLElement) {
                        if (node.tagName === 'PRE') {
                            addCopyButton(node as HTMLPreElement);
                        }
                        // Also check children of added nodes
                        node.querySelectorAll('pre').forEach((pre) => {
                            addCopyButton(pre as HTMLPreElement);
                        });
                    }
                });
            }
        });

        observer.observe(container, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, [document?.content, addCopyButton]);

    // Process content for TOC (memoized)
    const { processedContent, tocItems } = useMemo(() => {
        if (!document?.content) return { processedContent: undefined, tocItems: [] };
        const result = processContentForTOC(document.content);
        return {
            processedContent: result.processedContent,
            tocItems: result.toc 
        };
    }, [document?.content]);


    const handleShare = async () => {
        if (!document) return;
        
        const shareData = {
            title: document.title,
            text: document.metaDescription || `Check out this article: ${document.title}`,
            url: window.location.href, // Get the current active URL
        };

        try {
            if (navigator.share && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                // Fallback to copying to clipboard
                await navigator.clipboard.writeText(window.location.href);
                alert("URL copied to clipboard!");
            }
        } catch (err) {
            console.error("Error sharing:", err);
            // Ignore AbortError when user closes share sheet
        }
    };

    if (document === undefined) {
        return <div className="h-screen bg-bg" />; 
    }

    if (document === null) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-bg gap-4">
                <div className="text-2xl text-text-secondary font-medium">Article not found</div>
                <Link href="/" className="text-primary hover:underline">Back to Home</Link>
            </div>
        );
    }

    const publicationDate = new Date(document._creationTime);
    const formattedDate = publicationDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const relatedDocs = allDocs
        .filter(d => d._id !== document._id)
        .slice(0, 3);

    // ... imports (removed)

    return (

        <article className="min-h-screen bg-bg pb-20 font-sans antialiased text-text-primary">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-surface/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 transition-all duration-300">

                <Link 
                    href="/"
                    className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Articles
                </Link>
                <div className="flex items-center gap-4">
                     <ThemeToggle />
                     <button 
                         onClick={handleShare}
                         title="Share Article"
                         className="p-2 text-text-tertiary hover:text-text-primary hover:bg-black/5 rounded-full transition-all"
                     >
                        <Share2 className="w-4 h-4" />
                     </button>
                </div>
            </nav>


            {/* Header */}
            <ArticleHeader 
                title={document.title}
                coverImageUrl={document.coverImageUrl}
                authorName={document.authorName}
                authorImageUrl={document.authorImageUrl}
                publishedDate={formattedDate}
                readTime={document.readingTime}
                viewCount={document.viewCount}
                documentId={document._id}
            />

            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12 px-4 md:px-8">
                {/* Left: Empty or Social (Desktop) */}
                <div className="hidden lg:block lg:col-span-2 relative">
                    {/* Floating Socials could go here */}
                </div>

                {/* Center: Content */}
                <div ref={contentRef} className="col-span-1 lg:col-span-8 max-w-[720px] mx-auto w-full">
                    <div className="
                        prose prose-lg max-w-none dark:prose-invert
                        text-[20px] leading-[1.8] text-text-primary
                        prose-headings:font-bold prose-headings:text-text-primary prose-headings:tracking-tight
                        prose-h2:text-[32px] prose-h2:mt-12 prose-h2:mb-6 prose-h2:leading-[1.3]
                        prose-h3:text-[24px] prose-h3:mt-8 prose-h3:mb-4
                        prose-p:mb-8 prose-p:leading-[1.8] prose-p:text-text-primary
                        prose-a:text-primary prose-a:no-underline prose-a:border-b prose-a:border-primary/30 hover:prose-a:border-primary prose-a:transition-all
                        prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-bg-secondary/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-text-secondary
                        prose-img:rounded-xl prose-img:shadow-lg prose-img:my-10
                        prose-code:text-primary prose-code:bg-primary/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[0.9em] prose-code:font-medium
                        prose-pre:bg-[#1e1e1e] prose-pre:text-gray-200 prose-pre:p-6 prose-pre:rounded-xl prose-pre:shadow-sm prose-pre:my-8
                        prose-li:my-2 prose-li:text-text-primary

                        marker:text-primary

                    ">
                        <Editor
                            documentId={document._id}
                            initialContent={processedContent || document.content}
                            editable={false}
                            hideToolbar={true}
                        />
                    </div>

                    {/* Divider */}
                    <hr className="my-16 border-border" />

                    {/* Footer: Author & Tags */}
                    <div className="bg-surface rounded-2xl border border-border p-8 mb-16">
                        <div className="flex items-center gap-4 mb-4">
                             {document.authorImageUrl ? (
                                <img src={document.authorImageUrl} alt={document.authorName} className="w-16 h-16 rounded-full object-cover" />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <User className="w-8 h-8" />
                                </div>
                            )}
                            <div>
                                <h3 className="text-lg font-bold text-text-primary mb-1">Written by {document.authorName || "Blog Author"}</h3>
                                <p className="text-text-secondary text-sm">Tech enthusiast and software engineer. Sharing insights on web development and design.</p>
                            </div>
                        </div>
                    </div>

                    {/* Related Articles */}
                    {relatedDocs.length > 0 && (
                        <div>
                            <h3 className="text-2xl font-bold text-text-primary mb-8">Read Next</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {relatedDocs.map(doc => (
                                    <BlogCard key={doc._id} document={doc} />
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="mt-16 text-center">
                        <Link href="/" className="inline-flex items-center justify-center px-8 py-3 bg-surface border border-border rounded-full font-medium text-text-primary hover:bg-bg-secondary transition-all">
                            Back to Articles
                        </Link>
                    </div>
                </div>

                {/* Right: TOC */}
                <div className="hidden lg:block lg:col-span-2 relative">
                    <TableOfContents items={tocItems} />
                </div>
            </div>
        </article>
    );
}


