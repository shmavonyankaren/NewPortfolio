import React from "react";
import Image from "next/image";
import { FaCode } from "react-icons/fa";

type ProjectTechnologiesProps = {
  technologies: string[];
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
        {technologies.map((tech, index) => (
          <div key={index} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <Image
                src={tech}
                alt={`technology-${index}`}
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
