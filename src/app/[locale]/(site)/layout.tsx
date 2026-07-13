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

  return (
    <>
      <Header logoDark={config.logo_dark} logoWhite={config.logo_white} />
      <main className="flex-1">{children}</main>
      <WarrantyFloat />
      <Footer
        logoDark={config.logo_dark}
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
