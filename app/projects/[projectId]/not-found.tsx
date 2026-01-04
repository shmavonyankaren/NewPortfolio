import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ProjectNotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_15%_25%,#dcfce7,transparent_32%),radial-gradient(circle_at_85%_10%,#dbeafe,transparent_28%),linear-gradient(135deg,#f8fafc,#e2e8f0)] px-6 text-slate-900 dark:bg-[linear-gradient(90deg,rgba(4,7,29,1)_0%,rgba(12,14,35,1)_100%)] dark:text-white">
      <div
        className="absolute left-6 top-16 h-52 w-52 rounded-full bg-emerald-400/20 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute right-10 bottom-8 h-56 w-56 rounded-full bg-blue-500/15 blur-3xl"
        aria-hidden
      />

      <section className="relative z-10 max-w-2xl space-y-6 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-zinc-400">
          Project missing
        </p>
        <h1 className="text-4xl font-semibold sm:text-5xl">
          We can&apos;t find that project
        </h1>
        <p className="leading-relaxed text-slate-600 dark:text-zinc-300">
          The project you are looking for may have been renamed, unpublished, or
          removed. Explore other work or reach out if you need something
          specific.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild className="px-6">
            <Link href="/projects">View all projects</Link>
          </Button>
          <Button asChild variant="outline" className="px-6">
            <Link href="/contact">Contact me</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
