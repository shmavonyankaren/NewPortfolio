"use client";

import { Plus, Trash } from "lucide-react";

interface ProjectHeaderProps {
  projectCount: number;
  showForm: boolean;
  editingId: string | null;
  onToggleForm: () => void;
  onDeleteAll: () => void;
}

export default function ProjectHeader({
  projectCount,
  showForm,
  editingId,
  onToggleForm,
  onDeleteAll,
}: ProjectHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
        Projects
      </h3>
      <div className="flex gap-2">
        {projectCount > 0 && (
          <button
            onClick={onDeleteAll}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <Trash size={20} />
            Delete All
          </button>
        )}
        <button
          onClick={onToggleForm}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Plus size={20} />
          {projectCount === 0
            ? "Add Project"
            : showForm && !editingId
            ? "Close"
            : "Add"}
        </button>
      </div>
    </div>
  );
}
