"use client";

import { useEffect, useState } from "react";
import { AlignLeft } from "lucide-react";
import { TOCItem } from "../lib/toc";

interface TableOfContentsProps {
  items: TOCItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Intersection Observer to track active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="hidden lg:block sticky top-24 ml-8 w-64 p-6 bg-surface border border-border rounded-xl h-fit max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="flex items-center gap-2 mb-4 text-text-primary font-semibold">
        <AlignLeft className="w-4 h-4" />
        <span>Contents</span>
      </div>
      <nav className="space-y-1">
        {items.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={`
              block text-sm py-1 leading-snug transition-colors
              ${
                activeId === heading.id
                  ? "text-primary font-medium border-l-2 border-primary pl-3"
                  : heading.level === 3
                    ? "pl-4 text-text-tertiary"
                    : "text-text-secondary font-medium pl-3 border-l-2 border-transparent"
              }
              hover:text-primary
            `}
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById(heading.id);
              if (element) {
                // Manual offset calculation for reliability
                const headerOffset = 100;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
                window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth"
                });
                setActiveId(heading.id);
              }
            }}

          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
