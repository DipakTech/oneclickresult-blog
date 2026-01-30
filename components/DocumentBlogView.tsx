"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import dynamic from "next/dynamic";
import { Calendar, Edit } from "lucide-react";
import { useRouter } from "next/navigation";

const Editor = dynamic(() => import("./Editor"), { ssr: false });

interface DocumentBlogViewProps {
    documentId: Id<"documents">;
}

export default function DocumentBlogView({ documentId }: DocumentBlogViewProps) {
    const document = useQuery(api.documents.getDocument, { id: documentId });
    const router = useRouter();

    if (document === undefined) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (document === null) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <div className="text-xl text-gray-500">Document not found</div>
            </div>
        );
    }

    const publicationDate = new Date(document._creationTime);
    const formattedDate = publicationDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <article className="min-h-screen bg-white">
            <div className="max-w-3xl mx-auto px-6 py-12">
                {/* Header Section */}
                <header className="mb-12">
                    <div className="flex items-start justify-between gap-4 mb-6">
                        <h1 className="text-5xl font-bold text-gray-900 leading-tight flex-1">
                            {document.title || "Untitled"}
                        </h1>
                        <button
                            onClick={() => router.push(`/documents/${documentId}`)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors whitespace-nowrap"
                            title="Edit document"
                        >
                            <Edit className="w-4 h-4" />
                            Edit
                        </button>
                    </div>
                    
                    {/* Publication Date */}
                    <div className="flex items-center gap-2 text-gray-600 mb-8">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={publicationDate.toISOString()}>
                            {formattedDate}
                        </time>
                    </div>

                    {/* Cover Image */}
                    {document.coverImageUrl && (
                        <div className="relative w-full mb-8 rounded-lg overflow-hidden shadow-xl">
                            <img
                                src={document.coverImageUrl}
                                alt={document.title}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    )}
                </header>

                {/* Content Section */}
                <div className="prose prose-lg prose-gray max-w-none">
                    <Editor
                        documentId={documentId}
                        initialContent={document.content}
                        editable={false}
                    />
                </div>
            </div>
        </article>
    );
}
