"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { FileText, Plus, Trash2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { Id } from "../convex/_generated/dataModel";
import { getRandomGradient } from "../lib/gradients";
import { useSession } from "next-auth/react";

interface DocumentListProps {
  isDraft?: boolean;
}

export default function DocumentList({ isDraft }: DocumentListProps) {
  const documents = useQuery(api.documents.getDocuments, { isDraft });
  const createDocument = useMutation(api.documents.createDocument);
  const deleteDocument = useMutation(api.documents.deleteDocument);
  const router = useRouter();
  const { data: session } = useSession();
  const [isCreating, setIsCreating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] =
    useState<Id<"documents"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateDocument = async () => {
    if (isCreating) return;
    setIsCreating(true);
    try {
      const documentId = await createDocument({ 
        title: "Untitled",
        authorName: session?.user?.name || "Unknown Author",
        authorImageUrl: session?.user?.image || undefined
      });
      router.push(`/documents/${documentId}`);
    } catch (error) {
      console.error("Failed to create document:", error);
      alert("Failed to create document. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteClick = (
    e: React.MouseEvent,
    documentId: Id<"documents">
  ) => {
    e.stopPropagation();
    setDocumentToDelete(documentId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDocument({ id: documentToDelete });
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    } catch (error) {
      console.error("Failed to delete document:", error);
      alert("Failed to delete document. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Skeleton loading
  if (documents === undefined) {
    return (
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-h2 text-text-primary">
            {isDraft ? "Drafts" : "Articles"}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-card skeleton-shimmer"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-h2 text-text-primary">
          {isDraft ? "Drafts" : "Articles"}
        </h2>
        <button
          onClick={handleCreateDocument}
          disabled={isCreating}
          className="flex items-center gap-1.5 text-sm text-primary hover:text-primary-hover font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Document
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {/* Create New Card */}
        <button
          onClick={handleCreateDocument}
          disabled={isCreating}
          className="
            flex flex-col items-center justify-center
            aspect-[3/4] rounded-card
            border-2 border-dashed border-border
            hover:border-primary hover:bg-primary-subtle
            transition-all duration-200 group
          "
        >
          <div className="w-10 h-10 rounded-xl bg-bg-secondary flex items-center justify-center mb-3 group-hover:bg-primary-light transition-colors">
            <Plus className="w-5 h-5 text-text-tertiary group-hover:text-primary transition-colors" />
          </div>
          <span className="text-sm font-semibold text-text-secondary group-hover:text-primary transition-colors">
            Create New
          </span>
        </button>

        {/* Document Cards */}
        {documents?.map((doc) => {
          const gradient = getRandomGradient(doc._id);
          return (
            <div
              key={doc._id}
              onClick={() => router.push(`/documents/${doc._id}`)}
              className="
                relative group rounded-card overflow-hidden cursor-pointer
                bg-surface border border-border
                hover-lift hover:shadow-card-hover
                transition-shadow duration-200
                flex flex-col
              "
            >
              {/* Thumbnail / Gradient */}
              <div
                className={`aspect-[3/2] w-full relative overflow-hidden ${
                  doc.coverImageUrl
                    ? "bg-bg-secondary"
                    : `bg-gradient-to-br ${gradient}`
                }`}
              >
                {doc.coverImageUrl && (
                  <img
                    src={doc.coverImageUrl}
                    alt={doc.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                 {/* Delete button — top-right, appears on hover */}
                 <button
                  onClick={(e) => handleDeleteClick(e, doc._id)}
                  className="
                    absolute top-2 right-2
                    opacity-0 group-hover:opacity-100
                    p-1.5 bg-black/40 hover:bg-red-600
                    rounded-md transition-all duration-200
                    backdrop-blur-sm z-10
                  "
                  title="Delete document"
                >
                  <Trash2 className="w-3.5 h-3.5 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <h3
                    className="font-semibold text-text-primary text-base line-clamp-2 mb-auto"
                    title={doc.title}
                  >
                    {doc.title || "Untitled"}
                  </h3>
                
                {/* Footer: Date & Author */}
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {doc.authorImageUrl ? (
                            <img src={doc.authorImageUrl} alt={doc.authorName || "Author"} className="w-5 h-5 rounded-full object-cover" />
                        ): (
                             <div className="w-5 h-5 rounded-full bg-bg-secondary flex items-center justify-center">
                                <span className="text-[9px] font-bold text-text-tertiary">
                                    {(doc.authorName?.[0] || "U").toUpperCase()}
                                </span>
                             </div>
                        )}
                         <span className="text-xs text-text-secondary truncate max-w-[80px]" title={doc.authorName}>
                            {doc.authorName || "Unknown"}
                        </span>
                    </div>
                     <span className="text-[10px] text-text-tertiary font-mono">
                        {new Date(doc._creationTime).toLocaleDateString()}
                    </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Document"
        description="Are you sure you want to delete this document? This action cannot be undone and will also delete any associated cover images."
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
