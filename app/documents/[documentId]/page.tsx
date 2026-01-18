import { Id } from "../../../convex/_generated/dataModel";
import DocumentEditor from "./DocumentEditor";

interface DocumentPageProps {
    params: Promise<{
        documentId: Id<"documents">;
    }>;
}

export default async function DocumentPage({ params }: DocumentPageProps) {
    const { documentId } = await params;
    return <DocumentEditor documentId={documentId} />;
}
