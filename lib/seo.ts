import type { Metadata } from "next";
export const siteOrigin = () => (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const titles: Record<string, [string, string]> = { "": ["Portfolio", "Portfolio"], about: ["About me", "Über mich"], projects: ["Projects", "Projekte"], posts: ["Posts", "Beiträge"], contact: ["Contact", "Kontakt"] };
export function pageMetadata(locale: string, path = "", title?: string, description?: string): Metadata {
 const language = locale === "de" ? "de" : "en";
 const heading = title || titles[path]?.[language === "de" ? 1 : 0] || "Portfolio";
 const summary = description || (language === "de" ? "Karen Shmavonyan – Softwareentwicklung, ausgewählte Projekte, Berufserfahrung und Ausbildung." : "Karen Shmavonyan – software development, selected projects, work experience and education.");
 const suffix = path ? "/" + path : "";
 return { metadataBase: new URL(siteOrigin()), title: heading + " | Karen Shmavonyan", description: summary,
  alternates: { canonical: "/" + language + suffix, languages: { en: "/en" + suffix, de: "/de" + suffix, "x-default": "/en" + suffix } },
  openGraph: { title: heading, description: summary, url: "/" + language + suffix, locale: language === "de" ? "de_DE" : "en_US", alternateLocale: language === "de" ? ["en_US"] : ["de_DE"], type: "website" }
 };
}
