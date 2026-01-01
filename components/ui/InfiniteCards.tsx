"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import Image from "next/image";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    img: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const originalItems = Array.from(scroller.children).slice(0, items.length);
    scroller.replaceChildren(...originalItems);

    originalItems.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      scroller.appendChild(duplicatedItem);
    });

    // Defer start flag to avoid synchronous setState warning in effects
    Promise.resolve().then(() => setStart(true));

    return () => {
      scroller.replaceChildren(...originalItems);
    };
  }, [items.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const animationDirection = direction === "left" ? "forwards" : "reverse";
    const animationDuration =
      speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";

    container.style.setProperty("--animation-direction", animationDirection);
    container.style.setProperty("--animation-duration", animationDuration);
  }, [direction, speed]);

  const handleTouchStart = () => {
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        // max-w-7xl to w-screen
        "scroller relative z-20 w-screen overflow-hidden mask-[linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          // change gap-16
          " flex min-w-full shrink-0 gap-16 py-4 w-max flex-nowrap",
          start && "animate-scroll ",
          pauseOnHover && "hover:paused",
          isPaused && "paused"
        )}
        style={{ willChange: "transform", backfaceVisibility: "hidden" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {items.map((item, idx) => (
          <li
            //   change md:w-[450px] to md:w-[60vw] , px-8 py-6 to p-16, border-slate-700 to border-slate-800
            className="w-[90vw] max-w-full relative rounded-2xl border border-b-0
             shrink-0 border-slate-300 dark:border-slate-800 p-5 md:p-16 md:w-[60vw] bg-[linear-gradient(135deg,rgba(88,28,135,1)_0%,rgba(109,40,217,1)_50%,rgba(126,34,206,1)_100%)] dark:bg-[linear-gradient(90deg,rgba(4,7,29,1)_0%,rgba(12,14,35,1)_100%)]"
            style={{
              willChange: "auto",
              backfaceVisibility: "hidden",
            }}
            // change to idx cuz we have the same name
            key={idx}
          >
            <blockquote>
              <div
                aria-hidden="true"
                className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%+4px)] w-[calc(100%+4px)]"
              ></div>
              {/* change text color, text-lg */}
              <span className=" relative z-20 text-sm md:text-lg leading-[1.6] text-white dark:text-white font-normal">
                {item.quote}
              </span>
              <div className="relative z-20 mt-6 flex flex-row items-center">
                {/* add this div for the profile img */}
                <div className="me-3">
                  <Image
                    src={item.img ? item.img : "/profile.svg"}
                    alt={item.name}
                    width={32}
                    height={32}
                  />
                </div>
                <span className="flex flex-col gap-1">
                  {/* change text color, font-normal to font-bold, text-xl */}
                  <span className="text-xl font-bold leading-[1.6] text-white dark:text-white">
                    {item.name}
                  </span>
                  {/* change text color */}
                  <span className=" text-sm leading-[1.6] text-white/80 dark:text-white-200 font-normal">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
