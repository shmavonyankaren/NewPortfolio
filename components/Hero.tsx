"use client";

import { Spotlight } from "./ui/spotlight";
import { GridBackground } from "./ui/GridBackground";
import TextGenerateEffect from "./TextGenerateEffect";
import MagicButton from "./ui/MagicButton";
import { FaLocationArrow } from "react-icons/fa";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

function Hero() {
  const [animateSpotlights, setAnimateSpotlights] = useState(false);

  useEffect(() => {
    // Defer spotlight animations to avoid blocking main thread during page load
    const id =
      typeof requestIdleCallback !== "undefined"
        ? requestIdleCallback(() => setAnimateSpotlights(true), {
            timeout: 1000,
          })
        : setTimeout(() => setAnimateSpotlights(true), 300);

    return () => {
      if (typeof cancelIdleCallback !== "undefined") {
        cancelIdleCallback(id as number);
      } else {
        clearTimeout(id as NodeJS.Timeout);
      }
    };
  }, []);

  return (
    <div className="pb-20 pt-36">
      <div>
        {animateSpotlights && (
          <>
            <Spotlight
              className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
              fill="white"
            />
            <Spotlight
              className="top-10 left-full w-[50vw] h-[80vh]"
              fill="purple"
            />
            <Spotlight
              className="left-80 top-28 h-[80vh] w-[50vw]"
              fill="blue"
            />
          </>
        )}
      </div>
      <GridBackground />
      <div className="flex justify-center relative my-20 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <h2 className="uppercase tracking-widest text-xs text-center text-blue-100 max-w-80">
            Dynamic Web Magic with JavaScript
          </h2>
          <TextGenerateEffect />
          <p className="text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl">
            Hi, I &apos;m Karen, Software Developer specializing in crafting
            stunning and efficient web applications using JavaScript. Let&apos;s
            build something amazing together!
          </p>
          <a href="#">
            <MagicButton
              title="Show my work"
              icon={<FaLocationArrow />}
              position="right"
              handleClick={() => redirect("/projects")}
            />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Hero;
