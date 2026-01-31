import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Define public paths that don't need authentication
  const publicPaths = ["/articles", "/api/auth"];
  
  // Check if path starts with any public path
  const isPublic = publicPaths.some(p => path.startsWith(p)) || path === "/favicon.ico";

  // If it's a public path, allow access
  if (isPublic) {
    return NextResponse.next();
  }

  // Define protected paths (including root for document management)
  // We explicitly protect these to be safe, or we could default to protected except public
  // Given the user request: Protect root (document management), but allows articles
  // Strategy: If it's NOT public, it's protected.
  
  // However, verifying if we want to protect EVERYTHING else or just specific routes.
  // User said: "protect localhost:3001 route for document management but not articles"
  // This implies default deny (whitelist public routes).
  
  const isProtected = true; // Default to protected for everything else (including /)

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
  });

  if (!token) {
    // Redirect to main domain logic
    // We construct the login URL pointing to the main domain
    const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN_URL || "http://localhost:3000";
    const loginUrl = new URL(`${mainDomain}/auth/signin`);
    
    // Set callback URL to the current page on the blog
    // We derive the public URL from headers to avoid internal Docker hostnames (0.0.0.0)
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "blog.oneclickresult.com";
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const currentUrl = `${protocol}://${host}${path}`;
    loginUrl.searchParams.set("callbackUrl", currentUrl);
    
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // skip internal paths and static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
