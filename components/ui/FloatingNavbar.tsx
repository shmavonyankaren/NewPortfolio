"use client";
import { JSX, useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import LanguageSwitcher from "../LanguageSwitcher";
import { cn } from "@/lib/utils";

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
  const locale = useLocale();
  const t = useTranslations("Navigation");
  const [menuOpen, setMenuOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const { scrollY } = useScroll();
  const pathName = usePathname();
  const reduceMotion = useReducedMotion();
  const routePage =
    navItems.findIndex((item) =>
      item.link === "/" ? pathName === "/" : pathName.startsWith(item.link),
    ) >= 3
      ? 1
      : 0;
  const [mobileNavigation, setMobileNavigation] = useState({
    pathName,
    page: routePage,
  });
  // A route change immediately reveals its group, including browser back/forward.
  const mobilePage =
    mobileNavigation.pathName === pathName ? mobileNavigation.page : routePage;
  useEffect(() => {
    setMobileNavigation({ pathName, page: routePage });
  }, [pathName, routePage]);
  const prevDirectionRef = useRef(0);
  const navRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const computeActiveIndex = useCallback(() => {
    return navItems.findIndex((item) =>
      item.link === "/" ? pathName === "/" : pathName.startsWith(item.link),
    );
  }, [navItems, pathName]);

  // set true for the initial state so that nav bar is visible in the hero section
  const [visible, setVisible] = useState(true);
  const [isScrollable, setIsScrollable] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(() =>
    computeActiveIndex(),
  );
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    top: 0,
    height: 0,
  });

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
            top: elementRect.top - parentRect.top,
            height: elementRect.height,
          });
        }
      }
    }
  }, [activeIndex, locale]);

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
              top: elementRect.top - parentRect.top,
              height: elementRect.height,
            });
          }
        }
      }
    };

    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeIndex, locale]);

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

  useMotionValueEvent(scrollY, "change", (current) => {
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

      if (current < 40) {
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
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setFocused(false);
        }}
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible || menuOpen || focused ? 0 : -100,
          opacity: visible || menuOpen || focused ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "bg-white/80 dark:bg-[#161a31]/80 flex flex-nowrap sm:flex-nowrap w-[calc(100%-1rem)] max-w-fit md:min-w-[70vw] lg:min-w-fit fixed z-5000 top-5 md:top-10 inset-x-0 mx-auto px-2 sm:px-5 md:px-8 lg:px-10 py-3 md:py-3 rounded-lg border border-gray-200 dark:border-white/12.5 shadow-lg items-center justify-center gap-2.5 md:gap-4 backdrop-blur-md",
          "max-md:max-w-[430px] max-md:h-[66px] max-md:gap-1.5",
          className,
        )}
        style={{
          willChange: "auto",
          backfaceVisibility: "hidden",
        }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-0.5 md:hidden">
          <div className="relative h-10 min-w-0 flex-1 overflow-hidden">
            <motion.div
              key={`${pathName}-${mobilePage}`}
              initial={{
                x: reduceMotion ? 0 : mobilePage === 1 ? 16 : -16,
                opacity: reduceMotion ? 1 : 0,
              }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                duration: reduceMotion ? 0 : 0.18,
                ease: "easeOut",
              }}
              className="flex h-full items-center justify-evenly gap-0.5"
            >
              {navItems
                .slice(mobilePage === 0 ? 0 : 3, mobilePage === 0 ? 3 : 5)
                .map((item) => {
                  const isActive =
                    item.link === "/"
                      ? pathName === "/"
                      : pathName.startsWith(item.link);
                  return (
                    <Link
                      key={item.link}
                      href={item.link}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "shrink-0 whitespace-nowrap rounded-full border border-transparent px-2 py-2 text-xs min-[375px]:text-sm transition-colors focus-visible:outline-2 focus-visible:outline-purple-500",
                        isActive
                          ? "border-purple-400 bg-purple-50 font-medium text-purple-700 dark:border-white/20 dark:bg-purple-400/10 dark:text-purple-300"
                          : "text-gray-700 hover:text-purple-600 dark:text-neutral-50 dark:hover:text-neutral-300",
                      )}
                    >
                      {t(item.name)}
                    </Link>
                  );
                })}
            </motion.div>
          </div>
          <button
            type="button"
            aria-label={t(mobilePage === 0 ? "nextGroup" : "previousGroup")}
            onClick={() =>
              setMobileNavigation({ pathName, page: mobilePage === 0 ? 1 : 0 })
            }
            className="flex h-10 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-700 hover:bg-purple-50 hover:text-purple-600 focus-visible:outline-2 focus-visible:outline-purple-500 dark:text-neutral-50 dark:hover:bg-purple-400/10 dark:hover:text-purple-300"
          >
            {mobilePage === 0 ? (
              <ArrowRight aria-hidden="true" className="size-4" />
            ) : (
              <ArrowLeft aria-hidden="true" className="size-4" />
            )}
          </button>
        </div>
        <div className="relative hidden md:flex flex-wrap sm:flex-nowrap justify-center items-center gap-2 md:gap-4">
          {activeIndex >= 0 && (
            <motion.div
              className="absolute border border-purple-400 dark:border-white/20 bg-purple-50 dark:bg-purple-400/10 rounded-full top-0"
              initial={false}
              animate={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                height: indicatorStyle.height,
                top: indicatorStyle.top,
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
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative z-10 flex items-center gap-1 text-sm sm:text-sm md:text-sm transition-colors duration-200 shrink-0 whitespace-nowrap",
                  isActive
                    ? "font-medium text-purple-700 dark:text-purple-300 px-3 sm:px-3 md:px-4 py-2 md:py-2 whitespace-nowrap"
                    : "text-gray-700 dark:text-neutral-50 hover:text-purple-600 dark:hover:text-neutral-300",
                )}
              >
                <span className="hidden sm:block">{navItem.icon}</span>
                <span className="cursor-pointer">{t(navItem.name)}</span>
              </Link>
            );
          })}
        </div>
        {!pathName.startsWith("/admin-dashboard") && pathName !== "/login" && (
          <LanguageSwitcher onOpenChange={setMenuOpen} />
        )}
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
