import React from "react";

const AboutSkills = () => {
  const skillsData = [
    {
      title: "Frontend Development",
      emoji: "🎨",
      skills: [
        "React & React Native",
        "TypeScript",
        "Next.js",
        "Tailwind CSS",
        "Framer Motion",
        "Redux",
      ],
    },
    {
      title: "Backend Development",
      emoji: "⚙️",
      skills: [
        "Node.js & Express",
        "Python & Django",
        "PostgreSQL",
        "MongoDB",
        "GraphQL",
        "REST APIs",
      ],
    },
    {
      title: "Tools & DevOps",
      emoji: "🛠️",
      skills: [
        "Git & GitHub",
        "Docker",
        "AWS",
        "CI/CD Pipelines",
        "Webpack",
        "Testing (Jest, Cypress)",
      ],
    },
    {
      title: "Design & UX",
      emoji: "🎭",
      skills: [
        "Figma",
        "UI/UX Principles",
        "Responsive Design",
        "Accessibility (A11y)",
        "Wireframing",
        "Prototyping",
      ],
    },
    {
      title: "Soft Skills",
      emoji: "💬",
      skills: [
        "Team Leadership",
        "Communication",
        "Problem Solving",
        "Project Management",
        "Mentoring",
        "Agile/Scrum",
      ],
    },
    {
      title: "Other Technologies",
      emoji: "📚",
      skills: [
        "Three.js & WebGL",
        "Electron",
        "Firebase",
        "Stripe Integration",
        "Analytics",
        "SEO Optimization",
      ],
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="space-y-8 md:space-y-12">
        <h2 className="heading text-2xl sm:text-3xl md:text-4xl">
          <span className="text-purple-300">🎨 Skills & Expertise</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {skillsData.map((skillCategory, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#1a1f3a] p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-purple-500/20"
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                <span className="text-xl sm:text-2xl">
                  {skillCategory.emoji}
                </span>
                <span>{skillCategory.title}</span>
              </h3>
              <ul className="space-y-2 md:space-y-3">
                {skillCategory.skills.map((skill, skillIdx) => (
                  <li
                    key={skillIdx}
                    className="flex items-center text-gray-700 dark:text-gray-300 text-sm sm:text-base"
                  >
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSkills;
