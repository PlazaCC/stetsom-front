"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { A11y, Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

type HeroBannerSlide = {
  id: string;
  desktopImage: string;
  mobileImage?: string;
  alt?: string;
  href?: string;
};

const AUTOPLAY_INTERVAL_MS = 5000;
const HERO_HEIGHT_CLASS = "h-130 sm:h-155 lg:h-175";

const STUB_BANNERS: HeroBannerSlide[] = [
  {
    id: "banner-1",
    desktopImage: "/produtos-hero.png",
    mobileImage: "/produtos-hero.png",
    alt: "Banner Stetsom 1",
  },
  {
    id: "banner-2",
    desktopImage: "/brand-image.png",
    mobileImage: "/brand-image.png",
    alt: "Banner Stetsom 2",
  },
  {
    id: "banner-3",
    desktopImage: "/about-bg.png",
    mobileImage: "/about-bg.png",
    alt: "Banner Stetsom 3",
  },
];

export default function HeroCarousel() {
  const slides = STUB_BANNERS;
  const safeSlides = slides;
  const shouldLoop = safeSlides.length > 1;
  const paginationRef = useRef<HTMLDivElement | null>(null);

  if (safeSlides.length === 0) {
    return (
      <div
        className={cn(
          "relative w-full overflow-hidden bg-[rgb(9,9,11)]",
          HERO_HEIGHT_CLASS,
        )}
      />
    );
  }

  return (
    <section
      className={cn(
        "hero-carousel relative w-full overflow-hidden bg-[rgb(9,9,11)]",
        HERO_HEIGHT_CLASS,
      )}
      aria-label="Banners principais"
    >
      <Swiper
        className="h-full w-full"
        modules={[Autoplay, Pagination, A11y]}
        onSwiper={(swiper) => {
          if (!paginationRef.current) return;

          swiper.params.pagination = {
            clickable: true,
            el: paginationRef.current,
            renderBullet: (index, className) =>
              `<button type=\"button\" class=\"${className}\" aria-label=\"Ir para banner ${index + 1}\"></button>`,
          };

          swiper.pagination.init();
          swiper.pagination.render();
          swiper.pagination.update();
        }}
        autoplay={
          shouldLoop
            ? {
                delay: AUTOPLAY_INTERVAL_MS,
                disableOnInteraction: false,
              }
            : false
        }
        loop={shouldLoop}
        pagination={{ clickable: true }}
      >
        {safeSlides.map((slide, index) => {
          const mobileSrc = slide.mobileImage ?? slide.desktopImage;

          const bannerContent = (
            <>
              <Image
                className="absolute inset-0 object-cover sm:hidden"
                src={mobileSrc}
                alt={slide.alt ?? "Banner Stetsom"}
                fill
                sizes="100vw"
                priority={index === 0}
              />
              <Image
                className="absolute inset-0 hidden object-cover sm:block"
                src={slide.desktopImage}
                alt={slide.alt ?? "Banner Stetsom"}
                fill
                sizes="100vw"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/35" />
            </>
          );

          return (
            <SwiperSlide key={slide.id}>
              {slide.href ? (
                <Link
                  href={slide.href}
                  className="relative block h-full w-full"
                  aria-label={`Abrir banner ${index + 1}`}
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
      />
    </section>
  );
}
