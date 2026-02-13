"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import ArticleFilterBar from "../../components/ArticleFilterBar";
import ArticleCard from "../../components/ArticleCard";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Client-side component for interactivity
export default function ArticlesPage() {
    const documents = useQuery(api.documents.getPublishedDocuments, {}) ?? [];
    // const createDocument = useMutation(api.documents.createDocument); // Removed for public viewer
    // const router = useRouter(); // Removed
    
    const [filter, setFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("Newest");
    // const [isCreating, setIsCreating] = useState(false); // Removed

    // Filter logic
    const filteredDocs = documents.filter(doc => {
        // Status Filter - Removed since all are published
        // if (filter === "Published" && !doc.isPublished) return false;
        // if (filter === "Draft" && doc.isPublished) return false;
        
        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return doc.title.toLowerCase().includes(query) || 
                   (doc.authorName && doc.authorName.toLowerCase().includes(query));
        }
        return true;
    });

    // Sort logic
    const sortedDocs = [...filteredDocs].sort((a, b) => {
        if (sortOption === "Newest") return b._creationTime - a._creationTime;
        if (sortOption === "Oldest") return a._creationTime - b._creationTime;
        if (sortOption === "A-Z") return a.title.localeCompare(b.title);
        return 0;
    });

    return (
        <div className="min-h-screen bg-bg">
            {/* Header (180px) */}
            <header className="bg-surface border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center text-sm text-text-tertiary mb-4">
                        <Link href="/" className="hover:text-text-primary transition-colors">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-text-primary font-medium">Articles</span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-text-primary tracking-tight mb-2">Latest Stories</h1>
                            <p className="text-text-secondary text-base leading-relaxed max-w-2xl">
                                Explore our latest articles, guides, and insights.
                            </p>
                        </div>
                        
                        {/* Removed New Article Button */}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filter Bar */}
                <ArticleFilterBar 
                    filter={filter}
                    onFilterChange={setFilter}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    sortOption={sortOption}
                    onSortChange={setSortOption}
                />
                
                {/* Article Grid */}
                {documents === undefined ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : sortedDocs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sortedDocs.map((doc) => (
                            <ArticleCard key={doc._id} document={doc} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-surface rounded-2xl border border-dashed border-border">
                        <h3 className="text-xl font-medium text-text-secondary">No articles found</h3>
                        <p className="text-text-tertiary mt-2">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
