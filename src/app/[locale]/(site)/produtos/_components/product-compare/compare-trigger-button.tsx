"use client";

import { cn } from "@/lib/utils";
import { GitCompareArrows } from "lucide-react";
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
 */
export function CompareTriggerButton({ className }: CompareTriggerButtonProps) {
  const t = useTranslations("Catalog");
  const { enterCompareMode, mode } = useCompareContext();

  if (mode !== "idle") return null;

  return (
    <Button
      variant="brand-outline"
      onClick={() => enterCompareMode()}
      className={cn("h-9 shrink-0 gap-2 rounded-sm px-3 text-sm", className)}
    >
      <GitCompareArrows size={16} />
      {t("compare")}
    </Button>
  );
}
