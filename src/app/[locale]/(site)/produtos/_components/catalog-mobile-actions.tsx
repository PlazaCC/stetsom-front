"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

interface CatalogMobileActionsProps {
  search: string;
  onSearchChange: (value: string) => void;
  onToggleFilters: () => void;
}

export function CatalogMobileActions({
  search,
  onSearchChange,
  onToggleFilters,
}: CatalogMobileActionsProps) {
  const t = useTranslations("Catalog");

  return (
    <div className="mb-4 flex gap-3 lg:hidden">
      <div className="flex h-10 flex-1 items-center gap-2 border border-border px-3">
        <Search size={14} className="shrink-0 text-icon-muted" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="flex-1 border-none bg-transparent text-sm text-brand-dark outline-none"
        />
      </div>
      <button
        type="button"
        onClick={onToggleFilters}
        className="flex h-10 items-center gap-2 border border-border px-3 text-sm text-muted-foreground"
      >
        <SlidersHorizontal size={14} />
        {t("filters")}
      </button>
    </div>
  );
}
