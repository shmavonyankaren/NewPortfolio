import React from "react";
import Image from "next/image";
import { FaCode } from "react-icons/fa";

type Technology = {
  name: string;
  icon?: string;
};

type ProjectTechnologiesProps = {
  technologies: Technology[];
};

export function ProjectTechnologies({
  technologies,
}: ProjectTechnologiesProps) {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <FaCode className="text-3xl text-purple-600 dark:text-purple-400" />
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          Technologies Used
        </h2>
      </div>
      <div className="flex flex-wrap gap-4">
        {technologies
          .filter((tech) => tech.name && tech.name.trim() !== "")
          .map((tech, index) => {
            const hasValidIcon =
              tech.icon &&
              tech.icon.trim() !== "" &&
              (tech.icon.startsWith("/") || tech.icon.startsWith("http"));

            return (
              <div key={index} className="relative group">
                {/* Gradient glow */}
                <div
                  className="
      absolute inset-0 rounded-xl blur-md
      bg-linear-to-r from-purple-500 to-pink-500
      opacity-0 group-hover:opacity-20
      dark:group-hover:opacity-30
      transition-opacity duration-300
      pointer-events-none
    "
                />

                {/* Technology card */}
                <div
                  tabIndex={0}
                  aria-label={tech.name}
                  className="
      relative flex flex-col items-center justify-center
      gap-2 min-w-20 min-h-20 p-4 rounded-xl

      bg-[#F5F1FF] text-purple-800
      border border-[#E9D5FF]

      dark:bg-purple-500/10
      dark:text-purple-100
      dark:border-white/10

      transition-all duration-300 ease-out
      group-hover:-translate-y-1
      group-hover:border-purple-400
      group-hover:bg-[#EDE9FE]
      group-hover:shadow-[0_6px_20px_rgba(168,85,247,0.15)]

      dark:group-hover:bg-purple-500/20
      dark:group-hover:border-purple-400/40
      dark:group-hover:shadow-[0_6px_24px_rgba(168,85,247,0.20)]

      focus-visible:outline-2
      focus-visible:outline-offset-2
      focus-visible:outline-purple-500
    "
                >
                  {hasValidIcon ? (
                    <Image
                      src={tech.icon as string}
                      alt=""
                      width={48}
                      height={48}
                      className="
          w-12 h-12 object-contain
          transition-transform duration-300
          group-hover:scale-110
        "
                    />
                  ) : (
                    <span className="text-sm font-medium text-center px-2">
                      {tech.name}
                    </span>
                  )}
                </div>

                {/* Tooltip */}
                <div
                  role="tooltip"
                  className="
      absolute bottom-full left-1/2 z-50
      mb-3 -translate-x-1/2 translate-y-1
      px-3 py-1.5 rounded-lg
      whitespace-nowrap pointer-events-none

      bg-slate-900 text-white
      dark:bg-purple-950 dark:text-purple-100

      border border-purple-500/20
      shadow-lg shadow-purple-500/10

      text-xs font-medium

      opacity-0 invisible
      group-hover:opacity-100
      group-hover:visible
      group-hover:translate-y-0
      group-focus-within:opacity-100
      group-focus-within:visible
      group-focus-within:translate-y-0

      transition-all duration-200
    "
                >
                  {tech.name}

                  {/* Tooltip arrow */}
                  <div
                    className="
        absolute top-full left-1/2
        -translate-x-1/2 -mt-[1px]
        h-2 w-2 rotate-45

        bg-slate-900 dark:bg-purple-950
        border-r border-b border-purple-500/20
      "
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
