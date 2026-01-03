import Link from "next/link";
import React from "react";

interface AboutProjectsProps {
  projects?: {
    _id?: string;
    title: string;
    description: string;
    shortDescription?: string;
    technologies?: { name: string }[];
  }[];
}

const AboutProjects = ({ projects }: AboutProjectsProps) => {
  const projectsData =
    projects && projects.length > 0
      ? projects.slice(0, 3).map((project) => ({
          _id: project._id,
          title: project.title,
          description: project.shortDescription || project.description,
          tags:
            project.technologies
              ?.slice(0, 4)
              .map((t: { name: string }) => t.name) || [],
        }))
      : [];

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="space-y-8 md:space-y-12">
        <h2 className="heading text-2xl sm:text-3xl md:text-4xl">
          <span className="text-purple-500 dark:text-purple-300">
            🎯 Featured Projects
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projectsData.map((project, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#1a1f3a] p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-200 dark:border-purple-500/20"
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">
                {project.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 md:mb-6 text-sm sm:text-base">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                {project.tags.map((tag: string, tagIdx: number) => (
                  <span
                    key={tagIdx}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full text-xs sm:text-sm font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors text-sm sm:text-base">
                <Link href={`/projects/${project._id}`}>View Project →</Link>
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <Link
            href="/projects"
            className="inline-block px-6 sm:px-8 py-2 sm:py-3 bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors text-sm sm:text-base"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutProjects;
