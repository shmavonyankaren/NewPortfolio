"use client";

import { Insight } from "../types/insight";
import InsightCard from "./InsightCard";

interface InsightListProps {
  insights: Insight[];
  editingId: string | null;
  showForm: boolean;
  onEdit: (insight: Insight) => void;
  onDelete: (id: string) => void;
}

export default function InsightList({
  insights,
  editingId,
  showForm,
  onEdit,
  onDelete,
}: InsightListProps) {
  if (!insights || insights.length === 0) {
    return (
      <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-8 text-center">
        <p className="text-slate-600 dark:text-gray-400 text-lg">
          No insights yet. Click &quot;Add&quot; to create one.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {insights
        .filter((i) => i._id !== editingId)
        .map((insight) => (
          <InsightCard
            key={insight._id}
            insight={insight}
            showForm={showForm}
            editingId={editingId}
            onEdit={() => onEdit(insight)}
            onDelete={() => onDelete(insight._id!)}
          />
        ))}
    </div>
  );
}
