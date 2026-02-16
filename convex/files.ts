import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const saveFile = mutation({
    args: {
        name: v.string(),
        storageId: v.id("_storage"),
        size: v.number(),
        type: v.union(v.literal("image"), v.literal("csv"), v.literal("pdf"), v.literal("other")),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("files", {
            name: args.name,
            storageId: args.storageId,
            size: args.size,
            type: args.type,
        });
    },
});

export const getFiles = query({
    args: {
        query: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let files;
        if (args.query) {
            files = await ctx.db
                .query("files")
                .withSearchIndex("search_name", (q) => q.search("name", args.query!))
                .collect();
        } else {
            files = await ctx.db.query("files").collect();
        }

        const filesWithUrl = await Promise.all(
            files.map(async (file) => ({
                ...file,
                url: await ctx.storage.getUrl(file.storageId),
            }))
        );

        return filesWithUrl;
    },
});

export const getFileUrl = query({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    },
});

export const deleteFile = mutation({
    args: { id: v.id("files") },
    handler: async (ctx, args) => {
        const file = await ctx.db.get(args.id);
        if (!file) {
            throw new Error("File not found");
        }

        // Delete file from storage
        await ctx.storage.delete(file.storageId);

        // Delete the file record
        await ctx.db.delete(args.id);
    },
});

export const generateShareToken = mutation({
    args: { id: v.id("files") },
    handler: async (ctx, args) => {
        const file = await ctx.db.get(args.id);
        if (!file) {
            throw new Error("File not found");
        }

        // Generate a random token
        const shareToken = Math.random().toString(36).substring(2) + Date.now().toString(36);

        await ctx.db.patch(args.id, {
            shareToken,
        });

        return shareToken;
    },
});

export const getFileByShareToken = query({
    args: { shareToken: v.string() },
    handler: async (ctx, args) => {
        const file = await ctx.db
            .query("files")
            .withIndex("by_shareToken", (q) => q.eq("shareToken", args.shareToken))
            .first();

        if (!file) return null;

        const url = await ctx.storage.getUrl(file.storageId);

        return {
            ...file,
            url,
        };
    },
});

