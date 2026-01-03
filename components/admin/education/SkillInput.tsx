"use client";

import { Skill } from "../types/education";
import FileUploader from "../FileUploader";
import { X, Edit2 } from "lucide-react";

interface SkillInputProps {
  skills: Skill[];
  tempSkill: string;
  tempSkillImage: string;
  tempSkillDescription: string;
  showSkillInput: boolean;
  editingSkillIndex: number | null;
  onUpdateSkill: () => void;
  onCancelEditSkill: () => void;
  onEditSkill: (index: number) => void;
  onSkillChange: (skill: string) => void;
  onSkillImageChange: (image: string) => void;
  onSkillDescriptionChange: (description: string) => void;
  onAddSkill: () => void;
  onRemoveSkill: (index: number) => void;
  onShowSkillInput: (show: boolean) => void;
}

export default function SkillInput({
  skills,
  tempSkill,
  tempSkillImage,
  tempSkillDescription,
  showSkillInput,
  editingSkillIndex,
  onUpdateSkill,
  onCancelEditSkill,
  onEditSkill,
  onSkillChange,
  onSkillImageChange,
  onSkillDescriptionChange,
  onAddSkill,
  onRemoveSkill,
  onShowSkillInput,
}: SkillInputProps) {
  return (
    <div className="space-y-4 border-t border-slate-300 dark:border-white/10 pt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
          Skills
        </h4>
        <button
          type="button"
          onClick={() => onShowSkillInput(true)}
          disabled={showSkillInput}
          className="cursor-pointer bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-3 py-2.5 rounded text-sm font-semibold transition-colors"
        >
          + Add Skill
        </button>
      </div>

      {showSkillInput && (
        <div className="w-full flex justify-end">
          <div className="w-full max-w-125 flex flex-col items-start gap-2 bg-slate-50 dark:bg-white/5 p-5 rounded">
            <div className="flex-1 w-full space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-gray-400">
                Skill Name
              </label>
              <input
                type="text"
                placeholder="e.g., React, TypeScript"
                value={tempSkill}
                onChange={(e) => onSkillChange(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && tempSkill.trim()) {
                    onAddSkill();
                  }
                }}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500"
                autoFocus
              />
            </div>
            <div className="flex-1 w-full space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-gray-400">
                Icon/Logo (Optional)
              </label>
              <FileUploader
                imageUrl={tempSkillImage || ""}
                onFieldChange={onSkillImageChange}
              />
            </div>
            <div className="w-full space-y-1">
              <label className="block text-sm font-medium text-slate-900 dark:text-white">
                Description *
              </label>
              <textarea
                placeholder="Detailed education description"
                value={tempSkillDescription}
                onChange={(e) => onSkillDescriptionChange(e.target.value)}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500 dark:focus:ring-purple-500"
                rows={4}
                required
              />
            </div>
            <div className="flex w-full gap-2">
              <button
                type="button"
                onClick={onAddSkill}
                className=" cursor-pointer flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2.5 rounded transition-colors text-sm font-semibold"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  onShowSkillInput(false);
                  onSkillChange("");
                  onSkillImageChange("");
                  onSkillDescriptionChange("");
                }}
                className="cursor-pointer flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2.5 rounded transition-colors text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {editingSkillIndex !== null && (
        <div className="w-full flex justify-end">
          <div className="w-full max-w-125 flex flex-col items-start gap-3 bg-slate-50 dark:bg-white/5 p-5 rounded border border-slate-200 dark:border-white/10">
            <div className="flex w-full items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Edit Skill
              </h4>
              <button
                type="button"
                onClick={onCancelEditSkill}
                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 w-full space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-gray-400">
                Skill Name
              </label>
              <input
                type="text"
                placeholder="e.g., React, TypeScript"
                value={tempSkill}
                onChange={(e) => onSkillChange(e.target.value)}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500"
              />
            </div>

            <div className="flex-1 w-full space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-gray-400">
                Icon/Logo (Optional)
              </label>
              <FileUploader
                imageUrl={tempSkillImage || ""}
                onFieldChange={onSkillImageChange}
              />
            </div>

            <div className="w-full space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-gray-400">
                Description
              </label>
              <textarea
                placeholder="Brief description of this skill"
                value={tempSkillDescription}
                onChange={(e) => onSkillDescriptionChange(e.target.value)}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500"
                rows={3}
              />
            </div>

            <div className="flex w-full gap-2">
              <button
                type="button"
                onClick={onUpdateSkill}
                className="cursor-pointer flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2.5 rounded transition-colors text-sm font-semibold"
              >
                Update Skill
              </button>
              <button
                type="button"
                onClick={onCancelEditSkill}
                className="cursor-pointer flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2.5 rounded transition-colors text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {skills.map((skill, index) => (
          <div
            key={`skill-${index}-${skill.name}`}
            className="flex gap-2 items-center bg-slate-50 dark:bg-white/5 p-3 rounded"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {skill.name}
              </p>
              {skill.image && (
                <p className="text-xs text-slate-600 dark:text-gray-400">
                  Icon uploaded
                </p>
              )}
              {skill.description && (
                <p className="mt-1 text-xs text-slate-700 dark:text-gray-300">
                  {skill.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEditSkill(index)}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 flex items-center justify-center"
                title="Edit skill"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onRemoveSkill(index)}
                className="cursor-pointer bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
