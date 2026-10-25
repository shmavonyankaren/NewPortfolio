import { pageMetadata } from "@/lib/seo";
import { getPublicText } from "@/i18n/text-server";
import { publicContent } from "@/lib/content/public";
export const revalidate = 60;

import RecentProjects from "@/components/RecentProjects";
import React from "react";
import { FaCode, FaRocket, FaLayerGroup } from "react-icons/fa";

async function fetchProjects() {
  try {
    const content = await publicContent("projects", false);
    const res = { ok: content !== null, json: async () => content, status: content === null ? 404 : 200 };
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

async function MyProjects() {
  const t = await getPublicText();
  const projects = await fetchProjects();
  const projectCount = projects.length > 0 ? `${projects.length}+` : "5+";

  // Calculate unique technologies
  const uniqueTechs =
    projects.length > 0
      ? new Set(
          projects.flatMap(
            (p: {technologies?: {name: string}[]}) => p.technologies?.map((t: {name: string}) => t.name) || [],
          ),
        ).size
      : 20;

  return (
    <div className="min-h-screen flex flex-col items-center pt-20 pb-10 bg-[linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)]  dark:bg-[linear-gradient(90deg,rgba(4,7,29,1)_0%,rgba(12,14,35,1)_100%)] text-gray-900 dark:text-white">
      <div className="w-full max-w-7xl mx-auto md:px-20 px-5">
        {/* Hero Section */}
        <div className="text-center mb-16 mt-10">
          <div className="inline-block">
            <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.1] font-bold mb-4 bg-linear-to-r from-purple-600 via-purple-500 to-pink-500 dark:from-purple-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
              {t("My Projects")}</h1>
            <div className="h-1 w-full bg-linear-to-r from-purple-600 via-purple-500 to-pink-500 dark:from-purple-400 dark:via-purple-300 dark:to-pink-400 rounded-full"></div>
          </div>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mt-6 max-w-3xl mx-auto leading-relaxed">
            {t("Explore my portfolio of innovative projects showcasing modern web development, creative solutions, and cutting-edge technologies.")}</p>
        </div>

        {/* Stats Section */}
        <div className=" grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="relative group">
            <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl">
                  <FaCode className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {projectCount}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t("Projects Completed")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-linear-to-br from-blue-500 to-purple-500 rounded-xl">
                  <FaLayerGroup className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {uniqueTechs}+
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t("Technologies Used")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-linear-to-r from-pink-600 to-purple-600 dark:from-pink-500 dark:to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-linear-to-br from-pink-500 to-purple-500 rounded-xl">
                  <FaRocket className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                    100%
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t("Success Rate")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <RecentProjects projects={projects} />
      </div>
    </div>
  );
}

export default MyProjects;

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) { return pageMetadata((await params).locale, "projects"); }
