"use client";

import { Container } from "@/components/ui/container";
import { useTranslations } from "next-intl";

interface CatalogHeroProps {
  totalProducts: number;
}

export function CatalogHero({ totalProducts }: CatalogHeroProps) {
  const t = useTranslations("Catalog");

  return (
    <section className="relative h-72 overflow-hidden bg-brand-dark lg:h-84">
      <div className="bg-radial-dark absolute inset-0" />
      <div className="bg-gradient-fade-black absolute inset-0" />
      <Container className="relative z-10 ml-2 flex h-full flex-col justify-end pb-8 md:pb-12 lg:pb-16">
        <div className="mb-1 flex items-center gap-2">
          <div className="h-px w-6 shrink-0 bg-brand" />
          <span className="font-sans-condensed text-xs font-medium text-brand uppercase md:text-base">
            {t("heroLabel")}
          </span>
        </div>
        <h1 className="font-sans-condensed text-5xl leading-tight font-black text-white uppercase md:text-6xl md:leading-16 lg:text-[90px] lg:leading-18.5">
          {t("heroTitle")
            .split("\n")
            .map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
        </h1>
        <span className="mt-2 block text-xs text-text-subtle-dark md:text-base">
          {t("products", { count: totalProducts })}
        </span>
      </Container>
      <div className="pointer-events-none absolute -right-16 -bottom-16 font-sans-condensed text-display-2xl leading-none font-black text-watermark-text opacity-[0.08] select-none sm:text-[150px] lg:text-[263px]">
        PRODUTOS
      </div>
      <div className="absolute top-0 left-0 h-full w-3.5 lg:bg-brand" />
    </section>
  );
}
