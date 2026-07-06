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
    <div className="mb-4 rounded border border-border bg-off-white p-4 lg:hidden">
      <p className="mb-3 font-sans-condensed text-xs font-black text-brand-dark uppercase">
        {t("categories")}
      </p>
      <div className="flex flex-wrap gap-2">
        {categoryOptions.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => onCategoryChange(cat.slug)}
            className={cn(
              "border px-3 py-1 font-sans text-sm transition-colors",
              activeCategory === cat.slug
                ? "border-brand-dark bg-brand-dark text-white"
                : "border-border bg-white text-muted-foreground hover:border-muted-foreground",
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
