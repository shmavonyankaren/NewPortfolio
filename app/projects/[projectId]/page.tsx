"use client";

import { useParams, useRouter } from "next/navigation";
import { projects } from "@/data";
import { FaArrowLeft } from "react-icons/fa";
import {
  ProjectHero,
  ProjectStats,
  ProjectTechnologies,
  ProjectFeatures,
  ProjectChallenges,
  ProjectCTA,
} from "@/components/project";

function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const project = projects.find(
    (p) => p._id === projectId || p.id === Number(projectId)
  );

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[linear-gradient(90deg,rgba(4,7,29,1)_0%,rgba(12,14,35,1)_100%)]">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Project Not Found
        </h1>
        <button
          onClick={() => router.push("/projects")}
          className="cursor-pointer px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  // Mock detailed data - in real app, this would come from API/database
  const projectDetails = {
    overview: project.des,
    features: [
      "User authentication and authorization",
      "Real-time data updates and synchronization",
      "Responsive design for all devices",
      "Advanced search and filtering",
      "Interactive UI with smooth animations",
      "Optimized performance and SEO",
    ],
    challenges: [
      {
        title: "Performance Optimization",
        description:
          "Implemented lazy loading and code splitting to reduce initial bundle size by 40%",
      },
      {
        title: "State Management",
        description:
          "Designed a scalable state management solution handling complex data flows",
      },
      {
        title: "Cross-browser Compatibility",
        description:
          "Ensured consistent experience across all modern browsers and devices",
      },
    ],
    technologies: project.iconLists,
    stats: {
      duration: "3 months",
      team: "Solo Project",
      status: "Live & Maintained",
    },
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)] dark:bg-[linear-gradient(90deg,rgba(4,7,29,1)_0%,rgba(12,14,35,1)_100%)] text-slate-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-5 md:px-10 md:py-30 lg:px-20 py-20 pt-25">
        {/* Back Button */}
        <button
          onClick={() => router.push("/projects")}
          className="cursor-pointer flex items-center gap-2 mb-8 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Projects</span>
        </button>

        <ProjectHero project={project} overview={projectDetails.overview} />
        <ProjectStats stats={projectDetails.stats} />
        <ProjectTechnologies technologies={projectDetails.technologies} />
        <ProjectFeatures features={projectDetails.features} />
        <ProjectChallenges challenges={projectDetails.challenges} />
        <ProjectCTA project={project} />
      </div>
    </div>
  );
}

export default ProjectPage;
