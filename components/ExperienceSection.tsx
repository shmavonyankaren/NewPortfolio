"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { expCards } from "../data";
// import TitleHeader from "../components/TitleHeader";
import GlowCard from "./GlowCard";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  useGSAP(() => {
    // Animate timeline cards
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

    // Re-align on resize
    window.addEventListener("resize", alignGradientLine);

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
        },
      });
    }, "<");

    // Clean up on unmount
    return () => {
      window.removeEventListener("resize", alignGradientLine);
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
            My <span className="text-purple-300"> Work Experience</span>
          </p>
          <p>
            and
            <span className="text-purple-300"> Education</span>
          </p>
        </h1>
        <div className="mt-12 sm:mt-16 md:mt-24 lg:mt-32 relative">
          {/* Central Timeline - visible across all cards */}
          <div className="experience-timeline-container">
            <div className="timeline" />
            <div className="gradient-line" />
          </div>

          <div className="relative z-50 space-y-8 sm:space-y-10 md:space-y-16 xl:space-y-32">
            {expCards.map((card, index) => (
              <div key={card.title} className="exp-card-wrapper">
                <div className="w-full sm:w-full md:w-full xl:w-2/6 mb-6 md:mb-0">
                  <GlowCard card={card} index={index}>
                    <div>
                      <Image
                        width={40}
                        height={40}
                        src={card.imgPath ? card.imgPath : "/app.svg"}
                        alt="exp-img"
                      />
                    </div>
                  </GlowCard>
                </div>
                <div className="w-full sm:w-full md:w-full xl:w-4/6">
                  <div className="flex items-start">
                    <div className="expText flex flex-row sm:flex-row gap-4 sm:gap-6 md:gap-10 lg:gap-12 xl:gap-20 ml-2 sm:ml-4 md:ml-8 lg:ml-12 xl:ml-16">
                      <div className="timeline-logo flex-shrink-0">
                        <Image
                          id="logo-element"
                          width={50}
                          height={50}
                          src={card.logoPath ? card.logoPath : "/app.svg"}
                          alt="logo"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h1 className="font-semibold text-xl sm:text-2xl md:text-3xl">
                          {card.title}
                        </h1>
                        <p className="my-3 sm:my-4 md:my-5 text-white-50 text-sm sm:text-base">
                          🗓️&nbsp;{card.date}
                        </p>
                        <p className="text-[#839CB5] italic text-sm md:text-base">
                          Responsibilities
                        </p>
                        <ul className="list-disc ms-5 mt-3 sm:mt-4 md:mt-5 flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-5 text-white-50">
                          {card.responsibilities.map(
                            (responsibility, index) => (
                              <li
                                key={index}
                                className="text-sm sm:text-base md:text-lg"
                              >
                                {responsibility}
                              </li>
                            )
                          )}
                        </ul>
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
