export const revalidate = 60;

import Hero from "@/components/Hero";
import Grid from "@/components/Grid";
import Footer from "@/components/Footer";
import Clients from "@/components/Clients";
import ExperienceSection from "@/components/ExperienceSection";
import RecentProjects from "@/components/RecentProjects";

async function fetchGeneralInfo() {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/admin/general-info`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch general info:", error);
    return null;
  }
}

async function fetchProjects() {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/admin/projects`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

async function fetchJobs() {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/admin/jobs`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return [];
  }
}

async function fetchEducation() {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/admin/educations`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch education:", error);
    return [];
  }
}

async function fetchComments() {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/admin/comments`,
      {
        next: { revalidate: 60 },
      }
    );
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
        {/* <Experience /> */}
        <ExperienceSection jobs={jobs} education={education} />
        {/* <Approach /> */}
        <Footer />
      </div>
    </main>
  );
};

export default Home;
