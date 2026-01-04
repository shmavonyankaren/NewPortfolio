"use client";
import { JSX, useState, useEffect, useRef, useCallback } from "react";
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
  const navRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const computeActiveIndex = useCallback(() => {
    return navItems.findIndex((item) =>
      item.link === "/" ? pathName === "/" : pathName.startsWith(item.link)
    );
  }, [navItems, pathName]);

  // set true for the initial state so that nav bar is visible in the hero section
  const [visible, setVisible] = useState(true);
  const [isScrollable, setIsScrollable] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(() =>
    computeActiveIndex()
  );
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Update active index when path changes
  useEffect(() => {
    setActiveIndex(computeActiveIndex());
  }, [computeActiveIndex]);

  // Update indicator position when active index changes
  useEffect(() => {
    if (activeIndex >= 0 && navRefs.current[activeIndex]) {
      const element = navRefs.current[activeIndex];
      if (element) {
        const parentRect = element.parentElement?.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        if (parentRect) {
          setIndicatorStyle({
            left: elementRect.left - parentRect.left,
            width: elementRect.width,
          });
        }
      }
    }
  }, [activeIndex]);

  // Update indicator on resize/zoom
  useEffect(() => {
    const updateIndicator = () => {
      if (activeIndex >= 0 && navRefs.current[activeIndex]) {
        const element = navRefs.current[activeIndex];
        if (element) {
          const parentRect = element.parentElement?.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          if (parentRect) {
            setIndicatorStyle({
              left: elementRect.left - parentRect.left,
              width: elementRect.width,
            });
          }
        }
      }
    };

    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeIndex]);

  // Reset navbar visibility on route change and check if page is scrollable
  useEffect(() => {
    queueMicrotask(() => setVisible(true));

    // Check if page has scrollable content
    const checkScrollable = () => {
      const isScrollable =
        document.documentElement.scrollHeight > window.innerHeight;
      setIsScrollable(isScrollable);
    };

    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, [pathName]);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Only apply scroll-based hiding if page is actually scrollable
    if (!isScrollable) {
      setVisible(true);
      return;
    }

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
          "bg-white/80 dark:bg-[#161a31]/80 flex max-w-fit md:min-w-[70vw] lg:min-w-fit fixed z-5000 top-5 md:top-10 inset-x-0 mx-auto px-6 md:px-8 lg:px-10 py-3 md:py-3 rounded-lg border border-gray-200 dark:border-white/12.5 shadow-lg items-center justify-center gap-3 md:gap-4 backdrop-blur-md",
          className
        )}
        style={{
          willChange: "auto",
          backfaceVisibility: "hidden",
        }}
      >
        <div className="relative flex items-center gap-3 md:gap-4">
          {/* Animated background indicator */}
          {activeIndex >= 0 && (
            <motion.div
              className="absolute border border-purple-400 dark:border-white/20 bg-purple-50 dark:bg-purple-400/10 rounded-full top-0"
              initial={false}
              animate={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                height: "100%",
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
              style={{
                zIndex: 0,
              }}
            />
          )}

          {navItems.map((navItem: NavItem, idx: number) => {
            const isActive =
              navItem.link === "/"
                ? pathName === "/"
                : pathName.startsWith(navItem.link);

            return (
              <Link
                key={`link=${idx}`}
                ref={(el) => {
                  navRefs.current[idx] = el;
                }}
                href={navItem.link}
                className={cn(
                  "relative z-10 flex items-center gap-1 text-sm sm:text-sm md:text-sm transition-colors duration-200",
                  isActive
                    ? "font-medium text-purple-700 dark:text-purple-300 px-3 sm:px-3 md:px-4 py-2 md:py-2 whitespace-nowrap"
                    : "text-gray-700 dark:text-neutral-50 hover:text-purple-600 dark:hover:text-neutral-300"
                )}
              >
                <span className="hidden sm:block">{navItem.icon}</span>
                <span className="cursor-pointer">{navItem.name}</span>
              </Link>
            );
          })}
        </div>
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
