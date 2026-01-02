"use client";

import Image from "next/image";
import { Job } from "../types/job";
import { ItemActionButtons } from "../common";

interface JobListProps {
  jobs: Job[];
  editingId: string | null;
  showForm: boolean;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

export default function JobList({
  jobs,
  editingId,
  showForm,
  onEdit,
  onDelete,
}: JobListProps) {
  const formatDate = (value?: string | Date) => {
    if (!value) return "";
    return new Date(value).toLocaleDateString("en-GB");
  };

  if (!jobs || jobs.length === 0) {
    return (
      <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-8 text-center">
        <p className="text-slate-600 dark:text-gray-400 text-lg">
          No jobs yet. Click &quot;Add Job&quot; to create one.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {jobs
        .filter((j) => j._id !== editingId)
        .map((job, index) => (
          <div
            key={job._id || `job-${index}`}
            className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-3 sm:p-4"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Company Logo */}
              <div className="shrink-0">
                {job.logo ? (
                  <Image
                    width={64}
                    height={64}
                    src={job.logo}
                    alt={job.company}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover border border-slate-200 dark:border-white/10"
                  />
                ) : (
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-linear-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl">💼</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 mb-2">
                  <h4 className="text-slate-900 dark:text-white font-semibold text-sm sm:text-base wrap-break-words">
                    {job.position} at {job.company}
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-gray-400 whitespace-nowrap">
                    {formatDate(job.startDate)}
                    {job.endDate && !job.isCurrentlyWorking
                      ? ` - ${formatDate(job.endDate)}`
                      : " - Present"}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-gray-400 text-xs sm:text-sm mb-2">
                  {job.description}
                </p>
                {job.skills && job.skills.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                      Skills:
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {job.skills.map((skill, index) => (
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
                {job.responsibilities && job.responsibilities.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                      Responsibilities:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      {job.responsibilities.map((resp, index) => (
                        <li
                          key={index}
                          className="text-slate-600 dark:text-gray-400 text-xs"
                        >
                          {typeof resp === "string" ? resp : resp.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <ItemActionButtons
                onEdit={() => onEdit(job)}
                onDelete={() => onDelete(job._id!)}
                disabled={showForm && !editingId}
              />
            </div>
          </div>
        ))}
    </div>
  );
}
