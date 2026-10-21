import DetailBulletList from "@/components/DetailBulletList";
import React from "react";
import ContentLogo from "@/components/ContentLogo";
import { DEFAULT_CONTENT_IMAGE } from "@/lib/content-images";
import Image from "next/image";

interface AboutExperienceProps {
  jobs?: {
    position: string;
    logo?: string;
    company: string;
    startDate: string;
    endDate: string;
    isCurrentlyWorking: boolean;
    description: string;
    responsibilities?: { name: string }[];
    skills?: { name: string }[];
  }[];
}

const AboutExperience = ({ jobs }: AboutExperienceProps) => {
  const fallbackExperience = [
    {
      responsibilities: [] as string[],
      title: "Senior Frontend Developer",
      logo: DEFAULT_CONTENT_IMAGE,
      company: "Tech Innovations Inc.",
      duration: "Jan 2023 - Present",
      description:
        "Leading frontend development for multiple high-traffic web applications. Managed a team of 5 developers and implemented modern architectural patterns using React, TypeScript, and Next.js. Improved application performance by 40% through optimization techniques.",
      skills: [
        "React",
        "TypeScript",
        "Next.js",
        "Tailwind CSS",
        "Team Leadership",
      ],
    },
    {
      responsibilities: [] as string[],
      title: "Full Stack Developer",
      logo: DEFAULT_CONTENT_IMAGE,
      company: "StartUp Ventures LLC",
      duration: "Jun 2021 - Dec 2022",
      description:
        "Developed and maintained full-stack web applications using Node.js and React. Collaborated with product and design teams to implement user-facing features and backend APIs. Reduced load times by 50% through database optimization.",
      skills: ["Node.js", "React", "MongoDB", "PostgreSQL", "AWS"],
    },
    {
      responsibilities: [] as string[],
      title: "Junior Frontend Developer",
      logo: DEFAULT_CONTENT_IMAGE,
      company: "Digital Solutions Co.",
      duration: "Sep 2019 - May 2021",
      description:
        "Built responsive web interfaces using HTML, CSS, and JavaScript. Implemented pixel-perfect designs from Figma mockups. Participated in code reviews and contributed to best practices documentation.",
      skills: ["HTML/CSS", "JavaScript", "Vue.js", "Responsive Design"],
    },
  ];

  const experienceData =
    jobs && jobs.length > 0
      ? jobs.map((job) => ({
          title: job.position,
          logo: job.logo?.trim() || DEFAULT_CONTENT_IMAGE,
          company: job.company,
          duration: `${new Date(job.startDate).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })} - ${
            job.isCurrentlyWorking
              ? "Present"
              : new Date(job.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
          }`,
          description: job.description,
          responsibilities: job.responsibilities?.map(item => item.name) || [],
          skills: job.skills?.map((s: { name: string }) => s.name) || [],
        }))
      : fallbackExperience;

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="space-y-8 md:space-y-12">
        <h2 className="heading text-2xl! sm:text-3xl! md:text-4xl!">
          <span className="flex justify-center items-center text-center gap-3 text-purple-500 dark:text-purple-300">
            <Image
              src="/assets/images/WorkExperienceIcon.png"
              width={60}
              height={60}
              alt="Experience"
            />
            Work Experience
          </span>
        </h2>

        <div className="space-y-6 md:space-y-8">
          {experienceData.map((exp, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#1a1f3a] p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-purple-500/20"
            >
              <div className="flex flex-col gap-3 md:gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <ContentLogo src={exp.logo} alt={exp.company + " logo"} />

                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      {exp.title}
                    </h3>
                    <p className="text-purple-600 dark:text-purple-400 font-semibold text-sm sm:text-base">
                      {exp.company}
                    </p>
                  </div>
                </div>
                <span className="text-gray-600 dark:text-[#bec1dd] text-xs sm:text-sm font-semibold inline-block">
                  {exp.duration}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm sm:text-base">
                {exp.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {exp.skills.map((skill: string, skillIdx: number) => (
                  <span
                    key={skillIdx}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full text-xs sm:text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <DetailBulletList items={exp.responsibilities} title="Responsibilities" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutExperience;
