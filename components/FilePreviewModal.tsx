"use client";

import { X } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

interface FilePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileId: Id<"files">;
    storageId: Id<"_storage">;
    fileName: string;
    fileType: string;
}

export default function FilePreviewModal({
    isOpen,
    onClose,
    storageId,
    fileName,
    fileType,
}: FilePreviewModalProps) {
    const fileUrl = useQuery(api.files.getFileUrl, { storageId });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
            <div className="relative w-full max-w-4xl h-[80vh] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold truncate">{fileName}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 bg-gray-100 flex items-center justify-center p-4 overflow-auto">
                    {fileUrl ? (
                        fileType === "image" ? (
                            <img
                                src={fileUrl}
                                alt={fileName}
                                className="max-w-full max-h-full object-contain"
                            />
                        ) : fileType === "pdf" ? (
                            <iframe
                                src={fileUrl}
                                className="w-full h-full border-none"
                                title={fileName}
                            />
                        ) : (
                            <div className="text-center">
                                <p className="text-gray-500 mb-4">Preview not available for this file type.</p>
                                <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Download File
                                </a>
                            </div>
                        )
                    ) : (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    )}
                </div>
            </div>
        </div>
    );
}
