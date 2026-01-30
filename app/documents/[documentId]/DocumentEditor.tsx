"use client";

import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import dynamic from "next/dynamic";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import CoverImage from "../../../components/CoverImage";

const Editor = dynamic(() => import("../../../components/Editor"), { ssr: false });

interface DocumentEditorProps {
    documentId: Id<"documents">;
}

export default function DocumentEditor({ documentId }: DocumentEditorProps) {
    const document = useQuery(api.documents.getDocument, { id: documentId });
    const updateDocument = useMutation(api.documents.updateDocument);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const convex = useConvex();
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

    const handleCoverImageUpload = async (file: File) => {
        const postUrl = await generateUploadUrl();
        
        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
        });

        const { storageId } = await result.json();
        
        await updateDocument({
            id: documentId,
            coverImageId: storageId,
        });
    };

    const handleCoverImageRemove = async () => {
        await updateDocument({
            id: documentId,
            coverImageId: undefined, // Convex handles undefined as removing the field or setting to null depending on schema, here we want to remove the id
        });
    };

    const handlePublishToggle = async () => {
        if (!document) return;
        await updateDocument({
            id: documentId,
            isPublished: !document.isPublished,
        });
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
        <div className="min-h-screen bg-white pb-40">
            <CoverImage
                url={document.coverImageUrl}
                documentId={documentId}
                editable={true}
                onUpload={handleCoverImageUpload}
                onRemove={handleCoverImageRemove}
            >
                <div className="max-w-4xl mx-auto">
                    {/* Status Badge */}
                    <div className="mb-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            document.isPublished 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                        }`}>
                            {document.isPublished ? "Published" : "Draft"}
                        </span>
                    </div>

                    <input
                        value={title}
                        onChange={handleTitleChange}
                        className="text-5xl font-bold text-white w-full border-none focus:outline-none focus:ring-0 bg-transparent placeholder-white/70 px-0 drop-shadow-md"
                        placeholder="Untitled"
                    />
                </div>
            </CoverImage>
            
            <div className="max-w-4xl mx-auto px-8 mt-12">
                <div className="mb-8">
                    <div className="flex items-center justify-end mb-4 gap-2">
                         <button
                            onClick={handlePublishToggle}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                                document.isPublished
                                    ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                    : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                        >
                            {document.isPublished ? "Unpublish" : "Publish"}
                        </button>
                        <button
                            onClick={() => router.push(`/documents/${documentId}/view`)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors whitespace-nowrap"
                            title="Preview as blog post"
                        >
                            <Eye className="w-4 h-4" />
                            Preview
                        </button>
                    </div>
                </div>
                <Editor
                    documentId={documentId}
                    initialContent={document.content}
                />
            </div>
        </div>
    );
}
