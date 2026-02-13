import { Doc } from "../convex/_generated/dataModel";
import { getRandomGradient } from "../lib/gradients";
import Link from "next/link";
import { Edit2 } from "lucide-react";

interface ArticleCardProps {
  document: Doc<"documents"> & { coverImageUrl?: string | null };
}

export default function ArticleCard({ document }: ArticleCardProps) {
  // Simple read time estimate
  let readTime = 1;
  try {
      const wordCount = document.content 
        ? JSON.parse(document.content)?.content?.reduce((acc: number, node: any) => 
            acc + (node.content ? node.content.reduce((a: number, n: any) => 
              a + (n.text ? n.text.split(' ').length : 0), 0) : 0), 0) || 0 
        : 0;
      readTime = Math.max(1, Math.ceil(wordCount / 200));
  } catch (e) {
      // Fallback if content parsing fails
      readTime = 1;
  }

  const gradient = getRandomGradient(document._id);
  const authorInitial = document.authorName ? document.authorName[0].toUpperCase() : "U";

  // Link destination: Slug if published, Editor if draft
  const href = document.isPublished && document.slug 
    ? `/articles/${document.slug}` 
    : `/documents/${document._id}`;

  return (
    <div className="group relative flex flex-col bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <Link href={href} className="flex-1 flex flex-col">
        {/* Image: 16:9 ratio */}
        <div className={`aspect-video w-full relative overflow-hidden ${document.coverImageUrl ? "bg-bg-secondary" : `bg-gradient-to-r ${gradient}`}`}>
            {document.coverImageUrl && (
            <img
                src={document.coverImageUrl}
                alt={document.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            )}
            
            {/* Status Badge */}
            <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-[10px] font-bold text-white uppercase tracking-wider">
                {document.isPublished ? "Published" : "Draft"}
            </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
            {/* Meta */}
            <div className="flex items-center text-[11px] font-bold text-primary mb-3 tracking-wider uppercase">
            <span>ARTICLE</span>
            <span className="mx-2 text-text-tertiary">•</span>
            <span>{readTime} MIN READ</span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-text-primary mb-3 leading-snug line-clamp-3 group-hover:text-primary transition-colors">
            {document.title || "Untitled"}
            </h3>

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-xs text-text-secondary">
            <div className="flex items-center gap-2">
                {document.authorImageUrl ? (
                    <img src={document.authorImageUrl} alt={document.authorName || "Author"} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {authorInitial}
                    </div>
                )}
                <span className="font-medium">{document.authorName || "Unknown Author"}</span>
            </div>
            <time className="text-text-tertiary">
                {new Date(document._creationTime).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                })}
            </time>
            </div>
        </div>
      </Link>

      {/* Edit Button (Absolute Positioned, allows quick edit access) */}
      <Link
        href={`/documents/${document._id}`}
        className="absolute top-3 left-3 p-2 bg-white/90 hover:bg-white text-text-primary rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-10"
        title="Edit Article"
        onClick={(e) => e.stopPropagation()} // Prevent triggering main link if nested (though it's absolute so likely distinct click target)
      >
        <Edit2 className="w-4 h-4" />
      </Link>
    </div>
  );
}
