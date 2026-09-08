"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTranslations } from "next-intl";
import type { CatalogFilterFieldsProps } from "./catalog-filter-fields";
import { CatalogFilterFields } from "./catalog-filter-fields";

interface CatalogSidebarProps extends Omit<
  CatalogFilterFieldsProps,
  "onClose"
> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClear: () => void;
}

export function CatalogSidebar({
  open,
  onOpenChange,
  search,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  activeLine,
  onLineChange,
  sort,
  onSortChange,
  onClear,
  typeFilterOptions,
  productLines,
  showDiscontinued,
  onShowDiscontinuedChange,
  showExport,
  onShowExportChange,
}: CatalogSidebarProps) {
  const t = useTranslations("Catalog");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="flex w-90 max-w-[calc(100%-2rem)] gap-0 p-0"
      >
        <SheetHeader className="flex flex-row items-center justify-between border-b border-border px-4 py-3">
          <SheetTitle className="font-sans text-lg font-bold text-foreground">
            {t("filters")}
          </SheetTitle>
          <button
            type="button"
            onClick={() => {
              onClear();
              onOpenChange(false);
            }}
            className="mr-8 shrink-0 font-sans text-sm font-light underline-offset-2 hover:text-brand hover:underline"
          >
            {t("clearAll")}
          </button>
        </SheetHeader>

        <CatalogFilterFields
          search={search}
          onSearchChange={onSearchChange}
          onClose={() => onOpenChange(false)}
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
          activeLine={activeLine}
          onLineChange={onLineChange}
          sort={sort}
          onSortChange={onSortChange}
          typeFilterOptions={typeFilterOptions}
          productLines={productLines}
          showDiscontinued={showDiscontinued}
          onShowDiscontinuedChange={onShowDiscontinuedChange}
          showExport={showExport}
          onShowExportChange={onShowExportChange}
        />
      </SheetContent>
    </Sheet>
  );
}
