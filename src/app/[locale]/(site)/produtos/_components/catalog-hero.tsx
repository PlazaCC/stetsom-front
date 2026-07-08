"use client";

import { Container } from "@/components/ui/container";
import { useTranslations } from "next-intl";

interface CatalogHeroProps {
  totalProducts: number;
}

export function CatalogHero({ totalProducts }: CatalogHeroProps) {
  const t = useTranslations("Catalog");

  return (
    <section className="relative h-84 overflow-hidden bg-brand-dark">
      <div className="bg-radial-dark absolute inset-0" />
      <div className="bg-gradient-fade-black absolute inset-0" />
      <Container className="relative z-10 mx-auto flex h-full max-w-360 flex-col justify-end pb-4 md:flex-row md:items-end md:justify-between md:pb-16">
        <div className="py-4">
          <div className="mb-1 flex items-center gap-2">
            <div className="h-px w-6 shrink-0 bg-brand" />
            <span className="font-sans-condensed text-xs font-medium text-brand uppercase md:text-base">
              {t("heroLabel")}
            </span>
          </div>
          <h1 className="font-sans-condensed text-6xl font-black text-white uppercase md:text-6xl md:text-[90px] md:leading-18.5">
            {t("heroTitle")
              .split("\n")
              .map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
          </h1>
        </div>
        <div className="flex justify-end">
          <span className="mt-2 block text-base text-text-subtle-dark uppercase md:text-base">
            {t.rich("products", {
              count: totalProducts,
              number: (chunks) => (
                <strong className="text-4xl font-bold text-white">
                  {chunks}
                </strong>
              ),
              label: (chunks) => <span>{chunks}</span>,
            })}
          </span>
        </div>
      </Container>
      <div className="pointer-events-none absolute -right-18 -bottom-2 font-sans-condensed text-display-2xl leading-none font-black text-watermark-text opacity-[0.08] select-none md:-right-22 md:-bottom-16 md:text-[263px]">
        PRODUTOS
      </div>
      <div className="absolute top-0 left-0 h-full w-3.5 lg:bg-brand" />
    </section>
  );
}
