"use client";

import { ProductCard } from "@/components/ui/product-card";
import { SectionLabel } from "@/components/ui/section-label";
import type { ProductCardItem } from "@/lib/api/contracts";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

interface RelatedProductsCarouselProps {
  label: string;
  title: string;
  products: ProductCardItem[];
  emptyLabel: string;
}

export function RelatedProductsCarousel({
  label,
  title,
  products,
  emptyLabel,
}: RelatedProductsCarouselProps) {
  return (
    <div>
      <SectionLabel label={label} title={title} />
      {products.length > 0 ? (
        <div className="mt-6">
          <Swiper
            slidesPerView="auto"
            spaceBetween={12}
            grabCursor
            breakpoints={{
              768: { spaceBetween: 16 },
              1024: { spaceBetween: 20 },
            }}
            className="related-products-carousel w-full"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id} className="h-auto w-auto">
                <ProductCard
                  name={product.name}
                  category={product.category}
                  variations={product.variations}
                  img={product.img}
                  href={product.href}
                  className="w-60 sm:w-64 lg:w-70"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <p className="mt-6 text-base text-text-subtle">{emptyLabel}</p>
      )}
    </div>
  );
}
