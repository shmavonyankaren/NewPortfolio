"use client";

import { useState, useCallback } from "react";
import { useUploadThing } from "@/lib/utils/uploadthing";
import handleError from "@/lib/utils/handleError";

interface CVUploaderProps {
  fileUrl: string;
  onUrlChange: (url: string) => void;
}

export default function CVUploader({ fileUrl, onUrlChange }: CVUploaderProps) {
  const { startUpload } = useUploadThing("cvUploader");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File | null) => {
      if (!file) return;
      if (file.type !== "application/pdf") {
        setError("Please upload a PDF file.");
        return;
      }
      setError(null);
      setIsUploading(true);
      try {
        const uploaded = await startUpload([file]);
        const url = uploaded?.[0]?.url;
        if (url) onUrlChange(url);
      } catch (err) {
        handleError(err);
        setError("Upload failed. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [startUpload, onUrlChange]
  );

  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 w-fit bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400">
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
          disabled={isUploading}
        />
        {isUploading ? "Uploading..." : "Upload PDF"}
      </label>
      {fileUrl && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-semibold"
        >
          View uploaded CV
        </a>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
