"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { expCards } from "../data";
import GlowCard from "./GlowCard";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

interface Skill {
  name: string;
  icon?: string;
  image?: string;
  description?: string;
}

interface Job {
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
  isCurrentlyWorking: boolean;
  skills?: Skill[];
  responsibilities?: Array<{ name: string }>;
  logo?: string;
}

interface Education {
  institution: string;
  degree?: string;
  field: string;
  description: string;
  startDate: string;
  endDate: string;
  isCurrentlyStudying: boolean;
  skills?: Skill[];
  logo?: string;
}

interface ExperienceCard {
  review: string;
  imgPath: string;
  logoPath: string;
  title: string;
  date: string;
  responsibilities?: string[];
  skills?: Skill[];
  type: "job" | "education";
}

interface ExperienceSectionProps {
  jobs: Job[];
  education?: Education[];
}

const Experience = ({ jobs = [], education = [] }: ExperienceSectionProps) => {
  // Transform jobs to ExperienceCard format
  const jobCards: ExperienceCard[] =
    jobs && jobs.length > 0
      ? jobs.map((job) => ({
          review: job.description || "",
          imgPath: "/exp1.svg",
          logoPath: job.logo || "/app.svg",
          title: job.position,
          date: `${new Date(job.startDate).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })} - ${
            job.isCurrentlyWorking
              ? "Present"
              : new Date(job.endDate).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
          }`,
          skills: job.skills || [],
          responsibilities: job.responsibilities?.map((r) => r.name) || [],
          type: "job",
        }))
      : [];

  // Transform education to ExperienceCard format
  const educationCards: ExperienceCard[] =
    education && education.length > 0
      ? education.map((edu) => ({
          review: edu.description || "",
          imgPath: "/exp1.svg",
          logoPath: edu.logo || "/app.svg",
          title: edu.field,
          date: `${new Date(edu.startDate).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })} - ${
            edu.isCurrentlyStudying
              ? "Present"
              : new Date(edu.endDate).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
          }`,
          skills: edu.skills || [],
          type: "education",
        }))
      : [];

  // Combine all cards and sort by start date (old to new)
  const allCards = [...jobCards, ...educationCards].sort((a, b) => {
    // Extract the start date from the date string (before the dash)
    const aStartDate = new Date(a.date.split(" - ")[0]);
    const bStartDate = new Date(b.date.split(" - ")[0]);
    return aStartDate.getTime() - bStartDate.getTime();
  });

  // Use combined cards if available, otherwise use fallback
  const experienceCards: ExperienceCard[] =
    allCards.length > 0
      ? allCards
      : expCards.map((card) => ({ ...card, type: "job" as const }));

  useGSAP(() => {
    // Optimize ScrollTrigger settings
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Animate timeline cards with throttling
    gsap.utils.toArray(".timeline-card").forEach((card) => {
      gsap.from(card as Element, {
        xPercent: -100,
        opacity: 0,
        transformOrigin: "left left",
        duration: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: card as Element,
          start: "top 80%",
          invalidateOnRefresh: true,
        },
      });
    });

    // Responsive alignment for gradient line
    function alignGradientLine() {
      const gradientLine = document.querySelector(
        ".gradient-line"
      ) as HTMLElement;
      const containerElement = document.querySelector(
        ".experience-timeline-container"
      );
      const firstLogo = document.querySelector(".timeline-logo");

      if (gradientLine && containerElement && firstLogo) {
        const logoRect = firstLogo.getBoundingClientRect();
        const containerRect = containerElement.getBoundingClientRect();
        const offset =
          logoRect.left -
          containerRect.left +
          logoRect.width / 2 -
          gradientLine.offsetWidth / 2;
        gradientLine.style.left = `${offset}px`;
      }
    }

    // Initial alignment
    alignGradientLine();

    // Re-align on resize with throttle
    let resizeTimeout: NodeJS.Timeout;
    const throttledAlign = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(alignGradientLine, 150);
    };
    window.addEventListener("resize", throttledAlign);

    // Animate the gradient line from top to bottom
    const gradientLine = document.querySelector(".gradient-line");
    const containerElement = document.querySelector(
      ".experience-timeline-container"
    );
    if (gradientLine && containerElement) {
      gsap.set(gradientLine, { scaleY: 0, transformOrigin: "top top" });
      // Drive scale by scroll progress so it naturally reverses when scrolling up
      ScrollTrigger.create({
        trigger: containerElement,
        start: "top 60%",
        end: "bottom bottom",
        scrub: true,
        markers: false,
        onUpdate: (self) => {
          gsap.set(gradientLine, { scaleY: self.progress });
        },
      });
    }

    // Animate expText elements
    gsap.utils.toArray(".expText").forEach((text) => {
      gsap.from(text as Element, {
        opacity: 0,
        xPercent: 0,
        duration: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: text as Element,
          start: "top 60%",
          invalidateOnRefresh: true,
        },
      });
    }, "<");

    // Clean up on unmount
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", throttledAlign);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      id="experience"
      className="flex justify-center items-center md:mt-40 mt-20 section-padding xl:px-0"
    >
      <div className="w-full h-full px-4 sm:px-5 md:px-10 lg:px-20">
        <h1 className="heading flex flex-col text-center gap-2 sm:gap-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          💼 🎓
          <p>
            My{" "}
            <span className="text-purple-500 dark:text-purple-300">
              {" "}
              Work Experience
            </span>
          </p>
          <p>
            and
            <span className="text-purple-500 dark:text-purple-300">
              {" "}
              Education
            </span>
          </p>
        </h1>
        <div className="mt-12 sm:mt-16 md:mt-24 lg:mt-32 relative">
          {/* Central Timeline - visible across all cards */}
          <div className="experience-timeline-container">
            <div className="timeline" />
            <div className="gradient-line" />
          </div>

          <div className="relative z-50 space-y-8 sm:space-y-10 md:space-y-16 xl:space-y-32">
            {experienceCards.map((card, index) => (
              <div key={`${card.type}-${index}`} className="exp-card-wrapper">
                <div className="w-full sm:w-full md:w-full xl:w-2/6 mb-6 md:mb-0">
                  <GlowCard
                    card={{ ...card, skills: card.skills?.map((s) => s.name) }}
                    index={index}
                  >
                    <div className="flex  gap-3">
                      {/* <Image
                        width={40}
                        height={40}
                        src={card.imgPath ? card.imgPath : "/app.svg"}
                        alt="exp-img"
                      /> */}
                      {/* {card.type === "job" ? (
                        <p className="text-sm md:text-base lg:text-lg text-white-50">
                          💼 Work Experience
                        </p>
                      ) : (
                        <p className="text-sm md:text-base lg:text-lg text-white-50">
                          🎓 Education
                        </p>
                      )} */}
                    </div>
                  </GlowCard>
                </div>
                <div className="w-full sm:w-full md:w-full xl:w-4/6">
                  <div className="flex items-start">
                    <div className="expText flex flex-row sm:flex-row gap-4 sm:gap-6 md:gap-10 lg:gap-12 xl:gap-20 ml-2 sm:ml-4 md:ml-8 lg:ml-12 xl:ml-16">
                      <div className="timeline-logo shrink-0">
                        <Image
                          id="logo-element"
                          width={50}
                          height={50}
                          src={card.logoPath ? card.logoPath : "/app.svg"}
                          alt="logo"
                        />
                      </div>

                      <div className="flex-1  min-w-0">
                        <h1 className="font-semibold text-xl sm:text-2xl md:text-3xl">
                          {card.type === "job" ? card.title : card.title}
                        </h1>
                        <p className="my-3 sm:my-4 md:my-5 text-white-50 text-sm sm:text-base">
                          🗓️&nbsp;{card.date}
                        </p>
                        <p className="text-[#839CB5] italic text-sm md:text-base">
                          {card.type === "job" ? "Skills" : "Skills Learned"}
                        </p>
                        {card.type === "job" ? (
                          <div className="mt-3 sm:mt-4 md:mt-5 flex flex-col gap-3 sm:gap-4 md:gap-5">
                            {card.skills?.map((skill: Skill, index: number) => (
                              <div
                                key={index}
                                className="flex items-center gap-3"
                              >
                                <div className="p-3 w-6 h-6 rounded bg-purple-200 dark:bg-purple-700 flex items-center justify-center text-xs">
                                  ⚙️
                                </div>
                                <p>{skill.name}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-3 sm:mt-4 md:mt-5 flex flex-col gap-3 sm:gap-4 md:gap-5">
                            {card.skills?.map((skill: Skill, index: number) => (
                              <div key={index} className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                  {skill.icon || skill.image ? (
                                    <Image
                                      width={24}
                                      height={24}
                                      src={
                                        skill.icon || skill.image || "/app.svg"
                                      }
                                      alt={skill.name}
                                      className="w-6 h-6 rounded object-cover"
                                    />
                                  ) : (
                                    <div className="w-6 h-6 rounded bg-purple-200 dark:bg-purple-700 flex items-center justify-center text-xs">
                                      ⚙️
                                    </div>
                                  )}
                                  <span className="text-sm sm:text-base md:text-lg text-black dark:text-white  font-medium">
                                    {skill.name}
                                  </span>
                                </div>
                                {skill.description && (
                                  <p className="text-xs sm:text-sm text-white-50 ml-9">
                                    {skill.description}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Responsibilities Section */}
                        {card.type === "job" &&
                          card.responsibilities &&
                          card.responsibilities.length > 0 && (
                            <>
                              <p className="mt-5 text-[#839CB5] italic text-sm md:text-base">
                                {" "}
                                Responsibilities
                              </p>
                              <ul className="list-disc ms-5 mt-3 sm:mt-4 md:mt-5 flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-5 text-white-50">
                                {card.responsibilities.map(
                                  (responsibility: string, index: number) => (
                                    <li
                                      key={index}
                                      className="text-sm sm:text-base md:text-lg"
                                    >
                                      {responsibility}
                                    </li>
                                  )
                                )}
                              </ul>
                            </>
                          )}
                        {/* {card.type === "education" && (
                          <p className="text-[#839CB5] italic text-sm md:text-base mt-4">
                            📚 Education
                          </p>
                        )}
                        {card.type === "job" && (
                          <p className="text-[#839CB5] italic text-sm md:text-base mt-4">
                            💼 Work Experience
                          </p>
                        )} */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
