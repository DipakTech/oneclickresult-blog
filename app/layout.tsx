import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import NextAuthSessionProvider from "@/components/SessionProvider";
import ThemeProvider from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });



export const metadata: Metadata = {
  title: {
    default: 'My Blog - Insightful Articles on Development & Technology',
    template: '%s | My Blog',
  },
  description: 'A modern blog platform featuring articles on software development, technology trends, and developer insights.',
  keywords: ['blog', 'development', 'technology', 'programming', 'software engineering'],
  authors: [{ name: 'Blog Author' }],
  creator: 'Blog Author',
  publisher: 'My Blog',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'My Blog',
    title: 'My Blog - Insightful Articles on Development & Technology',
    description: 'A modern blog platform featuring articles on software development, technology trends, and developer insights.',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'My Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Blog - Insightful Articles on Development & Technology',
    description: 'A modern blog platform featuring articles on software development, technology trends, and developer insights.',
    creator: '@yourtwitterhandle',
    images: ['/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes when ready
    // google: 'your-google-site-verification',
    // yandex: 'your-yandex-verification',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthSessionProvider>
          <ConvexClientProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </ConvexClientProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
