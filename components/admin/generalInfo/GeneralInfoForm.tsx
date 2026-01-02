"use client";

import { GeneralInfo } from "../types/generalInfo";
import FileUploader from "../FileUploader";

interface GeneralInfoFormProps {
  formData: GeneralInfo;
  isEditing: boolean;
  onFormChange: (data: Partial<GeneralInfo>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function GeneralInfoForm({
  formData,
  isEditing,
  onFormChange,
  onSubmit,
  onCancel,
  isLoading = false,
}: GeneralInfoFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-6 space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* User Photo Upload */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            User Photo
          </label>
          <FileUploader
            imageUrl={formData.userPhoto || ""}
            onFieldChange={(url) => onFormChange({ userPhoto: url })}
          />
        </div>

        {/* Full Name */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            Full Name *
          </label>
          <input
            type="text"
            placeholder="Your Full Name"
            value={formData.fullName}
            onChange={(e) => onFormChange({ fullName: e.target.value })}
            className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Short About Me */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-900 dark:text-white">
          Short About Me *
        </label>
        <textarea
          placeholder="Brief description about yourself (1-2 sentences)"
          value={formData.shortAbout}
          onChange={(e) => onFormChange({ shortAbout: e.target.value })}
          className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
          rows={2}
          required
          disabled={isLoading}
        />
      </div>

      {/* Full Description */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-900 dark:text-white">
          Full Description *
        </label>
        <textarea
          placeholder="Detailed description about yourself, your background, skills, and experience"
          value={formData.fullDescription}
          onChange={(e) => onFormChange({ fullDescription: e.target.value })}
          className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
          rows={6}
          required
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          {isLoading ? "Saving..." : isEditing ? "Update Info" : "Create Info"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="cursor-pointer bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600/50 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
