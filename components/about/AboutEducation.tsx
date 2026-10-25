import { usePublicText, translateStatic } from "@/i18n/text";
import DetailBulletList from "@/components/DetailBulletList";
import React from "react";
import ContentLogo from "@/components/ContentLogo";
import { DEFAULT_CONTENT_IMAGE } from "@/lib/content-images";
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
    learningOutcomes?: string[];
    skills?: {
      name: string;
      image?: string;
      description?: string;
    }[];
  }[];
}

const AboutEducation = ({ educations }: AboutEducationProps) => {
  const t = usePublicText();
  const fallbackEducation = [
    {
      degree: "Bachelor of Science",
      field: "Computer Science",
      institution: "University of Technology, California",
      logo: DEFAULT_CONTENT_IMAGE,
      duration: "2018-2022",
      description:
        "Focused on software development, web technologies, and computer architecture. Achieved a 3.8 GPA with honors.",
      skills: [],
      learningOutcomes: [],
    },
    {
      degree: "Master of Science",
      field: "Web Development",
      institution: "Institute of Digital Innovation, New York",
      logo: DEFAULT_CONTENT_IMAGE,
      duration: "2022-2024",
      description:
        "Specialized in full-stack development, cloud technologies, and modern web frameworks.",
      skills: [],
      learningOutcomes: [],
    },
  ];

  const educationData =
    educations && educations.length > 0
      ? educations.map((edu) => ({
          degree: edu.degree || "",
          field: edu.field,
          institution: edu.institution,
          logo: edu.logo?.trim() || DEFAULT_CONTENT_IMAGE,
          duration: `${new Date(edu.startDate).getFullYear()} - ${
            edu.isCurrentlyStudying
              ? t("Present")
              : new Date(edu.endDate).getFullYear()
          }`,
          description: edu.description,
          skills: edu.skills || [],
          learningOutcomes: edu.learningOutcomes || [],
        }))
      : translateStatic(fallbackEducation, t);

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="space-y-8 md:space-y-12">
        <h2 className="heading text-2xl! sm:text-3xl! md:text-4xl!">
          <span className="flex justify-center items-center text-center gap-3 text-purple-500 dark:text-purple-300">
            <Image
              src="/assets/images/EducationIcon.png"
              width={60}
              height={60}
              alt={t("Education")}
            />
            {t("Education")}</span>
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
                <span className="self-start px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
                  {edu.duration}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <ContentLogo src={edu.logo} alt={edu.institution + " logo"} />
                <p className="text-gray-600 dark:text-[#bec1dd] text-sm sm:text-base">
                  {edu.institution}
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                {edu.description}
              </p>

              {edu.skills.some(skill => skill.name.trim()) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {edu.skills.filter(skill => skill.name.trim()).map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full text-xs sm:text-sm">
                      {skill.name}
                    </span>
                  ))}
                </div>
              )}
              <DetailBulletList items={edu.learningOutcomes} title={t("Key Learning Outcomes")} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutEducation;
