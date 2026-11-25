import { OurFactory } from "./our-factory";
import { OurFoundations } from "./our-foundations";
import { QualitySection } from "./quality-section";
import { SocialFeed } from "../../_components/social-feed";
import { TimelineCarousel } from "./timeline-carousel";
import { EditableSection } from "../../_components/editable-section";
import {
  resolveQualityPlayerVideo,
  type AboutFactoryBlockData,
  type AboutQualityBlockData,
  type AboutSocialBlockData,
  type AboutTimelineBlockData,
  type AboutValuesBlockData,
} from "@/lib/page-blocks";

interface AboutPageSectionsProps {
  /** next-intl locale — picks the localized Play video. */
  editable?: boolean;
  locale: string;
  quality: AboutQualityBlockData;
  values: AboutValuesBlockData;
  timeline: AboutTimelineBlockData;
  social: AboutSocialBlockData;
  factory: AboutFactoryBlockData;
}

export function AboutPageSections({
  editable = false,
  locale,
  quality,
  values,
  timeline,
  social,
  factory,
}: Readonly<AboutPageSectionsProps>) {
  return (
    <>
      {!quality.hidden && (quality.video_url || quality.image_url) && (
        <EditableSection target="section:quality" editable={editable}>
          <QualitySection
            section={{
              label: quality.label,
              title: quality.title ?? "",
              description: quality.description,
              backgroundVideoUrl: quality.video_url,
              fullVideoUrl: resolveQualityPlayerVideo(quality, locale),
              posterUrl: quality.image_url,
              posterAlt: quality.imageAlt ?? "Qualidade Stetsom",
              playLabel: quality.playLabel,
            }}
            values={values.items ?? []}
          />
        </EditableSection>
      )}

      {!timeline.hidden && timeline.events?.length ? (
        <EditableSection target="section:timeline" editable={editable}>
          <TimelineCarousel
            label={timeline.label}
            title={timeline.title}
            description={timeline.description}
            events={timeline.events.map((event) => ({
              year: String(event.year),
              title: event.title,
              description: event.description,
              image: event.image_url,
              imageAlt: event.imageAlt,
            }))}
          />
        </EditableSection>
      ) : null}

      {!values.hidden && values.bases?.length ? (
        <EditableSection target="section:values:bases" editable={editable}>
          <OurFoundations
            bases={values.bases}
            label={values.basesLabel}
            title={values.basesTitle}
          />
        </EditableSection>
      ) : null}

      {!social.hidden && social.handle && (
        <EditableSection target="section:social" editable={editable}>
          <SocialFeed
            rich
            section={{
              handle: social.handle,
              title: social.title ?? "",
              subtitle: social.subtitle,
              ctaHref: social.ctaHref ?? "#",
              ctaLabel: social.ctaLabel ?? "Ver mais",
              posts: social.posts ?? [],
            }}
          />
        </EditableSection>
      )}

      {!factory.hidden && (
        <EditableSection target="section:jobs-cta" editable={editable}>
          <OurFactory
            jobsCta={{
              image: factory.image_url,
              imageAlt: factory.imageAlt,
              label: factory.label,
              title: factory.title,
              description: factory.description,
              buttonText: factory.buttonLabel ?? "",
              buttonHref: factory.buttonHref,
            }}
          />
        </EditableSection>
      )}
    </>
  );
}
