import { pageMetadata } from "@/lib/seo";
import { publicContent } from "@/lib/content/public";
export const revalidate = 60;

import Hero from "@/components/Hero";
import Grid from "@/components/Grid";
import Footer from "@/components/Footer";
import Clients from "@/components/Clients";
import ExperienceSection from "@/components/ExperienceSection";
import RecentProjects from "@/components/RecentProjects";

async function fetchGeneralInfo() {
  try {
    const content = await publicContent("general-info", false);
    const res = { ok: content !== null, json: async () => content, status: content === null ? 404 : 200 };
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch general info:", error);
    return null;
  }
}

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

async function fetchJobs() {
  try {
    const content = await publicContent("jobs", false);
    const res = { ok: content !== null, json: async () => content, status: content === null ? 404 : 200 };
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return [];
  }
}

async function fetchEducation() {
  try {
    const content = await publicContent("educations", false);
    const res = { ok: content !== null, json: async () => content, status: content === null ? 404 : 200 };
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch education:", error);
    return [];
  }
}

async function fetchComments() {
  try {
    const content = await publicContent("comments", false);
    const res = { ok: content !== null, json: async () => content, status: content === null ? 404 : 200 };
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return [];
  }
}

const Home = async () => {
  const [generalInfo, projects, jobs, education, comments] = await Promise.all([
    fetchGeneralInfo(),
    fetchProjects(),
    fetchJobs(),
    fetchEducation(),
    fetchComments(),
  ]);

  return (
    <main className="relative bg-[linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)] dark:bg-[#000319] flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 lg:px-10 px-5">
      <div className="max-w-7xl w-full">
        <Hero generalInfo={generalInfo} />
        <Grid />
        <RecentProjects projects={projects} />
        <Clients insights={comments} />
        <ExperienceSection jobs={jobs} education={education} />
        <Footer />
      </div>
    </main>
  );
};

export default Home;

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) { return pageMetadata((await params).locale, ""); }
