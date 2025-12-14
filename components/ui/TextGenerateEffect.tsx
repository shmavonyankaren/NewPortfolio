"use client";
import { useEffect, useMemo } from "react";
import { motion, useAnimate, stagger } from "framer-motion";
import { cn } from "@/lib/utils/index";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.8,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const [scope, animate] = useAnimate();

  // Split words once; stable across renders
  const wordsArray = useMemo(() => words.split(" "), [words]);

  // Respect prefers-reduced-motion: skip animations for accessibility
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const shouldReduce = media.matches;

    if (shouldReduce) {
      animate("span", { opacity: 1, transform: "none" }, { duration: 0 });
      return;
    }

    // Smooth, modern staggered reveal with slight upward motion and blur fade
    animate(
      "span",
      {
        opacity: 1,
        // Use 3D transform for better GPU acceleration on Safari/iOS
        transform: "translate3d(0, 0, 0)",
      },
      {
        duration: duration ?? 0.8,
        delay: stagger(0.06),
        ease: [0.22, 1, 0.36, 1], // Use 'ease' instead of 'easing' for framer-motion
      }
    );
  }, [animate, duration, filter]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} aria-label={words}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            className={cn(
              idx > 3 ? "text-purple-300" : "dark:text-white text-black",
              // Remove will-change to avoid rendering issues on Safari
              "opacity-0"
            )}
            style={{
              // Initial offset using 3D transform for GPU acceleration
              transform: "translate3d(0, 8px, 0)",
              WebkitBackfaceVisibility: "hidden",
              WebkitPerspective: 1000,
            }}
          >
            {word}{" "}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="my-2">
        <div className="dark:text-white text-black leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
