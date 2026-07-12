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

export type { SocialPost };

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

  const posts = section.posts;

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
            className="social-feed-swiper w-full"
          >
            {posts.map((post) => (
              <SwiperSlide
                key={post.id}
                className="w-[calc(100vw-2.5rem)] max-w-62.5 sm:w-62.5"
              >
                <Link
                  href={post.permalink ?? "#"}
                  className="relative flex aspect-292/356 w-full flex-col overflow-hidden"
                >
                  {/* Background media */}
                  {post.media_type === "VIDEO" && post.media_url ? (
                    <video
                      src={post.media_url}
                      muted
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ opacity: post.opacity ?? 1 }}
                    />
                  ) : (
                    <Image
                      src={post.media_url ?? post.image}
                      alt={post.caption ?? ""}
                      fill
                      className="absolute inset-0 object-cover"
                      style={{ opacity: post.opacity ?? 1 }}
                    />
                  )}

                  {/* Dark overlay for readability */}
                  <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/60" />

                  {/* Top section: avatar + (name + date) */}
                  <div className="relative z-10 flex items-center gap-2 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
                      @
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-sans-condensed text-xs font-semibold text-white">
                        @{post.username ?? ""}
                      </span>
                      <time
                        dateTime={post.timestamp ?? ""}
                        className="text-2xs text-white/70"
                      >
                        {post.timestamp
                          ? dateFormatter.format(new Date(post.timestamp))
                          : ""}
                      </time>
                    </div>
                  </div>

                  {/* Spacer to push caption to bottom */}
                  <div className="flex-1" />

                  {/* Bottom section: description with truncate */}
                  {post.caption && (
                    <div className="relative z-10 p-3">
                      <span className="line-clamp-2 text-xs text-white">
                        {post.caption}
                      </span>
                    </div>
                  )}
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Container>
    </section>
  );
}
