import { getPathname } from "@/i18n/navigation";
import {
  API_LOCALES,
  toApiLocale,
  toAppLocale,
  type ApiLocale,
  type AppLocale,
} from "./locale";

export type LocalizedSlugs = {
  pt: string;
  en?: string;
  es?: string;
};

export type LocalizedHref = Parameters<typeof getPathname>[0]["href"];

export function localizedSlug(
  slugs: LocalizedSlugs,
  locale: ApiLocale,
): string {
  return slugs[locale] ?? slugs.pt;
}

export function localizedPath(locale: AppLocale, href: LocalizedHref): string {
  return getPathname({ locale, href });
}

export function buildLocalizedAlternates(
  currentLocale: string,
  hrefForLocale: (locale: ApiLocale) => LocalizedHref,
  locales: readonly ApiLocale[] = API_LOCALES,
) {
  const languages = Object.fromEntries(
    locales.map((apiLocale) => {
      const appLocale = toAppLocale(apiLocale);
      return [appLocale, localizedPath(appLocale, hrefForLocale(apiLocale))];
    }),
  ) as Record<AppLocale, string>;

  const apiLocale = toApiLocale(currentLocale);
  return {
    canonical: localizedPath(toAppLocale(apiLocale), hrefForLocale(apiLocale)),
    languages,
  };
}

export function absoluteLocalizedUrl(
  siteUrl: string,
  locale: ApiLocale,
  href: LocalizedHref,
): string {
  return `${siteUrl}${localizedPath(toAppLocale(locale), href)}`;
}

export function absoluteLocalizedLanguages(
  siteUrl: string,
  hrefForLocale: (locale: ApiLocale) => LocalizedHref,
  locales: readonly ApiLocale[] = API_LOCALES,
): Record<AppLocale, string> {
  return Object.fromEntries(
    locales.map((apiLocale) => {
      const appLocale = toAppLocale(apiLocale);
      return [
        appLocale,
        absoluteLocalizedUrl(siteUrl, apiLocale, hrefForLocale(apiLocale)),
      ];
    }),
  ) as Record<AppLocale, string>;
}
