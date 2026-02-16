import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Define public paths that don't need authentication
  const publicPaths = ["/articles", "/api/auth", "/api/og"];
  
  // Check if path starts with any public path OR is the root path
  const isPublic = path === "/" || publicPaths.some(p => path.startsWith(p)) || path === "/favicon.ico";

  // If it's a public path, allow access
  if (isPublic) {
    return NextResponse.next();
  }

  // Define protected paths
  // We want to protect /dashboard and anything else that isn't public
  const isProtected = true; 

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
