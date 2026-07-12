"use client";

import type { ProductCardItem } from "@/api/stetsom/model";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCompareContext } from "./compare-provider";
import { CompareCollapsed } from "./compare-collapsed";
import { CompareExpanded } from "./compare-expanded";

interface CompareModalProps {
  /** Map of slug → ProductCardItem for lookup */
  catalogMap: Map<string, ProductCardItem>;
}

export function CompareModal({ catalogMap }: CompareModalProps) {
  const { mode, exitCompareMode } = useCompareContext();

  if (mode === "idle") return null;

  if (mode === "comparing") {
    return (
      <Dialog open onOpenChange={(open) => !open && exitCompareMode()}>
        <DialogContent
          showCloseButton={false}
          className="max-w-[calc(100%-1rem)] p-0 sm:max-w-5xl"
        >
          <CompareExpanded catalogMap={catalogMap} />
        </DialogContent>
      </Dialog>
    );
  }

  // mode === "selecting"
  return <CompareCollapsed catalogMap={catalogMap} />;
}
