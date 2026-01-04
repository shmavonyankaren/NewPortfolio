"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";

import { Button } from "@/components/ui/button";

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function ProjectError({ error, reset }: ErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_18%_25%,#fef3c7,transparent_34%),radial-gradient(circle_at_82%_12%,#dbeafe,transparent_30%),linear-gradient(135deg,#f8fafc,#e2e8f0)] px-6 text-slate-900 dark:bg-[linear-gradient(90deg,rgba(4,7,29,1)_0%,rgba(12,14,35,1)_100%)] dark:text-white">
      <div
        className="absolute left-4 top-10 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute right-8 bottom-6 h-48 w-48 rounded-full bg-sky-400/15 blur-3xl"
        aria-hidden
      />

      <section className="relative z-10 max-w-2xl space-y-6 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-amber-600/80 dark:text-amber-200/80">
          Project error
        </p>
        <h1 className="text-4xl font-semibold sm:text-5xl">
          We hit a snag loading this project
        </h1>
        <p className="leading-relaxed text-slate-600 dark:text-zinc-300">
          Something went wrong while fetching this project. Please retry or head
          back to the projects list.
        </p>
        <pre className="mx-auto max-h-44 overflow-auto rounded-lg border border-slate-200 bg-white/70 p-4 text-left text-sm text-slate-800 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/40 dark:text-zinc-200">
          {error.message}
        </pre>

        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={reset} className="px-6">
            Retry project
          </Button>
          <Button asChild variant="outline" className="px-6">
            <Link href="/projects">Back to projects</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
