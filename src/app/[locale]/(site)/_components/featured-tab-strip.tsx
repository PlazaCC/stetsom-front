"use client";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
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
    <Container className="flex scrollbar-none justify-center overflow-x-auto">
      <div role="tablist" className="flex w-max items-center gap-6 lg:gap-8">
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
                "shrink-0 border-b-2 pb-3 font-sans-condensed text-sm font-bold tracking-wide uppercase transition-colors",
                isActive
                  ? "border-brand text-brand-dark"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </Container>
  );
}
