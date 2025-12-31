"use client";

import { Edit2, Trash2, Loader } from "lucide-react";

interface Project {
  _id?: string;
  title: string;
  shortDescription: string;
}

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  isEditing?: boolean;
  isSubmitting?: boolean;
  isDeleting?: boolean;
}

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
  isEditing = false,
  isSubmitting = false,
  isDeleting = false,
}: ProjectCardProps) {
  return (
    <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-4 flex items-center justify-between">
      <div className="flex-1">
        <h4 className="text-slate-900 dark:text-white font-semibold">
          {project.title}
        </h4>
        <p className="text-slate-600 dark:text-gray-400 text-sm">
          {project.shortDescription}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          disabled={isEditing || isSubmitting || isDeleting}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors flex items-center justify-center"
        >
          {isSubmitting ? (
            <Loader size={18} className="animate-spin" />
          ) : (
            <Edit2 size={18} />
          )}
        </button>
        <button
          onClick={onDelete}
          disabled={isEditing || isDeleting}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors flex items-center justify-center"
        >
          {isDeleting ? (
            <Loader size={18} className="animate-spin" />
          ) : (
            <Trash2 size={18} />
          )}
        </button>
      </div>
    </div>
  );
}
