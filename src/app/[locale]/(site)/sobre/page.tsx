import type { GetApiPagesSlug200 } from "@/api/stetsom/model";
import { getApiPagesSlug } from "@/api/stetsom/server/pages-public/pages-public";
import { toApiLocale } from "@/i18n/locale";
import {
  getPageBlock,
  type AboutFactoryBlockData,
  type AboutHeroBlockData,
  type AboutQualityBlockData,
  type AboutSocialBlockData,
  type AboutTimelineBlockData,
  type AboutValuesBlockData,
} from "@/lib/page-blocks";
import { getLocale } from "next-intl/server";
import { MilestonesMarquee } from "../_components/milestones-marquee";
import { AboutHeroSection } from "./_components/about-hero-section";
import { AboutPageSections } from "./_components/about-page-sections";

export default async function SobrePage() {
  const locale = await getLocale();
  const apiLocale = toApiLocale(locale);

  const pageRes = await getApiPagesSlug("about", { locale: apiLocale }).catch(
    () =>
      ({
        id: "",
        slug: "about",
        title: "",
        blocks: [],
        updated_at: "",
      }) satisfies GetApiPagesSlug200,
  );

  const blocks = pageRes.blocks ?? [];
  const heroData = getPageBlock<AboutHeroBlockData>(blocks, "hero");
  const qualityData = getPageBlock<AboutQualityBlockData>(blocks, "quality");
  const valuesData = getPageBlock<AboutValuesBlockData>(blocks, "values");
  const timelineData = getPageBlock<AboutTimelineBlockData>(blocks, "timeline");
  const socialData = getPageBlock<AboutSocialBlockData>(blocks, "social");
  const factoryData = getPageBlock<AboutFactoryBlockData>(blocks, "jobs-cta");

  return (
    <div>
      {!heroData.hidden && (
        <AboutHeroSection
          section={{
            url: heroData.url,
            imageAlt: heroData.imageAlt,
            label: heroData.label,
            title: heroData.title,
            description: heroData.description,
            foundedYear: heroData.foundedYear,
            stats: heroData.stats,
          }}
        />
      )}

      {!heroData.hidden && heroData.milestones?.length ? (
        <MilestonesMarquee items={heroData.milestones} />
      ) : null}

      <AboutPageSections
        locale={locale}
        quality={qualityData}
        values={valuesData}
        timeline={timelineData}
        social={socialData}
        factory={factoryData}
      />
    </div>
  );
}
