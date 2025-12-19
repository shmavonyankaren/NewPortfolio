"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const World = dynamic(() => import("./Globe").then((m) => m.World), {
  ssr: false,
  loading: () => (
    <div
      style={{ width: "100%", height: "100%", backgroundColor: "#000319" }}
    />
  ),
});

const GridGlobe = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let cancelled = false;
    let timeoutId: NodeJS.Timeout | null = null;

    const setupObserver = () => {
      if (shouldRender) return;
      if (!containerRef.current) return;

      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!cancelled && entry.isIntersecting) {
            // Defer rendering slightly to avoid blocking other content
            timeoutId = setTimeout(() => {
              setShouldRender(true);
            }, 100);
            observer?.disconnect();
          }
        },
        { rootMargin: "600px", threshold: 0.1 }
      );

      observer.observe(containerRef.current);
    };

    setupObserver();

    const handleResize = () => {
      if (!shouldRender) {
        observer?.disconnect();
        observer = null;
        setupObserver();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      observer?.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [shouldRender]);

  const globeConfig = {
    pointSize: 4,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };
  const colors = ["#06b6d4", "#3b82f6", "#6366f1"];
  // Optimized arc data - reduced from 38 to 16 key connections for better performance
  // While maintaining visual coverage across all continents and regions
  const baseArcs = [
    // Asia-Pacific connections (Beijing hub)
    {
      order: 1,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.2,
    },
    {
      order: 1,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 1.3521,
      endLng: 103.8198,
      arcAlt: 0.2,
    },
    {
      order: 1,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: -33.8688,
      endLng: 151.2093,
      arcAlt: 0.3,
    },
    // Europe connections
    {
      order: 2,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 48.8566,
      endLng: -2.3522,
      arcAlt: 0.1,
    },
    {
      order: 2,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 52.52,
      endLng: 13.405,
      arcAlt: 0.1,
    },
    {
      order: 2,
      startLat: 48.8566,
      startLng: -2.3522,
      endLat: 52.52,
      endLng: 13.405,
      arcAlt: 0.1,
    },
    // Americas connections
    {
      order: 3,
      startLat: 40.7128,
      startLng: -74.006,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
    },
    {
      order: 3,
      startLat: 40.7128,
      startLng: -74.006,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.4,
    },
    {
      order: 3,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: -34.6037,
      endLng: -58.3816,
      arcAlt: 0.3,
    },
    // India connections
    {
      order: 4,
      startLat: 28.6139,
      startLng: 77.209,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.2,
    },
    {
      order: 4,
      startLat: 28.6139,
      startLng: 77.209,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.5,
    },
    // Africa-Europe
    {
      order: 5,
      startLat: -1.303396,
      startLng: 36.852443,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
    },
    {
      order: 5,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
    },
    // Transatlantic
    {
      order: 6,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.2,
    },
    {
      order: 6,
      startLat: 48.8566,
      startLng: -2.3522,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
    },
    // Brazil connections
    {
      order: 7,
      startLat: -22.9068,
      startLng: -43.1729,
      endLat: -34.6037,
      endLng: -58.3816,
      arcAlt: 0.1,
    },
  ];
  const sampleArcs = baseArcs.map((arc, index) => ({
    ...arc,
    color: colors[index % colors.length],
  }));

  return (
    // remove dark:bg-black bg-white h-screen md:h-auto  w-full flex-row py-20
    // change absolute -left-5 top-36, add w-full h-full md:top-40
    <div
      ref={containerRef}
      className="flex items-center justify-center absolute -left-5 top-36 md:top-40 w-full h-full"
    >
      {/* remove h-full md:h-[40rem] */}
      <div className="max-w-7xl mx-auto w-full relative overflow-hidden h-96 px-4">
        {/* remove these text divs */}
        {/* <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="div"
        >
          <h2 className="text-center text-xl md:text-4xl font-bold text-black dark:text-white">
            We sell soap worldwide
          </h2>
          <p className="text-center text-base md:text-lg font-normal text-neutral-700 dark:text-neutral-200 max-w-md mt-2 mx-auto">
            This globe is interactive and customizable. Have fun with it, and
            don&apos;t forget to share it.
          </p>
        </motion.div> */}
        <div className="absolute w-full bottom-0 inset-x-0 h-40 bg-linear-to-b pointer-events-none select-none from-transparent dark:to-black to-white z-40" />
        {/* remove -bottom-20 */}
        <div className="absolute w-full h-72 md:h-full z-10">
          {shouldRender ? (
            <World data={sampleArcs} globeConfig={globeConfig} />
          ) : (
            <div className="w-full h-full bg-linear-to-b from-transparent via-black/10 to-black/30 dark:via-white/5 animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
};
export default GridGlobe;
