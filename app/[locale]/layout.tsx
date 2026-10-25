import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import LocaleShell from "@/components/LocaleShell";
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "de") notFound();
  setRequestLocale(locale);
  return (
    <LocaleShell locale={locale}>
      <div className="sm:pt-0">{children}</div>
    </LocaleShell>
  );
}
