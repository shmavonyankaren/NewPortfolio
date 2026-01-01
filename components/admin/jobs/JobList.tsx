"use client";

import { Job } from "../types/job";
import { Edit2, Trash2 } from "lucide-react";

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
            className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-slate-900 dark:text-white font-semibold">
                  {job.position} at {job.company}
                </h4>
                <span className="text-xs text-slate-500 dark:text-gray-400 ml-4 whitespace-nowrap">
                  {new Date(job.startDate).toLocaleDateString()}
                  {job.endDate && !job.isCurrentlyWorking
                    ? ` - ${new Date(job.endDate).toLocaleDateString()}`
                    : " - Present"}
                </span>
              </div>
              <p className="text-slate-600 dark:text-gray-400 text-sm">
                {job.description}
              </p>
              {job.skills && job.skills.length > 0 && (
                <div className="mt-3">
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
                <div className="mt-3">
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
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(job)}
                disabled={showForm && !editingId}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => onDelete(job._id!)}
                disabled={showForm && !editingId}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
