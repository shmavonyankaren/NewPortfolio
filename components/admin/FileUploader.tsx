"use client";

import { useAdminUpload } from "./common/AdminForm";

import { useRef, useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useUploadThing } from "@/lib/utils/uploadthing";

type FileUploaderProps = {
  imageUrl: string | null;
  onUploadingChange?: (uploading: boolean) => void;
  onFieldChange: (url: string) => void;
  setFiles?: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function FileUploader({
  imageUrl,
  onFieldChange,
  onUploadingChange,
}: FileUploaderProps) {
  const beginUpload = useAdminUpload();
  const { startUpload } = useUploadThing("imageUploader");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update preview when imageUrl changes
  useEffect(() => {
    setPreviewUrl(imageUrl);
  }, [imageUrl]);

  const uploadFile = useCallback(
    async (file: File) => {
      // Show preview immediately
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);
      setError(null);
      const finishUpload = beginUpload();
      setIsUploading(true);
      onUploadingChange?.(true);

      try {
        const uploaded = await startUpload([file]);

        if (!uploaded?.[0]?.url) throw new Error("Image upload failed. Please try again.");
        if (uploaded[0].url) {
          // Replace local preview with uploaded URL
          URL.revokeObjectURL(localPreview);
          setPreviewUrl(uploaded[0].url);
          onFieldChange(uploaded[0].url);
        }
      } catch (error) {
        // Revert to original imageUrl on error
        URL.revokeObjectURL(localPreview);
        setPreviewUrl(imageUrl);
        console.error("Image upload failed", error);
        setError("Upload failed. Please try again.");
      } finally {
        finishUpload();
        setIsUploading(false);
        onUploadingChange?.(false);
      }
    },
    [beginUpload, startUpload, onFieldChange, imageUrl, onUploadingChange]
  );

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) uploadFile(accepted[0]);
    },
    [uploadFile]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    disabled: isUploading,
  });

  const triggerFileDialog = useCallback(() => {
    if (!isUploading) fileInputRef.current?.click();
  }, [isUploading]);

  const manualSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  return (
    <>
    <div
      {...getRootProps()}
      className="flex flex-col items-center justify-center h-50 w-full bg-white/5 dark:bg-slate-800/30 border-2 border-dashed border-purple-300 dark:border-purple-500/50 rounded-lg cursor-pointer overflow-hidden relative transition-all duration-300 hover:border-purple-500 dark:hover:border-purple-400 hover:bg-white/10 dark:hover:bg-slate-700/30 py-3 px-3"
      onClick={triggerFileDialog}
    >
      {/* Hidden input for manual selection */}
      <input
        {...getInputProps()}
        ref={fileInputRef}
        type="file"
        disabled={isUploading}
        accept="image/*"
        onChange={manualSelect}
        className="hidden"
      />

      {previewUrl ? (
        <>
          <div className="absolute inset-0 p-2">
            <Image
              src={previewUrl}
              alt="Uploaded"
              fill
              className="object-cover rounded"
              unoptimized
            />
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg z-10">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-300 border-t-purple-600 mb-1"></div>
                <span className="text-white text-xs font-medium">
                  Uploading...
                </span>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center text-slate-600 dark:text-slate-400">
          <svg
            className="w-6 h-6 mb-1 text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
            />
          </svg>
          <p className="font-semibold text-xs text-slate-900 dark:text-white">
            Click to upload
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            or drag and drop
          </p>
        </div>
      )}
    </div>
    {error && <p role="alert" className="text-xs text-red-500">{error}</p>}
    </>
  );
}
