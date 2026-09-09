"use client";

import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { CompareTriggerButton } from "./product-compare/compare-trigger-button";

interface CatalogDesktopActionsProps {
  onToggleFilters: () => void;
}

export function CatalogDesktopActions({
  onToggleFilters,
}: CatalogDesktopActionsProps) {
  const t = useTranslations("Catalog");

  return (
    <div className="mb-4 hidden items-center justify-between gap-3 lg:flex">
      <Button
        variant="outline"
        onClick={onToggleFilters}
        className="h-9 gap-2 rounded-sm px-3 text-sm"
      >
        <SlidersHorizontal size={14} />
        {t("filters")}
      </Button>
      <CompareTriggerButton />
    </div>
  );
}
