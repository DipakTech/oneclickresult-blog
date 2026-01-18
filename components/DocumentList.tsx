"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { FileText, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DocumentList() {
    const documents = useQuery(api.documents.getDocuments);
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

    if (documents === undefined) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Documents</h2>
                <button
                    onClick={handleCreateDocument}
                    disabled={isCreating}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    <Plus className="w-4 h-4 mr-1" />
                    New Document
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Create New Card */}
                <button
                    onClick={handleCreateDocument}
                    disabled={isCreating}
                    className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors">
                        <Plus className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Create New</span>
                </button>

                {/* Document Cards */}
                {documents?.map((doc) => (
                    <div
                        key={doc._id}
                        onClick={() => router.push(`/documents/${doc._id}`)}
                        className="relative group bg-white border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer flex flex-col h-40 justify-between"
                    >
                        <div className="flex items-start justify-between">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <FileText className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900 truncate" title={doc.title}>
                                {doc.title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                {new Date(doc._creationTime).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
