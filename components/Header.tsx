"use client";

import { Menu, Search, Sun, Moon } from "lucide-react";
import AuthButton from "./AuthButton";
import { useTheme } from "./ThemeProvider";
import { usePathname } from "next/navigation";

interface HeaderProps {
  onSearch: (query: string) => void;
  onMenuClick?: () => void;
}

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/articles": "All Articles",
  "/drafts": "Drafts",
  "/media": "Media Library",
  "/write": "Write",
};

export default function Header({ onSearch, onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const pageTitle =
    pageTitles[pathname] ||
    (pathname.startsWith("/documents/") ? "Editor" : "Dashboard");

  return (
    <header className="h-18 bg-surface border-b border-border flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      {/* Left: Hamburger (mobile) + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-bg-secondary rounded-lg transition-colors md:hidden"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-text-secondary" />
        </button>

        <h1 className="text-h2 text-text-primary hidden sm:block">{pageTitle}</h1>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-tertiary group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            onChange={(e) => onSearch(e.target.value)}
            className="
              block w-full pl-10 pr-4 py-2.5
              bg-bg-secondary border border-transparent
              rounded-pill
              text-sm text-text-primary placeholder-text-tertiary
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
              focus:bg-surface
              transition-all duration-200
            "
            placeholder="Search posts..."
          />
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-text-tertiary bg-surface border border-border rounded">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Theme toggle + Auth */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-lg hover:bg-bg-secondary transition-colors"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <Moon className="w-[18px] h-[18px] text-text-secondary" />
          ) : (
            <Sun className="w-[18px] h-[18px] text-text-secondary" />
          )}
        </button>

        <div className="w-px h-8 bg-border mx-1 hidden sm:block" />

        <AuthButton />
      </div>
    </header>
  );
}
