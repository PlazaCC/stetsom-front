import { OurFactory } from "./our-factory";
import { OurFoundations } from "./our-foundations";
import { QualitySection } from "./quality-section";
import { SocialFeed } from "../../_components/social-feed";
import { TimelineCarousel } from "./timeline-carousel";
import type {
  AboutFactoryBlockData,
  AboutQualityBlockData,
  AboutSocialBlockData,
  AboutTimelineBlockData,
  AboutValuesBlockData,
} from "@/lib/page-blocks";

interface AboutPageSectionsProps {
  quality: AboutQualityBlockData;
  values: AboutValuesBlockData;
  timeline: AboutTimelineBlockData;
  social: AboutSocialBlockData;
  factory: AboutFactoryBlockData;
}

export function AboutPageSections({
  quality,
  values,
  timeline,
  social,
  factory,
}: Readonly<AboutPageSectionsProps>) {
  return (
    <>
      {!quality.hidden && (quality.video_url || quality.image_url) && (
        <QualitySection
          section={{
            label: quality.label,
            title: quality.title ?? "",
            description: quality.description,
            backgroundVideoUrl: quality.video_url,
            fullVideoUrl: quality.fullVideoLink || quality.fullVideo_url,
            posterUrl: quality.image_url,
            posterAlt: quality.imageAlt ?? "Qualidade Stetsom",
            playLabel: quality.playLabel,
          }}
          values={values.items ?? []}
        />
      )}

      {!timeline.hidden && timeline.events?.length ? (
        <TimelineCarousel
          events={timeline.events.map((event) => ({
            year: String(event.year),
            title: event.title,
            description: event.description,
            image: event.image_url,
            imageAlt: event.imageAlt,
          }))}
        />
      ) : null}

      {!values.hidden && values.bases?.length ? (
        <OurFoundations bases={values.bases} />
      ) : null}

      {!social.hidden && social.handle && (
        <SocialFeed
          section={{
            handle: social.handle,
            title: social.title ?? "",
            subtitle: social.subtitle,
            ctaHref: social.ctaHref ?? "#",
            ctaLabel: social.ctaLabel ?? "Ver mais",
            posts: social.posts ?? [],
          }}
        />
      )}

      {!factory.hidden && (
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
      )}
    </>
  );
}
