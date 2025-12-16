"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { expCards } from "../data";
// import TitleHeader from "../components/TitleHeader";
import GlowCard from "./GlowCard";
import Image from "next/image";
import { pow } from "three/tsl";

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
      <div className="w-full h-full md:px-20 px-5">
        {/* <h1 className="text-center text-4xl font-bold">
          Professional Work Experience
        </h1>
        <h2 className="text-center text-xl font-semibold text-purple-400 mt-3">
          💼 My Career Overview
        </h2> */}
        <h1 className="heading flex flex-col text-center gap-3">
          💼 🎓
          <p>
            My <span className="text-purple-300"> Work Experience</span>
          </p>
          <p>
            and
            <span className="text-purple-300"> Education</span>
          </p>
        </h1>
        <div className="mt-32 relative">
          {/* Central Timeline - visible across all cards */}
          <div className="experience-timeline-container">
            <div className="timeline" />
            <div className="gradient-line" />
          </div>

          <div className="relative z-50 xl:space-y-32 space-y-10">
            {expCards.map((card, index) => (
              <div key={card.title} className="exp-card-wrapper">
                <div className="xl:w-2/6">
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
                <div className="xl:w-4/6 ">
                  <div className="flex items-start">
                    <div className="expText flex xl:gap-20 md:gap-12 gap-10 ml-8 md:ml-16">
                      <div className="timeline-logo">
                        <Image
                          id="logo-element"
                          width={50}
                          height={50}
                          src={card.logoPath ? card.logoPath : "/app.svg"}
                          alt="logo"
                        />
                      </div>

                      <div>
                        <h1 className="font-semibold text-3xl">{card.title}</h1>
                        <p className="my-5 text-white-50">
                          🗓️&nbsp;{card.date}
                        </p>
                        <p className="text-[#839CB5] italic">
                          Responsibilities
                        </p>
                        <ul className="list-disc ms-5 mt-5 flex flex-col gap-5 text-white-50">
                          {card.responsibilities.map(
                            (responsibility, index) => (
                              <li key={index} className="text-lg">
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
