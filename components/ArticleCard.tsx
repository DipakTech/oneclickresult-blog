import { Doc } from "../convex/_generated/dataModel";
import { getRandomGradient } from "../lib/gradients";
import Link from "next/link";

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

  return (
    <Link
      href={`/articles/${document.slug || document._id}`}
      className="group flex flex-col bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image: 16:9 ratio */}
      <div className={`aspect-video w-full relative overflow-hidden ${document.coverImageUrl ? "bg-bg-secondary" : `bg-gradient-to-r ${gradient}`}`}>
        {document.coverImageUrl && (
          <img
            src={document.coverImageUrl}
            alt={document.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
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
  );
}
