import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import ResizableImage from "tiptap-extension-resize-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { FontFamily } from "@tiptap/extension-font-family";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Typography } from "@tiptap/extension-typography";
import { CharacterCount } from "@tiptap/extension-character-count";
import { Focus } from "@tiptap/extension-focus";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { Gapcursor } from "@tiptap/extension-gapcursor";
import { common, createLowlight } from "lowlight";

const lowlight = createLowlight(common);

/**
 * Get the complete set of Tiptap extensions for the advanced editor
 */
export function getEditorExtensions() {
  return [
    // Core editing
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
      },
      codeBlock: false, // Using CodeBlockLowlight instead
    }),

    // Placeholder
    Placeholder.configure({
      placeholder: "Type '/' for commands, or start writing...",
    }),

    // Text styling
    TextStyle,
    Color,
    Highlight.configure({
      multicolor: true,
    }),
    FontFamily.configure({
      types: ["textStyle"],
    }),
    Underline,
    Subscript,
    Superscript,
    Typography,

    // Alignment
    TextAlign.configure({
      types: ["heading", "paragraph"],
      alignments: ["left", "center", "right", "justify"],
    }),

    // Images
    ResizableImage.configure({
      inline: false,
      allowBase64: false,
    }),

    // Code blocks
    CodeBlockLowlight.configure({
      lowlight,
      defaultLanguage: "javascript",
    }),

    // Links
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: "text-primary underline hover:text-primary-hover cursor-pointer",
      },
    }),

    // Tables
    Table.configure({
      resizable: true,
      HTMLAttributes: {
        class: "border-collapse table-auto w-full",
      },
    }),
    TableRow,
    TableHeader.configure({
      HTMLAttributes: {
        class: "border border-border bg-bg-secondary font-semibold p-2",
      },
    }),
    TableCell.configure({
      HTMLAttributes: {
        class: "border border-border p-2",
      },
    }),

    // Task lists
    TaskList.configure({
      HTMLAttributes: {
        class: "not-prose",
      },
    }),
    TaskItem.configure({
      nested: true,
      HTMLAttributes: {
        class: "flex items-start gap-2",
      },
    }),

    // Utilities
    CharacterCount,
    Focus.configure({
      className: "has-focus",
      mode: "all",
    }),
    Dropcursor.configure({
      color: "#3b82f6",
      width: 2,
    }),
    Gapcursor,
  ];
}

/**
 * Font family options for the editor
 */
export const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Roboto", value: "Roboto, sans-serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
  { label: "Verdana", value: "Verdana, sans-serif" },
] as const;

/**
 * Font size options for the editor
 */
export const FONT_SIZES = [
  { label: "Small", value: "14px" },
  { label: "Normal", value: "16px" },
  { label: "Medium", value: "18px" },
  { label: "Large", value: "24px" },
  { label: "Extra Large", value: "32px" },
] as const;

/**
 * Common color palette for text and highlights
 */
export const COLOR_PALETTE = [
  "#000000", // Black
  "#ffffff", // White
  "#ef4444", // Red
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#6b7280", // Gray
] as const;
