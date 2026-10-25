import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/seo";
export default function robots(): MetadataRoute.Robots {
 return { rules: {userAgent: "*", allow: "/", disallow: ["/admin-dashboard", "/login", "/api/", "/monitoring", "/sentry-example-page"]}, sitemap: siteOrigin() + "/sitemap.xml" };
}
