import type {
  FaqItem,
  GetApiPagesSlug200,
  HeroBannerSlidesPayload,
  ProductCardItem,
  PublicCategory,
} from "@/api/stetsom/model";
import { getApiBannersActive } from "@/api/stetsom/server/banners-public/banners-public";
import { getApiCategories } from "@/api/stetsom/server/categories-public/categories-public";
import { getApiFaqs } from "@/api/stetsom/server/faq-public/faq-public";
import { getApiPagesSlug } from "@/api/stetsom/server/pages-public/pages-public";
import { getApiProducts } from "@/api/stetsom/server/products-public/products-public";
import { toApiLocale } from "@/lib/api/i18n-utils";
import { getLocale } from "next-intl/server";
import {
  buildNoveltiesByCategory,
  NOVELTIES_PAGE_SIZE,
} from "./_components/build-novelties-by-category";
import { HomePageView } from "./_components/home-page-view";

export default async function Home() {
  const locale = await getLocale();
  const apiLocale = toApiLocale(locale);

  const [bannersRes, pageRes, faqItems, categories] = await Promise.all([
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
    getApiCategories({ locale: apiLocale }).catch(() => [] as PublicCategory[]),
  ]);

  const novelties = await buildNoveltiesByCategory(categories, (categorySlug) =>
    getApiProducts({
      category: categorySlug,
      pageSize: NOVELTIES_PAGE_SIZE,
      sort: "newest",
      status: "PUBLISHED",
      locale: apiLocale,
    })
      .then((res) => res.items)
      .catch(() => [] as ProductCardItem[]),
  );

  return (
    <HomePageView
      data={{
        blocks: pageRes.blocks ?? [],
        banners: bannersRes.items,
        faqItems,
        novelties,
      }}
    />
  );
}
