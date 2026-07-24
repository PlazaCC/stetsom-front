"use client";

import { cn } from "@/lib/utils";
import { GitCompareArrows } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCompareContext } from "./compare-provider";
import { Button } from "@/components/ui/button";

interface CompareTriggerButtonProps {
  className?: string;
  variant?: "sidebar" | "mobile";
}

export function CompareTriggerButton({
  className,
  variant = "sidebar",
}: CompareTriggerButtonProps) {
  const t = useTranslations("Catalog");
  const { enterCompareMode, mode } = useCompareContext();

  if (mode !== "idle") return null;

  return (
    <Button
      variant="brand-outline"
      size={variant === "sidebar" ? "md" : "default"}
      onClick={() => enterCompareMode()}
      className={cn(
        className,
        variant === "mobile" && "h-9 rounded-sm text-sm",
      )}
    >
      <GitCompareArrows size={variant === "sidebar" ? 18 : 14} />
      {t("compare")}
    </Button>
  );
}
