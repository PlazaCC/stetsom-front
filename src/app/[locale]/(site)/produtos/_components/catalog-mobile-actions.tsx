"use client";

import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { CompareTriggerButton } from "./product-compare/compare-trigger-button";
import { useCompareContext } from "./product-compare/compare-provider";

interface CatalogMobileActionsProps {
  onToggleFilters: () => void;
}

export function CatalogMobileActions({
  onToggleFilters,
}: CatalogMobileActionsProps) {
  const t = useTranslations("Catalog");
  const { mode, exitCompareMode, selectedSlugs } = useCompareContext();

  if (mode !== "idle") {
    return (
      <div className="mb-4 flex gap-2 lg:hidden">
        <div className="flex h-10 flex-1 items-center gap-2 border border-border px-3 text-sm text-muted-foreground">
          <span className="font-sans-condensed text-xs font-bold text-brand uppercase">
            {t("compare")}
          </span>
          <span className="ml-auto text-2xs">
            {t("compareSelected", { count: selectedSlugs.length })}
          </span>
        </div>
        <button
          type="button"
          onClick={exitCompareMode}
          className="flex h-10 shrink-0 cursor-pointer items-center gap-1 border border-border px-3 text-xs text-muted-foreground transition-colors hover:text-brand-dark"
        >
          <X size={14} />
          {t("compareCancel")}
        </button>
      </div>
    );
  }

  return (
    <div className="mb-4 flex gap-2 lg:hidden">
      <CompareTriggerButton variant="mobile" className="flex-1" />
      <Button
        variant="outline"
        onClick={onToggleFilters}
        className="h-9 shrink-0 gap-2 rounded-sm px-3 text-sm"
      >
        <SlidersHorizontal size={14} />
        {t("filters")}
      </Button>
    </div>
  );
}
