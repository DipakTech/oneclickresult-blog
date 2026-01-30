"use client";

import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { useState } from "react";
import { ImageIcon, X, Loader2 } from "lucide-react";
import { getRandomGradient } from "../lib/gradients";
import ConfirmDialog from "./ConfirmDialog";

interface CoverImageProps {
    url?: string | null;
    documentId: string;
    editable?: boolean;
    onRemove?: () => void;
    onUpload?: (file: File) => Promise<void>;
    children?: React.ReactNode;
}

export default function CoverImage({
    url,
    documentId,
    editable = false,
    onRemove,
    onUpload,
    children
}: CoverImageProps) {
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const [isHovered, setIsHovered] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !onUpload) return;

        setIsUploading(true);
        try {
            await onUpload(file);
        } catch (error) {
            console.error("Failed to upload cover image:", error);
            alert("Failed to upload cover image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const gradient = getRandomGradient(documentId);

    return (
        <div 
            className={`relative w-full h-[35vh] min-h-[250px] group transition-all duration-300 overflow-hidden ${url ? "bg-gray-100" : `bg-gradient-to-r ${gradient}`}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image display */}
            {url && (
                <img
                    src={url}
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
            )}

            {/* Overlay for better text readability */}
            <div className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${url ? 'bg-black/30' : 'bg-black/10'}`} />

            {/* Editable Controls */}
            {editable && (
                <div className={`absolute bottom-4 right-8 flex gap-2 transition-opacity duration-200 z-20 ${isHovered || isUploading ? "opacity-100" : "opacity-0"}`}>
                    <label className="cursor-pointer group/button">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            className="hidden"
                            disabled={isUploading}
                        />
                        <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white/90 hover:bg-white backdrop-blur-sm rounded-md shadow-sm transition-colors">
                            {isUploading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <ImageIcon className="w-4 h-4" />
                            )}
                            Change cover
                        </div>
                    </label>

                    {url && onRemove && (
                        <button
                            onClick={() => setDeleteDialogOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white/90 hover:bg-white backdrop-blur-sm rounded-md shadow-sm transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Remove
                        </button>
                    )}
                </div>
            )}

            {/* Content Overlay (Title) */}
            {children && (
                <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                    <div className="max-w-4xl mx-auto px-4">
                        {children}
                    </div>
                </div>
            )}

             <ConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={() => {
                    onRemove?.();
                    setDeleteDialogOpen(false);
                }}
                title="Remove Cover Image"
                description="Are you sure you want to remove the cover image? This will restore the random gradient."
                confirmText="Remove"
                variant="danger"
            />
        </div>
    );
}
