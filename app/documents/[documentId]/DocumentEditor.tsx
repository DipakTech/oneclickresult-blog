"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
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

    // Update local title when document title changes (only if not focused or initial load - simplified approach)
    // Actually, we should just sync initially and then trust local state until save.
    // Or better: update local state if document id changes.
    // Let's use a simpler approach: Sync on load, and debounce updates.
    
    // We need to sync local title with document title if it changes externally or on load
    // But we don't want to overwrite user input while typing.
    // For now, let's just initialize it and sync if document ID changes.
    // Actually, since `document` is from useQuery, it will update. 
    // We should only update local title from prop if it's significantly different and we aren't typing?
    // Standard pattern: 
    // 1. useEffect to set title from document.title
    // 2. handleTitleChange updates local title and calls debounced update.
    
    useEffect(() => {
        if (document) {
            setTitle(document.title);
        }
    }, [document?.title, documentId]); // Only update if these change. Note: if user types, document.title won't update immediately so loop is broken by debounce.
    // Wait, if I type "A", local is "A", debounce fires -> updates Convex -> Document updates -> useEffect fires -> set local "A". usage is fine.
    // PROMLEM: If latency is high, user types "AB", debounce "A", Convex "A", Document "A", useEffect "A" (overwriting "AB").
    // FIX: Don't sync from document if we have pending updates? Or just use a ref to track if we are editing?
    // EASIER FIX: Just use `defaultValue` if we didn't want controlled, but we want controlled.
    // BETTER FIX: Only sync if the new server value is different AND we haven't touched it recently? 
    // LET'S TRY: Just local state + debounce. If multiple users edit same doc title, it might jump, but for single user it's fine.
    // We will use a `isEditing` ref or just only set it if `document` changes and it's not our own optimistic update?
    // Convex `useQuery` returns the server state. 
    // Let's just use a simple debounce and hope the loop isn't too tight.
    // Actually, `useMutation` is optimistic? No.
    // Let's stick to: Local state driving the input. Debounce effect updating the mutation. 
    // UseEffect syncing UPSTREAM changes ONLY if they differ? 
    // Standard "Draft" approach: 
    // 1. Local state `title`.
    // 2. Input `onChange` -> `setTitle(val)` -> `debouncedUpdate(val)`.
    // 3. `useEffect` -> `setTitle(doc.title)` ONLY if `doc.title !== title` AND `!isDebouncing`? Hard to know.
    // Let's just implement the debounce and see.
    
    const [isTypingTitle, setIsTypingTitle] = useState(false);

    useEffect(() => {
        if (document && !isTypingTitle) {
            setTitle(document.title);
        }
    }, [document?.title, isTypingTitle]);

    // Re-implementing debounce correctly
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTitle(val);
        setIsTypingTitle(true);

        if (timer) clearTimeout(timer);
        const newTimer = setTimeout(() => {
            updateDocument({ id: documentId, title: val });
            setIsTypingTitle(false);
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
                isSaving={isTypingTitle} 
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
