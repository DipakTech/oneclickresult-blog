"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Plus,
  Newspaper,
  LayoutDashboard,
  X,
  FileText,
  Image as ImageIcon,
  Settings,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const createDocument = useMutation(api.documents.createDocument);
  const documents = useQuery(api.documents.getDocuments, {});
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [isCreating, setIsCreating] = useState(false);

  const draftCount = documents?.filter((d) => !d.isPublished)?.length ?? 0;

  const handleCreateDocument = async () => {
    if (isCreating) return;
    setIsCreating(true);
    try {
      const documentId = await createDocument({
        title: "Untitled Post",
        authorName: session?.user?.name || undefined,
        authorImageUrl: session?.user?.image || undefined,
      });
      router.push(`/documents/${documentId}`);
    } catch (error) {
      console.error("Failed to create document:", error);
      alert("Failed to create document. Please try again.");
    } finally {
      setIsCreating(false);
      if (onClose) onClose();
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    if (onClose) onClose();
  };

  const navItems = [
    // { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/dashboard/articles", icon: Newspaper, label: "All Articles" },
    { path: "/media", icon: ImageIcon, label: "Media Library" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-sidebar
        bg-surface border-r border-border
        flex flex-col h-full
        transform transition-transform duration-300 ease-smooth
        md:relative md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Logo Header — 80px */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-card bg-primary flex items-center justify-center">
              <span className="text-white text-lg font-bold">O</span>
            </div>
            <div>
              <h1 className="text-[15px] font-bold text-text-primary leading-tight tracking-tight">
                OneClickResult
              </h1>
              <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
                CMS
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-bg-secondary md:hidden transition-colors"
          >
            <X className="w-5 h-5 text-text-tertiary" />
          </button>
        </div>

        {/* New Post Button */}
        <div className="px-4 pt-5 pb-2">
          <button
            onClick={handleCreateDocument}
            disabled={isCreating}
            className={`
              w-full flex items-center justify-center gap-2
              px-4 h-12 rounded-btn
              bg-primary text-white font-semibold text-sm
              hover:bg-primary-hover
              shadow-sm hover:shadow-md
              transition-all duration-200
              ${isCreating ? "opacity-70 cursor-not-allowed" : "active:scale-[0.98]"}
            `}
          >
            {isCreating ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            {isCreating ? "Creating..." : "New Post"}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pt-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-2">
            Menu
          </p>
          {navItems.map((item) => {
            const isActive = (() => {
              if (item.path.includes("?")) {
                const [path, query] = item.path.split("?");
                const params = new URLSearchParams(query);
                const currentParam = searchParams?.get("filter"); // safely access searchParams
                return (
                  pathname === path && currentParam === params.get("filter")
                );
              }
              // For paths without query params, ensure we're not on a filtered view if it's the exact path match
              // e.g. /dashboard/articles (All) vs /dashboard/articles?filter=draft
              if (item.path === "/dashboard/articles") {
                const currentParam = searchParams?.get("filter");
                return (
                  pathname === item.path &&
                  (!currentParam || currentParam === "all")
                );
              }
              return pathname === item.path;
            })();
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center gap-3 px-3 h-12 rounded-xl
                  font-medium text-sm transition-all duration-200
                  ${
                    isActive
                      ? "bg-primary-subtle text-primary font-semibold"
                      : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                  }
                `}
              >
                <Icon
                  className={`w-[18px] h-[18px] flex-shrink-0 ${
                    isActive ? "text-primary" : "text-text-tertiary"
                  }`}
                />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-border">
          <button
            className="w-full flex items-center gap-3 px-3 h-12 rounded-xl
              text-text-secondary hover:bg-bg-secondary hover:text-text-primary
              font-medium text-sm transition-all duration-200"
          >
            <Settings className="w-[18px] h-[18px] text-text-tertiary" />
            Settings
          </button>
        </div>
      </aside>
    </>
  );
}
