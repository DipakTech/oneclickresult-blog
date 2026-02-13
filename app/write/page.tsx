"use client";

import { useSession } from "next-auth/react";
import AuthButton from "@/components/AuthButton";

export default function WritePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen p-8 bg-bg flex flex-col items-center">
      <div className="w-full max-w-2xl bg-surface rounded-card shadow-sm border border-border p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-h2 font-bold text-text-primary">Create New Article</h1>
          <AuthButton />
        </div>

        <div className="mb-6 p-4 bg-primary-subtle border border-primary-light rounded-md text-primary">
          <p className="font-semibold">Authentication Verified! ✅</p>
          <p className="text-sm mt-1">
            Logged in as <span className="font-bold">{session?.user?.name}</span>
          </p>
          <a href="/" className="text-sm font-medium underline mt-2 inline-block hover:text-primary-hover">
            &larr; Go to Document Manager
          </a>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Title</label>
            <input 
              type="text" 
              placeholder="Article title..." 
              className="w-full px-4 py-2 bg-bg border border-border text-text-primary rounded-md focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Content</label>
            <textarea 
              rows={8}
              placeholder="Start writing..." 
              className="w-full px-4 py-2 bg-bg border border-border text-text-primary rounded-md focus:ring-2 focus:ring-primary outline-none"
            ></textarea>
          </div>
          <button className="px-6 py-2 bg-primary text-white font-medium rounded-md hover:bg-primary-hover transition-colors">
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
