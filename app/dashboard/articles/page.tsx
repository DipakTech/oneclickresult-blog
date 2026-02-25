"use client";

import { useMutation, usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import {
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  MoreHorizontal,
  ExternalLink,
  FileText,
} from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import Link from "next/link";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function ArticlesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArticlesContent />
    </Suspense>
  );
}

function ArticlesContent() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] =
    useState<Id<"documents"> | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasAttemptedCreateRef = useRef(false);

  useEffect(() => {
    const filterParam = searchParams.get("filter");
    if (filterParam === "published" || filterParam === "draft") {
      setFilter(filterParam);
    } else {
      setFilter("all");
    }
  }, [searchParams]);

  // Close overflow menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (openMenuId && !(e.target as HTMLElement).closest("[data-menu]")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openMenuId]);

  const queryArgs =
    filter === "all" ? undefined : { isDraft: filter === "draft" };

  const {
    results: documents,
    status,
    loadMore,
  } = usePaginatedQuery(api.documents.getDocumentsPaginated, queryArgs || {}, {
    initialNumItems: 20,
  });

  const createDocument = useMutation(api.documents.createDocument);
  const deleteDocument = useMutation(api.documents.deleteDocument);
  const updateDocument = useMutation(api.documents.updateDocument);

  const filteredDocuments = documents?.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.slug && doc.slug.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (status === "LoadingMore") return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && status === "CanLoadMore") {
          loadMore(20);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [status, loadMore],
  );

  const handleCreateDocument = useCallback(async () => {
    try {
      const documentId = await createDocument({
        title: "Untitled Article",
        authorName: session?.user?.name || "Unknown Author",
        authorImageUrl: session?.user?.image || undefined,
      });
      router.push(`/documents/${documentId}`);
    } catch (error) {
      console.error("Failed to create document:", error);
    }
  }, [createDocument, session?.user?.name, session?.user?.image, router]);

  useEffect(() => {
    if (searchParams.get("new") === "true" && !hasAttemptedCreateRef.current) {
      hasAttemptedCreateRef.current = true;
      handleCreateDocument();
      // Remove 'new' from URL to prevent re-triggering on refresh
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [searchParams, handleCreateDocument]);

  const handleDeleteClick = (id: Id<"documents">) => {
    setOpenMenuId(null);
    setDocumentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;
    try {
      await deleteDocument({ id: documentToDelete });
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    } catch (error) {
      console.error("Failed to delete document:", error);
    }
  };

  const totalCount = documents?.length ?? 0;
  const publishedCount = documents?.filter((d) => d.isPublished).length ?? 0;
  const draftCount = totalCount - publishedCount;

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-full min-w-0">
        <Header
          onSearch={setSearchQuery}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
        />

        <main className="flex-1 overflow-auto px-4 md:px-6 py-3 md:py-4">
          <div className="max-w-7xl mx-auto space-y-3">
            {/* Compact Header: Title + Pill Tabs + Search + CTA — single row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-lg font-bold text-text-primary whitespace-nowrap">
                  Articles
                </h1>

                {/* Pill Toggle Tabs */}
                <div className="flex items-center bg-gray-100 dark:bg-white/[0.06] rounded-lg p-0.5">
                  {(
                    [
                      { key: "all", label: "All" },
                      { key: "published", label: "Published" },
                      { key: "draft", label: "Drafts" },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setFilter(tab.key)}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                        filter === tab.key
                          ? "bg-white dark:bg-white/10 text-text-primary shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Inline search */}
                <div className="relative w-full sm:w-56">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/[0.04] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs"
                  />
                </div>
              </div>

              <button
                onClick={handleCreateDocument}
                className="inline-flex items-center justify-center px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-xs font-semibold shadow-sm hover:shadow-md shrink-0"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                New Article
              </button>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-surface rounded-lg border border-border overflow-hidden shadow-sm">
              {status === "LoadingFirstPage" ? (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-4 py-2 animate-pulse"
                    >
                      <div className="w-5 h-5 rounded bg-gray-200 dark:bg-gray-700 shrink-0" />
                      <div className="flex-1 flex items-center gap-4">
                        <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-16" />
                      </div>
                      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-20" />
                      <div className="w-6 h-4 bg-gray-100 dark:bg-gray-800 rounded" />
                    </div>
                  ))}
                </div>
              ) : filteredDocuments?.length === 0 ? (
                <div className="py-16 text-center flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-text-primary">
                    No articles found
                  </p>
                  <p className="text-xs text-text-secondary mt-1 max-w-xs">
                    {searchQuery
                      ? `No results for "${searchQuery}"`
                      : filter === "draft"
                        ? "No drafts yet."
                        : filter === "published"
                          ? "Nothing published yet."
                          : "Create your first article to get started."}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={handleCreateDocument}
                      className="mt-3 text-xs text-primary font-semibold hover:underline"
                    >
                      Start writing
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  {/* Table header */}
                  <div className="hidden md:grid grid-cols-[1fr_90px_100px_36px] gap-2 px-4 py-1.5 bg-gray-50 dark:bg-white/[0.03] text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                    <div>Title</div>
                    <div>Status</div>
                    <div>Date</div>
                    <div></div>
                  </div>

                  {/* Rows */}
                  <div className="divide-y divide-gray-50 dark:divide-gray-800/60">
                    {filteredDocuments?.map((doc) => (
                      <div
                        key={doc._id}
                        className="group grid grid-cols-1 md:grid-cols-[1fr_90px_100px_36px] gap-x-2 items-center px-4 py-1.5 hover:bg-gray-50/70 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        {/* Title cell */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Link
                            href={`/documents/${doc._id}`}
                            className="truncate text-[13px] font-medium text-text-primary hover:text-primary transition-colors"
                            title={doc.slug ? `/${doc.slug}` : undefined}
                          >
                            {doc.title || "Untitled"}
                          </Link>
                          {doc.readingTime ? (
                            <span className="hidden sm:inline shrink-0 text-[11px] text-gray-400 dark:text-gray-500">
                              {doc.readingTime}m
                            </span>
                          ) : null}
                          {doc.isPublished && doc.viewCount ? (
                            <span className="hidden sm:inline-flex items-center shrink-0 text-[11px] text-gray-400 dark:text-gray-500 gap-0.5">
                              <Eye className="w-3 h-3" />
                              {doc.viewCount}
                            </span>
                          ) : null}
                        </div>

                        {/* Status dot */}
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              doc.isPublished
                                ? "bg-emerald-500"
                                : "bg-amber-400 dark:bg-amber-300"
                            }`}
                          />
                          <span
                            className={`text-[12px] font-medium ${
                              doc.isPublished
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-amber-600 dark:text-amber-300"
                            }`}
                          >
                            {doc.isPublished ? "Live" : "Draft"}
                          </span>
                        </div>

                        {/* Date */}
                        <div className="text-[12px] text-gray-400 dark:text-gray-500 tabular-nums">
                          {new Date(doc._creationTime).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "2-digit" },
                          )}
                        </div>

                        {/* Overflow menu */}
                        <div className="relative flex justify-end" data-menu>
                          <button
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === doc._id ? null : doc._id,
                              )
                            }
                            className="p-1 rounded-md text-gray-400 hover:text-text-primary hover:bg-gray-100 dark:hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {openMenuId === doc._id && (
                            <div className="absolute right-0 top-full mt-1 z-50 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 text-[13px]">
                              <Link
                                href={`/documents/${doc._id}`}
                                className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-white/5 text-text-primary"
                                onClick={() => setOpenMenuId(null)}
                              >
                                <Edit className="w-3.5 h-3.5" /> Edit
                              </Link>
                              {doc.isPublished && (
                                <Link
                                  href={`/articles/${doc.slug || doc._id}`}
                                  target="_blank"
                                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-white/5 text-text-primary"
                                  onClick={() => setOpenMenuId(null)}
                                >
                                  <ExternalLink className="w-3.5 h-3.5" /> View
                                  live
                                </Link>
                              )}
                              <button
                                onClick={() => handleDeleteClick(doc._id)}
                                className="flex items-center gap-2 px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 w-full"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Infinite scroll sentinel */}
                  <div
                    ref={loadMoreRef}
                    className="h-6 flex justify-center items-center"
                  >
                    {status === "LoadingMore" && (
                      <div className="flex gap-1.5 py-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:75ms]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Article"
        description="Are you sure you want to delete this article? This action cannot be undone."
        variant="danger"
      />
    </div>
  );
}
