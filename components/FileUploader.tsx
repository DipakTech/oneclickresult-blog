"use client";

import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";

export default function FileUploader() {
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const saveFile = useMutation(api.files.saveFile);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // Step 1: Get a short-lived upload URL
            const postUrl = await generateUploadUrl();

            // Step 2: POST the file to the URL
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });
            const { storageId } = await result.json();

            // Step 3: Save the newly allocated storage id to the database
            await saveFile({
                name: file.name,
                storageId,
                size: file.size,
                type: "other", // TODO: Determine type dynamically
            });

            alert("Uploaded!");
        } catch (error) {
            console.error(error);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-4 border rounded-lg shadow-sm bg-white">
            <h2 className="text-lg font-semibold mb-4">Upload File</h2>
            <input
                type="file"
                onChange={handleUpload}
                disabled={uploading}
                className="block w-full text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
        "
            />
            {uploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
        </div>
    );
}
