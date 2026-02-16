"use client";

import { Calendar, Clock, Eye, User } from "lucide-react";
import { getRandomGradient } from "../lib/gradients";

interface ArticleHeaderProps {
  title: string;
  coverImageUrl?: string | null;
  authorName?: string;
  authorImageUrl?: string;
  publishedDate: string;
  readTime?: number;
  viewCount?: number;
  documentId: string;
}

export default function ArticleHeader({
  title,
  coverImageUrl,
  authorName,
  authorImageUrl,
  publishedDate,
  readTime,
  viewCount,
  documentId,
}: ArticleHeaderProps) {
  const gradient = getRandomGradient(documentId);

  return (
    <div className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={title}
            className="w-full h-full object-cover blur-md scale-105"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradient} blur-md scale-105`}
          />
        )}
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 tracking-tight drop-shadow-sm">
          {title}
        </h1>

        {/* Metadata Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm md:text-base font-medium text-gray-200">
            {/* Author */}
            <div className="flex items-center gap-2">
                {authorImageUrl ? (
                    <img src={authorImageUrl} alt={authorName} className="w-8 h-8 rounded-full border border-white/20" />
                ) : (
                     <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                        <User className="w-4 h-4" />
                     </div>
                )}
                <span>{authorName || "Unknown Author"}</span>
            </div>

            <div className="w-1 h-1 rounded-full bg-gray-400" />

          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <time>{publishedDate}</time>
          </div>

          {(readTime || viewCount) && <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-400" />}

          {/* Read Time */}
          {readTime && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{readTime} min read</span>
            </div>
          )}

           {viewCount !== undefined && viewCount > 0 && (
             <>
                <div className="w-1 h-1 rounded-full bg-gray-400" />
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{viewCount} views</span>
                </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
