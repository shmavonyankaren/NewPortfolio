"use client";

import { FormEvent, useState, useEffect } from "react";
import { Send, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { sendContactForm } from "@/lib/actions/user.actions";

export function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => {
        setStatus("idle");
        setErrorMsg(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Set status immediately for instant UI feedback
    setStatus("sending");
    setErrorMsg(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await sendContactForm(formData);
      setStatus("success");
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus("error");
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg || "Unable to send message.");
    }
  };

  return (
    <div className="lg:col-span-2">
      <div className="rounded-2xl border border-slate-200/70 bg-white dark:border-white/10 dark:bg-slate-900 p-5 sm:p-6 md:p-8 shadow-md transition-all duration-300">
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
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:border-white/10 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-purple-500 dark:focus:ring-purple-500/30 outline-none transition-all duration-200"
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
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:border-white/10 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-purple-500 dark:focus:ring-purple-500/30 outline-none transition-all duration-200"
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
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:border-white/10 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-purple-500 dark:focus:ring-purple-500/30 outline-none transition-all duration-200"
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
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:border-white/10 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-purple-500 dark:focus:ring-purple-500/30 outline-none transition-all duration-200 resize-none"
              placeholder="Share a short brief or your question..."
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap items-center gap-3 justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              I&apos;ll reply within one business day.
            </div>
            <button
              type="submit"
              disabled={status === "sending"}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 ${
                status === "sending"
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-purple-600 shadow-purple-600/30 hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-xl cursor-pointer focus-visible:outline-purple-500"
              }`}
            >
              {status === "sending" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-4 w-4" aria-hidden="true" />
              )}
              {status === "sending" ? "Sending..." : "Send message"}
            </button>
          </div>

          {/* Success Message */}
          {status === "success" && (
            <div className="md:col-span-2 flex items-center gap-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
              <p className="text-sm text-green-800 dark:text-green-300 font-medium">
                Message sent successfully! I&apos;ll get back to you soon.
              </p>
            </div>
          )}

          {/* Error Message */}
          {status === "error" && (
            <div className="md:col-span-2 flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
              <p className="text-sm text-red-800 dark:text-red-300 font-medium">
                {errorMsg || "Failed to send message. Please try again."}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
