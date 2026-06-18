"use client";

import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";

type SocialPost = {
  id: string;
  image: string;
  permalink?: string;
  media_type?: string;
  media_url?: string;
  caption?: string;
  username?: string;
  timestamp?: string;
  date?: string;
  likes?: number;
  opacity?: number;
  href?: string;
};

type SocialFeedSection = {
  handle: string;
  title: string;
  subtitle?: string;
  ctaHref: string;
  ctaLabel: string;
  posts: SocialPost[];
};

interface SocialFeedProps {
  section: SocialFeedSection;
}

export function SocialFeed({ section }: Readonly<SocialFeedProps>) {
  const locale = useLocale();
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  });
  const posts = section.posts ?? [];

  return (
    <section className="flex justify-center overflow-x-hidden bg-white py-10 sm:py-12">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionLabel
            label={section.handle}
            title={section.title}
            subtitle={section.subtitle}
            className="max-w-180"
          />
          <Link
            href={section.ctaHref}
            className="w-fit font-sans-condensed text-base font-medium text-brand transition-colors hover:text-brand/80"
          >
            {section.ctaLabel} ›
          </Link>
        </div>
        {posts.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            Nenhuma postagem disponível no momento.
          </p>
        )}
        {posts.length > 0 && (
          <Swiper
            slidesPerView="auto"
            spaceBetween={24}
            grabCursor
            className="w-full overflow-hidden"
          >
            {posts.map((post) => (
              <SwiperSlide
                key={post.id}
                className="w-[calc(100vw-2.5rem)] max-w-62.5 sm:w-62.5"
              >
                <Link
                  href={post.permalink ?? "#"}
                  className="flex w-full flex-col gap-3"
                >
                  <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-sm">
                    {post.media_type === "VIDEO" && post.media_url ? (
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
                        src={post.media_url ?? post.image}
                        alt={post.caption ?? ""}
                        fill
                        className="object-cover"
                        style={{ opacity: post.opacity ?? 1 }}
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-sans-condensed text-2xs font-semibold text-muted-foreground uppercase">
                      @{post.username ?? ""}
                    </span>
                    <span className="text-sm text-foreground">
                      {post.caption ?? ""}
                    </span>
                    <time
                      dateTime={post.timestamp ?? ""}
                      className="text-2xs text-muted-foreground"
                    >
                      {post.timestamp
                        ? dateFormatter.format(new Date(post.timestamp))
                        : ""}
                    </time>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Container>
    </section>
  );
}
