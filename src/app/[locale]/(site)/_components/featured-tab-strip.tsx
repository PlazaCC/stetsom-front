"use client";

import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import type { NoveltyCategory } from "./build-novelties-by-category";

interface FeaturedTabStripProps {
  categories: NoveltyCategory[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function FeaturedTabStrip({
  categories,
  activeIndex,
  onSelect,
}: Readonly<FeaturedTabStripProps>) {
  const t = useTranslations("Catalog");

  return (
    <Container className="flex scrollbar-none items-center justify-between gap-6 overflow-x-auto lg:gap-8">
      <div
        role="tablist"
        className="flex w-max shrink-0 items-center gap-6 lg:gap-8"
      >
        {categories.map((category, index) => {
          const isActive = index === activeIndex;
          const isNovelties = category.slug === "novidades";
          return (
            <motion.button
              type="button"
              key={category.slug}
              role="tab"
              onClick={() => onSelect(index)}
              aria-selected={isActive}
              layout
              transition={{ layout: { duration: 0.1 } }}
              className={cn(
                "relative shrink-0 px-0 pb-1 font-sans-condensed capitalize transition-[color,font-size,font-weight] duration-300",
                isNovelties
                  ? "text-lg font-normal lg:text-2xl"
                  : "text-base font-normal lg:text-lg",
                isActive
                  ? isNovelties
                    ? "font-semibold text-brand-dark"
                    : "font-semibold text-brand-dark"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <motion.span
                layout
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {category.name}
              </motion.span>
              <motion.span
                className="absolute inset-x-0 bottom-0 h-0.5 origin-center rounded-full bg-brand"
                initial={false}
                animate={{ scaleX: isActive ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </motion.button>
          );
        })}
      </div>
      <Link
        href="/produtos"
        className="flex shrink-0 items-center gap-2 pb-1 font-sans text-base font-semibold text-brand transition-colors hover:text-brand-dark"
      >
        {t("viewAll")}
        <ArrowRight className="size-5" aria-hidden="true" />
      </Link>
    </Container>
  );
}
