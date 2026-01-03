import React from "react";

interface AboutEducationProps {
  educations?: any[];
}

const AboutEducation = ({ educations }: AboutEducationProps) => {
  const fallbackEducation = [
    {
      degree: "Bachelor of Science",
      field: "Computer Science",
      institution: "University of Technology, California",
      duration: "2018-2022",
      description:
        "Focused on software development, web technologies, and computer architecture. Achieved a 3.8 GPA with honors.",
    },
    {
      degree: "Master of Science",
      field: "Web Development",
      institution: "Institute of Digital Innovation, New York",
      duration: "2022-2024",
      description:
        "Specialized in full-stack development, cloud technologies, and modern web frameworks.",
    },
  ];

  const educationData =
    educations && educations.length > 0
      ? educations.map((edu) => ({
          degree: edu.degree || "",
          field: edu.field,
          institution: edu.institution,
          duration: `${new Date(edu.startDate).getFullYear()} - ${
            edu.isCurrentlyStudying
              ? "Present"
              : new Date(edu.endDate).getFullYear()
          }`,
          description: edu.description,
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {educationData.map((edu, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#1a1f3a] p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-purple-500/20"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutEducation;
