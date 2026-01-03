import { TbFileDescription } from "react-icons/tb";

export function ProjectFullDescription({
  description,
}: {
  description?: string;
}) {
  return (
    <div className="mb-16">
      <div className="flex gap-3 mb-6 items-center">
        <TbFileDescription className="text-3xl text-purple-600 dark:text-purple-400" />
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          Project full overview
        </h2>{" "}
      </div>
      <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200">
        <p className="text-lg">{description}</p>
      </div>
    </div>
  );
}
