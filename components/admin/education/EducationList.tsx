"use client";

import type { ReactNode } from "react";

import ReorderableList from "../common/ReorderableList";

import { Education } from "../types/education";
import EducationCard from "./EducationCard";

interface EducationListProps {
  educations: Education[];
  editForm: ReactNode;
  editingId: string | null;
  showForm: boolean;
  onReordered: () => Promise<void>;
  onEdit: (education: Education) => void;
  onDelete: (id: string) => void;
}

export default function EducationList({
  educations,
  editForm,
  editingId,
  showForm,
  onReordered,
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
    <ReorderableList items={educations} editingId={editingId} editForm={editForm} endpoint="/api/admin/educations" disabled={showForm} onReordered={onReordered}>
      {educations
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
    </ReorderableList>
  );
}
