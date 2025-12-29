import React from "react";
import { ProjectItem } from "@/lib/types";

type ProjectCTAProps = {
  project: ProjectItem;
};

export function ProjectCTA({ project }: ProjectCTAProps) {
  return (
    <div className="relative mt-20">
      <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-30"></div>
      <div className="relative bg-linear-to-r from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-700 rounded-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Interested in This Project?
        </h2>
        <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
          Feel free to explore the live demo or dive into the source code.
          I&apos;m always open to feedback and collaboration!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white text-purple-600 hover:bg-slate-100 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
          >
            View Live Demo
          </a>
          <a
            href={project.gitHubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5"
          >
            Explore Code
          </a>
        </div>
      </div>
    </div>
  );
}
