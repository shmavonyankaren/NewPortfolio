"use client";
import { JSX, useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../ModeToggle";

type NavItem = {
  name: string;
  link: string;
  icon?: JSX.Element;
};

type FloatingNavbarProps = {
  navItems: NavItem[];
  className?: string;
};

export const FloatingNav = ({ navItems, className }: FloatingNavbarProps) => {
  const { scrollYProgress } = useScroll();
  const pathName = usePathname();
  const prevDirectionRef = useRef(0);

  // set true for the initial state so that nav bar is visible in the hero section
  const [visible, setVisible] = useState(true);

  // Reset navbar visibility on route change
  useEffect(() => {
    queueMicrotask(() => setVisible(true));
  }, [pathName]);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      const prev = prevDirectionRef.current;
      const direction = current - prev;
      prevDirectionRef.current = current;

      if (scrollYProgress.get() < 0.05) {
        // also set true for the initial state
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "bg-white/80 dark:bg-[linear-gradient(90deg,rgba(22,26,49,1)_0%,rgba(6,9,31,1)_100%)] flex max-w-fit md:min-w-[70vw] lg:min-w-fit fixed z-5000 top-5 md:top-10 inset-x-0 mx-auto px-6 md:px-8 lg:px-10 py-3 md:py-3 rounded-lg border border-gray-200 dark:border-white/12.5 shadow-lg items-center justify-center gap-3 md:gap-4 backdrop-blur-md",
          className
        )}
        style={{
          willChange: "auto",
          backfaceVisibility: "hidden",
        }}
      >
        {navItems.map((navItem: NavItem, idx: number) => {
          const isActive =
            navItem.link === "/"
              ? pathName === "/"
              : pathName.startsWith(navItem.link);

          return (
            <Link
              key={`link=${idx}`}
              href={navItem.link}
              className={cn(
                `${
                  isActive
                    ? "border text-sm sm:text-sm md:text-sm font-medium relative border-purple-400 dark:border-white/20 text-purple-700 dark:text-white bg-purple-50 dark:bg-transparent px-3 sm:px-3 md:px-4 py-2 md:py-2 rounded-full whitespace-nowrap"
                    : "relative text-gray-700 dark:text-neutral-50 items-center flex gap-1 hover:text-purple-600 dark:hover:text-neutral-300 text-sm sm:text-sm md:text-sm"
                }`
              )}
            >
              <span className="hidden sm:block">{navItem.icon}</span>
              <span className="cursor-pointer">{navItem.name}</span>
            </Link>
          );
        })}
        <ModeToggle />
        {/* remove this login btn */}
        {/* <button className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full">
          <span>Login</span>
          <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />
        </button> */}
      </motion.div>
    </AnimatePresence>
  );
};
