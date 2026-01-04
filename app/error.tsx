"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";

import { Button } from "@/components/ui/button";

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_20%_25%,#ffe4e6,transparent_32%),radial-gradient(circle_at_80%_10%,#dbeafe,transparent_28%),linear-gradient(135deg,#f8fafc,#e2e8f0)] px-6 text-slate-900 dark:bg-[linear-gradient(90deg,rgba(4,7,29,1)_0%,rgba(12,14,35,1)_100%)] dark:text-white">
      <div
        className="absolute left-1/2 top-12 h-60 w-60 -translate-x-1/2 rounded-full bg-rose-500/15 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute bottom-6 right-10 h-52 w-52 rounded-full bg-blue-500/15 blur-3xl"
        aria-hidden
      />

      <section className="relative z-10 max-w-2xl space-y-6 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-rose-500/80 dark:text-rose-200/80">
          Unexpected error
        </p>
        <h1 className="text-4xl font-semibold sm:text-5xl">
          Something went wrong
        </h1>
        <p className="leading-relaxed text-slate-600 dark:text-zinc-300">
          We have logged the issue. You can retry the last action or head back
          to the homepage while we sort this out.
        </p>
        <pre className="mx-auto max-h-44 overflow-auto rounded-lg border border-slate-200 bg-white/70 p-4 text-left text-sm text-slate-800 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/40 dark:text-zinc-200">
          {error.message}
        </pre>

        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={reset} className="px-6">
            Try again
          </Button>
          <Button asChild variant="outline" className="px-6">
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
