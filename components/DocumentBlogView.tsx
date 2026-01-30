"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import dynamic from "next/dynamic";
import { Calendar, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import CoverImage from "./CoverImage";

const Editor = dynamic(() => import("./Editor"), { ssr: false });

interface DocumentBlogViewProps {
    documentId: Id<"documents">;
}

export default function DocumentBlogView({ documentId }: DocumentBlogViewProps) {
    const document = useQuery(api.documents.getDocument, { id: documentId });
    const deleteDocument = useMutation(api.documents.deleteDocument);
    const router = useRouter();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        try {
            await deleteDocument({ id: documentId });
            router.push("/");
        } catch (error) {
            console.error("Failed to delete document:", error);
            alert("Failed to delete document. Please try again.");
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
        }
    };

    if (document === undefined) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (document === null) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <div className="text-xl text-gray-500">Document not found</div>
            </div>
        );
    }

    const publicationDate = new Date(document._creationTime);
    const formattedDate = publicationDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <article className="min-h-screen bg-white pb-20">
            {/* Cover Image - Full width banner */}
            <CoverImage
                url={document.coverImageUrl}
                documentId={documentId}
            >
                <h1 className="text-5xl font-bold text-white leading-tight drop-shadow-md">
                    {document.title || "Untitled"}
                </h1>
            </CoverImage>

            <div className="max-w-3xl mx-auto px-6 mt-8">
                {/* Header Section */}
                <header className="mb-12 border-b pb-8">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        {/* Publication Date */}
                        <div className="flex items-center gap-2 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <time dateTime={publicationDate.toISOString()} className="text-sm font-medium">
                                {formattedDate}
                            </time>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => router.push(`/documents/${documentId}`)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors whitespace-nowrap"
                                title="Edit document"
                            >
                                <Edit className="w-4 h-4" />
                                Edit
                            </button>
                            <button
                                onClick={() => setDeleteDialogOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors whitespace-nowrap"
                                title="Delete document"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content Section */}
                <div className="prose prose-lg prose-gray max-w-none">
                    <Editor
                        documentId={documentId}
                        initialContent={document.content}
                        editable={false}
                    />
                </div>
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
        </article>
    );
}
