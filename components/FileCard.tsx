"use client";

import { FileText, Image as ImageIcon, MoreVertical, File } from "lucide-react";
import { Doc } from "../convex/_generated/dataModel";

interface FileCardProps {
  file: Doc<"files">;
  onClick: () => void;
  isSelected?: boolean;
}

export default function FileCard({ file, onClick, isSelected }: FileCardProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-8 h-8 text-accent-purple" />;
      case "pdf":
        return <FileText className="w-8 h-8 text-danger" />;
      case "csv":
        return <FileText className="w-8 h-8 text-success" />;
      default:
        return <File className="w-8 h-8 text-text-tertiary" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        group rounded-card overflow-hidden cursor-pointer
        bg-surface border border-border
        hover-lift hover:shadow-card-hover
        transition-shadow duration-200
        flex flex-col
        ${isSelected ? "ring-2 ring-primary bg-primary-subtle" : ""}
      `}
    >
      {/* Thumbnail Area */}
      <div className="aspect-[4/3] bg-bg-secondary flex items-center justify-center relative overflow-hidden">
        {file.type === "image" && (file as any).url ? (
          <img
            src={(file as any).url}
            alt={file.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-text-tertiary/30">{getIcon(file.type)}</div>
        )}

        {/* Three-dot menu */}
        <button
          className="
            absolute top-2.5 right-2.5
            opacity-0 group-hover:opacity-100
            p-1.5 bg-black/30 hover:bg-black/50
            rounded-lg transition-all duration-200
            backdrop-blur-sm
          "
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-md bg-bg-secondary flex items-center justify-center flex-shrink-0">
            {getIcon(file.type)}
          </div>
          <span
            className="font-medium text-sm text-text-primary truncate"
            title={file.name}
          >
            {file.name}
          </span>
        </div>
        <div className="flex items-center justify-between text-caption text-text-tertiary mt-2">
          <span className="font-mono text-[11px]">
            {(file.size / 1024).toFixed(1)} KB
          </span>
          <span className="font-mono text-[11px]">Today</span>
        </div>
      </div>
    </div>
  );
}
