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
  ProjectFullDescription,
} from "@/components/project";
import { useEffect, useState } from "react";
import { ProjectItem } from "@/lib/types";

function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const [project, setProject] = useState<ProjectItem | null | undefined>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/admin/projects`);
        if (res.ok) {
          const apiProjects = await res.json();
          const foundProject = apiProjects.find(
            (p: ProjectItem) => p._id === projectId
          );
          if (foundProject) {
            setProject(foundProject);
          } else {
            // Fallback to static projects
            const staticProject = projects.find(
              (p) => p._id === projectId || p.id === Number(projectId)
            );
            setProject(staticProject);
          }
        } else {
          // Fallback to static projects
          const staticProject = projects.find(
            (p) => p._id === projectId || p.id === Number(projectId)
          );
          setProject(staticProject);
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
        // Fallback to static projects
        const staticProject = projects.find(
          (p) => p._id === projectId || p.id === Number(projectId)
        );
        setProject(staticProject);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[linear-gradient(90deg,rgba(4,7,29,1)_0%,rgba(12,14,35,1)_100%)]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

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

  // Prepare project details - use API data if available, otherwise fallback
  const projectDetails = {
    overview: project.shortDescription,
    features:
      project.features?.map((f: ProjectItem["features"][0]) => ({
        title: f.title,
        description: f.description,
      })) || [],
    challenges:
      project.challenges?.map((c: ProjectItem["challenges"][0]) => ({
        title: c.challenge,
        description: c.solution,
      })) || [],
    technologies:
      project.technologies?.filter(
        (t) => t && t.name && typeof t.name === "string" && t.name.trim() !== ""
      ) || [],
    stats: {
      duration: project.duration || "N/A",
      team: project.teamType === "solo" ? "Solo Project" : "Team Project",
      status: project.status || "N/A",
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
        <ProjectFullDescription description={project.description} />
        <ProjectFeatures features={projectDetails.features} />
        <ProjectChallenges challenges={projectDetails.challenges} />
        <ProjectCTA project={project} />
      </div>
    </div>
  );
}

export default ProjectPage;
