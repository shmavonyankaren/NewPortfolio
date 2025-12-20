import React from "react";

export function ContactHeader() {
  return (
    <header className="text-center space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-500 dark:text-purple-300">
        Contact
      </p>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
        Let&apos;s build something great together
      </h1>
      <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
        Whether you want to download my CV, hop on a call, or send a quick
        message, I&apos;d love to hear from you.
      </p>
    </header>
  );
}
