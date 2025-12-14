"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/index";

export const TextGenerateEffect = ({
  words,
  className,
  duration = 0.8,
}: {
  words: string;
  className?: string;
  duration?: number;
}) => {
  const wordsArray = useMemo(() => words.split(" "), [words]);

  const isIOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);
  const shouldReduceMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: isIOS ? 0.08 : 0.06,
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
          ? Math.min(duration, 0.9)
          : duration,
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
            animate="show"
          >
            {wordsArray.map((word, idx) => (
              <motion.span
                key={`${word}-${idx}`}
                className={cn(
                  idx > 3 ? "text-purple-300" : "dark:text-white text-black",
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
