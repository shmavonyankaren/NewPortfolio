"use client";

import { Trash2 } from "lucide-react";

interface Feature {
  title: string;
  description: string;
}

interface FeatureInputProps {
  features: Feature[];
  showInput: boolean;
  tempFeature: { title: string; description: string };
  onShowInput: (show: boolean) => void;
  onTempFeatureChange: (feature: {
    title: string;
    description: string;
  }) => void;
  onAddFeature: () => void;
  onRemoveFeature: (index: number) => void;
}

export default function FeatureInput({
  features,
  showInput,
  tempFeature,
  onShowInput,
  onTempFeatureChange,
  onAddFeature,
  onRemoveFeature,
}: FeatureInputProps) {
  return (
    <div className="space-y-4 border-t border-slate-300 dark:border-white/10 pt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
          Key Features
        </h4>
        <button
          type="button"
          onClick={() => onShowInput(true)}
          disabled={showInput}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-3 py-2.5 rounded text-sm font-semibold transition-colors"
        >
          + Add Feature
        </button>
      </div>

      {showInput && (
        <div className="w-full flex justify-end">
          <div
            className="w-full max-w-125 space-y-2
           bg-slate-50 dark:bg-white/5 p-5 rounded"
          >
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-gray-400">
                Feature Title
              </label>
              <input
                type="text"
                placeholder="e.g., Real-time Updates"
                value={tempFeature.title}
                onChange={(e) =>
                  onTempFeatureChange({
                    ...tempFeature,
                    title: e.target.value,
                  })
                }
                className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-gray-400">
                Description
              </label>
              <textarea
                placeholder="Describe this feature"
                value={tempFeature.description}
                onChange={(e) =>
                  onTempFeatureChange({
                    ...tempFeature,
                    description: e.target.value,
                  })
                }
                className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500"
                rows={2}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onAddFeature}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2.5 rounded transition-colors text-sm font-semibold"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  onShowInput(false);
                  onTempFeatureChange({ title: "", description: "" });
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
        {features.map((feature, index) => (
          <div
            key={`feature-${index}-${feature.title}`}
            className="flex gap-2 items-center bg-slate-50 dark:bg-white/5 p-3 rounded"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {feature.title}
              </p>
              <p className="text-xs text-slate-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRemoveFeature(index)}
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
