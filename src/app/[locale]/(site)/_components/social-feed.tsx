'use client';

import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import { Container } from '@/components/ui/container';
import { SectionLabel } from '@/components/ui/section-label';
import type { SocialFeedSection } from '@/lib/api/contracts';

interface SocialFeedProps {
  section: SocialFeedSection;
}

export function SocialFeed({ section }: Readonly<SocialFeedProps>) {
  const locale = useLocale();
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  });

  return (
    <section className="flex justify-center overflow-x-hidden bg-off-white py-10 sm:py-12">
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
        <Swiper
          slidesPerView='auto'
          spaceBetween={24}
          grabCursor
          className="w-full overflow-hidden"
        >
          {section.posts.map((post) => (
            <SwiperSlide
              key={post.id}
              className="w-[calc(100vw-2.5rem)] max-w-62.5 sm:w-62.5"
            >
              <Link
                href={post.permalink}
                className="flex w-full flex-col gap-3"
              >
                <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-sm">
                  {post.media_type === "VIDEO" ? (
                    <video
                      src={post.media_url}
                      muted
                      playsInline
                      preload='metadata'
                      className='h-full w-full object-cover'
                      style={{ opacity: post.opacity ?? 1 }}
                    />
                  ) : (
                    <Image
                      src={post.media_url}
                      alt={post.caption}
                      fill
                      className='object-cover'
                      style={{ opacity: post.opacity ?? 1 }}
                    />
                  )}
                </div>
                <div className='flex flex-col gap-1'>
                  <span className='text-2xs font-sans-condensed font-semibold uppercase text-muted-foreground'>
                    @{post.username}
                  </span>
                  <span className='text-sm text-foreground'>
                    {post.caption}
                  </span>
                  <time
                    dateTime={post.timestamp}
                    className='text-2xs text-muted-foreground'
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
