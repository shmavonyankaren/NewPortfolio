import { getTranslations } from "next-intl/server";
import keys from "@/messages/keys.json";
export async function getPublicText() {
  const translate = await getTranslations("Public");
  return (english: string, values?: Record<string, string | number>) => {
    const key = (keys as Record<string, string>)[english.replace(/\s+/g, " ").trim()];
    return key ? translate(key, values) : english;
  };
}
