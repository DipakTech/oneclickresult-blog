"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useSession } from "next-auth/react";

export function GlobalShortcuts() {
  const router = useRouter();
  const { data: session } = useSession();
  const createDocument = useMutation(api.documents.createDocument);

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Create New Document (Article)
      // Ctrl + N or Cmd + N OR Ctrl + Alt + N
      if (
        (e.ctrlKey || e.metaKey) && 
        e.key.toLowerCase() === "n"
      ) {
        e.preventDefault();
        e.stopPropagation();
        
        // Fast direct creation
        try {
          const documentId = await createDocument({
            title: "Untitled Article",
            authorName: session?.user?.name || "Unknown Author",
            authorImageUrl: session?.user?.image || undefined,
          });
          router.push(`/documents/${documentId}`);
        } catch (err) {
          console.error("Failed to create document via shortcut:", err);
          // Fallback if mutation fails for some reason
          router.push("/dashboard/articles?new=true");
        }
        
        return;
      }

      // Go to Dashboard
      // Ctrl + D or Cmd + D
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        e.stopPropagation();
        router.push("/dashboard");
        return;
      }

      // Go to Articles List
      // Ctrl + A or Cmd + A
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
        e.preventDefault();
        e.stopPropagation();
        router.push("/dashboard/articles");
        return;
      }

      // Open Settings
      // Ctrl + S or Cmd + S
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        e.stopPropagation();
        router.push("/dashboard/settings");
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [router, createDocument, session]);

  return null; // This is a logic-only component that doesn't render anything
}
