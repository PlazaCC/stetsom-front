import type { I18nString, Locale } from "@/api/stetsom/model";

export type ApiLocale = Locale;

export function toApiLocale(locale: string): Locale {
  if (locale === "pt-BR" || locale === "pt") return "pt";
  if (locale === "en" || locale.startsWith("en-")) return "en";
  if (locale === "es" || locale.startsWith("es-")) return "es";
  return "pt";
}

export function pickLocale(i18n: I18nString, locale: string): string {
  const api = toApiLocale(locale);
  if (api !== "pt" && i18n[api]) return i18n[api] as string;
  return i18n.pt;
}

export function resolveLocale(
  value: string | I18nString | null | undefined,
  locale: string,
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return pickLocale(value, locale);
}
