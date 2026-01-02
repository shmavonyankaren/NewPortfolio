"use client";

import { Trash } from "lucide-react";

interface DeleteAllButtonProps {
  count: number;
  onClick: () => void;
  label?: string;
}

export default function DeleteAllButton({
  count,
  onClick,
  label = "Delete All",
}: DeleteAllButtonProps) {
  if (count <= 0) return null;

  return (
    <button
      onClick={onClick}
      className="cursor-pointer flex items-center justify-center gap-1 sm:gap-2 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors flex-1 sm:flex-initial"
      title={label}
    >
      <Trash size={18} className="sm:w-5 sm:h-5" />
      <span className="text-sm sm:text-base">{label}</span>
    </button>
  );
}
