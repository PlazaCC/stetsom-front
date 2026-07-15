"use client";

import type { HeroBannerSlide } from "@/api/stetsom/model";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { AudioLines } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { A11y, Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const HERO_HEIGHT_CLASS = "h-130 sm:h-155 lg:h-200";

interface HeroCarouselProps {
  slides: HeroBannerSlide[];
}

export default function HeroCarousel({ slides }: Readonly<HeroCarouselProps>) {
  const t = useTranslations("HeroCarousel");
  const shouldLoop = slides.length > 1;
  const paginationRef = useRef<HTMLDivElement | null>(null);
  const interval = 5000;
  const effectEnabled = false;
  const modules = effectEnabled
    ? [Autoplay, Pagination, A11y, EffectFade]
    : [Autoplay, Pagination, A11y];

  if (slides.length === 0) {
    return (
      <section
        className={cn(
          "relative flex w-full items-center justify-center overflow-hidden bg-brand-dark px-6 text-center",
          HERO_HEIGHT_CLASS,
        )}
        aria-label={t("bannerLabel")}
      >
        <div className="absolute inset-0 bg-linear-to-br from-brand-dark via-brand-dark to-brand/35" />
        <div className="absolute top-1/2 left-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 sm:size-140" />
        <div className="relative z-10 flex max-w-xl flex-col items-center">
          <AudioLines className="size-16 text-brand" aria-hidden="true" />
          <h1 className="mt-6 font-sans-condensed text-4xl leading-none font-black text-white uppercase sm:text-display-sm">
            {t("fallbackTitle")}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
            {t("fallbackDescription")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "hero-carousel relative w-full overflow-hidden bg-brand-dark",
        HERO_HEIGHT_CLASS,
      )}
      aria-label={t("bannerLabel")}
    >
      <Swiper
        className="h-full w-full"
        effect={effectEnabled ? "fade" : undefined}
        modules={modules}
        onSwiper={(swiper) => {
          if (!paginationRef.current) return;

          swiper.params.pagination = {
            clickable: true,
            el: paginationRef.current,
            renderBullet: (index, className) =>
              `<button type="button" class="${className}" aria-label="${t("goToBanner", { index: index + 1 })}"></button>`,
          };

          swiper.pagination.init();
          swiper.pagination.render();
          swiper.pagination.update();
        }}
        autoplay={
          shouldLoop
            ? {
                delay: interval,
                disableOnInteraction: false,
              }
            : false
        }
        loop={shouldLoop}
        pagination={{ clickable: true }}
      >
        {slides.map((slide, index) => {
          const mobileSrc = slide.mobile_image_url ?? slide.desktop_image_url;

          const bannerContent = (
            <>
              <Image
                className="absolute inset-0 object-cover sm:hidden"
                src={mobileSrc}
                alt="Banner Stetsom"
                fill
                sizes="100vw"
                priority={index === 0}
              />
              <Image
                className="absolute inset-0 hidden object-cover sm:block"
                src={slide.desktop_image_url}
                alt="Banner Stetsom"
                fill
                sizes="100vw"
                priority={index === 0}
              />
              <div className="bg-gradient-fade-black absolute inset-0 z-10" />

              {(slide.label || slide.title) && (
                <div className="pointer-events-none absolute bottom-0 left-0 z-20 px-6 pb-12 sm:px-8 lg:px-42.5">
                  {slide.label && (
                    <p className="font-sans-condensed text-sm font-medium text-brand uppercase">
                      {slide.label}
                    </p>
                  )}

                  {slide.title && (
                    <h2
                      className={cn(
                        "font-sans-condensed text-3xl leading-none font-black whitespace-pre-line text-white uppercase sm:text-display-sm",
                        slide.label ? "mt-2" : "mt-0",
                      )}
                    >
                      {slide.title}
                    </h2>
                  )}
                </div>
              )}
            </>
          );

          return (
            <SwiperSlide key={slide.id}>
              {slide.href ? (
                <Link
                  href={slide.href}
                  className="relative block h-full w-full"
                  aria-label={t("openBanner", { index: index + 1 })}
                >
                  {bannerContent}
                </Link>
              ) : (
                <div className="relative h-full w-full">{bannerContent}</div>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div
        ref={paginationRef}
        className="hero-carousel-pagination swiper-pagination absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 sm:bottom-7"
        style={
          {
            "--hero-bullet-duration": `${interval}ms`,
          } as React.CSSProperties
        }
      />
    </section>
  );
}
