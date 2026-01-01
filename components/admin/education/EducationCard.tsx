"use client";

import { Edit2, Trash2 } from "lucide-react";
import { Education } from "../types/education";
import Image from "next/image";

interface EducationCardProps {
  education: Education;
  showForm: boolean;
  editingId: string | null;
  onEdit: () => void;
  onDelete: () => void;
}

export default function EducationCard({
  education,
  showForm,
  editingId,
  onEdit,
  onDelete,
}: EducationCardProps) {
  const formatDate = (value?: string | Date) => {
    if (!value) return "";
    return new Date(value).toLocaleDateString("en-GB");
  };

  return (
    <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-3 sm:p-4">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Institution Logo */}
        <div className="shrink-0">
          {education.logo ? (
            <Image
              width={64}
              height={64}
              src={education.logo}
              alt={education.institution}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover border border-slate-200 dark:border-white/10"
            />
          ) : (
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <span className="text-2xl sm:text-3xl">🎓</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 mb-2">
            <h4 className="text-slate-900 dark:text-white font-semibold text-sm sm:text-base wrap-break-words">
              {education.degree && `${education.degree} in `}
              {education.field} at {education.institution}
            </h4>
            <span className="text-xs text-slate-500 dark:text-gray-400 whitespace-nowrap">
              {formatDate(education.startDate)}
              {education.endDate && !education.isCurrentlyStudying
                ? ` - ${formatDate(education.endDate)}`
                : " - Present"}
            </span>
          </div>
          <p className="text-slate-600 dark:text-gray-400 text-xs sm:text-sm line-clamp-2 sm:line-clamp-none">
            {education.description}
          </p>
          {education.skills && education.skills.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                Skills:
              </p>
              <div className="flex gap-2 flex-wrap">
                {education.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-purple-600/20 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded flex items-center gap-1"
                  >
                    {typeof skill === "string" ? skill : skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={onEdit}
            disabled={showForm && !editingId}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
            title="Edit"
          >
            <Edit2 size={16} className="sm:w-4.5 sm:h-4.5" />
          </button>
          <button
            onClick={onDelete}
            disabled={showForm && !editingId}
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
            title="Delete"
          >
            <Trash2 size={16} className="sm:w-4.5 sm:h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
