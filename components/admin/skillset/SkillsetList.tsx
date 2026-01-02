"use client";

import { Skillset } from "../types/skillset";
import SkillsetCard from "./SkillsetCard";

interface SkillsetListProps {
  skillsets: Skillset[];
  editingId: string | null;
  showForm: boolean;
  onEdit: (skillset: Skillset) => void;
  onDelete: (id: string) => void;
}

export default function SkillsetList({
  skillsets,
  editingId,
  showForm,
  onEdit,
  onDelete,
}: SkillsetListProps) {
  if (!skillsets || skillsets.length === 0) {
    return (
      <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-8 text-center">
        <p className="text-slate-600 dark:text-gray-400 text-lg">
          No skillsets yet. Click &quot;Add&quot; to create one.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {skillsets
        .filter((s) => s._id !== editingId)
        .map((skillset, index) => (
          <SkillsetCard
            key={skillset._id || `skillset-${index}`}
            skillset={skillset}
            showForm={showForm}
            editingId={editingId}
            onEdit={() => onEdit(skillset)}
            onDelete={() => onDelete(skillset._id!)}
          />
        ))}
    </div>
  );
}
