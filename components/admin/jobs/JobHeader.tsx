"use client";

import { Plus, Trash } from "lucide-react";

interface JobHeaderProps {
  jobCount: number;
  showForm: boolean;
  editingId: string | null;
  onAddClick: () => void;
  onDeleteAll: () => void;
}

export default function JobHeader({
  jobCount,
  showForm,
  editingId,
  onAddClick,
  onDeleteAll,
}: JobHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
        Jobs Management
      </h3>
      <div className="flex gap-2">
        {jobCount > 0 && (
          <button
            onClick={onDeleteAll}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <Trash size={20} />
            Delete All
          </button>
        )}
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          {showForm && !editingId ? (
            <>
              <Plus size={20} className="rotate-45" />
              Close
            </>
          ) : (
            <>
              <Plus size={20} />
              Add Job
            </>
          )}
        </button>
      </div>
    </div>
  );
}
