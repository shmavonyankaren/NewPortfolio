import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/seo";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 const origin = siteOrigin();
 const paths = ["", "/about", "/projects", "/posts", "/contact"];
 try {
  const response = await fetch(origin + "/api/admin/projects", {next: {revalidate: 60, tags: ["portfolio"]}});
  if (response.ok) for (const project of await response.json()) paths.push("/projects/" + project._id);
 } catch (error) { console.error("Sitemap projects unavailable", error); }
 return paths.flatMap(path => ["en", "de"].map(locale => ({url: origin + "/" + locale + path, alternates: {languages: {en: origin + "/en" + path, de: origin + "/de" + path}}})));
}
