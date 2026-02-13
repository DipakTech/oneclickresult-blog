"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [currentUrl, setCurrentUrl] = useState("");
  const mainDomain =
    process.env.NEXT_PUBLIC_MAIN_DOMAIN_URL || "http://localhost:3000";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full skeleton-shimmer" />
        <div className="w-16 h-4 rounded skeleton-shimmer hidden sm:block" />
      </div>
    );
  }

  if (session) {
    const getInitials = (name: string) => {
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <div className="flex items-center gap-3">
        {session.user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-border"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center ring-2 ring-border text-primary font-semibold text-xs">
            {session.user?.name ? getInitials(session.user.name) : "U"}
          </div>
        )}
        <span className="text-sm font-medium hidden sm:inline-block text-text-primary">
          {session.user?.name}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-xs text-text-tertiary hover:text-danger font-medium px-2.5 py-1.5 rounded-lg hover:bg-bg-secondary transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  const loginUrl = `${mainDomain}/auth/signin${
    currentUrl ? `?callbackUrl=${encodeURIComponent(currentUrl)}` : ""
  }`;

  return (
    <a
      href={loginUrl}
      className="
        text-sm font-semibold text-white
        bg-primary hover:bg-primary-hover
        px-4 h-10 rounded-btn
        flex items-center
        transition-colors duration-200
      "
    >
      Sign In
    </a>
  );
}
