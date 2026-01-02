"use client";

import { Skillset } from "../types/skillset";
import { ItemActionButtons } from "../common";

interface SkillsetCardProps {
  skillset: Skillset;
  showForm: boolean;
  editingId: string | null;
  onEdit: () => void;
  onDelete: () => void;
}

export default function SkillsetCard({
  skillset,
  showForm,
  editingId,
  onEdit,
  onDelete,
}: SkillsetCardProps) {
  return (
    <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-3 sm:p-4">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 mb-3">
            <h4 className="text-slate-900 dark:text-white font-semibold text-base sm:text-lg wrap-break-words">
              {skillset.title}
            </h4>
          </div>
          {skillset.skills && skillset.skills.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {skillset.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-purple-600/20 text-purple-700 dark:text-purple-300 text-xs sm:text-sm px-3 py-1.5 rounded-full font-medium"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 dark:text-gray-400 text-sm italic">
              No skills added yet
            </p>
          )}
        </div>
        <ItemActionButtons
          onEdit={onEdit}
          onDelete={onDelete}
          disabled={showForm && !editingId}
        />
      </div>
    </div>
  );
}
