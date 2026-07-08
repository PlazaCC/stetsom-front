"use client";

import type { HeroBannerSlide, PageBlock } from "@/api/stetsom/model";
import {
  getPageBlock,
  type HomeFaqBlockData,
  type HomeFeaturedBlockData,
  type HomeHistoryBlockData,
  type HomeSocialBlockData,
} from "@/lib/page-blocks";
import { EditableSection } from "./editable-section";
import { Faq } from "./faq";
import { FeaturedProducts } from "./featured-products";
import HeroCarousel from "./hero-carousel";
import { OurHistory } from "./our-history";
import { SocialFeed } from "./social-feed";

export interface HomePageViewData {
  blocks: PageBlock[];
  banners: HeroBannerSlide[];
}

interface HomePageViewProps {
  data: HomePageViewData;
  /** CMS live-preview mode: stamps `data-editor-target` on each section. */
  editable?: boolean;
}

export function HomePageView({
  data,
  editable = false,
}: Readonly<HomePageViewProps>) {
  const { blocks, banners } = data;

  const featuredData = getPageBlock<HomeFeaturedBlockData>(blocks, "featured");
  const historyData = getPageBlock<HomeHistoryBlockData>(blocks, "history");
  const socialData = getPageBlock<HomeSocialBlockData>(blocks, "social");
  const faqData = getPageBlock<HomeFaqBlockData>(blocks, "faq");

  const featuredProducts = (featuredData.products ?? []).slice(0, 4);
  const spotlightProduct = featuredData.spotlight ?? featuredProducts[0];

  return (
    <>
      <EditableSection target="section:__banners__" editable={editable}>
        <HeroCarousel slides={banners} />
      </EditableSection>
      {!featuredData.hidden &&
        featuredProducts.length > 0 &&
        spotlightProduct && (
          <EditableSection target="section:featured" editable={editable}>
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
          </EditableSection>
        )}
      {!historyData.hidden && historyData.image_url && (
        <EditableSection target="section:history" editable={editable}>
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
        </EditableSection>
      )}
      {!socialData.hidden && socialData.handle && (
        <EditableSection target="section:social" editable={editable}>
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
        </EditableSection>
      )}
      {!faqData.hidden && faqData.items?.length ? (
        <EditableSection target="section:faq" editable={editable}>
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
        </EditableSection>
      ) : null}
    </>
  );
}
