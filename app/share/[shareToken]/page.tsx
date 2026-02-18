"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { Download, FileText, Image as ImageIcon, File } from "lucide-react";
import Link from "next/link";
import { Id } from "../../../convex/_generated/dataModel";

export default function SharePage() {
  const params = useParams();
  const shareToken = params.shareToken as string;

  const fileData = useQuery(api.files.getFileByShareToken, { shareToken });

  if (fileData === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg text-text-secondary">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (fileData === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg p-4 text-center">
        <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-text-tertiary" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          File Not Found
        </h1>
        <p className="text-text-secondary mb-6">
          The file link may be invalid or expired.
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  // Type assertion for safety if needed, though Convex types should handle it
  const { name, type, size, url, _creationTime } = fileData;
  // Loosen type checks to handle potential "other" types that are actually viewable or "video" if schema evolved
  const isImage =
    type === "image" ||
    (type === "other" && /\.(jpg|jpeg|png|gif|webp)$/i.test(name));
  const isPdf = type === "pdf" || (type === "other" && /\.pdf$/i.test(name));
  const isVideo =
    (type as string) === "video" ||
    (type === "other" && /\.(mp4|webm|ogg)$/i.test(name));

  // Format file size
  const formattedSize = size
    ? size < 1024 * 1024
      ? `${(size / 1024).toFixed(1)} KB`
      : `${(size / (1024 * 1024)).toFixed(1)} MB`
    : "Unknown size";

  return (
    <div className="min-h-screen bg-bg flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 border-b border-border bg-surface px-6 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold shadow-md">
            OC
          </div>
          <span className="font-semibold text-text-primary text-lg tracking-tight">
            oneclickresult
          </span>
        </div>
        <a
          href={url!}
          download={name}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium shadow-sm hover:shadow-md"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Download</span>
        </a>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col items-center justify-center bg-bg-secondary/30">
        <div className="max-w-4xl w-full bg-surface border border-border rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row min-h-[500px]">
          {/* File Info Sidebar (Mobile: Top, Desktop: Left) */}
          <div className="p-6 border-b md:border-b-0 md:border-r border-border bg-bg-secondary/10 w-full md:w-80 flex flex-col shrink-0">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white rounded-xl shadow-sm ring-1 ring-border">
                {isImage ? (
                  <ImageIcon className="w-8 h-8 text-success" />
                ) : isPdf ? (
                  <FileText className="w-8 h-8 text-danger" />
                ) : (
                  <File className="w-8 h-8 text-primary" />
                )}
              </div>
              <div>
                <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-0.5">
                  Shared File
                </h3>
                <div className="h-1 w-12 bg-primary/20 rounded-full"></div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-tertiary font-medium mb-1 block">
                  Filename
                </label>
                <h1 className="font-semibold text-text-primary text-lg break-words leading-tight">
                  {name}
                </h1>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-text-tertiary font-medium mb-1 block">
                    Size
                  </label>
                  <p className="text-sm text-text-secondary font-mono">
                    {formattedSize}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-text-tertiary font-medium mb-1 block">
                    Uploaded
                  </label>
                  <p className="text-sm text-text-secondary">
                    {new Date(_creationTime).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <a
                  href={url!}
                  download={name}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium text-sm shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Download File
                </a>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 bg-bg-secondary/50 p-6 flex items-center justify-center relative overflow-hidden">
            {/* Background Pattern */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            ></div>

            {isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={url!}
                alt={name}
                className="max-w-full max-h-[600px] rounded-lg shadow-xl object-contain z-10"
              />
            ) : isPdf ? (
              <iframe
                src={`${url}#toolbar=0`}
                className="w-full h-[600px] rounded-lg border border-border bg-white shadow-md z-10"
                title={name}
              />
            ) : isVideo ? (
              <video
                src={url!}
                controls
                className="max-w-full max-h-[600px] rounded-lg shadow-xl z-10"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="text-center z-10 max-w-sm">
                <div className="mx-auto w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6 shadow-sm ring-1 ring-border">
                  <File className="w-10 h-10 text-text-tertiary" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Preview Unavailable
                </h3>
                <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                  This file type cannot be previewed directly in the browser.
                  Please download the file to view its contents.
                </p>
                <a
                  href={url!}
                  download={name}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium text-sm shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Download File
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
