"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { FileText, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { Id } from "../convex/_generated/dataModel";
import { getRandomGradient } from "../lib/gradients";

export default function DocumentList() {
    const documents = useQuery(api.documents.getDocuments);
    const createDocument = useMutation(api.documents.createDocument);
    const deleteDocument = useMutation(api.documents.deleteDocument);
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<Id<"documents"> | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleCreateDocument = async () => {
        if (isCreating) return;
        setIsCreating(true);
        try {
            const documentId = await createDocument({ title: "Untitled" });
            router.push(`/documents/${documentId}`);
        } catch (error) {
            console.error("Failed to create document:", error);
            alert("Failed to create document. Please try again.");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteClick = (e: React.MouseEvent, documentId: Id<"documents">) => {
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

    if (documents === undefined) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Documents</h2>
                <button
                    onClick={handleCreateDocument}
                    disabled={isCreating}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    <Plus className="w-4 h-4 mr-1" />
                    New Document
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Create New Card */}
                <button
                    onClick={handleCreateDocument}
                    disabled={isCreating}
                    className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors">
                        <Plus className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Create New</span>
                </button>

                {/* Document Cards */}
                {documents?.map((doc) => {
                    const gradient = getRandomGradient(doc._id);
                    return (
                        <div
                            key={doc._id}
                            onClick={() => router.push(`/documents/${doc._id}`)}
                            className="relative group bg-white border rounded-lg hover:shadow-md transition-all cursor-pointer flex flex-col h-56 justify-between overflow-hidden"
                        >
                            {/* Thumbnail Area */}
                            <div className={`h-32 w-full relative ${doc.coverImageUrl ? "bg-gray-100" : `bg-gradient-to-r ${gradient}`}`}>
                                {doc.coverImageUrl && (
                                    <img 
                                        src={doc.coverImageUrl} 
                                        alt={doc.title}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                                <button
                                    onClick={(e) => handleDeleteClick(e, doc._id)}
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 bg-white/90 hover:bg-white rounded-md transition-all shadow-sm z-10"
                                    title="Delete document"
                                >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                            </div>

                            {/* Info Area */}
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900 truncate text-lg" title={doc.title}>
                                        {doc.title || "Untitled"}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(doc._creationTime).toLocaleDateString()}
                                    </p>
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
