"use client";

import { BlogPost } from "../types/blogPost";
import FileUploader from "../FileUploader";

interface PostFormProps {
  formData: BlogPost;
  editingId: string | null;
  onFormChange: (data: Partial<BlogPost>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function PostForm({
  formData,
  editingId,
  onFormChange,
  onSubmit,
  onCancel,
}: PostFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-6 space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            Title *
          </label>
          <input
            type="text"
            placeholder="Blog post title"
            value={formData.title}
            onChange={(e) => onFormChange({ title: e.target.value })}
            className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-900 dark:text-white">
            Image
          </label>
          <FileUploader
            imageUrl={formData.imageUrl || null}
            onFieldChange={(url) => onFormChange({ imageUrl: url })}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-900 dark:text-white">
          Content *
        </label>
        <textarea
          placeholder="Write your blog post content..."
          value={formData.content}
          onChange={(e) => onFormChange({ content: e.target.value })}
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
          {editingId ? "Update" : "Create"} Post
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
