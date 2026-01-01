"use client";

import { Trash2 } from "lucide-react";

export interface Responsibility {
  name: string;
}

interface ResponsibilityInputProps {
  responsibilities: Responsibility[];
  tempResponsibility: string;
  showResponsibilityInput: boolean;
  onResponsibilityChange: (responsibility: string) => void;
  onAddResponsibility: () => void;
  onRemoveResponsibility: (index: number) => void;
  onShowResponsibilityInput: (show: boolean) => void;
}

export default function ResponsibilityInput({
  responsibilities,
  tempResponsibility,
  showResponsibilityInput,
  onResponsibilityChange,
  onAddResponsibility,
  onRemoveResponsibility,
  onShowResponsibilityInput,
}: ResponsibilityInputProps) {
  return (
    <div className="space-y-4 border-t border-slate-300 dark:border-white/10 pt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
          Responsibilities
        </h4>
        <button
          type="button"
          onClick={() => onShowResponsibilityInput(true)}
          disabled={showResponsibilityInput}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-3 py-2.5 rounded text-sm font-semibold transition-colors"
        >
          + Add Responsibility
        </button>
      </div>

      {showResponsibilityInput && (
        <div className="w-full flex justify-end">
          <div className="w-full max-w-125 space-y-2 bg-slate-50 dark:bg-white/5 p-5 rounded">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-gray-400">
                Responsibility Description
              </label>
              <textarea
                placeholder="e.g., Led development of core features"
                value={tempResponsibility}
                onChange={(e) => onResponsibilityChange(e.target.value)}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500"
                rows={2}
                autoFocus
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onAddResponsibility}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2.5 rounded transition-colors text-sm font-semibold"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  onShowResponsibilityInput(false);
                  onResponsibilityChange("");
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2.5 rounded transition-colors text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {responsibilities.map((responsibility, index) => (
          <div
            key={`resp-${index}-${responsibility.name.slice(0, 10)}`}
            className="flex gap-2 items-center bg-slate-50 dark:bg-white/5 p-3 rounded"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {responsibility.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRemoveResponsibility(index)}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors shrink-0"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
