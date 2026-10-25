import { usePublicText } from "@/i18n/text";
import React from "react";

export function ContactHeader() {
  const t = usePublicText();
  return (
    <header className="text-center space-y-4">
      <div className="inline-block">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-linear-to-r from-purple-600 via-purple-500 to-pink-500 dark:from-purple-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
          {t("Contact")}</h1>
        <div className="h-1 w-full bg-linear-to-r from-purple-600 via-purple-500 to-pink-500 dark:from-purple-400 dark:via-purple-300 dark:to-pink-400 rounded-full"></div>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
        {t("Let's build something great together")}</h1>
      <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
        {t("Whether you want to download my CV, hop on a call, or send a quick message, I'd love to hear from you.")}</p>
    </header>
  );
}
