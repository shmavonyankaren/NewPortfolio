"use client";

import { Certificate } from "../types/certificate";
import CertificateUploader from "./CertificateUploader";

interface CertificateFormProps {
  formData: Certificate;
  editingId: string | null;
  onFormChange: (data: Partial<Certificate>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function CertificateForm({
  formData,
  editingId,
  onFormChange,
  onSubmit,
  onCancel,
}: CertificateFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-6 space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            Certificate Title *
          </label>
          <input
            type="text"
            placeholder="e.g., AWS Certified Solutions Architect"
            value={formData.title}
            onChange={(e) => onFormChange({ title: e.target.value })}
            className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            Issued By *
          </label>
          <input
            type="text"
            placeholder="e.g., Amazon Web Services, Google, Microsoft"
            value={formData.issuer}
            onChange={(e) => onFormChange({ issuer: e.target.value })}
            className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-900 dark:text-white">
          Description *
        </label>
        <textarea
          placeholder="Describe what this certificate represents and any key achievements..."
          value={formData.description}
          onChange={(e) => onFormChange({ description: e.target.value })}
          className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
          rows={4}
          required
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-900 dark:text-white">
          Certificate File *
        </label>
        <CertificateUploader
          fileUrl={formData.fileUrl || null}
          onFieldChange={(url, fileName, fileType) =>
            onFormChange({ fileUrl: url, fileName, fileType })
          }
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!formData.fileUrl}
          className="cursor-pointer bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          {editingId ? "Update" : "Create"} Certificate
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
