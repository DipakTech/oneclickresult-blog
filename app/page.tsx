"use client";

import FileExplorer from "../components/FileExplorer";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import FileDetailsSidebar from "../components/FileDetailsSidebar";
import { useState } from "react";
import { Doc } from "../convex/_generated/dataModel";

import { LayoutGrid, List as ListIcon } from "lucide-react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<Doc<"files"> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full">
        <Header onSearch={setSearchQuery} />

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Files</h2>
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <ListIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <FileExplorer
                onFileSelect={setSelectedFile}
                selectedFileId={selectedFile?._id ?? null}
                searchQuery={searchQuery}
                viewMode={viewMode}
              />
            </div>
          </main>

          {/* Right Sidebar for Details */}
          {selectedFile && (
            <FileDetailsSidebar
              file={selectedFile}
              onClose={() => setSelectedFile(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
