"use client";

import { User } from "lucide-react";
import { Insight } from "../types/insight";
import Image from "next/image";
import { ItemActionButtons } from "../common";

interface InsightCardProps {
  insight: Insight;
  showForm: boolean;
  editingId: string | null;
  onEdit: () => void;
  onDelete: () => void;
}

export default function InsightCard({
  insight,
  showForm,
  editingId,
  onEdit,
  onDelete,
}: InsightCardProps) {
  return (
    <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row items-start gap-3">
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            {insight.image ? (
              <Image
                width={40}
                height={40}
                src={insight.image}
                alt={insight.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0">
                <User size={16} className="text-white sm:w-5 sm:h-5" />
              </div>
            )}
            <div className="min-w-0">
              <h4 className="text-slate-900 dark:text-white font-semibold text-sm sm:text-base wrap-break-words">
                {insight.name}
              </h4>
              <p className="text-slate-600 dark:text-gray-400 text-xs sm:text-sm truncate">
                {insight.position}
              </p>
            </div>
          </div>
          <p className="text-slate-700 dark:text-gray-300 text-xs sm:text-sm italic mt-2">
            &quot;{insight.insight}&quot;
          </p>
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
