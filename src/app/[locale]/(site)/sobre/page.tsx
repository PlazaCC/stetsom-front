import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { getSiteAboutPayload } from "@/lib/api/server";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { CompanyTimeline } from "../_components/company-timeline";
import { OurFactory } from "../_components/our-factory";
import { OurFoundations } from "../_components/our-foundations";
import { QualitySection } from "../_components/quality-section";
import { RedBanner } from "../_components/red-banner";
import { SocialFeed } from "../_components/social-feed";

export default async function SobrePage() {
  const [aboutPayload, t] = await Promise.all([
    getSiteAboutPayload(),
    getTranslations("About"),
  ]);

  return (
    <div>
      <section className="relative bg-brand-dark h-109.75 overflow-hidden flex items-center">
        <Image
          src={aboutPayload.hero.image}
          alt={aboutPayload.hero.imageAlt}
          fill
          className="object-cover opacity-35"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-dark-overlay" />
        <Container className="z-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_428px] lg:items-end">
            <div>
              <SectionLabel label={aboutPayload.hero.label} />
              <h1 className="font-sans-condensed font-black text-5xl leading-none uppercase text-white mt-1 lg:text-display-2xl">
                {aboutPayload.hero.title
                  .split("\n")
                  .map((line, lineIdx, allLines) => {
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
                  })}
              </h1>
              <p className="mt-4 max-w-125 text-base leading-relaxed text-text-subtle-dark">
                {t("heroDescription")}
              </p>
            </div>

            <div className="relative border-t border-white/20 pt-5">
              <span className="pointer-events-none absolute right-0 -top-24 font-sans-condensed text-[112px] font-black leading-none text-white/10">
                1989
              </span>
              <div className="grid grid-cols-2 border border-white/20">
                {aboutPayload.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="border border-white/20 px-4 py-4"
                  >
                    <p className="font-sans-condensed text-display-sm font-black leading-none text-white">
                      {stat.value.replace("+", "")}
                      <span className="text-brand">+</span>
                    </p>
                    <p className="mt-1 text-sm font-sans font-medium uppercase text-text-subtle-dark">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <RedBanner milestones={aboutPayload.milestones} />
      <QualitySection
        section={aboutPayload.quality}
        values={aboutPayload.values}
        foundingLabel={t("foundingLabel")}
      />
      <CompanyTimeline events={aboutPayload.timeline} />
      <OurFoundations bases={aboutPayload.bases} />
      <SocialFeed section={aboutPayload.social} />
      <OurFactory jobsCta={aboutPayload.jobsCta} />
    </div>
  );
}
