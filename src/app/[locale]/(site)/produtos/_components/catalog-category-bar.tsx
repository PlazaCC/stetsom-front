"use client";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

interface CategoryOption {
  name: string;
  slug: string;
}

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
        <div className="flex w-max gap-2.5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => onCategoryChange(cat.slug)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-center transition-colors",
                  isActive ? "bg-brand/10" : "hover:bg-muted",
                )}
              >
                <div
                  className={cn(
                    "flex size-20 items-center justify-center overflow-hidden rounded-lg",
                    isActive ? "bg-brand/10" : "bg-muted",
                  )}
                >
                  <span className="font-sans-condensed text-2xs font-black text-muted-foreground uppercase">
                    {cat.name.slice(0, 2)}
                  </span>
                </div>
                <span
                  className={cn(
                    "font-sans text-2xs leading-tight font-medium whitespace-nowrap",
                    isActive ? "text-brand" : "text-muted-foreground",
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
