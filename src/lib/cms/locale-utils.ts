import type { LocaleInput } from "@/api/stetsom/model/localeInput";

export function toApiLocale(displayLocale: string): LocaleInput {
  if (displayLocale === "pt-BR" || displayLocale === "pt") return "pt";
  if (displayLocale === "en") return "en";
  return "es";
}

export function toDisplayLocale(apiLocale: string): string {
  if (apiLocale === "pt") return "pt-BR";
  return apiLocale;
}
