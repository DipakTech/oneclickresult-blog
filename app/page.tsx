"use client";

import FileExplorer from "../components/FileExplorer";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import FileDetailsSidebar from "../components/FileDetailsSidebar";
import { useState } from "react";
import { Doc } from "../convex/_generated/dataModel";
import { useSession } from "next-auth/react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import {
  LayoutGrid,
  List as ListIcon,
  Newspaper,
  FileEdit,
  Image as ImageIcon,
  Eye,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<Doc<"files"> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const dashboardStats = useQuery(api.stats.getDashboardStats);

  // Define stats configuration with real data
  const statsConfig = dashboardStats ? [
    {
      label: "Total Articles",
      value: dashboardStats.totalArticles.toString(),
      trend: "Published",
      trendUp: true,
      icon: Newspaper,
      accentColor: "text-primary",
      accentBg: "bg-primary-light",
      iconColor: "text-primary",
    },
    {
      label: "Drafts",
      value: dashboardStats.totalDrafts.toString(),
      trend: "Pending review",
      trendUp: false,
      icon: FileEdit,
      accentColor: "text-amber-500",
      accentBg: "bg-warning-light",
      iconColor: "text-amber-500",
    },
    {
      label: "Media Files",
      value: dashboardStats.totalFiles.toString(),
      trend: "In library",
      trendUp: true,
      icon: ImageIcon,
      accentColor: "text-success",
      accentBg: "bg-success-light",
      iconColor: "text-success",
    },
    {
      label: "Total Views",
      value: dashboardStats.totalViews.toLocaleString(),
      trend: "All articles",
      trendUp: true,
      icon: Eye,
      accentColor: "text-success",
      accentBg: "bg-success-light",
      iconColor: "text-success",
    },
  ] : [];

  const handleFileDelete = () => {
    setSelectedFile(null);
    setRefreshKey((prev) => prev + 1);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-full min-w-0">
        <Header
          onSearch={setSearchQuery}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
        />

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-content mx-auto p-6 lg:p-10">
              {/* Welcome Section */}
              <div className="mb-10">
                <h2 className="text-h1 text-text-primary mb-1">
                  {greeting()},{" "}
                  {session?.user?.name?.split(" ")[0] || "there"} 👋
                </h2>
                <p className="text-body text-text-secondary">
                  Here&apos;s an overview of your content workspace.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-12">
                {dashboardStats === undefined ? (
                  // Loading skeletons
                  [...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-surface border border-border rounded-card p-4 skeleton-shimmer h-32"
                    />
                  ))
                ) : (
                  statsConfig.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={stat.label}
                        className="
                          bg-surface border border-border rounded-card p-4
                          hover-lift hover:shadow-card-hover
                          cursor-default group
                          transition-shadow duration-200
                        "
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-caption text-text-tertiary uppercase tracking-wider">
                            {stat.label}
                          </span>
                          <div
                            className={`w-8 h-8 rounded-lg ${stat.accentBg} flex items-center justify-center`}
                          >
                            <Icon className={`w-[17px] h-[17px] ${stat.iconColor}`} />
                          </div>
                        </div>
                        <p className="text-[32px] font-extrabold text-text-primary leading-none mb-2 tracking-tight">
                          {stat.value}
                        </p>
                        <div
                          className={`flex items-center gap-1 text-caption ${
                            stat.trendUp ? "text-success" : "text-text-tertiary"
                          }`}
                        >
                          {stat.trendUp ? (
                            <TrendingUp className="w-3.5 h-3.5" />
                          ) : null}
                          <span>{stat.trend}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Documents & Files Sections */}
              <div className="space-y-12">
                {/* Recent Files Section */}
                <section>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-h2 text-text-primary">Recent Files</h2>
                    <div className="flex items-center gap-1 bg-bg-secondary rounded-lg p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-md transition-all duration-200 ${
                          viewMode === "grid"
                            ? "bg-surface shadow-sm text-primary"
                            : "text-text-tertiary hover:text-text-secondary"
                        }`}
                        aria-label="Grid view"
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-md transition-all duration-200 ${
                          viewMode === "list"
                            ? "bg-surface shadow-sm text-primary"
                            : "text-text-tertiary hover:text-text-secondary"
                        }`}
                        aria-label="List view"
                      >
                        <ListIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <FileExplorer
                    onFileSelect={setSelectedFile}
                    selectedFileId={selectedFile?._id ?? null}
                    searchQuery={searchQuery}
                    viewMode={viewMode}
                    key={refreshKey}
                    showDraftsOnly={false}
                  />
                </section>
              </div>
            </div>
          </main>

          {/* Right Sidebar for Details */}
          {selectedFile && (
            <FileDetailsSidebar
              file={selectedFile}
              onClose={() => setSelectedFile(null)}
              onDelete={handleFileDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
