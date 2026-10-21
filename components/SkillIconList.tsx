import Image from "next/image";

interface Skill { name: string; image?: string; icon?: string }

export default function SkillIconList({ skills = [], title }: { skills?: Skill[]; title: string }) {
  const visible = skills.filter(skill => skill.image?.trim() || skill.icon?.trim());
  if (!visible.length) return null;
  return <>
    <p className="text-[#839CB5] italic text-sm md:text-base">{title}</p>
    <ul aria-label={title === "Skills" ? "Work experience skills" : "Education skills"}
      className="mt-3 sm:mt-4 md:mt-5 flex flex-wrap items-center gap-3 sm:gap-4 pb-2">
      {visible.map((skill, index) => (
        <li key={index} className="relative group/skill shrink-0" tabIndex={0} aria-label={skill.name}>
          <Image src={(skill.image?.trim() || skill.icon?.trim())!} alt="" width={40} height={40} unoptimized
            className="h-10 w-10 object-contain transition-transform duration-300 group-hover/skill:scale-110" />
          <span role="tooltip"
            className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg px-3 py-1.5 bg-slate-900 text-white dark:bg-purple-950 dark:text-purple-100 border border-purple-500/20 shadow-lg shadow-purple-500/10 text-xs font-medium opacity-0 invisible group-hover/skill:visible group-hover/skill:opacity-100 group-hover/skill:translate-y-0 group-focus-within/skill:visible group-focus-within/skill:opacity-100 group-focus-within/skill:translate-y-0 transition-all duration-200">
            {skill.name}
            <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px h-2 w-2 rotate-45 bg-slate-900 dark:bg-purple-950 border-r border-b border-purple-500/20" />
          </span>
        </li>
      ))}
    </ul>
  </>;
}
