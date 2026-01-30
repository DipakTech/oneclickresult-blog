"use client";

import { X, FileText, Image as ImageIcon, File, Download, Trash2 } from "lucide-react";
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

export default function FileDetailsSidebar({ file, onClose, onDelete }: FileDetailsSidebarProps) {
    const fileUrl = useQuery(api.files.getFileUrl,
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
                return <ImageIcon className="w-12 h-12 text-purple-500" />;
            case "pdf":
                return <FileText className="w-12 h-12 text-red-500" />;
            case "csv":
                return <FileText className="w-12 h-12 text-green-500" />;
            default:
                return <File className="w-12 h-12 text-gray-400" />;
        }
    };

    return (
        <aside className="w-80 bg-white border-l h-full flex flex-col shadow-xl z-10 transition-transform">
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-semibold text-gray-700 text-lg">{file.name}</h2>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {/* Preview Section */}
                <div className="bg-gray-50 rounded-lg border flex items-center justify-center min-h-[200px] mb-6 overflow-hidden relative">
                    {fileUrl ? (
                        file.type === "image" ? (
                            <img src={fileUrl} alt={file.name} className="max-w-full max-h-[300px] object-contain" />
                        ) : (
                            <div className="flex flex-col items-center">
                                {getIcon(file.type)}
                                <p className="text-sm text-gray-500 mt-2">No preview available</p>
                            </div>
                        )
                    ) : (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    )}
                </div>

                {/* Details Section */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 border-b pb-2">File Details</h3>

                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Type</p>
                        <p className="text-sm text-gray-800 capitalize">{file.type}</p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Size</p>
                        <p className="text-sm text-gray-800">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Storage ID</p>
                        <p className="text-xs text-gray-600 font-mono truncate" title={file.storageId}>{file.storageId}</p>
                    </div>

                    {/* Download Button */}
                    {fileUrl && (
                        <div className="pt-4 space-y-2">
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </a>
                            <button
                                onClick={() => setDeleteDialogOpen(true)}
                                className="flex items-center justify-center w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
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
