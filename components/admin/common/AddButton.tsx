"use client";

import { Plus } from "lucide-react";

interface AddButtonProps {
  isOpen: boolean;
  onClick: () => void;
  addLabel?: string;
  closeLabel?: string;
}

export default function AddButton({
  isOpen,
  onClick,
  addLabel = "Add",
  closeLabel = "Close",
}: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer flex items-center justify-center gap-1 sm:gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors flex-1 sm:flex-initial"
      title={isOpen ? closeLabel : addLabel}
    >
      <Plus
        size={18}
        className={`${isOpen ? "rotate-45" : ""} sm:w-5 sm:h-5`}
      />
      <span className="text-sm sm:text-base">
        {isOpen ? closeLabel : addLabel}
      </span>
    </button>
  );
}
