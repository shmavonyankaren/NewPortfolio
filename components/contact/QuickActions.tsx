"use client";

import React from "react";
import { Download, Mail, Phone, Send } from "lucide-react";

function getFilenameFromUrl(url: string, fallback: string) {
  try {
    const pathname = new URL(
      url,
      typeof window !== "undefined" ? window.location.href : "http://localhost"
    ).pathname;
    const last = pathname.split("/").filter(Boolean).pop();
    if (last && last.includes(".")) return last;
    return fallback;
  } catch {
    return fallback;
  }
}

type QuickActionsProps = {
  email: string;
  phone: string;
  cvLink: string;
};

export function QuickActions({ email, phone, cvLink }: QuickActionsProps) {
  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const downloadUrl = cvLink;
    const filename = getFilenameFromUrl(downloadUrl, "Karen_Shmavonyan_CV.pdf");
    try {
      const res = await fetch(downloadUrl);
      if (!res.ok) throw new Error("Failed to fetch CV");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed, opening in new tab", err);
      window.open(downloadUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="lg:col-span-1 space-y-4">
      <div className="rounded-2xl border border-slate-200/70 bg-white/90 dark:border-white/10 dark:bg-white/5 p-5 sm:p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-3">Quick actions</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          Choose how you want to connect.
        </p>

        <div className="space-y-3">
          <a
            href={cvLink || "/assets/resume/Karen_Shmavonyan_Resume.pdf"}
            onClick={handleDownload}
            className="flex items-center justify-between rounded-xl border border-purple-200 bg-purple-50 text-purple-800 dark:border-purple-500/40 dark:bg-purple-500/10 dark:text-purple-100 px-4 py-3 hover:bg-purple-100 hover:border-purple-300 dark:hover:bg-purple-500/20 transition-all"
          >
            <div>
              <p className="text-sm font-semibold">Download CV</p>
              <p className="text-xs text-purple-700/80 dark:text-purple-100/80">
                PDF · Last updated
              </p>
            </div>
            <Download className="h-5 w-5" aria-hidden />
          </a>

          <a
            href={`mailto:${email}`}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 px-4 py-3 hover:border-purple-300 hover:bg-purple-50/70 dark:hover:border-purple-400/50 dark:hover:bg-purple-500/10 transition-all"
          >
            <div>
              <p className="text-sm font-semibold">Send an email</p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {email}
              </p>
            </div>
            <Mail
              className="h-5 w-5 text-purple-600 dark:text-purple-300"
              aria-hidden
            />
          </a>

          <a
            href={`tel:${phone}`}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 px-4 py-3 hover:border-purple-300 hover:bg-purple-50/70 dark:hover:border-purple-400/50 dark:hover:bg-purple-500/10 transition-all"
          >
            <div>
              <p className="text-sm font-semibold">Schedule a call</p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {phone}
              </p>
            </div>
            <Phone
              className="h-5 w-5 text-purple-600 dark:text-purple-300"
              aria-hidden
            />
          </a>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-linear-to-br from-purple-600 to-purple-700 text-white p-5 sm:p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-2">Prefer email?</h3>
        <p className="text-sm text-white/80">
          Drop me a line and I&apos;ll get back within one business day.
        </p>
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-2 mt-4 rounded-full bg-white text-purple-700 px-4 py-2 text-sm font-semibold shadow hover:-translate-y-px transition-transform"
        >
          Email now
          <Send className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </div>
  );
}
