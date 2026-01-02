"use client";

import { useState, useCallback } from "react";
import { useUploadThing } from "@/lib/utils/uploadthing";
import handleError from "@/lib/utils/handleError";
import { FileText, X } from "lucide-react";

type CertificateUploaderProps = {
  fileUrl: string | null;
  onFieldChange: (url: string, fileName?: string, fileType?: string) => void;
};

export default function CertificateUploader({
  fileUrl,
  onFieldChange,
}: CertificateUploaderProps) {
  const { startUpload } = useUploadThing("certificateUploader");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFile = useCallback(
    async (file: File | null) => {
      if (!file) return;

      const isPdf = file.type === "application/pdf";
      const isImage = file.type.startsWith("image/");

      if (!isPdf && !isImage) {
        setError("Please upload a PDF or image file.");
        return;
      }

      setError(null);
      setIsUploading(true);
      setFileName(file.name);

      try {
        const uploaded = await startUpload([file]);
        const url = uploaded?.[0]?.url;
        if (url) {
          onFieldChange(url, file.name, file.type);
        }
      } catch (err) {
        handleError(err);
        setError("Upload failed. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [startUpload, onFieldChange]
  );

  const removeFile = () => {
    onFieldChange("", "", "");
    setFileName("");
  };

  return (
    <div className="flex flex-col gap-2">
      {fileUrl ? (
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg p-3">
          <FileText
            className="text-purple-600 dark:text-purple-400"
            size={24}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
              {fileName || "Certificate file"}
            </p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
            >
              View file
            </a>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="cursor-pointer bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="flex items-center gap-2 w-fit bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400">
          <input
            type="file"
            accept="application/pdf,image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
            disabled={isUploading}
          />
          {isUploading ? "Uploading..." : "Upload Certificate (PDF or Image)"}
        </label>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
