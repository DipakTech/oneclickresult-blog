"use client";

import { FileText, Image as ImageIcon, MoreVertical, File } from "lucide-react";
import { Doc } from "../convex/_generated/dataModel";
// Removed: import { useState } from "react";
// Removed: import FilePreviewModal from "./FilePreviewModal";

interface FileCardProps {
    file: Doc<"files">;
    onClick: () => void;
    isSelected?: boolean;
}

export default function FileCard({ file, onClick, isSelected }: FileCardProps) {
    // Removed: const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const getIcon = (type: string) => {
        switch (type) {
            case "image":
                return <ImageIcon className="w-8 h-8 text-purple-500" />;
            case "pdf":
                return <FileText className="w-8 h-8 text-red-500" />;
            case "csv":
                return <FileText className="w-8 h-8 text-green-500" />;
            default:
                return <File className="w-8 h-8 text-gray-400" />;
        }
    };

    return (
        <div
            onClick={onClick}
            className={`group border rounded-xl p-3 shadow-sm hover:shadow-md transition-all bg-white cursor-pointer flex flex-col ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 truncate">
                    <div className="p-1 bg-gray-50 rounded">
                        {getIcon(file.type)}
                    </div>
                    <span className="font-medium text-sm text-gray-700 truncate max-w-[120px]" title={file.name}>
                        {file.name}
                    </span>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded-full transition-opacity">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
            </div>

            <div className="flex-1 bg-gray-50 rounded-lg flex items-center justify-center mb-2 min-h-[100px] overflow-hidden relative">
                {/* Thumbnail */}
                {file.type === 'image' && (file as any).url ? (
                    <img src={(file as any).url} alt={file.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="text-gray-300">
                        {getIcon(file.type)}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                <span>{(file.size / 1024).toFixed(1)} KB</span>
                <span>Today</span> {/* TODO: Add real date */}
            </div>
        </div>
    );
}
