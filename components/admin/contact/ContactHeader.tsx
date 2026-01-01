"use client";

import { Plus, Trash } from "lucide-react";

interface ContactHeaderProps {
  contactCount: number;
  showForm: boolean;
  editingId: string | null;
  onToggleForm: () => void;
  onDeleteAll: () => void;
}

export default function ContactHeader({
  contactCount,
  showForm,
  editingId,
  onToggleForm,
  onDeleteAll,
}: ContactHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
        Contact Info
      </h3>
      <div className="flex gap-2 w-full sm:w-auto">
        {contactCount > 0 && (
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
          onClick={onToggleForm}
          className="flex items-center justify-center gap-1 sm:gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors flex-1 sm:flex-initial"
          title={showForm && !editingId ? "Close" : "Add Contact"}
        >
          <Plus size={18} className="sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">
            {contactCount === 0
              ? "Add Contact"
              : showForm && !editingId
              ? "Close"
              : "Add"}
          </span>
        </button>
      </div>
    </div>
  );
}
