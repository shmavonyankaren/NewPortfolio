"use client";

import { expCards } from "@/data";
// import { WorkExperienceAndEducation } from "@/lib/types";
import Image from "next/image";
import { useRef, useCallback } from "react";

type GlowCardProps = {
  card: (typeof expCards)[0];
  index: number;
  children: React.ReactNode;
};

const GlowCard = ({ card, index, children }: GlowCardProps) => {
  // refs for all the cards
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const lastAngleRef = useRef<number>(0);

  // when mouse moves over a card, rotate the glow effect - with debouncing
  const handleMouseMove = useCallback(
    (index: number) => (e: React.MouseEvent<HTMLDivElement>) => {
      // get the current card
      const card = cardRefs.current[index];
      if (!card) return;

      // get the mouse position relative to the card
      const rect = card.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - rect.width / 2;
      const mouseY = e.clientY - rect.top - rect.height / 2;

      // calculate the angle from the center of the card to the mouse
      let angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);

      // adjust the angle so that it's between 0 and 360
      angle = (angle + 360) % 360;

      // only update if angle changed significantly (debounce by 3 degrees)
      if (Math.abs(angle - lastAngleRef.current) > 3) {
        lastAngleRef.current = angle;
        card.style.setProperty("--start", String(angle + 60));
      }
    },
    []
  );

  // return the card component with the mouse move event
  return (
    <div
      ref={(el) => {
        cardRefs.current[index] = el;
      }}
      onMouseMove={handleMouseMove(index)}
      className="card card-border timeline-card rounded-xl p-5 md:p-8 lg:p-10 mb-4 md:mb-5 break-inside-avoid-column"
    >
      <div className="glow"></div>
      <div className="flex items-center gap-1 mb-4 md:mb-5">
        {Array.from({ length: 5 }, (_, i) => (
          <Image
            width={20}
            height={20}
            key={i}
            src="/star.png"
            alt="star"
            className="size-4 md:size-5 brightness-110 invert sepia saturate-[3] hue-rotate-260 dark:brightness-100 dark:invert-0 dark:sepia-0 dark:saturate-100 dark:hue-rotate-0"
          />
        ))}
      </div>
      <div className="mb-4 md:mb-5">
        <p className="text-slate-700 dark:text-white text-sm md:text-base lg:text-lg">
          {card.review}
        </p>
      </div>
      {children}
    </div>
  );
};

export default GlowCard;
