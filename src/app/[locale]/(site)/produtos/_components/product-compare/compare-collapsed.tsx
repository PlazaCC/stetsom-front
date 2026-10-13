"use client";

import type { ProductCardItem } from "@/api/stetsom/model";
import { cn } from "@/lib/utils";
import { GitCompareArrows, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect } from "react";
import { useCompareContext } from "./compare-provider";
import { Button } from "@/components/ui/button";

interface CompareCollapsedProps {
  /** Map of slug → ProductCardItem for lookup */
  catalogMap: Map<string, ProductCardItem>;
}

export function CompareCollapsed({ catalogMap }: CompareCollapsedProps) {
  const t = useTranslations("Catalog");
  const {
    selectedSlugs,
    selectedCategory,
    blockedReason,
    removeProduct,
    exitCompareMode,
    clearBlocked,
  } = useCompareContext();

  // Auto-dismiss the same-category violation notice after a short delay.
  useEffect(() => {
    if (blockedReason !== "different-category") return;
    const id = setTimeout(clearBlocked, 3000);
    return () => clearTimeout(id);
  }, [blockedReason, clearBlocked]);

  const selectedItems = selectedSlugs
    .map((slug) => catalogMap.get(slug))
    .filter(Boolean) as ProductCardItem[];

  return (
    <div className="pointer-events-none fixed top-0 right-0 left-0 z-[60] flex justify-center">
      <div className="pointer-events-auto mx-4 mt-4 w-full max-w-xl rounded-lg border border-border bg-white p-4 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompareArrows size={18} className="text-brand" />
            <span className="font-sans-condensed text-sm font-black text-brand-dark uppercase">
              {t("compare")}
            </span>
          </div>
          <Button variant="ghost" size="xs" onClick={exitCompareMode}>
            <X size={14} />
            {t("compareClose")}
          </Button>
        </div>

        {/* Count indicator + instruction */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2">
            {[0, 1].map((i) => (
              <div
                key={i}
                className={cn(
                  "flex h-2 flex-1 rounded-full transition-colors",
                  i < selectedSlugs.length ? "bg-brand" : "bg-muted",
                )}
              />
            ))}
            <span className="font-sans text-2xs font-medium whitespace-nowrap text-muted-foreground">
              {t("compareSelected", { count: selectedSlugs.length })}
            </span>
          </div>
          <span className="font-sans text-2xs text-text-subtle">
            {selectedSlugs.length === 0
              ? t("compareInstruction")
              : selectedCategory
                ? t("compareSameCategoryHint", { category: selectedCategory })
                : t("compareInstructionSecond")}
          </span>
        </div>

        {/* Same-category violation notice */}
        {blockedReason === "different-category" && (
          <p className="mt-3 rounded-md border border-brand/30 bg-brand/10 px-3 py-2 font-sans text-2xs font-medium text-brand">
            {t("compareDifferentCategory")}
          </p>
        )}

        {/* Mini previews of already-selected products */}
        {selectedItems.length > 0 && (
          <div className="mt-3 flex gap-2">
            {selectedItems.map((item) => (
              <div
                key={item.slug}
                className="flex flex-1 items-center gap-2 rounded-md border border-border bg-card p-2"
              >
                {item.thumbnail_url ? (
                  <Image
                    src={item.thumbnail_url}
                    alt={item.name}
                    width={36}
                    height={36}
                    className="h-9 w-9 shrink-0 rounded object-contain"
                  />
                ) : (
                  <div className="h-9 w-9 shrink-0 rounded bg-muted" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-sans-condensed text-xs leading-tight font-bold text-brand-dark uppercase">
                    {item.name}
                  </p>
                  <p className="font-sans text-2xs text-muted-foreground">
                    {item.category}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => removeProduct(item.slug)}
                  title={t("compareRemove")}
                  className="shrink-0"
                >
                  <X size={12} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
