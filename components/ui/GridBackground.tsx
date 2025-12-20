import { cn } from "@/lib/utils";

export function GridBackground() {
  return (
    <div
      className="absolute top-0 left-0 flex h-screen w-full items-center justify-center bg-[linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)] dark:bg-[#000319]"
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
      {/* Subtle overlay: light mode fades to white; dark mode fades to #000319 */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)]   dark:to-[#000319] opacity-20 dark:opacity-40"
        style={{ willChange: "auto", backfaceVisibility: "hidden" }}
      />
    </div>
  );
}
