import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createDocument = mutation({
    args: {
        title: v.string(),
    },
    handler: async (ctx, args) => {
        const documentId = await ctx.db.insert("documents", {
            title: args.title,
        });
        return documentId;
    },
});

export const updateDocument = mutation({
    args: {
        id: v.id("documents"),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
        coverImageId: v.optional(v.id("_storage")),
    },
    handler: async (ctx, args) => {
        const { id, ...rest } = args;
        await ctx.db.patch(id, rest);
    },
});

export const getDocument = query({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const document = await ctx.db.get(args.id);
        if (!document) return null;

        let coverImageUrl = null;
        if (document.coverImageId) {
            coverImageUrl = await ctx.storage.getUrl(document.coverImageId);
        }

        return {
            ...document,
            coverImageUrl,
        };
    },
});

export const getDocuments = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("documents").collect();
    },
});
