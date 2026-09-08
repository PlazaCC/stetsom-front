"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { CatalogFilterFieldsProps } from "./catalog-filter-fields";
import { CatalogFilterFields } from "./catalog-filter-fields";

interface CatalogMobileFilterSheetProps extends Omit<
  CatalogFilterFieldsProps,
  "onClose"
> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClear: () => void;
}

export function CatalogMobileFilterSheet({
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
}: CatalogMobileFilterSheetProps) {
  const t = useTranslations("Catalog");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="flex max-h-[85vh] flex-col gap-0 rounded-t-xl p-0"
        showCloseButton={false}
      >
        <SheetHeader className="flex flex-row items-center justify-between border-b border-border px-4 py-1">
          <SheetTitle className="font-sans text-base font-bold text-foreground">
            {t("filters")}
          </SheetTitle>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onClear();
                onOpenChange(false);
              }}
              className="font-sans text-sm font-light text-muted-foreground underline-offset-2 hover:text-brand hover:underline"
            >
              {t("clearAll")}
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <XIcon size={16} />
              <span className="sr-only">Close</span>
            </button>
          </div>
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
