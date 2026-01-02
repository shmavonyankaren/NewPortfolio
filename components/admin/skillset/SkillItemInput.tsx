"use client";

import { Skill } from "../types/skillset";
import { Trash2 } from "lucide-react";

interface SkillItemInputProps {
  skills: Skill[];
  tempSkillName: string;
  showSkillInput: boolean;
  onSkillNameChange: (name: string) => void;
  onAddSkill: () => void;
  onRemoveSkill: (index: number) => void;
  onShowSkillInput: (show: boolean) => void;
}

export default function SkillItemInput({
  skills,
  tempSkillName,
  showSkillInput,
  onSkillNameChange,
  onAddSkill,
  onRemoveSkill,
  onShowSkillInput,
}: SkillItemInputProps) {
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
                placeholder="e.g., React, TypeScript, Problem Solving"
                value={tempSkillName}
                onChange={(e) => onSkillNameChange(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && tempSkillName.trim()) {
                    e.preventDefault();
                    onAddSkill();
                  }
                }}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-white/10 dark:text-white dark:border-white/20 dark:placeholder-gray-500"
                autoFocus
              />
            </div>
            <div className="flex w-full gap-2">
              <button
                type="button"
                onClick={onAddSkill}
                className="cursor-pointer flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2.5 rounded transition-colors text-sm font-semibold"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  onShowSkillInput(false);
                  onSkillNameChange("");
                }}
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
            </div>
            <button
              type="button"
              onClick={() => onRemoveSkill(index)}
              className="cursor-pointer bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors shrink-0"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
