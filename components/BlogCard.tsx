"use client";

import { Doc } from "../convex/_generated/dataModel";
import { getRandomGradient } from "../lib/gradients";
import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";

interface BlogCardProps {
  document: Doc<"documents"> & { coverImageUrl?: string | null };
  featured?: boolean;
}

export default function BlogCard({ document, featured = false }: BlogCardProps) {
  // Read time estimate
  let readTime = 1;
  try {
    if (document.readingTime) {
      readTime = document.readingTime;
    } else if (document.content) {
      const wordCount = JSON.parse(document.content)?.content?.reduce(
        (acc: number, node: any) =>
          acc +
          (node.content
            ? node.content.reduce(
                (a: number, n: any) =>
                  a + (n.text ? n.text.split(" ").length : 0),
                0
              )
            : 0),
        0
      ) || 0;
      readTime = Math.max(1, Math.ceil(wordCount / 200));
    }
  } catch {
    readTime = 1;
  }

  const gradient = getRandomGradient(document._id);
  const authorInitial = document.authorName
    ? document.authorName[0].toUpperCase()
    : "A";

  const href =
    document.isPublished && document.slug
      ? `/articles/${document.slug}`
      : `/articles/${document._id}`;

  const formattedDate = new Date(document._creationTime).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  // Extract a short description from metaDescription or content
  let description = document.metaDescription || "";
  if (!description && document.content) {
    try {
      const json = JSON.parse(document.content);
      let text = "";
      function traverse(node: any) {
        if (node.type === "text") text += node.text + " ";
        if (node.content && Array.isArray(node.content))
          node.content.forEach(traverse);
      }
      traverse(json);
      description = text.trim().slice(0, 160);
      if (text.trim().length > 160) description += "...";
    } catch {
      description = "";
    }
  }

  if (featured) {
    return (
      <Link href={href} className="group block">
        <article className="relative grid grid-cols-1 lg:grid-cols-2 gap-0 bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-card-hover transition-all duration-500">
          {/* Image */}
          <div
            className={`aspect-[16/10] lg:aspect-auto lg:min-h-[400px] relative overflow-hidden ${
              document.coverImageUrl
                ? "bg-bg-secondary"
                : `bg-gradient-to-br ${gradient}`
            }`}
          >
            {document.coverImageUrl && (
              <img
                src={document.coverImageUrl}
                alt={document.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Content */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-5">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full tracking-wide uppercase">
                Featured
              </span>
              <span className="flex items-center gap-1 text-text-tertiary text-xs">
                <Clock className="w-3.5 h-3.5" />
                {readTime} min read
              </span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary leading-tight mb-4 group-hover:text-primary transition-colors duration-300 line-clamp-3">
              {document.title || "Untitled"}
            </h2>

            {description && (
              <p className="text-text-secondary text-base leading-relaxed mb-6 line-clamp-3">
                {description}
              </p>
            )}

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-border">
              <div className="flex items-center gap-3">
                {document.authorImageUrl ? (
                  <img
                    src={document.authorImageUrl}
                    alt={document.authorName || "Author"}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-border"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {authorInitial}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {document.authorName || "Unknown Author"}
                  </p>
                  <time className="text-xs text-text-tertiary">
                    {formattedDate}
                  </time>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                <ArrowUpRight className="w-4 h-4 text-text-tertiary group-hover:text-white transition-colors duration-300" />
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={href} className="group block">
      <article className="h-full flex flex-col bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-400">
        {/* Image */}
        <div
          className={`aspect-[16/10] relative overflow-hidden ${
            document.coverImageUrl
              ? "bg-bg-secondary"
              : `bg-gradient-to-br ${gradient}`
          }`}
        >
          {document.coverImageUrl && (
            <img
              src={document.coverImageUrl}
              alt={document.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Meta row */}
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center gap-1 text-text-tertiary text-xs font-medium">
              <Clock className="w-3.5 h-3.5" />
              {readTime} min read
            </span>
            <span className="text-border">·</span>
            <time className="text-xs text-text-tertiary">{formattedDate}</time>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-text-primary leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {document.title || "Untitled"}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-sm text-text-secondary leading-relaxed mb-5 line-clamp-2 flex-1">
              {description}
            </p>
          )}

          {/* Author */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-light">
            <div className="flex items-center gap-2.5">
              {document.authorImageUrl ? (
                <img
                  src={document.authorImageUrl}
                  alt={document.authorName || "Author"}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  {authorInitial}
                </div>
              )}
              <span className="text-sm font-medium text-text-primary">
                {document.authorName || "Unknown Author"}
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </article>
    </Link>
  );
}
