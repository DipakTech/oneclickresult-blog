import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [], // No providers needed as we only read session
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain:
          process.env.NODE_ENV === "production"
            ? ".oneclickresult.com"
            : undefined,
      },
    },
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          name: token.name,
          email: token.email,
          image: token.picture,
        } as any;
        // Map other custom fields if necessary
        // (session.user as any).id = token.dbUserId;
      }
      return session;
    },
  },
  pages: {
    signIn: `${process.env.NEXT_PUBLIC_MAIN_DOMAIN_URL}/auth/signin`,
  },
};
