import { cn } from "@/lib/utils";

export function GridBackground() {
  return (
    <div className="absolute top-0 left-0 flex h-screen w-full items-center justify-center bg-white dark:bg-[#000319]">
      <div
        className={cn(
          "absolute inset-0",
          "bg-size-[100px_100px]",
          "bg-[linear-gradient(to_right,#060a1c_3px,transparent_3px),linear-gradient(to_bottom,#060a1c_3px,transparent_3px)]"
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]"
        style={{ backgroundColor: "#000319" }}
      />
    </div>
  );
}
