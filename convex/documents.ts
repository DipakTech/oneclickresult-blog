import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

// Helper to generate slug
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Helper to calculate reading time (average 200 words per minute)
function calculateReadingTime(content: string | undefined): number {
  if (!content) return 0;

  try {
    const json = JSON.parse(content);
    let text = "";

    // Extract text from Tiptap JSON
    function traverse(node: any) {
      if (node.type === "text") {
        text += node.text + " ";
      }
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(traverse);
      }
    }

    traverse(json);

    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 200); // Reading speed: 200 words/min
  } catch {
    return 0;
  }
}

export const createDocument = mutation({
  args: {
    title: v.string(),
    authorName: v.optional(v.string()),
    authorImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let slug = generateSlug(args.title);

    // Ensure uniqueness
    const existingSlug = await ctx.db
      .query("documents")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (existingSlug) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
    }

    const documentId = await ctx.db.insert("documents", {
      title: args.title,
      isPublished: false,
      authorName: args.authorName,
      authorImageUrl: args.authorImageUrl,
      viewCount: 0,
      slug: slug,
      metaDescription: "", // Initialize with empty string
    });
    return documentId;
  },
});

export const updateDocument = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImageId: v.optional(v.union(v.id("_storage"), v.null())),
    isPublished: v.optional(v.boolean()),
    authorName: v.optional(v.string()),
    authorImageUrl: v.optional(v.string()),

    // SEO Metadata
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    metaKeywords: v.optional(v.array(v.string())),
    ogImageId: v.optional(v.id("_storage")),
    canonicalUrl: v.optional(v.string()),
    focusKeyphrase: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;

    let patchData: any = { ...rest };

    // Generate slug if publishing or title changed (and no slug exists or we want to update it?)
    // For simplicity: If we are updating the title, or publishing, let's ensure there is a slug.
    // We only generate a slug if one doesn't exist, or if we want to auto-update it.
    // Let's generate it if `title` is being updated OR `isPublished` is becoming true.

    const existingDoc = await ctx.db.get(id);
    if (!existingDoc) throw new Error("Document not found");

    if (rest.title || (rest.isPublished === true && !existingDoc.slug)) {
      const titleToSlug = rest.title || existingDoc.title;
      let slug = generateSlug(titleToSlug);

      // Ensure uniqueness: check if slug exists (excluding current doc)
      const existingSlug = await ctx.db
        .query("documents")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first();

      if (existingSlug && existingSlug._id !== id) {
        // Append random string if duplicate
        slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
      }

      patchData.slug = slug;
    }

    // Auto-calculate reading time when content is updated
    if (rest.content !== undefined) {
      patchData.readingTime = calculateReadingTime(rest.content);
      patchData.lastModified = Date.now();
    }

    // Update lastModified on any edit
    if (Object.keys(rest).length > 0) {
      patchData.lastModified = Date.now();
    }

    await ctx.db.patch(id, patchData);
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

export const getArticleBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const document = await ctx.db
      .query("documents")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!document) return null;
    if (!document.isPublished) return null; // Only return published docs

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
  args: {
    isDraft: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const documents = await ctx.db.query("documents").order("desc").collect();

    let filteredDocs = documents;
    if (args.isDraft !== undefined) {
      filteredDocs = documents.filter((doc) =>
        args.isDraft ? !doc.isPublished : doc.isPublished,
      );
    }

    return Promise.all(
      filteredDocs.map(async (doc) => {
        let coverImageUrl = undefined;
        if (doc.coverImageId) {
          coverImageUrl = await ctx.storage.getUrl(doc.coverImageId);
        }
        return {
          ...doc,
          coverImageUrl,
        };
      }),
    );
  },
});

export const getPublishedDocuments = query({
  args: {},
  handler: async (ctx) => {
    // Filter by isPublished manually since we don't have an index on it with order yet,
    // or we can just fetch all and filter in memory if dataset is small,
    // or add an index. For now, filter in memory for simplicity or usage of existing index.
    const documents = await ctx.db.query("documents").order("desc").collect();
    const publishedDocs = documents.filter((doc) => doc.isPublished);

    return Promise.all(
      publishedDocs.map(async (doc) => {
        let coverImageUrl = undefined;
        if (doc.coverImageId) {
          coverImageUrl = await ctx.storage.getUrl(doc.coverImageId);
        }
        return {
          ...doc,
          coverImageUrl,
        };
      }),
    );
  },
});

export const deleteDocument = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.id);
    if (!document) {
      throw new Error("Document not found");
    }

    // Delete cover image from storage if it exists
    if (document.coverImageId) {
      await ctx.storage.delete(document.coverImageId);
    }

    // Delete the document
    await ctx.db.delete(args.id);
  },
});

export const incrementViewCount = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.id);
    if (!document) {
      throw new Error("Document not found");
    }

    await ctx.db.patch(args.id, {
      viewCount: (document.viewCount || 0) + 1,
    });
  },
});
export const getDocumentsPaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
    isDraft: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let results;

    if (args.isDraft !== undefined) {
      const isPublishedTarget = !args.isDraft;
      results = await ctx.db
        .query("documents")
        .withIndex("by_published", (q) =>
          q.eq("isPublished", isPublishedTarget),
        )
        .order("desc") // This uses index order: isPublished then _id
        .paginate(args.paginationOpts);
    } else {
      results = await ctx.db
        .query("documents")
        .order("desc")
        .paginate(args.paginationOpts);
    }

    return {
      ...results,
      page: await Promise.all(
        results.page.map(async (doc) => {
          let coverImageUrl = undefined;
          if (doc.coverImageId) {
            coverImageUrl = await ctx.storage.getUrl(doc.coverImageId);
          }
          return {
            ...doc,
            coverImageUrl,
          };
        }),
      ),
    };
  },
});
