"use client";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CategoryOption {
  name: string;
  slug: string;
}

interface CategoryIcon {
  src: string;
  width: number;
  height: number;
}

const CATEGORY_ICONS: Record<string, CategoryIcon> = {
  todos: { src: "/star.svg", width: 32, height: 32 },
  amplificadores: { src: "/amplifier.svg", width: 89, height: 66 },
  processadores: { src: "/processor.svg", width: 107, height: 64 },
  crossovers: { src: "/crossover.svg", width: 93, height: 63 },
};

const DEFAULT_CATEGORY_ICON: CategoryIcon = {
  src: "/layout-dashboard.svg",
  width: 67,
  height: 67,
};

interface CatalogCategoryBarProps {
  categories: CategoryOption[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
}

export function CatalogCategoryBar({
  categories,
  activeCategory,
  onCategoryChange,
}: CatalogCategoryBarProps) {
  return (
    <section className="border-b border-border bg-white py-6">
      <Container className="scrollbar-none overflow-x-auto">
        <div className="flex w-max gap-5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            const icon = CATEGORY_ICONS[cat.slug] ?? DEFAULT_CATEGORY_ICON;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => onCategoryChange(cat.slug)}
                className={cn(
                  "flex size-30.75 shrink-0 flex-col items-center justify-center gap-3 rounded-[12px] border px-2 py-3 text-center transition-colors",
                  isActive
                    ? "border-brand bg-brand/20"
                    : "border-zinc-700 hover:bg-muted",
                )}
              >
                <span className="flex h-16.75 w-full items-center justify-center">
                  <Image
                    src={icon.src}
                    alt=""
                    width={icon.width}
                    height={icon.height}
                    className="h-auto max-h-16.75 w-auto max-w-full object-contain"
                  />
                </span>
                <span
                  className={cn(
                    "font-sans text-base leading-tight font-medium whitespace-nowrap",
                    isActive ? "text-brand" : "text-brand-dark",
                  )}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
