import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#e0f2fe,transparent_35%),radial-gradient(circle_at_80%_0%,#f5d0fe,transparent_30%),linear-gradient(135deg,#f8fafc,#e2e8f0)] px-6 text-slate-900 dark:bg-[linear-gradient(90deg,rgba(4,7,29,1)_0%,rgba(12,14,35,1)_100%)] dark:text-white">
      <div
        className="absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute right-10 bottom-10 h-48 w-48 rounded-full bg-fuchsia-500/10 blur-3xl"
        aria-hidden
      />

      <section className="relative z-10 max-w-2xl space-y-6 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-zinc-400">
          404 / off-route
        </p>
        <h1 className="text-4xl font-semibold sm:text-5xl">Page not found</h1>
        <p className="leading-relaxed text-slate-600 dark:text-zinc-300">
          We could not find the page you were looking for. It may have been
          moved or never existed. Let&apos;s get you back to familiar ground.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild className="px-6">
            <Link href="/">Back home</Link>
          </Button>
          <Button asChild variant="outline" className="px-6">
            <Link href="/projects">See projects</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
