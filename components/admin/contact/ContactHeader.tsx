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
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
        Contact Information
      </h3>
      <div className="flex gap-2">
        {contactCount > 0 && (
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
          {contactCount === 0
            ? "Add Contact"
            : showForm && !editingId
            ? "Close"
            : "Add New"}
        </button>
      </div>
    </div>
  );
}
