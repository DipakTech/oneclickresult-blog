"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import ResizableImage from "tiptap-extension-resize-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Link from "@tiptap/extension-link";
import { common, createLowlight } from "lowlight";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { useCallback, useState } from "react";
import { useImageUpload } from "../hooks/useImageUpload";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ImagePlus,
  Image as ImageIcon,
  Loader2,
  FileCode,
  Link2,
  Minus,
} from "lucide-react";

// Create lowlight instance with common languages
const lowlight = createLowlight(common);

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
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: "Write something amazing...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      ResizableImage,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800 cursor-pointer',
        },
      }),
    ],
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
            handleImageUpload(file).then((url) => {
              if (url) {
                const { schema } = view.state;
                const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                if (coordinates) {
                  const node = schema.nodes.resizableImage.create({ src: url });
                  const transaction = view.state.tr.insert(coordinates.pos, node);
                  view.dispatch(transaction);
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

  // Internal toolbar functions (keep references/logic if needed, but UI is hidden if hideToolbar is true)
  const addImage = async () => { /* ... */ }; 
  // ... other functions ...

  return (
    <div className="w-full relative">
      {/* Upload Progress Toast - Fixed bottom right */}
      {uploadProgress.isUploading && (
        <div className="fixed bottom-6 right-6 z-50 w-80 p-4 bg-white border border-gray-200 rounded-xl shadow-2xl animate-in slide-in-from-right-5">
           {/* ... progress UI ... */}
        </div>
      )}

      {editable && !hideToolbar && (
        <div className="sticky top-0 z-40 flex flex-wrap items-center gap-1 p-2 mb-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg">
           {/* ... existing toolbar ... */}
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}

