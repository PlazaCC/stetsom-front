"use client";

import { GitCompareArrows } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCompareContext } from "./compare-provider";
import { cn } from "@/lib/utils";

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
    <button
      type="button"
      onClick={() => enterCompareMode()}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 font-sans font-semibold uppercase transition-colors",
        variant === "sidebar" &&
          "h-11 w-full justify-center gap-2 rounded-sm border border-brand bg-brand px-4 text-button-md tracking-[0.8px] text-white hover:bg-brand/90",
        variant === "mobile" &&
          "h-10 shrink justify-center rounded-sm border border-brand bg-brand px-2.5 text-xs text-white hover:bg-brand/90",
        className,
      )}
    >
      <GitCompareArrows size={variant === "sidebar" ? 18 : 14} />
      {t("compare")}
    </button>
  );
}
