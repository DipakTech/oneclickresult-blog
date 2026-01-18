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
