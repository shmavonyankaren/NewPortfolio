import { usePublicText, translateStatic } from "@/i18n/text";
import ContentLogo from "@/components/ContentLogo";
import { DEFAULT_CONTENT_IMAGE } from "@/lib/content-images";
import Image from "next/image";

interface AboutSkillsProps {
  skillsets?: {
    title: string;
    image?: string;
    skills?: { name: string }[];
  }[];
}

const AboutSkills = ({ skillsets }: AboutSkillsProps) => {
  const t = usePublicText();
  const fallbackSkills = [
    {
      title: "Frontend Development",
      image: DEFAULT_CONTENT_IMAGE,
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
      image: DEFAULT_CONTENT_IMAGE,
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
      image: DEFAULT_CONTENT_IMAGE,
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
      image: DEFAULT_CONTENT_IMAGE,
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
      image: DEFAULT_CONTENT_IMAGE,
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
      image: DEFAULT_CONTENT_IMAGE,
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

  const skillsData =
    skillsets && skillsets.length > 0
      ? skillsets.map((skillset) => ({
          title: skillset.title,
          image: skillset.image || DEFAULT_CONTENT_IMAGE,
          skills: skillset.skills?.map((s: { name: string }) => s.name) || [],
        }))
      : translateStatic(fallbackSkills, t);

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="space-y-8 md:space-y-12">
        <h2 className="heading text-2xl! sm:text-3xl! md:text-4xl!">
          <span className="flex justify-center items-center text-center gap-3  text-purple-500 dark:text-purple-300">
            <Image
              src="/assets/images/SkillsIcon.png"
              width={60}
              height={60}
              alt={t("Skills")}
            />
            {t("Skills & Expertise")}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {skillsData.map((skillCategory, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#1a1f3a] p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-purple-500/20"
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white md:mb-3 flex items-center gap-2 md:gap-3 min-h-16 ">
                <ContentLogo
                  src={skillCategory.image}
                  alt={skillCategory.title + " image"}
                />

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
