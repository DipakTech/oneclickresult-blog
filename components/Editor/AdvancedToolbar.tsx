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
  Unlink,
  Highlighter,
  Type,
  Palette,
  Undo2,
  Redo2,
  ChevronDown,
  Eraser,
  Subscript,
  Superscript,
  Quote,
  CodeSquare,
  Trash2,
  Plus,
  ArrowDownFromLine,
  ArrowUpFromLine,
  ArrowLeftFromLine,
  ArrowRightFromLine,
  ArrowUpDown,
  Youtube,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { FONT_FAMILIES, COLOR_PALETTE, LINE_HEIGHTS } from "../../lib/editorExtensions";

interface EditorToolbarProps {
  editor: Editor | null;
  onImageUpload?: () => void;
}

export default function EditorToolbar({ editor, onImageUpload }: EditorToolbarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const toolbarRef = useRef<HTMLDivElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const youtubeInputRef = useRef<HTMLInputElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // If clicking inside a dropdown (which is fixed positioned), don't close
      const target = e.target as HTMLElement;
      if (typeof target?.closest === 'function' && target.closest('.fixed-dropdown')) return;

      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };

    globalThis.document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      globalThis.document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);

  // Focus link or youtube input when dropdown opens
  useEffect(() => {
    if (activeDropdown === "link" && linkInputRef.current) {
      linkInputRef.current.focus();
      if (editor?.isActive("link")) {
        const attrs = editor.getAttributes("link");
        setLinkUrl(attrs.href || "");
      } else {
        setLinkUrl("");
      }
    }
    if (activeDropdown === "youtube" && youtubeInputRef.current) {
      youtubeInputRef.current.focus();
      setYoutubeUrl(""); // Reset whenever opened
    }
  }, [activeDropdown, editor]);

  if (!editor) {
    return null;
  }

  const toggleDropdown = (name: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
      setDropdownPosition(null);
    } else {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
      });
      setActiveDropdown(name);
    }
  };

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title,
  }: {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
        p-1.5 rounded-md transition-all duration-150 shrink-0
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
    <div className="w-px h-5 bg-border mx-0.5 shrink-0" />
  );

  const handleSetLink = () => {
    if (linkUrl) {
      const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
      editor.chain().focus().setLink({ href: url }).run();
    }
    setActiveDropdown(null);
    setLinkUrl("");
  };

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run();
    setActiveDropdown(null);
    setLinkUrl("");
  };

  const handleSetYoutube = () => {
    if (youtubeUrl) {
      editor.commands.setYoutubeVideo({
        src: youtubeUrl,
      });
    }
    setActiveDropdown(null);
    setYoutubeUrl("");
  };

  // Helper to render fixed dropdown content
  const DropdownContent = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
    if (!dropdownPosition) return null;
    
    // Adjust horizontal position if it overflows screen
    let left = dropdownPosition.left;
    if (typeof window !== 'undefined' && left + 220 > window.innerWidth) {
        left = window.innerWidth - 230; // 220 + padding
    }

    // Since AdvancedToolbar has backdrop-blur which creates a new containing block
    // for fixed positioned descendants, we must account for the toolbar's own offset 
    // to map the viewport coordinates back to the local coordinate space.
    const toolbarRect = toolbarRef.current?.getBoundingClientRect();
    const toolbarOffsetTop = toolbarRect ? toolbarRect.top : 0;
    const toolbarOffsetLeft = toolbarRect ? toolbarRect.left : 0;

    return (
      <div 
        className={`fixed z-50 bg-surface border border-border rounded-lg shadow-xl fixed-dropdown ${className}`}
        style={{ top: dropdownPosition.top - toolbarOffsetTop, left: left - toolbarOffsetLeft }}
      >
        {children}
      </div>
    );
  };

  return (
    <div ref={toolbarRef} className="sticky top-[72px] z-40 bg-surface/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="w-fit mx-auto flex items-center gap-0.5 p-1.5">
        {/* Undo/Redo */}
        <div className="flex items-center gap-0.5">
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

        {/* Font Family Dropdown */}
        <button
          onClick={(e) => toggleDropdown("font", e)}
          className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs transition-colors shrink-0 ${
            activeDropdown === "font"
              ? "bg-primary/10 text-primary"
              : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
          }`}
          title="Font Family"
        >
          <Type className="w-3.5 h-3.5" />
          <span className="hidden sm:inline max-w-[60px] truncate">
            {FONT_FAMILIES.find(f => editor.isActive('textStyle', { fontFamily: f.value }))?.label || "Font"}
          </span>
          <ChevronDown className="w-3 h-3" />
        </button>
        {activeDropdown === "font" && (
          <DropdownContent className="w-48">
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
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                     editor.isActive('textStyle', { fontFamily: font.value }) 
                     ? "bg-primary/10 text-primary" 
                     : "hover:bg-bg-secondary text-text-primary"
                  }`}
                  style={{ fontFamily: font.value || undefined }}
                >
                  {font.label}
                </button>
              ))}
            </div>
          </DropdownContent>
        )}

        {/* Line Height Dropdown */}
        <button
          onClick={(e) => toggleDropdown("lineHeight", e)}
          className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs transition-colors shrink-0 ${
            activeDropdown === "lineHeight"
              ? "bg-primary/10 text-primary"
              : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
          }`}
          title="Line Height"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <ChevronDown className="w-3 h-3" />
        </button>
        {activeDropdown === "lineHeight" && (
          <DropdownContent className="w-32">
            <div className="p-1">
              {LINE_HEIGHTS.map((height) => (
                <button
                  key={height.value}
                  onClick={() => {
                     // @ts-ignore - setLineHeight is a custom command
                    editor.chain().focus().setLineHeight(height.value).run();
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                     editor.isActive({ lineHeight: height.value })
                     ? "bg-primary/10 text-primary"
                     : "hover:bg-bg-secondary text-text-primary"
                  }`}
                >
                  {height.label}
                </button>
              ))}
            </div>
          </DropdownContent>
        )}

        <ToolbarDivider />

        {/* Text Formatting */}
        <div className="flex items-center gap-0.5">
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
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            isActive={editor.isActive("subscript")}
            title="Subscript"
          >
            <Subscript className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            isActive={editor.isActive("superscript")}
            title="Superscript"
          >
            <Superscript className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        {/* Text Color */}
        <ToolbarButton
          onClick={(e) => toggleDropdown("color", e)}
          isActive={activeDropdown === "color"}
          title="Text Color"
        >
          <Palette className="w-4 h-4" />
        </ToolbarButton>
        {activeDropdown === "color" && (
          <DropdownContent className="p-2 w-48">
            <div className="grid grid-cols-5 gap-1">
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    setActiveDropdown(null);
                  }}
                  className="w-7 h-7 rounded border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <button
              onClick={() => {
                editor.chain().focus().unsetColor().run();
                setActiveDropdown(null);
              }}
              className="w-full mt-1.5 px-2 py-1 text-xs text-text-secondary hover:bg-bg-secondary rounded"
            >
              Reset Default
            </button>
          </DropdownContent>
        )}

        {/* Highlight */}
        <ToolbarButton
          onClick={(e) => toggleDropdown("highlight", e)}
          isActive={editor.isActive("highlight") || activeDropdown === "highlight"}
          title="Highlight"
        >
          <Highlighter className="w-4 h-4" />
        </ToolbarButton>
        {activeDropdown === "highlight" && (
          <DropdownContent className="p-2 w-48">
            <div className="grid grid-cols-5 gap-1">
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    editor.chain().focus().toggleHighlight({ color }).run();
                    setActiveDropdown(null);
                  }}
                  className="w-7 h-7 rounded border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <button
              onClick={() => {
                editor.chain().focus().unsetHighlight().run();
                setActiveDropdown(null);
              }}
              className="w-full mt-1.5 px-2 py-1 text-xs text-text-secondary hover:bg-bg-secondary rounded"
            >
              Remove Highlight
            </button>
          </DropdownContent>
        )}

        {/* Clear Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          title="Clear Formatting"
        >
          <Eraser className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Headings */}
        <div className="flex items-center gap-0.5">
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
        <div className="flex items-center gap-0.5">
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
            title="Task List (Checklist)"
          >
            <ListChecks className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        {/* Alignment */}
        <div className="flex items-center gap-0.5">
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
        <div className="flex items-center gap-0.5">
          {/* Link */}
          <ToolbarButton
            onClick={(e) => toggleDropdown("link", e)}
            isActive={editor.isActive("link") || activeDropdown === "link"}
            title="Insert Link (Ctrl+K)"
          >
            <Link2 className="w-4 h-4" />
          </ToolbarButton>
          {activeDropdown === "link" && (
            <DropdownContent className="w-72 p-3">
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">URL</label>
              <div className="flex gap-1.5">
                <input
                  ref={linkInputRef}
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSetLink();
                    if (e.key === "Escape") setActiveDropdown(null);
                  }}
                  placeholder="https://example.com"
                  className="flex-1 px-2.5 py-1.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={handleSetLink}
                  className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary-hover transition-colors"
                >
                  Apply
                </button>
              </div>
              {editor.isActive("link") && (
                <button
                  onClick={handleRemoveLink}
                  className="flex items-center gap-1.5 mt-2 text-xs text-danger hover:text-danger-dark transition-colors"
                >
                  <Unlink className="w-3 h-3" />
                  Remove Link
                </button>
              )}
            </DropdownContent>
          )}

          {/* Image */}
          <ToolbarButton
            onClick={() => onImageUpload?.()}
            title="Insert Image"
          >
            <ImagePlus className="w-4 h-4" />
          </ToolbarButton>

          {/* YouTube */}
          <ToolbarButton
            onClick={(e) => toggleDropdown("youtube", e)}
            isActive={activeDropdown === "youtube"}
            title="Insert YouTube Video"
          >
            <Youtube className="w-4 h-4" />
          </ToolbarButton>
          {activeDropdown === "youtube" && (
            <DropdownContent className="w-72 p-3">
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">YouTube Video URL</label>
              <div className="flex gap-1.5">
                <input
                  ref={youtubeInputRef}
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSetYoutube();
                    if (e.key === "Escape") setActiveDropdown(null);
                  }}
                  placeholder="https://youtube.com/watch?v=..."
                  className="flex-1 px-2.5 py-1.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={handleSetYoutube}
                  className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary-hover transition-colors"
                >
                  Insert
                </button>
              </div>
            </DropdownContent>
          )}

          {/* Quote */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>

          {/* Code Block */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}
            title="Code Block"
          >
            <CodeSquare className="w-4 h-4" />
          </ToolbarButton>

          {/* Horizontal Rule */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Line"
          >
            <Minus className="w-4 h-4" />
          </ToolbarButton>

          {/* Table with dropdown for table operations */}
           <ToolbarButton
              onClick={(e) => toggleDropdown("table", e)}
              isActive={editor.isActive("table") || activeDropdown === "table"}
              title="Table"
            >
              <TableIcon className="w-4 h-4" />
            </ToolbarButton>
            {activeDropdown === "table" && (
              <DropdownContent className="w-52 p-1">
                  {!editor.isActive("table") ? (
                    <button
                      onClick={() => {
                        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                        setActiveDropdown(null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-bg-secondary transition-colors text-text-primary"
                    >
                      <Plus className="w-4 h-4 text-text-tertiary" />
                      Insert 3×3 Table
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => { editor.chain().focus().addColumnAfter().run(); setActiveDropdown(null); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-bg-secondary transition-colors text-text-primary"
                      >
                        <ArrowRightFromLine className="w-3.5 h-3.5 text-text-tertiary" />
                        Add Column After
                      </button>
                      <button
                        onClick={() => { editor.chain().focus().addColumnBefore().run(); setActiveDropdown(null); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-bg-secondary transition-colors text-text-primary"
                      >
                        <ArrowLeftFromLine className="w-3.5 h-3.5 text-text-tertiary" />
                        Add Column Before
                      </button>
                      <button
                        onClick={() => { editor.chain().focus().addRowAfter().run(); setActiveDropdown(null); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-bg-secondary transition-colors text-text-primary"
                      >
                        <ArrowDownFromLine className="w-3.5 h-3.5 text-text-tertiary" />
                        Add Row After
                      </button>
                      <button
                        onClick={() => { editor.chain().focus().addRowBefore().run(); setActiveDropdown(null); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-bg-secondary transition-colors text-text-primary"
                      >
                        <ArrowUpFromLine className="w-3.5 h-3.5 text-text-tertiary" />
                        Add Row Before
                      </button>
                      <div className="my-1 h-px bg-border" />
                      <button
                        onClick={() => { editor.chain().focus().deleteColumn().run(); setActiveDropdown(null); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-bg-secondary transition-colors text-danger"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Column
                      </button>
                      <button
                        onClick={() => { editor.chain().focus().deleteRow().run(); setActiveDropdown(null); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-bg-secondary transition-colors text-danger"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Row
                      </button>
                      <button
                        onClick={() => { editor.chain().focus().deleteTable().run(); setActiveDropdown(null); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-bg-secondary transition-colors text-danger"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Table
                      </button>
                    </>
                  )}
              </DropdownContent>
            )}
        </div>
        </div>
      </div>
    </div>
  );
}
