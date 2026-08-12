"use client";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
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
  return (
    <Container className="flex scrollbar-none overflow-x-auto">
      <div
        role="tablist"
        className="flex w-max items-center gap-6 lg:mx-auto lg:gap-8"
      >
        {categories.map((category, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              type="button"
              key={category.slug}
              role="tab"
              onClick={() => onSelect(index)}
              aria-selected={isActive}
              className={cn(
                "relative shrink-0 px-2 pb-1.5 font-sans-condensed text-base font-semibold uppercase transition-colors",
                isActive
                  ? "text-brand-dark"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {category.name}
              <motion.span
                className="absolute inset-x-0 bottom-0 h-0.5 origin-center rounded-full bg-brand"
                initial={false}
                animate={{ scaleX: isActive ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </button>
          );
        })}
      </div>
    </Container>
  );
}
