import type {
  FaqItem,
  GetApiPagesSlug200,
  HeroBannerSlidesPayload,
  ProductCardItem,
} from "@/api/stetsom/model";
import { getApiBannersActive } from "@/api/stetsom/server/banners-public/banners-public";
import { getApiFaqs } from "@/api/stetsom/server/faq-public/faq-public";
import { getApiPagesSlug } from "@/api/stetsom/server/pages-public/pages-public";
import { toApiLocale } from "@/lib/api/i18n-utils";
import { getLocale } from "next-intl/server";
import { NOVELTIES_PAGE_SIZE } from "./_components/build-novelties-by-category";
import { HomePageView } from "./_components/home-page-view";

export default async function Home() {
  const locale = await getLocale();
  const apiLocale = toApiLocale(locale);

  const [bannersRes, pageRes, faqItems] = await Promise.all([
    getApiBannersActive({ locale: apiLocale }).catch(() => {
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
    getApiFaqs({ locale: apiLocale }).catch(() => [] as FaqItem[]),
  ]);
  const featuredBlock = pageRes.blocks?.find(
    (block) => block.section_id === "featured",
  );
  const featuredTabs = Array.isArray(featuredBlock?.data?.tabs)
    ? featuredBlock.data.tabs
        .map((tab) => {
          if (!tab || typeof tab !== "object") return null;
          const value = tab as {
            category?: { id?: string; name?: string; slug?: string };
            products?: ProductCardItem[];
          };
          if (
            !value.category?.id ||
            !value.category.name ||
            !value.category.slug
          ) {
            return null;
          }
          return {
            slug: value.category.slug,
            name: value.category.name,
            spotlight: value.products?.[0],
            grid:
              value.category.slug === "novidades"
                ? value.products?.slice(1)
                : value.products?.slice(1, NOVELTIES_PAGE_SIZE),
          };
        })
        .filter(
          (
            tab,
          ): tab is {
            slug: string;
            name: string;
            spotlight: ProductCardItem;
            grid: ProductCardItem[];
          } => Boolean(tab?.spotlight && tab.grid),
        )
    : [];

  return (
    <HomePageView
      data={{
        blocks: pageRes.blocks ?? [],
        banners: bannersRes.items,
        faqItems,
        novelties: featuredTabs,
      }}
    />
  );
}
