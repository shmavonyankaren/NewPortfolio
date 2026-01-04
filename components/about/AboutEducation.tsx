import React from "react";
import Image from "next/image";

interface AboutEducationProps {
  educations?: {
    degree: string;
    field: string;
    institution: string;
    logo?: string;
    startDate: string;
    endDate: string;
    isCurrentlyStudying: boolean;
    description: string;
    skills?: {
      name: string;
      image?: string;
      description?: string;
    }[];
  }[];
}

const AboutEducation = ({ educations }: AboutEducationProps) => {
  const fallbackEducation = [
    {
      degree: "Bachelor of Science",
      field: "Computer Science",
      institution: "University of Technology, California",
      logo: "/app.svg",
      duration: "2018-2022",
      description:
        "Focused on software development, web technologies, and computer architecture. Achieved a 3.8 GPA with honors.",
      skills: [],
    },
    {
      degree: "Master of Science",
      field: "Web Development",
      institution: "Institute of Digital Innovation, New York",
      logo: "/app.svg",
      duration: "2022-2024",
      description:
        "Specialized in full-stack development, cloud technologies, and modern web frameworks.",
      skills: [],
    },
  ];

  const educationData =
    educations && educations.length > 0
      ? educations.map((edu) => ({
          degree: edu.degree || "",
          field: edu.field,
          institution: edu.institution,
          logo: edu.logo,
          duration: `${new Date(edu.startDate).getFullYear()} - ${
            edu.isCurrentlyStudying
              ? "Present"
              : new Date(edu.endDate).getFullYear()
          }`,
          description: edu.description,
          skills: edu.skills || [],
        }))
      : fallbackEducation;

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="space-y-8 md:space-y-12">
        <h2 className="heading text-2xl sm:text-3xl md:text-4xl">
          <span className="text-purple-500 dark:text-purple-300">
            🎓 Education
          </span>
        </h2>

        <div className="columns-1 md:columns-2 gap-6 md:gap-8 space-y-6 md:space-y-8">
          {educationData.map((edu, idx) => (
            <div
              key={idx}
              className="break-inside-avoid bg-white dark:bg-[#1a1f3a] p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-purple-500/20"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    {edu.degree}
                  </h3>
                  <p className="text-purple-600 dark:text-purple-400 font-semibold mt-1 text-sm sm:text-base">
                    {edu.field}
                  </p>
                </div>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
                  {edu.duration}
                </span>
              </div>
              <p className="text-gray-600 dark:text-[#bec1dd] mb-4 text-sm sm:text-base">
                {edu.institution}
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                {edu.description}
              </p>

              {edu.skills && edu.skills.length > 0 && (
                <div className="mt-5 space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-300">
                    Skills
                  </h4>
                  <div className="space-y-3">
                    {edu.skills.map((skill, skillIdx) => {
                      const logoSrc =
                        skill.image && skill.image.trim() !== "" && skill.image;
                      return (
                        <div
                          key={skillIdx}
                          className="flex items-start gap-3 rounded-xl border border-gray-100 dark:border-purple-500/15 bg-gray-50/70 dark:bg-white/5 p-3"
                        >
                          {logoSrc ? (
                            <div className="shrink-0 w-12 h-12 rounded-full bg-white dark:bg-[#161a31] border border-gray-100 dark:border-purple-500/20 flex items-center justify-center overflow-hidden">
                              <Image
                                src={logoSrc}
                                alt={skill.name || "Skill logo"}
                                width={48}
                                height={48}
                                className="object-contain p-2"
                              />
                            </div>
                          ) : (
                            <div className="p-3 w-6 h-6 rounded bg-purple-200 dark:bg-purple-700 flex items-center justify-center text-xs">
                              ⚙️
                            </div>
                          )}
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {skill.name}
                            </p>
                            {skill.description && (
                              <p className="text-sm text-gray-600 dark:text-[#bec1dd] leading-relaxed">
                                {skill.description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutEducation;
