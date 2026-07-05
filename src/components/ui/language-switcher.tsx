"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { LocaleFlag } from "./flag-icons";

const LOCALE_CODES: Record<Locale, string> = {
  "pt-BR": "PT",
  en: "EN",
  es: "ES",
};

interface LanguageSwitcherProps {
  variant?: "light" | "dark";
}

export function LanguageSwitcher({ variant = "light" }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("LanguageSwitcher");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchLocale(next: Locale) {
    setOpen(false);
    router.replace(pathname, { locale: next });
  }

  const isLight = variant === "light";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={t("label")}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-3 rounded-full border px-2 py-1.5 transition-colors",
          isLight
            ? "border-border text-muted-foreground hover:border-brand hover:text-brand-dark"
            : "border-white/20 text-text-subtle-dark hover:border-brand hover:text-white",
        )}
      >
        <span className="h-6.75 w-9.5 shrink-0 overflow-hidden rounded-2xl [&>svg]:h-full [&>svg]:w-full">
          <LocaleFlag locale={locale} />
        </span>
        <ChevronDown
          size={10}
          className={cn(
            "transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          className={cn(
            "absolute top-full right-0 z-50 mt-1.5 min-w-32 overflow-hidden rounded border shadow-md",
            isLight
              ? "border-border bg-white"
              : "border-white/10 bg-brand-dark",
          )}
        >
          {routing.locales.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => switchLocale(loc)}
              className={cn(
                "flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors",
                loc === locale
                  ? isLight
                    ? "bg-brand/5 text-brand"
                    : "bg-white/5 text-brand"
                  : isLight
                    ? "text-muted-foreground hover:bg-muted hover:text-brand-dark"
                    : "text-text-subtle-dark hover:bg-white/5 hover:text-white",
              )}
            >
              <LocaleFlag locale={loc as Locale} />
              <span className="font-sans font-semibold tracking-wide uppercase">
                {LOCALE_CODES[loc as Locale]}
              </span>
              <span className="ml-auto font-sans text-[11px] tracking-normal normal-case opacity-70">
                {t(loc)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
