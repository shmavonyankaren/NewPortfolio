"use client";

import { AddButton, DeleteAllButton } from "../common";

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
        <DeleteAllButton count={educationCount} onClick={onDeleteAll} />
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
