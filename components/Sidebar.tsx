"use client";

import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useRouter } from "next/navigation";
import { Plus, HardDrive, Clock, Star, Trash2, Cloud, LayoutDashboard } from "lucide-react";
import FileUploader from "./FileUploader";
import { useState } from "react";

export default function Sidebar() {
    const createDocument = useMutation(api.documents.createDocument);
    const router = useRouter();

    const [isCreating, setIsCreating] = useState(false);

    const handleCreateDocument = async () => {
        if (isCreating) return;
        setIsCreating(true);
        try {
            const documentId = await createDocument({ title: "Untitled" });
            router.push(`/documents/${documentId}`);
        } catch (error) {
            console.error("Failed to create document:", error);
            alert("Failed to create document. Please try again.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <aside className="w-64 bg-white border-r flex flex-col h-full hidden md:flex">
            <div className="p-4">
                <div className="flex items-center mb-8 px-2">
                    <span className="text-2xl mr-2">📂</span>
                    <h1 className="text-xl font-bold text-gray-700">My Drive</h1>
                </div>

                <div className="space-y-2">
                    <button
                        onClick={handleCreateDocument}
                        disabled={isCreating}
                        className={`w-full flex items-center justify-center px-4 py-3 bg-white border border-gray-300 shadow-sm rounded-full text-gray-700 font-medium hover:bg-gray-50 hover:shadow transition-all mb-4 ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isCreating ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                        ) : (
                            <Plus className="w-5 h-5 mr-2 text-blue-600" />
                        )}
                        {isCreating ? "Creating..." : "New Document"}
                    </button>

                    <FileUploader />
                </div>
            </div>

            {/* <nav className="space-y-1 flex-1">
                <a href="#" className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-r-full font-medium">
                    <HardDrive className="w-5 h-5 mr-3" />
                    My Drive
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-full">
                    <LayoutDashboard className="w-5 h-5 mr-3" />
                    Shared with me
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-full">
                    <Star className="w-5 h-5 mr-3" />
                    Starred
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-full">
                    <Trash2 className="w-5 h-5 mr-3" />
                    Trash
                </a>
            </nav> */}

            <div className="mt-auto px-4 py-4 border-t">
                <div className="text-xs text-gray-500">
                    <p className="font-semibold text-gray-700 mb-1">Storage</p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                        <div className="bg-blue-600 h-1.5 rounded-full w-1/4"></div>
                    </div>
                    <p>1.2 GB of 15 GB used</p>
                </div>
            </div>
        </aside>
    );
}
