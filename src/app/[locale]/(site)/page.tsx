import type { HeroBannerSlidesPayload, PagePayload } from "@/api/stetsom/model";
import { serverOrvalClient } from "@/api/stetsom/orval-server";
import { toApiLocale } from "@/lib/api/i18n-utils";
import {
  getPageBlock,
  type HomeFaqBlockData,
  type HomeFeaturedBlockData,
  type HomeHistoryBlockData,
  type HomeSocialBlockData,
} from "@/lib/page-blocks";
import { getLocale } from "next-intl/server";
import { Faq } from "./_components/faq";
import { FeaturedProducts } from "./_components/featured-products";
import HeroCarousel from "./_components/hero-carousel";
import { OurHistory } from "./_components/our-history";
import { SocialFeed } from "./_components/social-feed";

export default async function Home() {
  const locale = await getLocale();
  const apiLocale = toApiLocale(locale);

  const [bannersRes, pageRes] = await Promise.all([
    serverOrvalClient<HeroBannerSlidesPayload>({
      method: "GET",
      url: "/api/banners/active",
      params: { locale: apiLocale },
    }).catch((err) => {
      console.error("Failed to fetch home banners:", err);
      return { items: [], total: 0 } as HeroBannerSlidesPayload;
    }),
    serverOrvalClient<PagePayload>({
      method: "GET",
      url: "/api/pages/home",
      params: { locale: apiLocale },
    }).catch(
      () =>
        ({
          id: "",
          slug: "home",
          title: { pt: "" },
          blocks: [],
          updated_at: "",
        }) as PagePayload,
    ),
  ]);

  const blocks = pageRes.blocks ?? [];
  const featuredData = getPageBlock<HomeFeaturedBlockData>(blocks, "featured");
  const historyData = getPageBlock<HomeHistoryBlockData>(blocks, "history");
  const socialData = getPageBlock<HomeSocialBlockData>(blocks, "social");
  const faqData = getPageBlock<HomeFaqBlockData>(blocks, "faq");

  const featuredProducts = (featuredData.products ?? []).slice(0, 4);
  const spotlightProduct = featuredData.spotlight ?? featuredProducts[0];

  return (
    <>
      <HeroCarousel slides={bannersRes.items} />
      {!featuredData.hidden &&
        featuredProducts.length > 0 &&
        spotlightProduct && (
          <FeaturedProducts
            featuredProducts={featuredProducts}
            spotlightProduct={spotlightProduct}
            tabs={featuredData.tabs ?? []}
            section={{
              label: featuredData.label ?? "",
              title: featuredData.title ?? "",
              spotlightTitle: featuredData.spotlightTitle,
              ctaHref: featuredData.ctaHref ?? "/produtos",
              ctaLabel: featuredData.ctaLabel ?? "Ver todos",
            }}
          />
        )}
      {!historyData.hidden && historyData.image_url && (
        <OurHistory
          section={{
            image: historyData.image_url,
            imageAlt: historyData.imageAlt ?? "Stetsom",
            label: historyData.label ?? "",
            title: historyData.title ?? "",
            subtitle: historyData.subtitle,
            ctaHref: historyData.ctaHref ?? "/sobre",
            ctaLabel: historyData.ctaLabel ?? "Nossa história",
          }}
        />
      )}
      {!socialData.hidden && socialData.handle && (
        <SocialFeed
          section={{
            handle: socialData.handle,
            title: socialData.title ?? "",
            subtitle: socialData.subtitle,
            ctaHref: socialData.ctaHref ?? "#",
            ctaLabel: socialData.ctaLabel ?? "Ver mais",
            posts: socialData.posts ?? [],
          }}
        />
      )}
      {!faqData.hidden && faqData.items?.length ? (
        <Faq
          items={faqData.items as Array<{ id: string; q: string; a: string }>}
          section={{
            label: faqData.section?.label ?? "",
            title: faqData.section?.title ?? "",
            subtitle: faqData.section?.subtitle,
            ctaHref: faqData.section?.ctaHref ?? "#",
            ctaLabel: faqData.section?.ctaLabel ?? "Ver mais",
            buttonText: faqData.section?.ctaLabel ?? "Ver todas as perguntas",
            buttonHref: faqData.section?.ctaHref,
          }}
        />
      ) : null}
    </>
  );
}
