"use client";

import { AddButton, DeleteAllButton } from "../common";

interface CommentHeaderProps {
  commentCount: number;
  showForm: boolean;
  editingId: string | null;
  onAddClick: () => void;
  onDeleteAll: () => void;
}

export default function CommentHeader({
  commentCount,
  showForm,
  editingId,
  onAddClick,
  onDeleteAll,
}: CommentHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
        Comments
      </h3>
      <div className="flex gap-2 w-full sm:w-auto">
        <DeleteAllButton count={commentCount} onClick={onDeleteAll} />
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
