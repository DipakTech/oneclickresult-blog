"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import dynamic from "next/dynamic";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";

const Editor = dynamic(() => import("../../../components/Editor"), { ssr: false });

interface DocumentEditorProps {
    documentId: Id<"documents">;
}

export default function DocumentEditor({ documentId }: DocumentEditorProps) {
    const document = useQuery(api.documents.getDocument, { id: documentId });
    const updateDocument = useMutation(api.documents.updateDocument);
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [hasSynced, setHasSynced] = useState(false);

    // Sync title from backend only on initial load
    useEffect(() => {
        if (document && !hasSynced) {
            setTitle(document.title);
            setHasSynced(true);
        }
    }, [document, hasSynced]);

    const debouncedUpdate = useCallback(
        (newTitle: string) => {
            updateDocument({ id: documentId, title: newTitle });
        },
        [updateDocument, documentId]
    );

    // Debounce the update function
    const debouncedSave = useMemo(
        () => {
            let timeout: NodeJS.Timeout;
            return (newTitle: string) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    debouncedUpdate(newTitle);
                }, 500);
            };
        },
        [debouncedUpdate]
    );

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        debouncedSave(newTitle);
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

    return (
        <div className="min-h-screen bg-white">
            <div className="p-8 max-w-4xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <input
                            value={title}
                            onChange={handleTitleChange}
                            className="text-4xl font-bold text-gray-900 w-full border-none focus:outline-none focus:ring-0 bg-transparent placeholder-gray-400"
                            placeholder="Untitled"
                        />
                        <button
                            onClick={() => router.push(`/documents/${documentId}/view`)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors whitespace-nowrap"
                            title="Preview as blog post"
                        >
                            <Eye className="w-4 h-4" />
                            Preview
                        </button>
                    </div>
                    {document.coverImageUrl && (
                        <div className="relative w-full h-64 mb-6">
                            <img
                                src={document.coverImageUrl}
                                alt={document.title}
                                className="w-full h-full object-cover rounded-lg shadow-md"
                            />
                        </div>
                    )}
                </div>
                <Editor
                    documentId={documentId}
                    initialContent={document.content}
                />
            </div>
        </div>
    );
}
