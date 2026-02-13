"use client";

import {
  X,
  FileText,
  Image as ImageIcon,
  File,
  Download,
  Trash2,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Doc } from "../convex/_generated/dataModel";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

interface FileDetailsSidebarProps {
  file: Doc<"files"> | null;
  onClose: () => void;
  onDelete?: () => void;
}

export default function FileDetailsSidebar({
  file,
  onClose,
  onDelete,
}: FileDetailsSidebarProps) {
  const fileUrl = useQuery(
    api.files.getFileUrl,
    file ? { storageId: file.storageId } : "skip"
  );
  const deleteFile = useMutation(api.files.deleteFile);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!file) return;
    setIsDeleting(true);
    try {
      await deleteFile({ id: file._id });
      setDeleteDialogOpen(false);
      onClose();
      onDelete?.();
    } catch (error) {
      console.error("Failed to delete file:", error);
      alert("Failed to delete file. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!file) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-12 h-12 text-accent-purple" />;
      case "pdf":
        return <FileText className="w-12 h-12 text-danger" />;
      case "csv":
        return <FileText className="w-12 h-12 text-success" />;
      default:
        return <File className="w-12 h-12 text-text-tertiary" />;
    }
  };

  return (
    <aside className="w-80 bg-surface border-l border-border h-full flex flex-col animate-fade-in z-10">
      {/* Header */}
      <div className="flex items-center justify-between px-5 h-18 border-b border-border">
        <h2 className="font-semibold text-text-primary text-base truncate pr-4">
          {file.name}
        </h2>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-bg-secondary rounded-lg transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4 text-text-tertiary" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {/* Preview Section */}
        <div className="bg-bg-secondary rounded-card border border-border flex items-center justify-center min-h-[200px] mb-6 overflow-hidden">
          {fileUrl ? (
            file.type === "image" ? (
              <img
                src={fileUrl}
                alt={file.name}
                className="max-w-full max-h-[300px] object-contain"
              />
            ) : (
              <div className="flex flex-col items-center py-8">
                {getIcon(file.type)}
                <p className="text-caption text-text-tertiary mt-3">
                  No preview available
                </p>
              </div>
            )
          ) : (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary/30 border-t-primary" />
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-4">
          <h3 className="text-caption text-text-tertiary uppercase tracking-wider font-semibold pb-2 border-b border-border">
            File Details
          </h3>

          <div className="space-y-3">
            <div>
              <p className="text-[11px] text-text-tertiary uppercase font-semibold tracking-wider mb-0.5">
                Type
              </p>
              <p className="text-sm text-text-primary capitalize font-medium">
                {file.type}
              </p>
            </div>

            <div>
              <p className="text-[11px] text-text-tertiary uppercase font-semibold tracking-wider mb-0.5">
                Size
              </p>
              <p className="text-sm text-text-primary font-mono">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>

            <div>
              <p className="text-[11px] text-text-tertiary uppercase font-semibold tracking-wider mb-0.5">
                Storage ID
              </p>
              <p
                className="text-xs text-text-secondary font-mono truncate"
                title={file.storageId}
              >
                {file.storageId}
              </p>
            </div>
          </div>

          {/* Actions */}
          {fileUrl && (
            <div className="pt-4 space-y-2">
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex items-center justify-center gap-2 w-full
                  h-11 rounded-btn
                  bg-primary text-white text-sm font-semibold
                  hover:bg-primary-hover
                  transition-colors duration-200
                "
              >
                <Download className="w-4 h-4" />
                Download
              </a>
              <button
                onClick={() => setDeleteDialogOpen(true)}
                className="
                  flex items-center justify-center gap-2 w-full
                  h-11 rounded-btn
                  bg-danger text-white text-sm font-semibold
                  hover:bg-red-600
                  transition-colors duration-200
                "
              >
                <Trash2 className="w-4 h-4" />
                Delete File
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete File"
        description="Are you sure you want to delete this file? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </aside>
  );
}
