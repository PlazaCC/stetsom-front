import type { PagePayload } from "@/api/stetsom/model";
import { serverOrvalClient } from "@/api/stetsom/orval-server";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { toApiLocale } from "@/lib/api/i18n-utils";
import {
  getPageBlock,
  type AboutFactoryBlockData,
  type AboutHeroBlockData,
  type AboutQualityBlockData,
  type AboutSocialBlockData,
  type AboutTimelineBlockData,
  type AboutValuesBlockData,
} from "@/lib/page-blocks";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { TimelineCarousel } from "../_components/timeline-carousel";
import { MilestonesMarquee } from "../_components/milestones-marquee";
import { OurFactory } from "../_components/our-factory";
import { OurFoundations } from "../_components/our-foundations";
import { QualitySection } from "../_components/quality-section";
import { SocialFeed } from "../_components/social-feed";

export default async function SobrePage() {
  const locale = await getLocale();
  const apiLocale = toApiLocale(locale);

  const [pageRes, t] = await Promise.all([
    serverOrvalClient<PagePayload>({
      method: "GET",
      url: "/api/pages/about",
      params: { locale: apiLocale },
    }).catch(
      () =>
        ({
          id: "",
          slug: "about",
          title: { pt: "" },
          blocks: [],
          updated_at: "",
        }) as PagePayload,
    ),
    getTranslations("About"),
  ]);

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
        <section className="relative flex h-109.75 items-center overflow-hidden bg-brand-dark">
          {/* {heroData.url && (
            <Image
              src={heroData.url}
              alt={heroData.imageAlt ?? "Stetsom"}
              fill
              className="object-cover opacity-35"
              sizes="100vw"
              priority
            />
          )} */}
          <div className="bg-gradient-dark-overlay absolute inset-0" />

          <Container className="z-10">
            <div className="grid gap-10 lg:grid-cols-[1fr_428px] lg:items-end">
              <div>
                <SectionLabel label={heroData.label ?? ""} />
                <h1 className="mt-1 font-sans-condensed text-5xl leading-none font-black text-white uppercase lg:text-display-2xl">
                  {(heroData.title ?? "")
                    .split("\n")
                    .map(
                      (line: string, lineIdx: number, allLines: string[]) => {
                        if (lineIdx === allLines.length - 1) {
                          const words = line.split(" ");
                          const lastWord = words.pop();
                          return (
                            <span key={line} className="block">
                              {words.length > 0 ? `${words.join(" ")} ` : ""}
                              <span className="text-brand">{lastWord}</span>
                            </span>
                          );
                        }
                        return (
                          <span key={line} className="block">
                            {line}
                          </span>
                        );
                      },
                    )}
                </h1>
                <p className="mt-4 max-w-125 text-base text-text-subtle-dark">
                  {t("heroDescription")}
                </p>
              </div>

              {heroData.stats?.length ? (
                <div className="relative pt-5">
                  <span className="pointer-events-none absolute -top-24 font-sans-condensed text-[112px] leading-none font-black text-white/10">
                    {heroData.foundedYear ?? "1989"}
                  </span>
                  <div className="grid grid-cols-2">
                    {heroData.stats.map((stat) => (
                      <div key={stat.label} className="px-4 py-4">
                        <p className="font-sans-condensed text-display-sm font-black text-white">
                          {stat.value.replace("+", "")}
                          <span className="text-brand">+</span>
                        </p>
                        <p className="mt-1 font-sans text-sm font-medium text-text-subtle-dark uppercase">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </Container>
        </section>
      )}

      {/* {!heroData.hidden && heroData.milestones?.length ? (
        <MilestonesMarquee items={heroData.milestones} />
      ) : null} */}

      {!qualityData.hidden && qualityData.image_url && (
        <QualitySection
          section={{
            label: qualityData.label ?? "",
            title: qualityData.title ?? "",
            description: qualityData.description ?? "",
            image: qualityData.image_url,
            imageAlt: qualityData.imageAlt ?? "Qualidade Stetsom",
          }}
          values={
            (valuesData.items ?? []) as Array<{
              id: string;
              icon: "zap" | "shield-check" | "rocket";
              title: string;
              description: string;
            }>
          }
          foundingLabel={t("foundingLabel")}
          foundingYear={heroData.foundedYear ?? "1989"}
        />
      )}
      {!timelineData.hidden && timelineData.events?.length ? (
        <TimelineCarousel
          events={timelineData.events.map((e) => ({
            year: String(e.year),
            title: e.title,
            description: e.description,
            image: e.image_url,
            imageAlt: e.imageAlt,
          }))}
        />
      ) : null}
      {!valuesData.hidden && valuesData.bases?.length ? (
        <OurFoundations bases={valuesData.bases} />
      ) : null}
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
      {!factoryData.hidden && (
        <OurFactory
          jobsCta={{
            image: factoryData.image_url,
            imageAlt: factoryData.imageAlt,
            label: factoryData.label,
            title: factoryData.title,
            description: factoryData.description,
            buttonText: factoryData.buttonLabel ?? "",
            buttonHref: factoryData.buttonHref,
          }}
        />
      )}
    </div>
  );
}
