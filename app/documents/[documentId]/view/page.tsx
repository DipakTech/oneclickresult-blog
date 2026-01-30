import { Id } from "../../../../convex/_generated/dataModel";
import DocumentBlogView from "../../../../components/DocumentBlogView";

interface DocumentViewPageProps {
  params: Promise<{
    documentId: Id<"documents">;
  }>;
}

export default async function DocumentViewPage({
  params,
}: DocumentViewPageProps) {
  const { documentId } = await params;
  return <DocumentBlogView documentId={documentId} />;
}
