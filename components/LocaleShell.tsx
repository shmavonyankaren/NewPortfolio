import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { FloatingNav } from "./ui/FloatingNavbar";
import { navItems } from "@/data";
import LocaleDocument from "./LocaleDocument";
import SentryFeedbackWidget from "./ReportBugButton";
export default async function LocaleShell({locale, children}: {locale: "en" | "de"; children: React.ReactNode}) {
  const messages = await getMessages({locale});
  return <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
    <LocaleDocument />
    <header><FloatingNav navItems={navItems} /></header>
    {children}
    <SentryFeedbackWidget />
  </NextIntlClientProvider>;
}
