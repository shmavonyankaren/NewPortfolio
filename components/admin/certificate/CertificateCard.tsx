"use client";

import { Download, Eye } from "lucide-react";
import { Certificate } from "../types/certificate";
import { ItemActionButtons } from "../common";

interface CertificateCardProps {
  certificate: Certificate;
  showForm: boolean;
  editingId: string | null;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CertificateCard({
  certificate,
  showForm,
  editingId,
  onEdit,
  onDelete,
}: CertificateCardProps) {
  const formatDate = (value?: string) => {
    if (!value) return "";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleView = () => {
    window.open(certificate.fileUrl, "_blank");
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(certificate.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = certificate.fileName || `${certificate.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback to opening in new tab
      window.open(certificate.fileUrl, "_blank");
    }
  };

  return (
    <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-3 sm:p-4">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 mb-2">
            <h4 className="text-slate-900 dark:text-white font-semibold text-sm sm:text-base wrap-break-words">
              {certificate.title}
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-medium mb-2">
            Issued by: {certificate.issuer}
          </p>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 mb-2">
            Issued on: {formatDate(certificate.dateIssued)}
          </p>
          <p className="text-slate-600 dark:text-gray-400 text-xs sm:text-sm line-clamp-2">
            {certificate.description}
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleView}
              className="cursor-pointer  flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition-colors"
            >
              <Eye size={14} />
              View
            </button>
            <button
              onClick={handleDownload}
              className="cursor-pointer flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition-colors"
            >
              <Download size={14} />
              Download
            </button>
          </div>
        </div>
        <ItemActionButtons
          onEdit={onEdit}
          onDelete={onDelete}
          disabled={showForm && !editingId}
        />
      </div>
    </div>
  );
}
