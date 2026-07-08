import type {
  GetApiPagesSlug200,
  HeroBannerSlidesPayload,
} from "@/api/stetsom/model";
import { getApiBannersActive } from "@/api/stetsom/server/banners-public/banners-public";
import { getApiPagesSlug } from "@/api/stetsom/server/pages-public/pages-public";
import { toApiLocale } from "@/lib/api/i18n-utils";
import { getLocale } from "next-intl/server";
import { HomePageView } from "./_components/home-page-view";

export default async function Home() {
  const locale = await getLocale();
  const apiLocale = toApiLocale(locale);

  const [bannersRes, pageRes] = await Promise.all([
    getApiBannersActive({ locale: apiLocale }).catch((err) => {
      console.error("Failed to fetch home banners:", err);
      return { items: [], total: 0 } as HeroBannerSlidesPayload;
    }),
    getApiPagesSlug("home", { locale: apiLocale }).catch(
      () =>
        ({
          id: "",
          slug: "home",
          title: "",
          blocks: [],
          updated_at: "",
        }) satisfies GetApiPagesSlug200,
    ),
  ]);

  return (
    <HomePageView
      data={{ blocks: pageRes.blocks ?? [], banners: bannersRes.items }}
    />
  );
}
