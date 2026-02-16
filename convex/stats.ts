import { query } from "./_generated/server";

export const getDashboardStats = query({
    args: {},
    handler: async (ctx) => {
        const allDocuments = await ctx.db.query("documents").collect();
        const allFiles = await ctx.db.query("files").collect();
        
        // Count published articles
        const publishedArticles = allDocuments.filter(doc => doc.isPublished);
        
        // Count drafts
        const drafts = allDocuments.filter(doc => !doc.isPublished);
        
        // Calculate total views across all articles
        const totalViews = allDocuments.reduce((sum, doc) => sum + (doc.viewCount || 0), 0);
        
        return {
            totalArticles: publishedArticles.length,
            totalDrafts: drafts.length,
            totalFiles: allFiles.length,
            totalViews,
        };
    },
});
