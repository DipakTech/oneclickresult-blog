import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import FileCard from "./FileCard";
import FileRow from "./FileRow";
import { Doc } from "../convex/_generated/dataModel";
import DocumentList from "./DocumentList";

interface FileExplorerProps {
    onFileSelect: (file: Doc<"files">) => void;
    selectedFileId: string | null;
    searchQuery: string;
    viewMode: "grid" | "list";
}

export default function FileExplorer({
    onFileSelect,
    selectedFileId,
    searchQuery,
    viewMode
}: FileExplorerProps) {
    const files = useQuery(api.files.getFiles, { query: searchQuery });

    if (files === undefined) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Documents Section */}
            <section>
                <DocumentList />
            </section>

            {/* Files Section */}
            <section>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Files</h2>
                {viewMode === "list" ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border rounded-lg overflow-hidden">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Modified</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Size</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
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
                            <div className="text-center py-12 text-gray-500">
                                No files found matching "{searchQuery}"
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {files.map((file) => (
                            <FileCard
                                key={file._id}
                                file={file}
                                onClick={() => onFileSelect(file)}
                                isSelected={selectedFileId === file._id}
                            />
                        ))}
                        {files.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                                <div className="bg-gray-100 p-4 rounded-full mb-4">
                                    <span className="text-4xl">📂</span>
                                </div>
                                <p className="text-lg font-medium">No files found</p>
                                {searchQuery ? (
                                    <p className="text-sm">Try adjusting your search</p>
                                ) : (
                                    <p className="text-sm">Upload a file to get started</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
