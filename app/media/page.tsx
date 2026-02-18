"use client";

import FileExplorer from "../../components/FileExplorer";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import FileUploader from "../../components/FileUploader";
import { useState } from "react";
import { Doc } from "../../convex/_generated/dataModel";
import { LayoutGrid, List as ListIcon, Upload } from "lucide-react";
import FileDetailsSidebar from "../../components/FileDetailsSidebar";

import { Suspense } from "react";

export default function MediaPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MediaPageContent />
    </Suspense>
  );
}

function MediaPageContent() {
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-h2 text-text-primary">Media Library</h2>
                <p className="text-text-secondary">
                  Manage images, videos, and other assets.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-bg-secondary rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-surface shadow-sm text-primary" : "text-text-tertiary hover:text-text-secondary"}`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-surface shadow-sm text-primary" : "text-text-tertiary hover:text-text-secondary"}`}
                  >
                    <ListIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-card border border-border shadow-sm mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-text-primary">
                  Quick Upload
                </h3>
              </div>
              <FileUploader />
            </div>

            <FileExplorer
              onFileSelect={setSelectedFile}
              selectedFileId={selectedFile?._id ?? null}
              searchQuery={searchQuery}
              viewMode={viewMode}
              filterType="image" // Defaulting to image logic or general media
              hideDocuments={true}
            />
          </div>
        </main>
      </div>
      {/* File Details Sidebar - Right Side */}
      {selectedFile && (
        <FileDetailsSidebar
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onDelete={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
}
