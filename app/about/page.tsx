export const revalidate = 60;

import AboutHero from "@/components/about/AboutHero";
import AboutEducation from "@/components/about/AboutEducation";
import AboutExperience from "@/components/about/AboutExperience";
import AboutSkills from "@/components/about/AboutSkills";
import AboutCertifications from "@/components/about/AboutCertifications";
import AboutProjects from "@/components/about/AboutProjects";
import AboutTestimonials from "@/components/about/AboutTestimonials";
import AboutCTA from "@/components/about/AboutCTA";

async function fetchGeneralInfo() {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/admin/general-info`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch general info:", error);
    return null;
  }
}

async function fetchEducations() {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/admin/educations`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch educations:", error);
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
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return [];
  }
}

async function fetchSkillsets() {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/admin/skillsets`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch skillsets:", error);
    return [];
  }
}

async function fetchCertificates() {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/admin/certificates`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch certificates:", error);
    return [];
  }
}

async function fetchProjects() {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/admin/projects`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

async function fetchComments() {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/admin/comments-section`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return [];
  }
}

async function AboutMePage() {
  const [
    generalInfo,
    educations,
    jobs,
    skillsets,
    certificates,
    projects,
    comments,
  ] = await Promise.all([
    fetchGeneralInfo(),
    fetchEducations(),
    fetchJobs(),
    fetchSkillsets(),
    fetchCertificates(),
    fetchProjects(),
    fetchComments(),
  ]);

  return (
    <main className="relative bg-[linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)] dark:bg-[linear-gradient(90deg,rgba(4,7,29,1)_0%,rgba(12,14,35,1)_100%)] text-gray-900 dark:text-white flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 lg:px-10 px-5">
      <div className="max-w-7xl w-full">
        <AboutHero generalInfo={generalInfo} />
        <AboutEducation educations={educations} />
        <AboutExperience jobs={jobs} />
        <AboutSkills skillsets={skillsets} />
        <AboutCertifications certificates={certificates} />
        <AboutProjects projects={projects} />
        <AboutTestimonials comments={comments} />
        <AboutCTA />
      </div>
    </main>
  );
}

export default AboutMePage;
