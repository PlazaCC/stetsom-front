import type { I18nString } from "@/api/stetsom/model";
import { API_LOCALES, type ApiLocale } from "@/i18n/locale";
import { slugify } from "@/lib/utils/slugify";

export const CMS_LOCALES: ReadonlyArray<{
  key: ApiLocale;
  label: string;
}> = [
  { key: "pt", label: "Português" },
  { key: "en", label: "Inglês" },
  { key: "es", label: "Espanhol" },
];

export function compactI18n(value: I18nString): I18nString {
  const result: I18nString = { pt: value.pt.trim() };
  for (const locale of API_LOCALES) {
    if (locale === "pt") continue;
    const localized = value[locale]?.trim();
    if (localized) result[locale] = localized;
  }
  return result;
}

export function updateTrackedLocalizedSlugs(
  previousSlugs: I18nString,
  previousTitles: I18nString,
  nextTitles: I18nString,
): I18nString {
  const nextSlugs: I18nString = { ...previousSlugs };
  for (const locale of API_LOCALES) {
    const previousTitle = previousTitles[locale] ?? "";
    const previousSlug = previousSlugs[locale] ?? "";
    if (!previousSlug || previousSlug === slugify(previousTitle)) {
      const nextSlug = slugify(nextTitles[locale] ?? "");
      if (locale === "pt" || nextSlug) nextSlugs[locale] = nextSlug;
      else delete nextSlugs[locale];
    }
  }
  return nextSlugs;
}
