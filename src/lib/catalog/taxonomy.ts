import type { PublicCategory, PublicLine } from "@/api/stetsom/model";
import type { Locale } from "@/i18n/routing";
import { toApiLocale, type ApiLocale } from "@/i18n/locale";

export type LocalizedSlugs = {
  pt: string;
  en?: string;
  es?: string;
};

/** Returns the canonical slug for a route locale, falling back to Portuguese. */
export function localizedTaxonomySlug(
  slugs: LocalizedSlugs,
  locale: Locale | ApiLocale,
): string {
  const apiLocale =
    locale === "pt-BR" || locale === "en" || locale === "es"
      ? toApiLocale(locale)
      : locale;
  return slugs[apiLocale] ?? slugs.pt;
}

export function localizedSlugValues(slugs: LocalizedSlugs): string[] {
  return Object.values(slugs).filter(
    (value): value is string => typeof value === "string" && value.length > 0,
  );
}

export function findCategoryByLocalizedSlug(
  categories: PublicCategory[],
  slug: string,
  locale: Locale = "pt-BR",
): PublicCategory | undefined {
  return categories.find(
    (category) =>
      localizedTaxonomySlug(category.localized_slugs, locale) === slug,
  );
}

export function findLineByLocalizedSlug(
  lines: PublicLine[],
  slug: string,
  locale: Locale = "pt-BR",
): PublicLine | undefined {
  return lines.find(
    (line) => localizedTaxonomySlug(line.localized_slugs, locale) === slug,
  );
}

export function resolveLocalizedTaxonomy(
  categories: PublicCategory[],
  categorySlug: string,
  lineSlug?: string,
  locale: Locale = "pt-BR",
) {
  const category = findCategoryByLocalizedSlug(
    categories,
    categorySlug,
    locale,
  );
  if (!category) return null;
  if (!lineSlug) return { category, line: undefined };

  const line = findLineByLocalizedSlug(category.lines, lineSlug, locale);
  return line ? { category, line } : null;
}
