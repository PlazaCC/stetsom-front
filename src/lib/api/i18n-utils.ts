import type { Locale } from "@/api/stetsom/model";

/**
 * Locale helpers — the single source for converting between the next-intl
 * display locale (e.g. "pt-BR") and the API locale key ("pt").
 *
 * Public pages do NOT resolve I18nString themselves: the backend already
 * returns flat strings when given `?locale=`. These helpers only translate
 * the locale token used in that query param (and back, for admin forms).
 */

/** next-intl display locale → API locale key. "pt-BR" → "pt". */
export function toApiLocale(locale: string): Locale {
  if (locale === "pt-BR" || locale === "pt") return "pt";
  if (locale === "en" || locale.startsWith("en-")) return "en";
  if (locale === "es" || locale.startsWith("es-")) return "es";
  return "pt";
}

/** API locale key → next-intl display locale. "pt" → "pt-BR". */
export function toDisplayLocale(apiLocale: string): string {
  return apiLocale === "pt" ? "pt-BR" : apiLocale;
}
