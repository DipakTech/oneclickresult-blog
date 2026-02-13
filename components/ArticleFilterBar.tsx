import { Search, ChevronDown, Filter } from "lucide-react";

interface ArticleFilterBarProps {
  filter: string;
  onFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: string;
  onSortChange: (sort: string) => void;
}

export default function ArticleFilterBar({
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
}: ArticleFilterBarProps) {
  const filters = ["All", "Technology", "Design", "Business"]; // Example topics instead of status

  return (
    <div className="h-16 flex items-center justify-between gap-4 mb-8">
      {/* Left: Tag Pills */}
      <div className="flex items-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            className={`
              h-9 px-4 rounded-full text-sm font-medium transition-all duration-200
              ${
                filter === f
                  ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                  : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
              }
            `}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Right: Search & Sort */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-[280px] h-9 pl-9 pr-4 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div className="relative group">
          <button className="h-9 px-3 flex items-center gap-2 bg-surface border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary hover:border-gray-300 transition-all">
            <span>Sort: {sortOption}</span>
            <ChevronDown className="w-4 h-4 text-text-tertiary" />
          </button>
          {/* Dropdown would go here, simplified for now */}
          <div className="absolute right-0 top-full mt-1 w-40 bg-surface border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 p-1">
            {["Newest", "Oldest", "A-Z"].map((opt) => (
                <button
                    key={opt}
                    onClick={() => onSortChange(opt)}
                    className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-bg-secondary hover:text-text-primary rounded-md"
                >
                    {opt}
                </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
