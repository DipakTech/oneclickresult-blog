"use client";

import FileExplorer from "../../components/FileExplorer";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useState } from "react";
import { Doc } from "../../convex/_generated/dataModel";
import { LayoutGrid, List as ListIcon } from "lucide-react";

export default function DraftsPage() {
    const [selectedFile, setSelectedFile] = useState<Doc<"files"> | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-bg overflow-hidden">
            <Sidebar
                isOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col h-full">
                <Header
                    onSearch={setSearchQuery}
                    onMenuClick={() => setIsMobileSidebarOpen(true)}
                />

                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-h2 text-text-primary">Drafts</h2>
                            <div className="flex items-center bg-bg-secondary rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-surface shadow-sm text-primary' : 'text-text-tertiary hover:text-text-secondary'}`}
                                >
                                    <LayoutGrid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-surface shadow-sm text-primary' : 'text-text-tertiary hover:text-text-secondary'}`}
                                >
                                    <ListIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        
                        <p className="text-text-secondary mb-6">Manage your unpublished work.</p>

                        <FileExplorer
                            onFileSelect={setSelectedFile}
                            selectedFileId={selectedFile?._id ?? null}
                            searchQuery={searchQuery}
                            viewMode={viewMode}
                            showDraftsOnly={true}
                            hideFiles={true}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}
