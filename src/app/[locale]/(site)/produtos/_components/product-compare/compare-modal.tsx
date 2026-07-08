"use client";

import type { ProductCardItem } from "@/api/stetsom/model";
import { useCompareContext } from "./compare-provider";
import { CompareCollapsed } from "./compare-collapsed";
import { CompareExpanded } from "./compare-expanded";

interface CompareModalProps {
  /** Map of slug → ProductCardItem for lookup */
  catalogMap: Map<string, ProductCardItem>;
}

export function CompareModal({ catalogMap }: CompareModalProps) {
  const { mode } = useCompareContext();

  if (mode === "idle") return null;

  if (mode === "comparing") {
    return <CompareExpanded catalogMap={catalogMap} />;
  }

  // mode === "selecting"
  return <CompareCollapsed catalogMap={catalogMap} />;
}
