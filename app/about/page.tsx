import AboutHero from "@/components/about/AboutHero";
import AboutEducation from "@/components/about/AboutEducation";
import AboutExperience from "@/components/about/AboutExperience";
import AboutSkills from "@/components/about/AboutSkills";
import AboutCertifications from "@/components/about/AboutCertifications";
import AboutProjects from "@/components/about/AboutProjects";
import AboutTestimonials from "@/components/about/AboutTestimonials";
import AboutCTA from "@/components/about/AboutCTA";

function AboutMePage() {
  return (
    <main className="relative bg-[linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)] dark:bg-[linear-gradient(90deg,rgba(4,7,29,1)_0%,rgba(12,14,35,1)_100%)] text-gray-900 dark:text-white flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 lg:px-10 px-5">
      <div className="max-w-7xl w-full">
        <AboutHero />
        <AboutEducation />
        <AboutExperience />
        <AboutSkills />
        <AboutCertifications />
        <AboutProjects />
        <AboutTestimonials />
        <AboutCTA />
      </div>
    </main>
  );
}

export default AboutMePage;
