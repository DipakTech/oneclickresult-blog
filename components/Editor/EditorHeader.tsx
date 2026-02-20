import { ArrowLeft, Save, Cloud, Loader2, Share2, MoreHorizontal, PanelRight } from "lucide-react";
import Link from "next/link";
import { Id } from "../../convex/_generated/dataModel";

interface EditorHeaderProps {
  documentId: Id<"documents">;
  title: string;
  isSaving: boolean;
  onPublish: () => void;
  isPublished: boolean;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function EditorHeader({
  documentId,
  title,
  isSaving,
  onPublish,
  isPublished,
  isSidebarOpen,
  onToggleSidebar,
}: EditorHeaderProps) {
  return (
    <header className="sticky top-0 z-50 h-[72px] bg-bg/80 backdrop-blur-md border-b border-border transition-all duration-200">
      <div className="max-w-screen-2xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Left: Back + Title + Status */}
        <div className="flex items-center gap-4 flex-1">
          <Link
            href="/dashboard"
            className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-text-primary truncate max-w-[200px] sm:max-w-md">
              {title || "Untitled"}
            </h1>
            <div className="flex items-center gap-2 text-xs text-text-tertiary">
              {isSaving ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3 h-3" />
                  <span>Saved</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-text-tertiary border-r border-border pr-4 mr-2">
                <span>{/* Word count could go here */}</span>
                <span>Last edited today</span>
            </div>

            <button 
                onClick={onToggleSidebar}
                className={`p-2 rounded-lg transition-colors ${isSidebarOpen ? 'bg-bg-secondary text-text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'}`}
                title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            >
                <PanelRight className="w-5 h-5" />
            </button>

            <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
            </button>

            <button
                onClick={onPublish}
                className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm
                    ${isPublished 
                        ? "bg-bg-secondary text-text-secondary hover:bg-border" 
                        : "bg-primary text-white hover:bg-primary-hover hover:shadow-md hover:-translate-y-0.5"
                    }
                `}
            >
                {isPublished ? "Unpublish" : "Publish"}
            </button>
            
            <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5" />
            </button>
        </div>
      </div>
    </header>
  );
}
