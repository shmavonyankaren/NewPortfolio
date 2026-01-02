"use client";

import { AddButton, DeleteAllButton } from "../common";

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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
        Jobs
      </h3>
      <div className="flex gap-2 w-full sm:w-auto">
        <DeleteAllButton count={jobCount} onClick={onDeleteAll} />
        <AddButton
          isOpen={showForm && !editingId}
          onClick={onAddClick}
          addLabel="Add"
          closeLabel="Close"
        />
      </div>
    </div>
  );
}
