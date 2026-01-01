"use client";

import { Edit2, Trash2, Loader } from "lucide-react";

interface Project {
  _id?: string;
  title: string;
  shortDescription: string;
  description?: string;
  image: string;
  features?: Array<{ title: string; description: string }>;
  challenges?: Array<{ challenge: string; solution: string }>;
  technologies?: Array<{ name: string }>;
  status?: string;
  teamType?: string;
}

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  isEditing?: boolean;
  isSubmitting?: boolean;
  isDeleting?: boolean;
  disabled?: boolean;
}

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
  isEditing = false,
  isSubmitting = false,
  isDeleting = false,
  disabled = false,
}: ProjectCardProps) {
  return (
    <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg overflow-hidden">
      <div className="flex items-start gap-3 p-4 border-b border-slate-200 dark:border-white/10">
        {project.image && (
          <img
            src={project.image}
            alt={project.title}
            className="w-16 h-16 object-cover rounded border border-slate-200 dark:border-white/10 shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="text-slate-900 dark:text-white font-semibold truncate">
                {project.title}
              </h4>
              <p className="text-slate-600 dark:text-gray-400 text-sm line-clamp-2">
                {project.shortDescription}
              </p>
            </div>
          </div>
          {(project.status || project.teamType) && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {project.status && (
                <span className="inline-block bg-blue-600/20 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded">
                  {project.status}
                </span>
              )}
              {project.teamType && (
                <span className="inline-block bg-purple-600/20 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded capitalize">
                  {project.teamType}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-3 space-y-3 text-sm">
        {project.description && (
          <div>
            <p className="text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
              Description
            </p>
            <p className="text-slate-600 dark:text-gray-400 line-clamp-2">
              {project.description}
            </p>
          </div>
        )}

        {project.technologies && project.technologies.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
              Technologies
            </p>
            <div className="flex gap-1 flex-wrap">
              {project.technologies.slice(0, 5).map((tech, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded"
                >
                  {tech.name}
                </span>
              ))}
              {project.technologies.length > 5 && (
                <span className="inline-block text-slate-600 dark:text-gray-400 text-xs px-2 py-0.5">
                  +{project.technologies.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {project.features && project.features.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
              Key Features
            </p>
            <ul className="space-y-1">
              {project.features.slice(0, 3).map((feature, idx) => (
                <li
                  key={idx}
                  className="text-slate-600 dark:text-gray-400 text-xs"
                >
                  • {feature.title}
                </li>
              ))}
              {project.features.length > 3 && (
                <li className="text-slate-600 dark:text-gray-400 text-xs italic">
                  +{project.features.length - 3} more features
                </li>
              )}
            </ul>
          </div>
        )}

        {project.challenges && project.challenges.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
              Challenges & Solutions
            </p>
            <ul className="space-y-1">
              {project.challenges.slice(0, 2).map((item, idx) => (
                <li
                  key={idx}
                  className="text-slate-600 dark:text-gray-400 text-xs"
                >
                  • {item.challenge}
                </li>
              ))}
              {project.challenges.length > 2 && (
                <li className="text-slate-600 dark:text-gray-400 text-xs italic">
                  +{project.challenges.length - 2} more challenges
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="flex gap-2 p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
        <button
          onClick={onEdit}
          disabled={
            isEditing || isSubmitting || isDeleting || (disabled && !isEditing)
          }
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 flex items-center justify-center"
        >
          {isSubmitting ? (
            <Loader size={18} className="animate-spin" />
          ) : (
            <Edit2 size={18} />
          )}
        </button>
        <button
          onClick={onDelete}
          disabled={isEditing || isDeleting || (disabled && !isEditing)}
          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600 flex items-center justify-center"
        >
          {isDeleting ? (
            <Loader size={18} className="animate-spin" />
          ) : (
            <Trash2 size={18} />
          )}
        </button>
      </div>
    </div>
  );
}
