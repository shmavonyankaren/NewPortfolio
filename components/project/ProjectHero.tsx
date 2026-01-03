import React from "react";
import Image from "next/image";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { ProjectItem } from "@/lib/types";

type ProjectHeroProps = {
  project: ProjectItem;
  overview: string;
};

export function ProjectHero({ project, overview }: ProjectHeroProps) {
  return (
    <div className="mb-16">
      <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
        <div className="flex-1 min-w-75">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-linear-to-r from-purple-600 via-purple-500 to-pink-500 dark:from-purple-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
            {project.title}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
            {project.shortDescription}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          {project.demoUrl && project.demoUrl.trim() !== "" && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/50 hover:-translate-y-0.5"
            >
              <FaExternalLinkAlt />
              <span className="font-semibold">View Live</span>
            </a>
          )}
          {project.githubUrl && project.githubUrl.trim() !== "" && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <FaGithub />
              <span className="font-semibold">Source Code</span>
            </a>
          )}
        </div>
      </div>

      {/* Project Image */}
      {project.image && (
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 group">
          <div className="absolute inset-0 bg-linear-to-t from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
          <Image
            src={project.image}
            alt={project.title}
            width={1200}
            height={600}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      )}
    </div>
  );
}
