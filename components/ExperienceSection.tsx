"use client";

import SkillIconList from "./SkillIconList";
import DetailBulletList from "./DetailBulletList";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { expCards } from "../data";
import GlowCard from "./GlowCard";
import Image from "next/image";
import { FaRegBuilding, FaUniversity } from "react-icons/fa";

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
  learningOutcomes?: string[];
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
  company?: string;
  institution?: string;
  review: string;
  imgPath: string;
  logoPath: string;
  title: string;
  date: string;
  responsibilities?: string[];
  learningOutcomes?: string[];
  skills?: Skill[];
  type: "job" | "education";
}

interface ExperienceSectionProps {
  jobs: Job[];
  education?: Education[];
}

const Experience = ({ jobs = [], education = [] }: ExperienceSectionProps) => {
  const jobCards: ExperienceCard[] =
    jobs && jobs.length > 0
      ? jobs.map((job) => ({
          company: job.company,
          review: job.description || "",
          imgPath: "/exp1.svg",
          logoPath: job.logo || "",
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
          institution: edu.institution,
          review: edu.description || "",
          imgPath: "/exp1.svg",
          logoPath: edu.logo || "",
          title: [edu.degree, edu.field].filter(Boolean).join(" - "),
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
          learningOutcomes: edu.learningOutcomes || [],
          type: "education",
        }))
      : [];

  // Preserve backend order within each independently managed section.
  const allCards = [...jobCards, ...educationCards];

  // Use combined cards if available, otherwise use fallback
  const experienceCards: ExperienceCard[] =
    allCards.length > 0
      ? allCards.sort((a, b) => {
          const dateA = new Date(a.date.split(" - ")[0]);
          const dateB = new Date(b.date.split(" - ")[0]);
          return dateB.getTime() - dateA.getTime();
        })
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
        ".gradient-line",
      ) as HTMLElement;
      const containerElement = document.querySelector(
        ".experience-timeline-container",
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
      ".experience-timeline-container",
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
      className="flex justify-center items-center md:mt-20 section-padding xl:px-0"
    >
      <div className="w-full h-full px-4 sm:px-5 md:px-10 lg:px-20">
        <h1 className="heading flex flex-col text-center gap-2 sm:gap-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          <div className="flex justify-center items-center">
            <Image
              src="/assets/images/EducationIcon.png"
              width={60}
              height={60}
              alt="Education"
            />
            <Image
              src="/assets/images/WorkExperienceIcon.png"
              width={60}
              height={60}
              alt="Experience"
            />
          </div>
          <p>
            My
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
                      /> 
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
                    <div className="expText min-w-0 w-full flex flex-row sm:flex-row gap-4 sm:gap-6 md:gap-10 lg:gap-12 xl:gap-20 ml-2 sm:ml-4 md:ml-8 lg:ml-12 xl:ml-16">
                      <div
                        className="timeline-logo group/logo relative shrink-0"
                        tabIndex={0}
                        aria-label={
                          card.company || card.institution || card.title
                        }
                      >
                        {card.logoPath?.trim() ? (
                          <Image
                            width={50}
                            height={50}
                            src={card.logoPath}
                            alt=""
                            className="h-[70%] w-[70%] object-contain transition-transform duration-300 group-hover/logo:scale-110"
                          />
                        ) : card.type === "job" ? (
                          <FaRegBuilding className="h-6 w-6 text-purple-600 dark:text-purple-200" />
                        ) : (
                          <FaUniversity className="h-6 w-6 text-purple-600 dark:text-purple-200" />
                        )}

                        {/* Organization name tooltip */}
                        <span
                          role="tooltip"
                          className="
      pointer-events-none
      absolute bottom-full left-1/2 z-50
      mb-3 -translate-x-1/2 translate-y-1
      whitespace-nowrap rounded-lg
      px-3 py-1.5

      bg-slate-900 text-white
      dark:bg-purple-950 dark:text-purple-100
      border border-purple-500/20

      text-xs font-medium
      shadow-lg shadow-purple-500/10

      opacity-0 invisible
      group-hover/logo:visible
      group-hover/logo:opacity-100
      group-hover/logo:translate-y-0
      group-focus-within/logo:visible
      group-focus-within/logo:opacity-100

      transition-all duration-200
    "
                        >
                          {card.company || card.institution || card.title}

                          <span
                            className="
        absolute top-full left-1/2
        -translate-x-1/2 -mt-px
        h-2 w-2 rotate-45
        bg-slate-900 dark:bg-purple-950
        border-r border-b border-purple-500/20
      "
                          />
                        </span>
                      </div>

                      <div className="flex-1  min-w-0">
                        <h1 className="font-semibold text-xl sm:text-2xl md:text-3xl">
                          {card.type === "job" ? card.title : card.title}
                        </h1>
                        <p
                          className="
                                  mt-1
                                  text-base md:text-lg
                                  font-semibold
                                  text-purple-600 dark:text-purple-400
                                   "
                        >
                          {card.company || card.institution}
                        </p>
                        <p className="my-3 sm:my-4 md:my-5 text-white-50 text-sm sm:text-base">
                          🗓️&nbsp;{card.date}
                        </p>
                        <SkillIconList
                          skills={card.skills}
                          title={
                            card.type === "job" ? "Skills" : "Skills Learned"
                          }
                        />
                        <DetailBulletList
                          items={
                            card.type === "job"
                              ? card.responsibilities
                              : card.learningOutcomes
                          }
                          title={
                            card.type === "job"
                              ? "Responsibilities"
                              : "Key Learning Outcomes"
                          }
                          onToggle={() => ScrollTrigger.refresh()}
                        />
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
