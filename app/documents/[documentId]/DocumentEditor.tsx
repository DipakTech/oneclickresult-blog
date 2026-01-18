"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import dynamic from "next/dynamic";
import { useState, useEffect, useCallback, useMemo } from "react";

const Editor = dynamic(() => import("../../../components/Editor"), { ssr: false });

interface DocumentEditorProps {
    documentId: Id<"documents">;
}

export default function DocumentEditor({ documentId }: DocumentEditorProps) {
    const document = useQuery(api.documents.getDocument, { id: documentId });
    const updateDocument = useMutation(api.documents.updateDocument);

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
                    <input
                        value={title}
                        onChange={handleTitleChange}
                        className="text-4xl font-bold text-gray-900 mb-4 w-full border-none focus:outline-none focus:ring-0 bg-transparent placeholder-gray-400"
                        placeholder="Untitled"
                    />
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
