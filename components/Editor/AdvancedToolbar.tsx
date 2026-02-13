"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  List,
  ListOrdered,
  ListChecks,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ImagePlus,
  Table as TableIcon,
  Minus,
  Link2,
  Highlighter,
  Type,
  Palette,
  Undo2,
  Redo2,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { FONT_FAMILIES, FONT_SIZES, COLOR_PALETTE } from "../../lib/editorExtensions";

interface EditorToolbarProps {
  editor: Editor | null;
  onImageUpload?: () => void;
}

export default function EditorToolbar({ editor, onImageUpload }: EditorToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showFontFamily, setShowFontFamily] = useState(false);

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        p-2 rounded-lg transition-all duration-150
        ${isActive
          ? "bg-primary/10 text-primary ring-1 ring-primary/20"
          : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
        }
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {children}
    </button>
  );

  const ToolbarDivider = () => (
    <div className="w-px h-6 bg-border mx-1" />
  );

  return (
    <div className="sticky top-16 z-30 bg-surface/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="flex flex-wrap items-center gap-1 p-2 max-w-full overflow-x-auto">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        {/* Font Family */}
        <div className="relative">
          <button
            onClick={() => setShowFontFamily(!showFontFamily)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors"
            title="Font Family"
          >
            <Type className="w-4 h-4" />
            <span className="hidden sm:inline">Font</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {showFontFamily && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-surface border border-border rounded-lg shadow-xl z-50">
              <div className="p-1 max-h-64 overflow-y-auto">
                {FONT_FAMILIES.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => {
                      if (font.value) {
                        editor.chain().focus().setFontFamily(font.value).run();
                      } else {
                        editor.chain().focus().unsetFontFamily().run();
                      }
                      setShowFontFamily(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded text-sm hover:bg-bg-secondary transition-colors"
                    style={{ fontFamily: font.value || undefined }}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          </div>

        <ToolbarDivider />

        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        {/* Text Color */}
        <div className="relative">
          <ToolbarButton
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Text Color"
          >
            <Palette className="w-4 h-4" />
          </ToolbarButton>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-surface border border-border rounded-lg shadow-xl z-50">
              <div className="grid grid-cols-5 gap-1">
                {COLOR_PALETTE.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      editor.chain().focus().setColor(color).run();
                      setShowColorPicker(false);
                    }}
                    className="w-8 h-8 rounded border-2 border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  setShowColorPicker(false);
                }}
                className="w-full mt-2 px-2 py-1 text-xs text-text-secondary hover:bg-bg-secondary rounded"
              >
                Reset Color
              </button>
            </div>
          )}
        </div>

        {/* Highlight */}
        <div className="relative">
          <ToolbarButton
            onClick={() => setShowHighlightPicker(!showHighlightPicker)}
            title="Highlight"
          >
            <Highlighter className="w-4 h-4" />
          </ToolbarButton>
          {showHighlightPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-surface border border-border rounded-lg shadow-xl z-50">
              <div className="grid grid-cols-5 gap-1">
                {COLOR_PALETTE.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      editor.chain().focus().toggleHighlight({ color }).run();
                      setShowHighlightPicker(false);
                    }}
                    className="w-8 h-8 rounded border-2 border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  editor.chain().focus().unsetHighlight().run();
                  setShowHighlightPicker(false);
                }}
                className="w-full mt-2 px-2 py-1 text-xs text-text-secondary hover:bg-bg-secondary rounded"
              >
                Remove Highlight
              </button>
            </div>
          )}
        </div>

        <ToolbarDivider />

        {/* Headings */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            isActive={editor.isActive("taskList")}
            title="Task List"
          >
            <ListChecks className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        {/* Alignment */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            isActive={editor.isActive({ textAlign: "justify" })}
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        {/* Insert Elements */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => onImageUpload?.()}
            title="Insert Image"
          >
            <ImagePlus className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            title="Insert Table"
          >
            <TableIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Line"
          >
            <Minus className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              const url = window.prompt("Enter URL:");
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            isActive={editor.isActive("link")}
            title="Insert Link"
          >
            <Link2 className="w-4 h-4" />
          </ToolbarButton>
        </div>
      </div>
    </div>
  );
}
