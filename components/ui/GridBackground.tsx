import { cn } from "@/lib/utils";

export function GridBackground() {
  return (
    <div
      className="absolute top-0 left-0 flex h-screen w-full items-center justify-center bg-white dark:bg-[#000319]"
      style={{ willChange: "auto", contain: "layout", pointerEvents: "none" }}
    >
      <div
        className={cn(
          "absolute inset-0",
          "bg-size-[100px_100px]",
          "bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",

          "dark:bg-[linear-gradient(to_right,#060a1c_3px,transparent_3px),linear-gradient(to_bottom,#060a1c_3px,transparent_3px)]"
        )}
        style={{ willChange: "auto", backfaceVisibility: "hidden" }}
      />
      {/* Simplified gradient - removed expensive mask */}
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#000319]"
        style={{
          backgroundColor: "#000319",
          willChange: "auto",
          backfaceVisibility: "hidden",
          opacity: 0.4,
        }}
      />
    </div>
  );
}
