import { pageMetadata } from "@/lib/seo";
import { publicContent } from "@/lib/content/public";
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
    const content = await publicContent("general-info", false);
    const res = { ok: content !== null, json: async () => content, status: content === null ? 404 : 200 };
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch general info:", error);
    return null;
  }
}

async function fetchEducations() {
  try {
    const content = await publicContent("educations", false);
    const res = { ok: content !== null, json: async () => content, status: content === null ? 404 : 200 };
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch educations:", error);
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

async function fetchSkillsets() {
  try {
    const content = await publicContent("skillsets", false);
    const res = { ok: content !== null, json: async () => content, status: content === null ? 404 : 200 };
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch skillsets:", error);
    return [];
  }
}

async function fetchCertificates() {
  try {
    const content = await publicContent("certificates", false);
    const res = { ok: content !== null, json: async () => content, status: content === null ? 404 : 200 };
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch certificates:", error);
    return [];
  }
}

async function fetchProjects() {
  try {
    const content = await publicContent("projects", true);
    const res = { ok: content !== null, json: async () => content, status: content === null ? 404 : 200 };
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

async function fetchComments() {
  try {
    const content = await publicContent("comments-section", true);
    const res = { ok: content !== null, json: async () => content, status: content === null ? 404 : 200 };
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return [];
  }
}

async function fetchContactInfo() {
  try {
    const content = await publicContent("contacts", false);
    const res = { ok: content !== null, json: async () => content, status: content === null ? 404 : 200 };
    if (!res.ok) return null;
    const contacts = await res.json();
    return contacts[0] || null;
  } catch (error) {
    console.error("Failed to fetch contact info:", error);
    return null;
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
    contactInfo,
  ] = await Promise.all([
    fetchGeneralInfo(),
    fetchEducations(),
    fetchJobs(),
    fetchSkillsets(),
    fetchCertificates(),
    fetchProjects(),
    fetchComments(),
    fetchContactInfo(),
  ]);

  const cvUrl = contactInfo?.cvUrl;

  return (
    <main className="relative bg-[linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)] dark:bg-[linear-gradient(90deg,rgba(4,7,29,1)_0%,rgba(12,14,35,1)_100%)] text-gray-900 dark:text-white flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 lg:px-10 px-5">
      <div className="max-w-7xl w-full">
        <AboutHero generalInfo={generalInfo} cvUrl={cvUrl} />
        <AboutEducation educations={educations} />
        <AboutExperience jobs={jobs} />
        <AboutSkills skillsets={skillsets} />
        <AboutCertifications certificates={certificates} />
        <AboutProjects projects={projects} />
        <AboutTestimonials comments={comments} />
        <AboutCTA cvUrl={cvUrl} />
      </div>
    </main>
  );
}

export default AboutMePage;

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) { return pageMetadata((await params).locale, "about"); }
