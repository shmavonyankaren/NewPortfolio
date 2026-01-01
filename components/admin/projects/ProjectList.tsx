"use client";

import { Project } from "./useProjectsManager";
import ProjectCard from "./ProjectCard";

interface ProjectListProps {
  projects: Project[];
  editingId: string | null;
  disabled: boolean;
  submittingId: string | null;
  deletingId: string | null;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export default function ProjectList({
  projects,
  editingId,
  disabled,
  submittingId,
  deletingId,
  onEdit,
  onDelete,
}: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-8 text-center">
        <p className="text-slate-600 dark:text-gray-400 text-lg">
          No projects yet. Click &quot;Add Project&quot; to create one.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {projects
        .filter((project) => !editingId || project._id !== editingId)
        .map((project, index) => (
          <ProjectCard
            key={project._id || `project-${index}-${project.title}`}
            project={project}
            onEdit={() => onEdit(project)}
            onDelete={() => onDelete(project._id!)}
            isSubmitting={submittingId === project._id}
            isDeleting={deletingId === project._id}
            disabled={disabled}
          />
        ))}
    </div>
  );
}
