"use client";

import { FormEvent } from "react";
import { Send } from "lucide-react";

type ContactFormProps = {
  email: string;
};

export function ContactForm({ email }: ContactFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const name = (formData.get("name") as string) || "";
    const replyEmail = (formData.get("email") as string) || "";
    const subject = (formData.get("subject") as string) || "Let's connect";
    const message = (formData.get("message") as string) || "";

    const body = [
      message.trim() || "Hi Karen,",
      "",
      `-- ${name || "A visitor"}${replyEmail ? ` (${replyEmail})` : ""}`,
    ].join("\n");

    const mailto = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  return (
    <div className="lg:col-span-2">
      <div className="rounded-2xl border border-slate-200/70 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-white/5 p-5 sm:p-6 md:p-8 shadow-md">
        <h2 className="text-xl font-semibold mb-2">Send a message</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
          Tell me a bit about your project or question.
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Full name
            </label>
            <input
              id="name"
              name="name"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-purple-500 dark:focus:ring-purple-500/30 outline-none transition"
              placeholder="Your name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-purple-500 dark:focus:ring-purple-500/30 outline-none transition"
              placeholder="you@example.com"
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            <label
              htmlFor="subject"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-purple-500 dark:focus:ring-purple-500/30 outline-none transition"
              placeholder="Project idea, collaboration, Q&A..."
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            <label
              htmlFor="message"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-purple-500 dark:focus:ring-purple-500/30 outline-none transition resize-none"
              placeholder="Share a short brief or your question..."
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap items-center gap-3 justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              I&apos;ll reply within one business day.
            </div>
            <button
              type="submit"
              className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-600/30 transition hover:-translate-y-px hover:bg-purple-700  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
            >
              <Send className="h-4 w-4" aria-hidden />
              Send message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
