"use client";

import { useSession } from "next-auth/react";
import AuthButton from "@/components/AuthButton";

export default function WritePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Create New Article</h1>
          <AuthButton />
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-700">
          <p className="font-semibold">Authentication Verified! ✅</p>
          <p className="text-sm mt-1">
            Logged in as <span className="font-bold">{session?.user?.name}</span>
          </p>
          <a href="/" className="text-sm font-medium underline mt-2 inline-block hover:text-blue-800">
            &larr; Go to Document Manager
          </a>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              type="text" 
              placeholder="Article title..." 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea 
              rows={8}
              placeholder="Start writing..." 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
          </div>
          <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
