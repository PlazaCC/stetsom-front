"use client";

import { Container } from "@/components/ui/container";
import { PublicEmptyState } from "@/components/ui/public-empty-state";
import { PackageSearch } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import type { Swiper as SwiperClass } from "swiper";
import { A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import type { NoveltyCategory } from "./build-novelties-by-category";
import { FeaturedProductCard } from "./featured-product-card";
import { FeaturedTabStrip } from "./featured-tab-strip";

interface FeaturedProductsProps {
  categories: NoveltyCategory[];
}

export function FeaturedProducts({
  categories,
}: Readonly<FeaturedProductsProps>) {
  const t = useTranslations("Catalog");
  const swiperRef = useRef<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const categoriesKey = categories.map((category) => category.slug).join(",");
  const isEmpty = categories.length === 0;

  return (
    <section className="flex w-full flex-col gap-6 bg-background pt-12 pb-24 sm:gap-8">
      {!isEmpty && (
        <FeaturedTabStrip
          categories={categories}
          activeIndex={activeIndex}
          onSelect={(index) => swiperRef.current?.slideTo(index)}
        />
      )}

      <Container>
        {isEmpty ? (
          <PublicEmptyState
            icon={PackageSearch}
            title={t("emptyCatalogTitle")}
            description={t("emptyCatalogDescription")}
            className="min-h-180 rounded-2xl sm:min-h-300 lg:min-h-111.75"
          />
        ) : (
          <Swiper
            key={categoriesKey}
            modules={[A11y]}
            slidesPerView={1}
            spaceBetween={0}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setActiveIndex(swiper.activeIndex);
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          >
            {categories.map((category) => (
              <SwiperSlide key={category.slug}>
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-8">
                  <FeaturedProductCard
                    product={category.spotlight}
                    variant="spotlight"
                  />
                  <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                    {category.grid.map((product) => (
                      <FeaturedProductCard
                        key={product.id}
                        product={product}
                        variant="grid"
                      />
                    ))}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Container>
    </section>
  );
}
