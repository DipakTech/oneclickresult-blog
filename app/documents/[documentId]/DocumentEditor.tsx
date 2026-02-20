"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import EditorHeader from "../../../components/Editor/EditorHeader";
import AdvancedToolbar from "../../../components/Editor/AdvancedToolbar";
import EditorSidebar from "../../../components/Editor/EditorSidebar";
import { useImageUpload } from "../../../hooks/useImageUpload";
import { Editor as TipTapEditor } from "@tiptap/react";

const Editor = dynamic(() => import("../../../components/Editor"), { ssr: false });

interface DocumentEditorProps {
    documentId: Id<"documents">;
}

export default function DocumentEditor({ documentId }: DocumentEditorProps) {
    const document = useQuery(api.documents.getDocument, { id: documentId });
    const updateDocument = useMutation(api.documents.updateDocument);
    const { uploadImage } = useImageUpload();
    
    // Editor instance state
    const [editor, setEditor] = useState<TipTapEditor | null>(null);
    // Sidebar state
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Local title state for debouncing
    const [title, setTitle] = useState(document?.title || "");
    const localTitleRef = useRef(document?.title || "");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // Only override local title if the server document title changes to something
        // different than our last intended local edit (handles external updates).
        if (document && document.title !== localTitleRef.current) {
            const newTitle = document.title || "";
            setTitle(newTitle);
            localTitleRef.current = newTitle;
        }
    }, [document?.title]);

    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTitle(val);
        localTitleRef.current = val; // immediately update our intent
        setIsSaving(true);

        if (timer) clearTimeout(timer);
        const newTimer = setTimeout(async () => {
            await updateDocument({ id: documentId, title: val });
            setIsSaving(false);
        }, 500);
        setTimer(newTimer);
    };

    const handlePublishToggle = async () => {
        if (!document) return;
        await updateDocument({
            id: documentId,
            isPublished: !document.isPublished,
        });
    };

    const handleSidebarUpdate = (updates: any) => {
        updateDocument({ id: documentId, ...updates });
    };

    const handleCoverImageRemove = async () => {
        await updateDocument({
            id: documentId,
            coverImageId: null, 
        });
    };

    const handleCoverImageUpload = async (file: File) => {
        const result = await uploadImage(file);
        if (result && result.storageId) {
             await updateDocument({
                id: documentId,
                coverImageId: result.storageId as Id<"_storage">,
            });
        }
    };

    const handleEditorImageUpload = async (file: File) => {
        const result = await uploadImage(file);
        return result?.url || null;
    };

    const addImage = () => {
        const input = globalThis.document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async () => {
            if (input.files?.length) {
                const file = input.files[0];
                const url = await handleEditorImageUpload(file);
                if (url && editor) {
                    editor.chain().focus().setImage({ src: url }).run();
                }
            }
        };
        input.click();
    };

    if (document === undefined) {
        return (
            <div className="flex items-center justify-center h-screen bg-bg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (document === null) {
        return (
            <div className="flex items-center justify-center h-screen bg-bg">
                <div className="text-xl text-text-secondary">Document not found</div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-bg flex flex-col">
            {/* 1. Fixed Header */}
            <EditorHeader 
                documentId={documentId}
                title={title}
                isSaving={isSaving} 
                onPublish={handlePublishToggle}
                isPublished={document.isPublished ?? false}
                isSidebarOpen={isSidebarOpen}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            {/* 2. Sticky Toolbar (below header) */}
            <AdvancedToolbar editor={editor} onImageUpload={addImage} />

            <div className="flex flex-1 overflow-hidden">
                {/* 3. Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-bg relative transition-all duration-300">
                   <div className={`max-w-[720px] mx-auto px-12 py-12 pb-40 ${isSidebarOpen ? '' : 'max-w-[900px]'}`}>
                        {/* Title Input */}
                        <div className="group relative mb-8">
                             <input
                                value={title}
                                onChange={onTitleChange}
                                placeholder="Untitled"
                                className="w-full text-4xl font-bold text-text-primary bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-text-tertiary/50"
                            />
                        </div>

                        {/* Editor Content */}
                        <Editor
                            documentId={documentId}
                            initialContent={document.content}
                            onEditorReady={setEditor}
                            hideToolbar={true} 
                        />
                   </div>
                </main>

                {/* 4. Right Sidebar */}
                <EditorSidebar 
                    document={document}
                    onUpdate={handleSidebarUpdate}
                    onCoverImageUpload={handleCoverImageUpload}
                    onCoverImageRemove={handleCoverImageRemove}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
            </div>
        </div>
    );
}
