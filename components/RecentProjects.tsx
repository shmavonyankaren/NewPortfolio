"use client";

import { GoArrowUpRight } from "react-icons/go";
import { FaGithub } from "react-icons/fa";

import { CardContainer, CardBody, CardItem } from "./ui/3d-card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { ProjectItem } from "@/lib/types";

interface RecentProjectsProps {
  projects?: ProjectItem[];
}

const ProjectCard = memo(({ item }: { item: ProjectItem }) => {
  const router = useRouter();
  const projectId = item._id || item.id;

  return (
    <CardContainer
      key={projectId}
      className="min-w-80 flex justify-center items-center md:flex-none md:w-160 max-w-154"
      containerClassName="pb-20"
    >
      <CardBody
        className="h-auto w-full flex flex-col p-6 rounded-2xl shadow-[0_8px_16px_rgb(0_0_0/0.4)] border border-white/10 group-hover/pin:border-white/20 transition duration-700 cursor-pointer group"
        onClick={() => router.push(`/projects/${projectId}`)}
        role="button"
        tabIndex={0}
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key === "Enter" || e.key === " ") {
            router.push(`/projects/${projectId}`);
          }
        }}
      >
        {/* Project Image */}
        <CardItem
          translateZ="65"
          className="relative  flex items-center justify-center w-full overflow-hidden h-[20vh] lg:h-[40vh] mb-10  rounded-2xl lg:rounded-3xl"
        >
          <div
            className="relative flex justify-center items-center w-full h-full overflow-hidden rounded-2xl sm:rounded-3xl"
            style={{ backgroundColor: "#13162D" }}
          >
            <Image
              width={500}
              height={300}
              src="/bg.png"
              alt="background"
              className="w-full h-full object-cover"
              sizes="(min-width: 1024px) 50vw, 90vw"
              priority={false}
              loading="lazy"
            />
            {item.image && (
              <Image
                width={500}
                height={300}
                src={item.image}
                alt={item.title}
                className="z-10 absolute bottom-0 w-auto"
                sizes="(min-width: 1024px) 40vw, 80vw"
                loading="lazy"
              />
            )}
          </div>
        </CardItem>

        {/* Title */}
        <CardItem translateZ="30" className="w-full">
          <h1 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1 text-slate-900 dark:text-white">
            {item.title}
          </h1>
        </CardItem>

        {/* Description */}
        <CardItem translateZ="20" className="w-full">
          <p className="lg:text-xl dark:text-[#BEC1DD] text-slate-700 lg:font-normal font-light text-sm line-clamp-2 mt-2">
            {item.shortDescription}
          </p>
        </CardItem>

        {/* Tech Icons and Actions */}
        <CardItem
          translateZ="25"
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-5 w-full"
        >
          <div className="flex items-center">
            {(
              item.technologies?.slice(0, 5) ||
              (item as { iconLists?: string[] }).iconLists
                ?.slice(0, 5)
                .map((icon: string) => ({ icon })) ||
              []
            ).map(
              (
                tech: { icon?: string; name?: string } | string,
                index: number
              ) => {
                const icon = typeof tech === "string" ? tech : tech.icon;
                const name = typeof tech === "string" ? "" : tech.name;
                const hasValidIcon =
                  icon &&
                  icon.trim() !== "" &&
                  (icon.startsWith("/") || icon.startsWith("http"));

                return (
                  <div
                    key={index}
                    className="border border-none dark:border-white/20 bg-back/90 shadow-lg bg-linear-to-br from-white-400 to-purple-700 dark:from-[#161a31] dark:to-[#06091f] rounded-full  lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                    style={{
                      transform: `translateX(-${5 * index + 2}px)`,
                    }}
                  >
                    {hasValidIcon ? (
                      <Image
                        width={40}
                        height={40}
                        src={icon}
                        alt={name || `tech-${index}`}
                        className="p-2"
                        sizes="32px"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-white dark:text-white text-xs font-bold">
                        {(name || `T${index}`).charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                );
              }
            )}
          </div>

          {/* Actions: keep inside card on iPhone widths */}
          <div className="w-full max-w-full flex  sm:flex-row sm:flex-wrap  justify-center items-stretch gap-3">
            {item.githubUrl && item.githubUrl.trim() !== "" && (
              <a
                href={item.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex w-full sm:basis-[calc(50%-0.75rem)] sm:max-w-[calc(50%-0.75rem)] justify-center items-center text-gray-600 dark:text-gray-300 dark:hover:text-gray-400 hover:text-gray-800 px-4 py-2 sm:px-4 sm:py-2 rounded-xl"
              >
                <FaGithub className="mr-2" size={20} />
                <span className="text-xs sm:text-sm">Check Code</span>
              </a>
            )}
            {item.demoUrl && item.demoUrl.trim() !== "" && (
              <a
                href={item.demoUrl as string}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex w-full sm:basis-[calc(50%-0.75rem)] sm:max-w-[calc(50%-0.75rem)] justify-center items-center
              text-purple-600 dark:text-purple-300
               dark:hover:text-purple-400
               hover:text-purple-800 py-2 sm:px-4 sm:py-2 rounded-xl"
              >
                <GoArrowUpRight className="mr-2" size={20} />
                <span className="text-xs sm:text-sm">Check Live Site</span>
              </a>
            )}
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
});

ProjectCard.displayName = "ProjectCard";

const RecentProjectsContent: React.FC<{ projectsData: ProjectItem[] }> = ({
  projectsData,
}) => {
  return (
    <div className="flex flex-1 w-full flex-wrap justify-center gap-12 mt-10">
      {projectsData.map((item) => (
        <ProjectCard key={item._id || item.id} item={item} />
      ))}
    </div>
  );
};

const RecentProjects = ({ projects }: RecentProjectsProps) => {
  const projectsData = projects && projects.length > 0 ? projects : [];

  return (
    <div className="py-20">
      <h1 className="heading">
        A small selection of{" "}
        <span className="text-purple-500 dark:text-purple-300">
          recent projects
        </span>
      </h1>
      <RecentProjectsContent projectsData={projectsData} />
    </div>
  );
};

export default RecentProjects;
