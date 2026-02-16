"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import BlogCard from "../components/BlogCard";
import { useState, useMemo, useRef, useEffect } from "react";
import { Search, ChevronDown, Newspaper, BookOpen } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";


const POSTS_PER_PAGE = 9;

export default function BlogHomePage() {
  const documents = useQuery(api.documents.getPublishedDocuments, {});
  const isLoading = documents === undefined;
  const allDocs = documents ?? [];

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  // Close sort dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOption]);

  // Filter
  const filteredDocs = useMemo(() => {
    if (!searchQuery) return allDocs;
    const q = searchQuery.toLowerCase();
    return allDocs.filter(
      (doc) =>
        doc.title.toLowerCase().includes(q) ||
        (doc.authorName && doc.authorName.toLowerCase().includes(q)) ||
        (doc.metaDescription && doc.metaDescription.toLowerCase().includes(q))
    );
  }, [allDocs, searchQuery]);

  // Sort
  const sortedDocs = useMemo(() => {
    return [...filteredDocs].sort((a, b) => {
      if (sortOption === "Latest") return b._creationTime - a._creationTime;
      if (sortOption === "Oldest") return a._creationTime - b._creationTime;
      if (sortOption === "Popular")
        return (b.viewCount ?? 0) - (a.viewCount ?? 0);
      if (sortOption === "A-Z") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [filteredDocs, sortOption]);

  // Featured article (newest, only when not searching)
  const featuredArticle = !searchQuery ? sortedDocs[0] : null;
  const remainingArticles = !searchQuery ? sortedDocs.slice(1) : sortedDocs;

  // Pagination
  const totalPages = Math.ceil(remainingArticles.length / POSTS_PER_PAGE);
  const paginatedDocs = remainingArticles.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const sortOptions = ["Latest", "Oldest", "Popular", "A-Z"];

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <header className="relative z-10">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-surface" />
        <div
          className="absolute inset-x-0 -bottom-40 -top-40 overflow-hidden blur-3xl opacity-50"
          aria-hidden="true"
        >
          <div className="relative aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          {/* Top Nav placeholder */}
          <nav className="flex items-center justify-between mb-16">
            <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              Dipak.
            </div>
            <div className="flex items-center gap-4">
               {/* Other nav items could go here */}
               <ThemeToggle />
               {/* <a href="/dashboard" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                  Dashboard
               </a> */}
            </div>
          </nav>

          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-xs font-medium text-text-tertiary mb-10 tracking-wide uppercase"
            aria-label="Breadcrumbs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Home</span>
            <span className="text-border">/</span>
            <span className="text-text-secondary">Articles</span>
          </nav>

          {/* Title */}
          <div className="max-w-2xl mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary tracking-tight leading-[1.1] mb-4">
              Latest Stories
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed">
              Insights, guides, and updates from our team. Stay informed with
              the latest trends in technology and development.
            </p>
          </div>

          {/* Search & Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-2xl">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] transition-colors duration-200 ${
                  searchFocused ? "text-primary" : "text-text-tertiary"
                }`}
              />
              <input
                type="text"
                placeholder="Search articles by title, author, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full h-12 pl-11 pr-4 bg-bg border border-border rounded-xl text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all duration-200"
                aria-label="Search articles"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative z-20" ref={sortRef}>

              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="h-12 px-5 flex items-center gap-2.5 bg-bg border border-border rounded-xl text-sm text-text-secondary hover:text-text-primary hover:border-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 whitespace-nowrap"
                aria-label="Sort articles"
                aria-expanded={isSortOpen}
              >
                <span className="text-text-tertiary text-xs font-medium">
                  Sort by:
                </span>
                <span className="font-medium">{sortOption}</span>
                <ChevronDown
                  className={`w-4 h-4 text-text-tertiary transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isSortOpen && (
                <div className="absolute  right-0 top-full mt-2 w-48 bg-surface border border-border rounded-xl shadow-overlay z-50 p-1.5 animate-scale-in">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSortOption(opt);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 text-sm rounded-lg transition-colors duration-150 ${
                        sortOption === opt
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom separator */}
        <div className="h-px bg-border" />
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-8">
            {/* Featured skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-surface rounded-2xl border border-border overflow-hidden">
              <div className="aspect-[16/10] lg:aspect-auto lg:min-h-[400px] skeleton-shimmer" />
              <div className="p-8 lg:p-12 space-y-4">
                <div className="h-4 w-24 skeleton-shimmer rounded-full" />
                <div className="h-8 w-3/4 skeleton-shimmer rounded-lg" />
                <div className="h-4 w-full skeleton-shimmer rounded-lg" />
                <div className="h-4 w-2/3 skeleton-shimmer rounded-lg" />
              </div>
            </div>
            {/* Card skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-surface rounded-2xl border border-border overflow-hidden"
                >
                  <div className="aspect-[16/10] skeleton-shimmer" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 w-20 skeleton-shimmer rounded-full" />
                    <div className="h-5 w-3/4 skeleton-shimmer rounded-lg" />
                    <div className="h-3 w-full skeleton-shimmer rounded-lg" />
                    <div className="h-3 w-1/2 skeleton-shimmer rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : sortedDocs.length === 0 ? (
          /* Empty State */
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-bg-secondary flex items-center justify-center">
              <Newspaper className="w-8 h-8 text-text-tertiary" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {searchQuery ? "No articles found" : "No articles yet"}
            </h3>
            <p className="text-text-secondary max-w-md mx-auto leading-relaxed">
              {searchQuery
                ? `We couldn't find any articles matching "${searchQuery}". Try a different search term.`
                : "Check back later for new articles and updates."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-6 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors duration-200"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Article count */}
            {searchQuery && (
              <p className="text-sm text-text-tertiary mb-8">
                Found{" "}
                <span className="font-semibold text-text-secondary">
                  {sortedDocs.length}
                </span>{" "}
                {sortedDocs.length === 1 ? "article" : "articles"} matching "
                {searchQuery}"
              </p>
            )}

            {/* Featured Article */}
            {featuredArticle && (
              <section className="mb-14" aria-label="Featured article">
                <BlogCard document={featuredArticle} featured />
              </section>
            )}

            {/* Articles Grid */}
            {paginatedDocs.length > 0 && (
              <section aria-label="All articles">
                {!searchQuery && (
                  <div className="flex items-center gap-3 mb-8">
                    <h2 className="text-xl font-semibold text-text-primary">
                      All Articles
                    </h2>
                    <span className="px-2.5 py-1 bg-bg-secondary text-text-tertiary text-xs font-medium rounded-full">
                      {remainingArticles.length}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                  {paginatedDocs.map((doc) => (
                    <BlogCard key={doc._id} document={doc} />
                  ))}
                </div>
              </section>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                className="flex items-center justify-center gap-2 mt-16"
                aria-label="Pagination"
              >
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.max(1, p - 1))
                  }
                  disabled={currentPage === 1}
                  className="h-10 px-4 text-sm font-medium text-text-secondary hover:text-text-primary bg-surface border border-border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:border-text-tertiary transition-all duration-200"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 ${
                        currentPage === page
                          ? "bg-primary text-white shadow-sm"
                          : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary"
                      }`}
                      aria-current={
                        currentPage === page ? "page" : undefined
                      }
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="h-10 px-4 text-sm font-medium text-text-secondary hover:text-text-primary bg-surface border border-border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:border-text-tertiary transition-all duration-200"
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-text-tertiary text-center">
            © {new Date().getFullYear()} OneClickResult. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
