import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    files: defineTable({
        name: v.string(),
        type: v.union(v.literal("image"), v.literal("csv"), v.literal("pdf"), v.literal("other")),
        storageId: v.id("_storage"),
        size: v.number(),
        userId: v.optional(v.string()),
        shareToken: v.optional(v.string()), // For generating shareable links
    })
        .index("by_userId", ["userId"])
        .index("by_shareToken", ["shareToken"])
        .searchIndex("search_name", {
            searchField: "name",
        }),
    documents: defineTable({
        title: v.string(),
        content: v.optional(v.string()),
        coverImageId: v.optional(v.union(v.id("_storage"), v.null())),
        userId: v.optional(v.string()),
        isPublished: v.optional(v.boolean()),
        slug: v.optional(v.string()), // URL-friendly slug
        authorName: v.optional(v.string()),
        authorImageUrl: v.optional(v.string()),
        
        // SEO Metadata
        metaTitle: v.optional(v.string()), // Custom title for search engines (60 chars)
        metaDescription: v.optional(v.string()), // 150-160 characters
        metaKeywords: v.optional(v.array(v.string())), // Target keywords
        ogImageId: v.optional(v.id("_storage")), // Open Graph image (1200x630)
        canonicalUrl: v.optional(v.string()), // Canonical URL if needed
        focusKeyphrase: v.optional(v.string()), // Primary keyword for SEO
        
        // Analytics & Tracking
        readingTime: v.optional(v.number()), // Minutes (auto-calculated)
        lastModified: v.optional(v.number()), // Last edit timestamp
        viewCount: v.optional(v.number()), // Track article views
    })
    .index("by_userId", ["userId"])
    .index("by_slug", ["slug"]), // Index for fast lookup by slug
});
