"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/index";
import React from "react";

export const TextGenerateEffect = ({
  words,
  className,
  duration = 0.8,
}: {
  words: string;
  className?: string;
  duration?: number;
}) => {
  const [startAnimation, setStartAnimation] = React.useState(false);
  const wordsArray = useMemo(() => words.split(" "), [words]);

  const isIOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);
  const shouldReduceMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  // Defer animation start to avoid blocking on page load
  React.useEffect(() => {
    const id =
      typeof requestIdleCallback !== "undefined"
        ? requestIdleCallback(() => setStartAnimation(true), { timeout: 800 })
        : setTimeout(() => setStartAnimation(true), 200);

    return () => {
      if (typeof cancelIdleCallback !== "undefined") {
        cancelIdleCallback(id as number);
      } else {
        clearTimeout(id as NodeJS.Timeout);
      }
    };
  }, []);

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: isIOS ? 0.05 : 0.04,
        when: "beforeChildren",
      },
    },
  } as const;

  const childVariants = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion
          ? 0
          : isIOS
          ? Math.min(duration, 0.6)
          : Math.min(duration, 0.7),
        ease: [0.22, 1, 0.36, 1],
      },
    },
  } as const;

  return (
    <div className={cn("font-bold", className)}>
      <div className="my-2">
        <div className="dark:text-white text-black leading-snug tracking-wide">
          <motion.div
            aria-label={words}
            variants={containerVariants}
            initial="hidden"
            animate={startAnimation ? "show" : "hidden"}
          >
            {wordsArray.map((word, idx) => (
              <motion.span
                key={`${word}-${idx}`}
                className={cn(
                  idx > 3
                    ? "text-purple-500 dark:text-purple-300"
                    : "dark:text-white text-black",
                  "opacity-0"
                )}
                style={{
                  WebkitBackfaceVisibility: "hidden",
                  WebkitPerspective: "1000px",
                }}
                variants={childVariants}
              >
                {word}{" "}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
