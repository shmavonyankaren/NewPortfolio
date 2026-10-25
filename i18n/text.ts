import { useTranslations } from "next-intl";
import keys from "@/messages/keys.json";
import type { ReactNode } from "react";
export function usePublicText() {
  const translate = useTranslations("Public");
  const text = (english: string, values?: Record<string, string | number>) => {
    const key = (keys as Record<string, string>)[english.replace(/\s+/g, " ").trim()];
    return key ? translate(key, values) : english;
  };
  return Object.assign(text, { rich: (english: string, values: Record<string, (chunks: ReactNode) => ReactNode>) => translate.rich((keys as Record<string, string>)[english], values) });
}
export function translateStatic<T>(value: T, t: (text: string) => string): T {
  if (typeof value === "string") return t(value) as T;
  if (Array.isArray(value)) return value.map(item => translateStatic(item, t)) as T;
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, translateStatic(item, t)])) as T;
  return value;
}
