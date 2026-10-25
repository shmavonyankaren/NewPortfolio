"use client";
import { useLocale, useTranslations } from "next-intl";
import { Globe, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function LanguageSwitcher({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const locale = useLocale();
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const router = useRouter();
  return (
    <DropdownMenu modal={false} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger
        aria-label={t("language")}
        className="shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-2 text-xs sm:text-sm border border-purple-200 dark:border-purple-400/30 focus-visible:outline-2 focus-visible:outline-purple-500 cursor-pointer"
      >
        <Globe className="h-4 w-4" />
        <span>{locale.toUpperCase()}</span>
        <ChevronDown className="h-3 w-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-36 rounded-xl border border-gray-200 bg-white/95 backdrop-blur-md shadow-lg dark:border-purple-500/30 dark:bg-[#1a1f3a]/95 z-9999"
        align="end"
      >
        {(
          [
            ["en", "English"],
            ["de", "Deutsch"],
          ] as const
        ).map(([code, label]) => (
          <DropdownMenuItem
            key={code}
            lang={code}
            aria-current={locale === code ? "true" : undefined}
            onSelect={() =>
              router.replace(
                pathname + window.location.search + window.location.hash,
                { locale: code, scroll: false },
              )
            }
            className="text-gray-700 hover:bg-purple-100! focus:bg-purple-100! hover:text-purple-700! focus:text-purple-700! dark:text-gray-200 dark:hover:bg-purple-500/20! dark:focus:bg-purple-500/20! dark:hover:text-purple-300! dark:focus:text-purple-300! cursor-pointer rounded-lg"
          >
            {label}
            {locale === code ? " ✓" : ""}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
