"use client";

import type { ProductCardItem } from "@/api/stetsom/model";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
import { SectionLabel } from "@/components/ui/section-label";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo, useState } from "react";
import { FeaturedTabStrip } from "./featured-tab-strip";

type FeaturedTab = {
  id: string;
  label: string;
  categorySlug?: string;
};

type FeaturedSection = {
  label: string;
  title: string;
  spotlightTitle?: string;
  ctaHref: string;
  ctaLabel: string;
};

interface FeaturedProductsProps {
  featuredProducts: ProductCardItem[];
  spotlightProduct: ProductCardItem;
  tabs: FeaturedTab[];
  section: FeaturedSection;
}

export function FeaturedProducts({
  featuredProducts,
  spotlightProduct,
  tabs,
  section,
}: Readonly<FeaturedProductsProps>) {
  const t = useTranslations("Catalog");
  const [activeTab, setActiveTab] = useState<FeaturedTab>(
    tabs[0] ?? { id: "tab-all", label: t("allCategories") },
  );

  const filteredProducts = useMemo(() => {
    if (!activeTab.categorySlug) {
      return featuredProducts;
    }

    return featuredProducts.filter(
      (product) => product.category === activeTab.label,
    );
  }, [activeTab, featuredProducts]);

  return (
    <section className="flex w-full justify-center bg-background pt-12 pb-24">
      <Container>
        <div className="mb-6 sm:mb-8">
          <div className="hidden items-stretch justify-between gap-6 lg:flex">
            <div className="max-w-80">
              <SectionLabel
                label={section.label}
                title={section.title}
                className=""
              />
            </div>

            <div className="flex flex-1 items-end justify-end">
              <FeaturedTabStrip
                tabs={tabs}
                activeTab={activeTab}
                onSelect={setActiveTab}
                ctaHref={section.ctaHref}
                ctaLabel={section.ctaLabel}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:hidden">
            <SectionLabel
              label={section.label}
              title={section.title}
              className="max-w-80"
            />

            <div className="flex items-center justify-between">
              <FeaturedTabStrip
                tabs={tabs}
                activeTab={activeTab}
                onSelect={setActiveTab}
                ctaHref={section.ctaHref}
                ctaLabel={section.ctaLabel}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:flex lg:h-111.75">
          <Link
            href={spotlightProduct.href}
            className="relative flex aspect-square h-full items-center justify-center overflow-hidden rounded-2xl border border-border transition-colors hover:border-brand"
          >
            {spotlightProduct.thumbnail_url ? (
              <Image
                src={spotlightProduct.thumbnail_url}
                alt={spotlightProduct.name}
                width={620}
                height={620}
                className="h-full w-full object-contain"
              />
            ) : null}
            <div className="absolute right-0 bottom-0 left-0 px-4 pt-12 pb-4 sm:px-5">
              <div className="font-sans-condensed text-lg leading-tight font-black tracking-wider uppercase sm:text-xl lg:text-2xl">
                {spotlightProduct.name}
              </div>
            </div>
          </Link>
          <div className="grid h-full flex-1 grid-cols-2 grid-rows-2 gap-3 sm:gap-4 lg:gap-5">
            {filteredProducts.length === 0 ? (
              <p className="col-span-2 flex items-center justify-center py-12 text-sm text-muted-foreground">
                {t("emptyCategory")}
              </p>
            ) : (
              filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  name={p.name}
                  category={p.category}
                  variants={p.variants}
                  img={p.thumbnail_url ?? undefined}
                  href={p.href}
                />
              ))
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
