"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import ResizableImage from "tiptap-extension-resize-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Link from "@tiptap/extension-link";
import { common, createLowlight } from "lowlight";
import { useMutation, useConvex } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { useCallback, useState } from "react";
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
}

interface UploadProgress {
  isUploading: boolean;
  progress: number;
  fileName: string;
}

export default function Editor({ documentId, initialContent, editable = true }: EditorProps) {
  const updateDocument = useMutation(api.documents.updateDocument);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const convex = useConvex();
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    isUploading: false,
    progress: 0,
    fileName: "",
  });

  const handleImageUpload = useCallback(async (file: File): Promise<string | null> => {
    setUploadProgress({ isUploading: true, progress: 0, fileName: file.name });

    try {
      const postUrl = await generateUploadUrl();

      // Use XMLHttpRequest for progress tracking
      const url = await new Promise<string | null>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(prev => ({ ...prev, progress: percentComplete }));
          }
        });

        xhr.addEventListener("load", async () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const { storageId } = JSON.parse(xhr.responseText);
              const fileUrl = await convex.query(api.files.getFileUrl, { storageId });
              resolve(fileUrl);
            } catch (e) {
              reject(e);
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Upload failed")));

        xhr.open("POST", postUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      setUploadProgress({ isUploading: false, progress: 100, fileName: "" });
      return url;
    } catch (error) {
      console.error("Upload error:", error);
      setUploadProgress({ isUploading: false, progress: 0, fileName: "" });
      return null;
    }
  }, [generateUploadUrl, convex]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false, // Disable default codeBlock to use CodeBlockLowlight
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
    onUpdate: ({ editor }) => {
      updateDocument({
        id: documentId,
        content: JSON.stringify(editor.getJSON()),
      });
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none max-w-full min-h-[300px]",
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

  const addImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0];
        const url = await handleImageUpload(file);
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      }
    };
    input.click();
  }

  const addImageWithAlignment = async (alignment: 'left' | 'center' | 'right') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0];
        const url = await handleImageUpload(file);
        if (url) {
          // Insert image with wrapper for alignment
          const alignmentClass = alignment === 'left' ? 'float-left mr-4 mb-2' :
            alignment === 'right' ? 'float-right ml-4 mb-2' :
              'mx-auto block';
          editor.chain().focus().setImage({ src: url }).run();
        }
      }
    };
    input.click();
  }

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl || 'https://');

    if (url === null) {
      return; // User cancelled
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const addHorizontalRule = () => {
    editor.chain().focus().setHorizontalRule().run();
  };

  const ToolbarButton = ({
    onClick,
    isActive = false,
    children,
    title,
    disabled = false,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title?: string;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed ${isActive ? 'bg-blue-100 text-blue-600 hover:bg-blue-100' : ''
        }`}
    >
      {children}
    </button>
  );

  const ToolbarDivider = () => (
    <div className="w-px h-6 bg-gray-200 mx-1" />
  );

  return (
    <div className="w-full relative">
      {/* Upload Progress Toast - Fixed bottom right */}
      {uploadProgress.isUploading && (
        <div className="fixed bottom-6 right-6 z-50 w-80 p-4 bg-white border border-gray-200 rounded-xl shadow-2xl animate-in slide-in-from-right-5">
          <div className="flex items-center gap-3 mb-2">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
            <span className="text-sm text-gray-700 font-medium truncate flex-1">
              Uploading {uploadProgress.fileName}
            </span>
            <span className="text-sm text-blue-600 font-semibold">
              {uploadProgress.progress}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress.progress}%` }}
            />
          </div>
        </div>
      )}

      {editable && (
        <div className="sticky top-0 z-40 flex flex-wrap items-center gap-1 p-2 mb-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg">
          {/* Text Formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold"
          >
            <Bold size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic"
          >
            <Italic size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Inline Code"
          >
            <Code size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            title="Code Block"
          >
            <FileCode size={18} />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Headings */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <Heading1 size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <Heading3 size={18} />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Lists */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Ordered List"
          >
            <ListOrdered size={18} />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Text Alignment */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <AlignLeft size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <AlignCenter size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <AlignRight size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            isActive={editor.isActive({ textAlign: 'justify' })}
            title="Justify"
          >
            <AlignJustify size={18} />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Link */}
          <ToolbarButton
            onClick={addLink}
            isActive={editor.isActive('link')}
            title="Add Link"
          >
            <Link2 size={18} />
          </ToolbarButton>

          {/* Horizontal Rule */}
          <ToolbarButton
            onClick={addHorizontalRule}
            title="Add Horizontal Line"
          >
            <Minus size={18} />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Image Upload */}
          <ToolbarButton
            onClick={addImage}
            title="Add Image"
            disabled={uploadProgress.isUploading}
          >
            <ImagePlus size={18} />
          </ToolbarButton>

          {/* Image Alignment Buttons */}
          <div className="flex items-center gap-0.5 ml-1 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => addImageWithAlignment('left')}
              title="Add Image (Float Left)"
              disabled={uploadProgress.isUploading}
              className="p-1.5 rounded hover:bg-white text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <div className="flex items-center gap-1">
                <ImageIcon size={14} />
                <AlignLeft size={12} />
              </div>
            </button>
            <button
              onClick={() => addImageWithAlignment('center')}
              title="Add Image (Center)"
              disabled={uploadProgress.isUploading}
              className="p-1.5 rounded hover:bg-white text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <div className="flex items-center gap-1">
                <ImageIcon size={14} />
                <AlignCenter size={12} />
              </div>
            </button>
            <button
              onClick={() => addImageWithAlignment('right')}
              title="Add Image (Float Right)"
              disabled={uploadProgress.isUploading}
              className="p-1.5 rounded hover:bg-white text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <div className="flex items-center gap-1">
                <ImageIcon size={14} />
                <AlignRight size={12} />
              </div>
            </button>
          </div>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
