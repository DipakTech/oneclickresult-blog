import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import FileCard from "./FileCard";
import FileRow from "./FileRow";
import { Doc } from "../convex/_generated/dataModel";
import DocumentList from "./DocumentList";
import { FolderOpen, Upload } from "lucide-react";

interface FileExplorerProps {
  onFileSelect: (file: Doc<"files">) => void;
  selectedFileId: string | null;
  searchQuery: string;
  viewMode: "grid" | "list";
  filterType?: "image" | "video" | "audio" | "other";
  showDraftsOnly?: boolean;
  hideDocuments?: boolean;
  hideFiles?: boolean;
}

export default function FileExplorer({
  onFileSelect,
  selectedFileId,
  searchQuery,
  viewMode,
  filterType,
  showDraftsOnly,
  hideDocuments = false,
  hideFiles = false,
}: FileExplorerProps) {
  const files = useQuery(api.files.getFiles, { query: searchQuery });

  if (files === undefined) {
    return (
      <div className="space-y-10">
        {/* Documents skeleton */}
        {!hideDocuments && (
            <section>
            <DocumentList isDraft={showDraftsOnly} />
            </section>
        )}
        {/* Files skeleton */}
        {!hideFiles && (
            <section>
            <h2 className="text-h3 text-text-primary mb-4">Files</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className="h-40 rounded-card skeleton-shimmer"
                />
                ))}
            </div>
            </section>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Documents Section */}
      {!hideDocuments && (
        <section>
            <DocumentList isDraft={showDraftsOnly} />
        </section>
      )}

      {/* Files Section */}
      {!hideFiles && (
        <section>
            <h2 className="text-h3 text-text-primary mb-4">Files</h2>
        {viewMode === "list" ? (
          <div className="overflow-x-auto rounded-card border border-border bg-surface">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3.5 text-left text-caption text-text-tertiary uppercase tracking-wider font-semibold">
                    Name
                  </th>
                  <th className="px-5 py-3.5 text-left text-caption text-text-tertiary uppercase tracking-wider font-semibold">
                    Owner
                  </th>
                  <th className="px-5 py-3.5 text-left text-caption text-text-tertiary uppercase tracking-wider font-semibold">
                    Last Modified
                  </th>
                  <th className="px-5 py-3.5 text-left text-caption text-text-tertiary uppercase tracking-wider font-semibold">
                    File Size
                  </th>
                  <th className="px-5 py-3.5 text-right text-caption text-text-tertiary uppercase tracking-wider font-semibold" />
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <FileRow
                    key={file._id}
                    file={file}
                    onClick={() => onFileSelect(file)}
                    isSelected={selectedFileId === file._id}
                  />
                ))}
              </tbody>
            </table>
            {files.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-text-tertiary">
                <FolderOpen className="w-10 h-10 mb-3 text-text-tertiary/50" />
                <p className="text-sm font-medium text-text-secondary">
                  No files found
                </p>
                {searchQuery && (
                  <p className="text-caption text-text-tertiary mt-1">
                    Try adjusting your search
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {files.map((file) => (
              <FileCard
                key={file._id}
                file={file}
                onClick={() => onFileSelect(file)}
                isSelected={selectedFileId === file._id}
              />
            ))}
            {files.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-text-tertiary">
                <div className="w-16 h-16 rounded-2xl bg-bg-secondary flex items-center justify-center mb-4">
                  <FolderOpen className="w-8 h-8 text-text-tertiary/50" />
                </div>
                <p className="text-base font-semibold text-text-secondary">
                  No files found
                </p>
                {searchQuery ? (
                  <p className="text-sm text-text-tertiary mt-1">
                    Try adjusting your search
                  </p>
                ) : (
                  <p className="text-sm text-text-tertiary mt-1">
                    Upload a file to get started
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </section>
      )}
    </div>
  );
}
