"use client";

import { Insight } from "../types/insight";
import FileUploader from "../FileUploader";

interface InsightFormProps {
  formData: Insight;
  editingId: string | null;
  onFormChange: (data: Partial<Insight>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function InsightForm({
  formData,
  editingId,
  onFormChange,
  onSubmit,
  onCancel,
}: InsightFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-6 space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            Name *
          </label>
          <input
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => onFormChange({ name: e.target.value })}
            className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            Position *
          </label>
          <input
            type="text"
            placeholder="CEO at Company"
            value={formData.position}
            onChange={(e) => onFormChange({ position: e.target.value })}
            className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            Image
          </label>
          <FileUploader
            imageUrl={formData.image || ""}
            onFieldChange={(url) => onFormChange({ image: url })}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-900 dark:text-white">
          Insight *
        </label>
        <textarea
          placeholder="Share an insight or testimonial..."
          value={formData.insight}
          onChange={(e) => onFormChange({ insight: e.target.value })}
          className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
          rows={4}
          required
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          {editingId ? "Update" : "Create"} Insight
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
