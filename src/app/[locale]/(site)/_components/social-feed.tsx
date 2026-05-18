"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useLocale } from "next-intl";

import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import type { SocialFeedSection } from "@/lib/api/contracts";

interface SocialFeedProps {
  section: SocialFeedSection;
}

export function SocialFeed({ section }: Readonly<SocialFeedProps>) {
  const locale = useLocale();
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  });

  return (
    <section className="flex justify-center bg-off-white py-12">
      <Container>
        <div className="flex justify-between items-end mb-8">
          <SectionLabel
            label={section.handle}
            title={section.title}
            subtitle={section.subtitle}
          />
          <Link
            href={section.ctaHref}
            className="font-sans-condensed font-medium text-base text-brand hover:text-brand/80 transition-colors"
          >
            {section.ctaLabel} ›
          </Link>
        </div>
        <Swiper
          slidesPerView="auto"
          spaceBetween={24}
          grabCursor
          className="!overflow-visible"
        >
          {section.posts.map((post) => (
            <SwiperSlide key={post.id} className="!w-62.5">
              <Link
                href={post.permalink}
                className="flex w-62.5 flex-col gap-3"
              >
                <div className="relative h-62.5 w-62.5 shrink-0 overflow-hidden rounded-sm">
                  {post.media_type === "VIDEO" ? (
                    <video
                      src={post.media_url}
                      muted
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                      style={{ opacity: post.opacity ?? 1 }}
                    />
                  ) : (
                    <Image
                      src={post.media_url}
                      alt={post.caption}
                      fill
                      className="object-cover"
                      style={{ opacity: post.opacity ?? 1 }}
                    />
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xs font-sans-condensed font-semibold uppercase text-muted-foreground">
                    @{post.username}
                  </span>
                  <span className="text-sm text-foreground">
                    {post.caption}
                  </span>
                  <time
                    dateTime={post.timestamp}
                    className="text-2xs text-muted-foreground"
                  >
                    {dateFormatter.format(new Date(post.timestamp))}
                  </time>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </section>
  );
}
