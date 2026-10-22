import type { Locale as ApiLocaleModel } from "@/api/stetsom/model";

export const APP_LOCALES = ["pt-BR", "en", "es"] as const;
export const API_LOCALES = ["pt", "en", "es"] as const;
export const DEFAULT_APP_LOCALE = "pt-BR" as const;

export type AppLocale = (typeof APP_LOCALES)[number];
export type ApiLocale = (typeof API_LOCALES)[number] & ApiLocaleModel;

export function isAppLocale(locale: string): locale is AppLocale {
  return APP_LOCALES.includes(locale as AppLocale);
}

/** next-intl locale → API locale key. */
export function toApiLocale(locale: string): ApiLocale {
  if (locale === "en" || locale.startsWith("en-")) return "en";
  if (locale === "es" || locale.startsWith("es-")) return "es";
  return "pt";
}

/** API locale key → next-intl locale. */
export function toAppLocale(locale: ApiLocale): AppLocale {
  return locale === "pt" ? "pt-BR" : locale;
}

export function toDisplayLocale(locale: string): AppLocale {
  return toAppLocale(toApiLocale(locale));
}
