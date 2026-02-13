"use client";

import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";

export default function FileUploader() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveFile = useMutation(api.files.saveFile);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus("idle");
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      await saveFile({
        name: file.name,
        storageId,
        size: file.size,
        type: "other",
      });

      setUploadStatus("success");
      setTimeout(() => setUploadStatus("idle"), 3000);
    } catch (error) {
      console.error(error);
      setUploadStatus("error");
      setTimeout(() => setUploadStatus("idle"), 3000);
    } finally {
      setUploading(false);
      // Reset the input
      e.target.value = "";
    }
  };

  return (
    <div className="relative">
      <label
        className={`
          flex items-center gap-3 w-full px-4 py-3
          rounded-card border-2 border-dashed
          cursor-pointer transition-all duration-200
          ${
            uploading
              ? "border-primary/50 bg-primary-subtle"
              : uploadStatus === "success"
                ? "border-success/50 bg-success-light"
                : uploadStatus === "error"
                  ? "border-danger/50 bg-danger-light"
                  : "border-border hover:border-primary/50 hover:bg-primary-subtle"
          }
        `}
      >
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
            uploading
              ? "bg-primary-light"
              : uploadStatus === "success"
                ? "bg-success-light"
                : "bg-bg-secondary"
          }`}
        >
          {uploading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary/30 border-t-primary" />
          ) : uploadStatus === "success" ? (
            <CheckCircle className="w-4 h-4 text-success" />
          ) : uploadStatus === "error" ? (
            <AlertCircle className="w-4 h-4 text-danger" />
          ) : (
            <Upload className="w-4 h-4 text-text-tertiary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary">
            {uploading
              ? "Uploading..."
              : uploadStatus === "success"
                ? "Uploaded successfully!"
                : uploadStatus === "error"
                  ? "Upload failed"
                  : "Upload File"}
          </p>
          {!uploading && uploadStatus === "idle" && (
            <p className="text-[11px] text-text-tertiary">
              Click to browse files
            </p>
          )}
        </div>
        <input
          type="file"
          onChange={handleUpload}
          disabled={uploading}
          className="sr-only"
        />
      </label>
    </div>
  );
}
