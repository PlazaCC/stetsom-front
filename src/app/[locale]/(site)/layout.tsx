import type { PublicConfig } from "@/api/stetsom/model";
import { getApiConfigPublic } from "@/api/stetsom/server/config-public/config-public";
import { Header } from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { toApiLocale } from "@/lib/api/i18n-utils";
import { getLocale } from "next-intl/server";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const config = await getApiConfigPublic({
    locale: toApiLocale(locale),
  }).catch((err) => {
    console.error("Failed to fetch public config:", err);
    return {} as PublicConfig;
  });

  return (
    <>
      <Header logoDark={config.logo_dark} logoWhite={config.logo_white} />
      <main className="flex-1">{children}</main>
      <Footer
        logoDark={config.logo_dark}
        socials={{
          instagram: config.social_instagram,
          facebook: config.social_facebook,
          youtube: config.social_youtube,
          linkedin: config.social_linkedin,
        }}
      />
    </>
  );
}
