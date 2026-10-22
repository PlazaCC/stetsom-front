"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";
import { toApiLocale } from "@/i18n/locale";
import { getApiCategories } from "@/api/stetsom/endpoints/categories-public/categories-public";
import { getApiLegalPagesPublic } from "@/api/stetsom/endpoints/legal-pages-public/legal-pages-public";
import { localizedTaxonomySlug } from "@/lib/catalog/taxonomy";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { LocaleFlag } from "./flag-icons";

interface LanguageSwitcherProps {
  variant?: "light" | "dark";
}

export function LanguageSwitcher({ variant = "light" }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{
    category?: string | string[];
    line?: string | string[];
    slug?: string | string[];
  }>();
  const searchParams = useSearchParams();
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

  async function switchLocale(next: Locale) {
    setOpen(false);
    const query = Object.fromEntries(searchParams.entries());
    const category = firstParam(params.category);
    const line = firstParam(params.line);
    const slug = firstParam(params.slug);

    if (pathname === "/produto/[slug]" && slug) {
      router.replace(
        { pathname: "/produto/[slug]", params: { slug }, query },
        { locale: next },
      );
      return;
    }
    if (pathname === "/legal/[slug]" && slug) {
      const pages = await getApiLegalPagesPublic({
        locale: toApiLocale(locale),
      }).catch(() => []);
      const page = pages.find((item) => item.slug === slug);
      const target =
        (page &&
          (page.localized_slugs[toApiLocale(next)] ??
            page.localized_slugs.pt)) ??
        slug;
      router.replace(
        { pathname: "/legal/[slug]", params: { slug: target }, query },
        { locale: next },
      );
      return;
    }
    if (
      category &&
      (pathname === "/produtos/[category]" ||
        pathname === "/produtos/[category]/produtos" ||
        pathname === "/produtos/[category]/[line]")
    ) {
      const categories = await getApiCategories({
        locale: toApiLocale(locale),
      }).catch(() => []);
      const item = categories.find(
        (entry) =>
          localizedTaxonomySlug(entry.localized_slugs, locale) === category,
      );
      const targetCategory = item
        ? localizedTaxonomySlug(item.localized_slugs, next)
        : category;
      const targetLine =
        line &&
        item?.lines.find(
          (entry) =>
            localizedTaxonomySlug(entry.localized_slugs, locale) === line,
        );
      const target = targetLine
        ? {
            pathname: "/produtos/[category]/[line]" as const,
            params: {
              category: targetCategory,
              line: localizedTaxonomySlug(targetLine.localized_slugs, next),
            },
          }
        : pathname === "/produtos/[category]/produtos"
          ? {
              pathname: "/produtos/[category]/produtos" as const,
              params: { category: targetCategory },
            }
          : {
              pathname: "/produtos/[category]" as const,
              params: { category: targetCategory },
            };
      router.replace({ ...target, query }, { locale: next });
      return;
    }
    if (["/", "/produtos", "/sobre", "/suporte"].includes(pathname)) {
      router.replace(
        {
          pathname: pathname as "/" | "/produtos" | "/sobre" | "/suporte",
          query,
        },
        { locale: next },
      );
    }
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
          "flex h-8 w-28 items-center justify-center gap-2 rounded-full px-3 text-sm transition-colors",
          isLight
            ? "border border-border bg-muted text-foreground hover:border-brand"
            : "bg-white/20 text-white hover:bg-white/30",
        )}
      >
        <RoundFlag locale={locale} />
        <span className="font-sans font-medium whitespace-nowrap">
          {t(locale)}
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "shrink-0 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          className={cn(
            "absolute top-full right-0 z-50 mt-1.5 min-w-36 overflow-hidden rounded border shadow-md",
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
                "flex w-full items-center gap-2.5 px-3 py-2 text-sm font-medium transition-colors",
                loc === locale
                  ? isLight
                    ? "bg-brand/5 text-brand"
                    : "bg-white/5 text-brand"
                  : isLight
                    ? "text-muted-foreground hover:bg-muted hover:text-brand-dark"
                    : "text-text-subtle-dark hover:bg-white/5 hover:text-white",
              )}
            >
              <RoundFlag locale={loc as Locale} />
              <span>{t(loc)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

// ─── Round Flag ───────────────────────────────────────────────────────────────

function RoundFlag({ locale }: { locale: Locale }) {
  return (
    <span className="size-5 shrink-0 overflow-hidden rounded-full [&>svg]:h-full [&>svg]:w-full">
      <LocaleFlag locale={locale} />
    </span>
  );
}
