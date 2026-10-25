import { getLocale } from "next-intl/server";
import { resolveContent } from "./localization";
export async function publicContent(path: string, fresh = false) {
 const locale = await getLocale();
 const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/admin/${path}`, fresh ? { cache: "no-store" } : { next: { revalidate: 60, tags: ["portfolio"] } });
 if (!response.ok) { if (response.status === 404 || response.status === 400) return null; throw new Error("Content unavailable"); }
 return resolveContent(await response.json(), locale);
}
