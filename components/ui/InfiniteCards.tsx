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
          " flex min-w-full shrink-0 gap-8 py-4 w-max flex-nowrap",
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
            className="w-[90vw] max-w-full relative rounded-2xl border
             shrink-0 border-slate-200 dark:border-slate-700 p-4 sm:p-6 md:p-8 md:w-[60vw] shadow-lg hover:shadow-xl transition-shadow duration-300
             bg-linear-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800"
            style={{
              willChange: "auto",
              backfaceVisibility: "hidden",
            }}
            key={idx}
          >
            <blockquote>
              <div
                aria-hidden="true"
                className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%+4px)] w-[calc(100%+4px)]"
              ></div>
              <span className="relative z-20 text-sm sm:text-base md:text-lg leading-[1.6] text-slate-700 dark:text-slate-100 font-normal italic">
                &quot;{item.quote}&quot;
              </span>
              <div className="relative z-20 mt-10 flex flex-row items-center gap-3">
                {/* Profile image with better styling */}
                <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-linear-to-br from-purple-200 to-blue-200 dark:from-purple-900 dark:to-blue-900">
                  <Image
                    src={
                      item.img && item.img.trim() !== ""
                        ? item.img
                        : "/profile.svg"
                    }
                    alt={item.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="flex flex-col gap-0.5">
                  {/* Name styling */}
                  <span className="text-base sm:text-lg font-bold leading-[1.4] text-slate-900 dark:text-white">
                    {item.name}
                  </span>
                  {/* Title styling */}
                  <span className="text-xs sm:text-sm leading-[1.4] text-slate-600 dark:text-slate-300 font-medium">
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
