"use client";
import { useEffect } from "react";
import { useLocale } from "next-intl";
export default function LocaleDocument() {
  const locale = useLocale();
  // The root HTML is server-localized on entry; it persists during client navigation.
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  return null;
}
