"use client";

import type { PageBlock } from "@/api/stetsom/model";
import {
  getPageBlock,
  type AboutFactoryBlockData,
  type AboutHeroBlockData,
  type AboutQualityBlockData,
  type AboutSocialBlockData,
  type AboutTimelineBlockData,
  type AboutValuesBlockData,
} from "@/lib/page-blocks";
import { useLocale } from "next-intl";
import { EditableSection } from "../../_components/editable-section";
import { MilestonesMarquee } from "../../_components/milestones-marquee";
import { AboutPageSections } from "./about-page-sections";
import { AboutHeroSection } from "./about-hero-section";

export interface AboutPageViewData {
  blocks: PageBlock[];
}

interface AboutPageViewProps {
  data: AboutPageViewData;
  /** CMS live-preview mode: stamps `data-editor-target` on each section. */
  editable?: boolean;
}

export function AboutPageView({
  data,
  editable = false,
}: Readonly<AboutPageViewProps>) {
  const locale = useLocale();
  const { blocks } = data;

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
          editable={editable}
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
        <EditableSection target="section:hero" editable={editable}>
          <MilestonesMarquee items={heroData.milestones} />
        </EditableSection>
      ) : null}

      <AboutPageSections
        editable={editable}
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
