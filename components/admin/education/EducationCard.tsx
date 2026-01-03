"use client";

import { Education } from "../types/education";
import Image from "next/image";
import { ItemActionButtons } from "../common";

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
            <div className="mt-3">
              <p className="text-xs font-semibold text-slate-700 dark:text-gray-300 mb-2">
                Skills:
              </p>
              <div className="space-y-2 flex flex-col gap-3">
                {education.skills.map((skill, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 w-fit">
                      {typeof skill !== "string" && skill.image ? (
                        <Image
                          width={24}
                          height={24}
                          src={skill.image}
                          alt={skill.name}
                          className="w-6 h-6 rounded object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded bg-purple-200 dark:bg-purple-700 flex items-center justify-center text-xs">
                          ⚙️
                        </div>
                      )}
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 whitespace-nowrap">
                        {typeof skill === "string" ? skill : skill.name}
                      </span>
                    </div>
                    {typeof skill !== "string" && skill.description && (
                      <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 ml-8">
                        {skill.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
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
