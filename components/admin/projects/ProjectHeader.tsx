"use client";

import { AddButton, DeleteAllButton } from "../common";

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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <h3 className=" text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
        Projects
      </h3>
      <div className="flex gap-2 w-full sm:w-auto">
        <DeleteAllButton count={projectCount} onClick={onDeleteAll} />
        <AddButton
          isOpen={showForm && !editingId}
          onClick={onToggleForm}
          addLabel={projectCount === 0 ? "Add Project" : "Add"}
          closeLabel="Close"
        />
      </div>
    </div>
  );
}
