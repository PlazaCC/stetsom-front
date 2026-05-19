"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface CategoryOption {
  name: string;
  slug: string;
}

interface CatalogMobileFilterProps {
  categoryOptions: CategoryOption[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
}

export function CatalogMobileFilter({
  categoryOptions,
  activeCategory,
  onCategoryChange,
}: CatalogMobileFilterProps) {
  const t = useTranslations("Catalog");

  return (
    <div className="lg:hidden mb-4 border border-border rounded p-4 bg-off-white">
      <p className="font-sans-condensed font-black text-xs uppercase text-brand-dark mb-3">
        {t("categories")}
      </p>
      <div className="flex flex-wrap gap-2">
        {categoryOptions.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => onCategoryChange(cat.slug)}
            className={cn(
              "font-sans text-sm px-3 py-1 border transition-colors",
              activeCategory === cat.slug
                ? "bg-brand-dark text-white border-brand-dark"
                : "bg-white text-muted-foreground border-border hover:border-muted-foreground",
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
