"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { getEditorExtensions } from "../lib/editorExtensions";
import { useImageUpload } from "../hooks/useImageUpload";
import { useState } from "react";
import AdvancedToolbar from "./Editor/AdvancedToolbar";

interface EditorProps {
  documentId: Id<"documents">;
  initialContent?: string;
  editable?: boolean;
  onEditorReady?: (editor: any) => void;
  hideToolbar?: boolean;
}

export default function Editor({ documentId, initialContent, editable = true, onEditorReady, hideToolbar = false }: EditorProps) {
  const updateDocument = useMutation(api.documents.updateDocument);
  const { uploadImage, uploadProgress } = useImageUpload();

  const handleImageUpload = async (file: File) => {
    const result = await uploadImage(file);
    return result?.url || null;
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: getEditorExtensions(),
    content: initialContent ? JSON.parse(initialContent) : undefined,
    editable,
    onCreate: ({ editor }) => {
        onEditorReady?.(editor);
    },
    onUpdate: ({ editor }) => {
      updateDocument({
        id: documentId,
        content: JSON.stringify(editor.getJSON()),
      });
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none max-w-full min-h-[300px] prose prose-lg max-w-none",
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            handleImageUpload(file).then((url) => {
              if (url && editor) {
                const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                if (coordinates) {
                  // Use editor commands instead of direct schema manipulation
                  editor.chain().focus().setImage({ src: url }).run();
                }
              }
            });
            return true;
          }
        }
        return false;
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = await handleImageUpload(file);
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      }
    };
    input.click();
  };

  // Get character and word count
  const characterCount = editor.storage.characterCount as { characters?: () => number, words?: () => number } | undefined;
  const characters = characterCount?.characters?.() || 0;
  const words = characterCount?.words?.() || 0;
  const readingTime = Math.ceil(words / 200); // Average reading speed: 200 words/min

  return (
    <div className="w-full relative">
      {/* Upload Progress Toast */}
      {uploadProgress.isUploading && (
        <div className="fixed bottom-6 right-6 z-50 w-80 p-4 bg-surface border border-border rounded-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">
                Uploading image...
              </p>
              {uploadProgress.progress !== undefined && (
                <div className="mt-2">
                  <div className="w-full h-2 bg-bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-text-tertiary mt-1">
                    {uploadProgress.progress}%
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {editable && !hideToolbar && (
        <AdvancedToolbar editor={editor} onImageUpload={addImage} />
      )}

      <EditorContent 
        editor={editor}
        className="prose prose-lg max-w-none focus:outline-none min-h-[500px] px-4 py-6"
      />

      {/* Status Bar - Word/Character Count */}
      {editable && !hideToolbar && (
        <div className="sticky bottom-0 z-30 bg-surface/95 backdrop-blur-sm border-t border-border px-4 py-2">
          <div className="flex items-center gap-4 text-xs text-text-tertiary">
            <span>{words || 0} words</span>
            <span>•</span>
            <span>{characters || 0} characters</span>
            <span>•</span>
            <span>{readingTime || 0} min read</span>
          </div>
        </div>
      )}
    </div>
  );
}
