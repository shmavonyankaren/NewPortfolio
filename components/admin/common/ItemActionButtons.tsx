"use client";

import { Edit2, Loader, Trash2 } from "lucide-react";

interface ItemActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
  editDisabled?: boolean;
  deleteDisabled?: boolean;
  editLoading?: boolean;
  deleteLoading?: boolean;
  containerClassName?: string;
}

export default function ItemActionButtons({
  onEdit,
  onDelete,
  disabled = false,
  editDisabled = false,
  deleteDisabled = false,
  editLoading = false,
  deleteLoading = false,
  containerClassName = "",
}: ItemActionButtonsProps) {
  const isEditDisabled = disabled || editDisabled;
  const isDeleteDisabled = disabled || deleteDisabled;

  return (
    <div className={`flex gap-2 shrink-0 ${containerClassName}`}>
      <button
        onClick={onEdit}
        disabled={isEditDisabled}
        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 flex items-center justify-center"
        title="Edit"
      >
        {editLoading ? (
          <Loader size={16} className="animate-spin sm:w-4.5 sm:h-4.5" />
        ) : (
          <Edit2 size={16} className="sm:w-4.5 sm:h-4.5" />
        )}
      </button>
      <button
        onClick={onDelete}
        disabled={isDeleteDisabled}
        className="cursor-pointer bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600 flex items-center justify-center"
        title="Delete"
      >
        {deleteLoading ? (
          <Loader size={16} className="animate-spin sm:w-4.5 sm:h-4.5" />
        ) : (
          <Trash2 size={16} className="sm:w-4.5 sm:h-4.5" />
        )}
      </button>
    </div>
  );
}
