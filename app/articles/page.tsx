"use client";

import ArticleGrid from "../../components/ArticleGrid";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ArticlesPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link 
                        href="/"
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900">Articles</h1>
                    <div className="w-20" /> {/* Spacer for centering if needed */}
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Latest Stories</h2>
                    <p className="text-gray-600 mt-2">Read our latest thinking on document management and more.</p>
                </div>
                
                <ArticleGrid />
            </main>
        </div>
    );
}
