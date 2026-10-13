"use client";

import { cn } from "@/lib/utils";
import { GitCompareArrows, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCompareContext } from "./compare-provider";
import { Button } from "@/components/ui/button";

interface CompareTriggerButtonProps {
  className?: string;
}

/**
 * "Comparar" trigger for the catalog action bars. Sizing is intentionally
 * identical on mobile and desktop — compact and content-width (never stretched
 * across the row), so it does not balloon on tablet-sized screens.
 *
 * Doubles as a toggle: while a comparison is active it becomes a "close
 * comparison" action (label + icon).
 */
export function CompareTriggerButton({ className }: CompareTriggerButtonProps) {
  const t = useTranslations("Catalog");
  const { enterCompareMode, exitCompareMode, mode } = useCompareContext();

  const isActive = mode !== "idle";

  return (
    <Button
      variant="brand-outline"
      onClick={() => (isActive ? exitCompareMode() : enterCompareMode())}
      className={cn("h-9 shrink-0 gap-2 rounded-sm px-3 text-sm", className)}
    >
      {isActive ? <X size={16} /> : <GitCompareArrows size={16} />}
      {isActive ? t("compareClose") : t("compare")}
    </Button>
  );
}
