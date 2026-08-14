import type {
  PublicConfig,
  PublicLegalPageListItem,
} from "@/api/stetsom/model";
import { getApiConfigPublic } from "@/api/stetsom/server/config-public/config-public";
import { getApiLegalPagesPublic } from "@/api/stetsom/server/legal-pages-public/legal-pages-public";
import { Header } from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { WarrantyFloat } from "@/components/ui/warranty-float";
import { toApiLocale } from "@/lib/api/i18n-utils";
import { getLocale } from "next-intl/server";

// Fallback logos shown when the admin hasn't published a CMS logo for a
// locale yet. No Spanish artwork exists, so `es` reuses the English mark.
const FALLBACK_LOGOS: Record<string, { dark: string; white: string }> = {
  "pt-BR": { dark: "/logo-pt-br-white.svg", white: "/logo-pt-br-black.svg" },
  en: { dark: "/logo-en-white.svg", white: "/logo-en-black.svg" },
  es: { dark: "/logo-en-white.svg", white: "/logo-en-black.svg" },
};

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const apiLocale = toApiLocale(locale);
  const config = await getApiConfigPublic({
    locale: apiLocale,
  }).catch(() => {
    return {} as PublicConfig;
  });
  const legalPages = await getApiLegalPagesPublic({
    locale: apiLocale,
  }).catch(() => {
    return [] as PublicLegalPageListItem[];
  });

  const fallbackLogos = FALLBACK_LOGOS[locale] ?? FALLBACK_LOGOS["pt-BR"];
  const logoDark = config.logo_dark ?? fallbackLogos.dark;
  const logoWhite = config.logo_white ?? fallbackLogos.white;

  return (
    <>
      <Header logoDark={logoDark} logoWhite={logoWhite} />
      <main className="flex-1">{children}</main>
      <WarrantyFloat />
      <Footer
        logoDark={logoDark}
        socials={{
          instagram: config.social_instagram,
          facebook: config.social_facebook,
          youtube: config.social_youtube,
          linkedin: config.social_linkedin,
        }}
        legalPages={legalPages}
      />
    </>
  );
}
