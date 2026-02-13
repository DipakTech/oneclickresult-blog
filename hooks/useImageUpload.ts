import { useState, useCallback } from "react";
import { useMutation, useConvex } from "convex/react";
import { api } from "../convex/_generated/api";

export interface UploadProgress {
  isUploading: boolean;
  progress: number;
  fileName: string;
}

export function useImageUpload() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const convex = useConvex();
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    isUploading: false,
    progress: 0,
    fileName: "",
  });

  const uploadImage = useCallback(async (file: File): Promise<{ url: string | null; storageId?: string } | null> => {
    setUploadProgress({ isUploading: true, progress: 0, fileName: file.name });

    try {
      const postUrl = await generateUploadUrl();

      // Use XMLHttpRequest for progress tracking
      const result = await new Promise<{ url: string | null; storageId?: string } | null>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(prev => ({ ...prev, progress: percentComplete }));
          }
        });

        xhr.addEventListener("load", async () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const { storageId } = JSON.parse(xhr.responseText);
              const fileUrl = await convex.query(api.files.getFileUrl, { storageId });
              resolve({ url: fileUrl, storageId });
            } catch (e) {
              reject(e);
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Upload failed")));

        xhr.open("POST", postUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      setUploadProgress({ isUploading: false, progress: 100, fileName: "" });
      return result;
    } catch (error) {
      console.error("Upload error:", error);
      setUploadProgress({ isUploading: false, progress: 0, fileName: "" });
      return null;
    }
  }, [generateUploadUrl, convex]);

  return { uploadImage, uploadProgress };
}
