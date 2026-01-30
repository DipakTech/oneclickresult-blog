import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    files: defineTable({
        name: v.string(),
        type: v.union(v.literal("image"), v.literal("csv"), v.literal("pdf"), v.literal("other")),
        storageId: v.id("_storage"),
        size: v.number(),
        userId: v.optional(v.string()),
    })
        .index("by_userId", ["userId"])
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
    })
    .index("by_userId", ["userId"])
    .index("by_slug", ["slug"]), // Index for fast lookup by slug
});
