"use client";

import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { CompareTriggerButton } from "./product-compare/compare-trigger-button";

interface CatalogMobileActionsProps {
  onToggleFilters: () => void;
}

export function CatalogMobileActions({
  onToggleFilters,
}: CatalogMobileActionsProps) {
  const t = useTranslations("Catalog");

  return (
    <div className="mb-4 flex items-center justify-between gap-2 lg:hidden">
      <Button
        variant="outline"
        onClick={onToggleFilters}
        className="h-9 shrink-0 gap-2 rounded-sm px-3 text-sm"
      >
        <SlidersHorizontal size={14} />
        {t("filters")}
      </Button>
      <CompareTriggerButton />
    </div>
  );
}
