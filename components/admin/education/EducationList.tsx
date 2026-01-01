"use client";

import { Education } from "../types/education";
import EducationCard from "./EducationCard";

interface EducationListProps {
  educations: Education[];
  editingId: string | null;
  showForm: boolean;
  onEdit: (education: Education) => void;
  onDelete: (id: string) => void;
}

export default function EducationList({
  educations,
  editingId,
  showForm,
  onEdit,
  onDelete,
}: EducationListProps) {
  if (!educations || educations.length === 0) {
    return (
      <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-8 text-center">
        <p className="text-slate-600 dark:text-gray-400 text-lg">
          No educations yet. Click &quot;Add Education&quot; to create one.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {educations
        .filter((e) => e._id !== editingId)
        .map((education, index) => (
          <EducationCard
            key={education._id || `education-${index}`}
            education={education}
            showForm={showForm}
            editingId={editingId}
            onEdit={() => onEdit(education)}
            onDelete={() => onDelete(education._id!)}
          />
        ))}
    </div>
  );
}
