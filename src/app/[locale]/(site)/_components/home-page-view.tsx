"use client";

import type { FaqItem, HeroBannerSlide, PageBlock } from "@/api/stetsom/model";
import {
  getPageBlock,
  type FaqBlockData,
  type HomeHistoryBlockData,
  type HomeSocialBlockData,
} from "@/lib/page-blocks";
import type { NoveltyCategory } from "./build-novelties-by-category";
import { EditableSection } from "./editable-section";
import { FaqSection } from "./faq-section";
import { FeaturedProducts } from "./featured-products";
import HeroCarousel from "./hero-carousel";
import { OurHistory } from "./our-history";
import { SocialFeed } from "./social-feed";

export interface HomePageViewData {
  blocks: PageBlock[];
  banners: HeroBannerSlide[];
  faqItems: FaqItem[];
  novelties?: NoveltyCategory[];
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
  const { blocks, banners, faqItems, novelties = [] } = data;

  const historyData = getPageBlock<HomeHistoryBlockData>(blocks, "history");
  const socialData = getPageBlock<HomeSocialBlockData>(blocks, "social");
  const faqData = getPageBlock<FaqBlockData>(blocks, "faq");

  return (
    <>
      <EditableSection target="section:__banners__" editable={editable}>
        <HeroCarousel slides={banners} />
      </EditableSection>
      {novelties.length > 0 && <FeaturedProducts categories={novelties} />}
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
      {!faqData.hidden ? (
        <EditableSection target="section:faq" editable={editable}>
          <FaqSection
            items={faqItems.slice(
              0,
              Number(faqData.section?.maxItems) || faqItems.length,
            )}
            section={{
              label: faqData.section?.label ?? "",
              title: faqData.section?.title ?? "",
              subtitle: faqData.section?.subtitle,
              ctaHref: faqData.section?.ctaHref ?? "#",
              ctaLabel: faqData.section?.ctaLabel ?? "",
            }}
          />
        </EditableSection>
      ) : null}
    </>
  );
}
