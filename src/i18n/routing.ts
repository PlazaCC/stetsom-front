import { defineRouting, type Pathnames } from "next-intl/routing";
import { APP_LOCALES, DEFAULT_APP_LOCALE } from "./locale";

const pathnames = {
  "/": "/",
  "/produtos": { "pt-BR": "/produtos", en: "/products", es: "/productos" },
  "/produtos/[category]": {
    "pt-BR": "/produtos/[category]",
    en: "/products/[category]",
    es: "/productos/[category]",
  },
  "/produtos/[category]/[line]": {
    "pt-BR": "/produtos/[category]/[line]",
    en: "/products/[category]/[line]",
    es: "/productos/[category]/[line]",
  },
  "/produtos/[category]/produtos": {
    "pt-BR": "/produtos/[category]/produtos",
    en: "/products/[category]/products",
    es: "/productos/[category]/productos",
  },
  "/produto/[slug]": {
    "pt-BR": "/produto/[slug]",
    en: "/product/[slug]",
    es: "/producto/[slug]",
  },
  "/sobre": { "pt-BR": "/sobre", en: "/about", es: "/nosotros" },
  "/suporte": { "pt-BR": "/suporte", en: "/support", es: "/soporte" },
  "/legal/[slug]": "/legal/[slug]",
} satisfies Pathnames<typeof APP_LOCALES>;

export const routing = defineRouting({
  locales: APP_LOCALES,
  defaultLocale: DEFAULT_APP_LOCALE,
  localePrefix: "as-needed",
  localeDetection: true,
  pathnames,
});

export type Locale = (typeof routing.locales)[number];
