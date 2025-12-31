"use client";

import { Trash2 } from "lucide-react";
import FileUploader from "../FileUploader";

interface Technology {
  name: string;
  icon?: string;
}

interface TechnologyInputProps {
  technologies: Technology[];
  showInput: boolean;
  tempTech: { name: string; icon: string };
  onShowInput: (show: boolean) => void;
  onTempTechChange: (tech: { name: string; icon: string }) => void;
  onAddTechnology: () => void;
  onRemoveTechnology: (index: number) => void;
}

export default function TechnologyInput({
  technologies,
  showInput,
  tempTech,
  onShowInput,
  onTempTechChange,
  onAddTechnology,
  onRemoveTechnology,
}: TechnologyInputProps) {
  return (
    <div className="space-y-4 border-t border-slate-300 dark:border-white/10 pt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
          Technologies & Tools
        </h4>
        <button
          type="button"
          onClick={() => onShowInput(true)}
          disabled={showInput}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-3 py-2.5 rounded text-sm font-semibold transition-colors"
        >
          + Add Technology
        </button>
      </div>

      {showInput && (
        <div className="w-full flex justify-end">
          <div className="w-full max-w-125 flex flex-col items-start gap-2 bg-slate-50 dark:bg-white/5 p-5 rounded">
            <div className="flex-1 w-full space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-gray-400">
                Technology Name
              </label>
              <input
                type="text"
                placeholder="e.g., React, TypeScript"
                value={tempTech.name}
                onChange={(e) =>
                  onTempTechChange({ ...tempTech, name: e.target.value })
                }
                className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500"
              />
            </div>
            <div className="flex-1 w-full space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-gray-400">
                Icon (Optional)
              </label>
              <FileUploader
                imageUrl={tempTech.icon || null}
                onFieldChange={(url) =>
                  onTempTechChange({ ...tempTech, icon: url })
                }
              />
            </div>
            <div className="flex w-full gap-2">
              <button
                type="button"
                onClick={onAddTechnology}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2.5 rounded transition-colors text-sm font-semibold"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  onShowInput(false);
                  onTempTechChange({ name: "", icon: "" });
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
        {technologies.map((tech, index) => (
          <div
            key={`tech-${index}-${tech.name}`}
            className="flex gap-2 items-center bg-slate-50 dark:bg-white/5 p-3 rounded"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {tech.name}
              </p>
              {tech.icon && (
                <p className="text-xs text-slate-600 dark:text-gray-400">
                  Icon uploaded
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onRemoveTechnology(index)}
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
