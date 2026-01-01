"use client";

import { Plus, Trash } from "lucide-react";

interface EducationHeaderProps {
  educationCount: number;
  showForm: boolean;
  editingId: string | null;
  onAddClick: () => void;
  onDeleteAll: () => void;
}

export default function EducationHeader({
  educationCount,
  showForm,
  editingId,
  onAddClick,
  onDeleteAll,
}: EducationHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
        Education
      </h3>
      <div className="flex gap-2 w-full sm:w-auto">
        {educationCount > 0 && (
          <button
            onClick={onDeleteAll}
            className="flex items-center justify-center gap-1 sm:gap-2 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors flex-1 sm:flex-initial"
            title="Delete All"
          >
            <Trash size={18} className="sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Delete All</span>
          </button>
        )}
        <button
          onClick={onAddClick}
          className="flex items-center justify-center gap-1 sm:gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors flex-1 sm:flex-initial"
          title={showForm && !editingId ? "Close" : "Add Education"}
        >
          {showForm && !editingId ? (
            <>
              <Plus size={18} className="rotate-45 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Close</span>
            </>
          ) : (
            <>
              <Plus size={18} className="sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Add</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
