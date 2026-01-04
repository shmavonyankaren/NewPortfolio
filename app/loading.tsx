export default function Loading() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_25%_20%,#e0f2fe,transparent_34%),radial-gradient(circle_at_80%_10%,#f5d0fe,transparent_30%),linear-gradient(135deg,#f8fafc,#e2e8f0)] px-6 text-slate-900 dark:bg-[linear-gradient(90deg,rgba(4,7,29,1)_0%,rgba(12,14,35,1)_100%)] dark:text-white">
      <div
        className="absolute left-1/4 top-12 h-56 w-56 rounded-full bg-cyan-500/15 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute right-10 bottom-10 h-44 w-44 rounded-full bg-purple-500/15 blur-3xl"
        aria-hidden
      />

      <section className="relative z-10 flex flex-col items-center gap-4 text-center">
        <div
          className="h-12 w-12 rounded-full border-2 border-slate-300 border-t-cyan-500 animate-spin dark:border-white/20 dark:border-t-cyan-400"
          aria-label="Loading"
        />
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-zinc-400">
          Loading portfolio
        </p>
        <p className="max-w-md leading-relaxed text-slate-600 dark:text-zinc-200">
          Fetching the latest updates and experiences. This will only take a
          moment.
        </p>
      </section>
    </main>
  );
}
