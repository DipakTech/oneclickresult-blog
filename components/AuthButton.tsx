"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [currentUrl, setCurrentUrl] = useState("");
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN_URL || "http://localhost:3000";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  if (status === "loading") {
    return <div className="text-sm animate-pulse">Loading...</div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        {session.user?.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={session.user.image} 
            alt={session.user.name || "User"} 
            className="w-8 h-8 rounded-full object-cover border border-gray-200"
          />
        )}
        <span className="text-sm font-medium hidden sm:inline-block">
          {session.user?.name}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // Construct login URL
  const loginUrl = `${mainDomain}/auth/signin${currentUrl ? `?callbackUrl=${encodeURIComponent(currentUrl)}` : ""}`;

  return (
    <a
      href={loginUrl}
      className="text-sm bg-zinc-900 text-white px-4 py-2 rounded-md hover:bg-zinc-800 transition-colors font-medium"
    >
      Sign In
    </a>
  );
}
