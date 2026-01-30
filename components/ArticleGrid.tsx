"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { getRandomGradient } from "../lib/gradients";
import Link from "next/link";
import { Calendar } from "lucide-react";

export default function ArticleGrid() {
    const documents = useQuery(api.documents.getPublishedDocuments);

    if (documents === undefined) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (documents.length === 0) {
        return (
            <div className="text-center py-20">
                <h3 className="text-xl text-gray-500">No articles published yet.</h3>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {documents.map((doc) => {
                const gradient = getRandomGradient(doc._id);
                // Simple read time estimate (200 words per minute)
                const wordCount = doc.content ? JSON.parse(doc.content)?.content?.reduce((acc: number, node: any) => acc + (node.content ? node.content.reduce((a: number, n: any) => a + (n.text ? n.text.split(' ').length : 0), 0) : 0), 0) || 0 : 0;
                const readTime = Math.max(1, Math.ceil(wordCount / 200));

                return (
                    <Link 
                        key={doc._id} 
                        href={`/articles/${doc.slug || doc._id}`} 
                        className="group flex flex-col bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100/50"
                    >
                        {/* Thumbnail */}
                        <div className={`h-56 w-full relative overflow-hidden ${doc.coverImageUrl ? "bg-gray-100" : `bg-gradient-to-r ${gradient}`}`}>
                             {doc.coverImageUrl && (
                                <img 
                                    src={doc.coverImageUrl} 
                                    alt={doc.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            )}
                            {/* Overlay gradient for text pop if we moved text inside, but we keep it clean below for now */}
                        </div>

                        {/* Content */}
                        <div className="p-8 flex-1 flex flex-col">
                            {/* Metadata */}
                            <div className="flex items-center text-xs font-semibold text-blue-600 mb-3 tracking-wide uppercase">
                                <span>Article</span>
                                <span className="mx-2 text-gray-300">•</span>
                                <span>{readTime} min read</span>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors leading-tight">
                                {doc.title}
                            </h3>
                            
                            {/* Snippet / Excerpt would go here if available */}
                            
                            <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between text-sm text-gray-500 font-medium">
                                <div className="flex items-center gap-2">
                                     <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px] text-white font-bold">
                                        KD
                                     </div>
                                     <span>Author</span>
                                </div>
                                <time className="text-gray-400">
                                    {new Date(doc._creationTime).toLocaleDateString("en-US", {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </time>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
