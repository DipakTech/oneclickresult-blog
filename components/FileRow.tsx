"use client";

import { FileText, Image as ImageIcon, File, MoreVertical } from "lucide-react";
import { Doc } from "../convex/_generated/dataModel";

interface FileRowProps {
  file: Doc<"files"> & { url: string | null };
  onClick: () => void;
  isSelected?: boolean;
}

export default function FileRow({ file, onClick, isSelected }: FileRowProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-5 h-5 text-accent-purple" />;
      case "pdf":
        return <FileText className="w-5 h-5 text-danger" />;
      case "csv":
        return <FileText className="w-5 h-5 text-success" />;
      default:
        return <File className="w-5 h-5 text-text-tertiary" />;
    }
  };

  return (
    <tr
      onClick={onClick}
      className={`
        group h-14 border-b border-border
        hover:bg-bg-secondary cursor-pointer
        transition-colors duration-150
        ${isSelected ? "bg-primary-subtle hover:bg-primary-subtle" : ""}
      `}
    >
      <td className="px-5 py-3 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-bg-secondary rounded-lg">
            {file.type === "image" && file.url ? (
              <img
                src={file.url}
                alt=""
                className="h-8 w-8 object-cover rounded-lg"
              />
            ) : (
              getIcon(file.type)
            )}
          </div>
          <span
            className="text-sm font-medium text-text-primary truncate max-w-[240px]"
            title={file.name}
          >
            {file.name}
          </span>
        </div>
      </td>
      <td className="px-5 py-3 whitespace-nowrap text-sm text-text-secondary">
        Me
      </td>
      <td className="px-5 py-3 whitespace-nowrap text-sm text-text-secondary font-mono text-[13px]">
        Today
      </td>
      <td className="px-5 py-3 whitespace-nowrap text-sm text-text-secondary font-mono text-[13px]">
        {(file.size / 1024).toFixed(2)} KB
      </td>
      <td className="px-5 py-3 whitespace-nowrap text-right">
        <button
          className="
            opacity-0 group-hover:opacity-100
            p-1.5 rounded-lg
            text-text-tertiary hover:text-text-primary hover:bg-surface
            transition-all duration-150
          "
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}
