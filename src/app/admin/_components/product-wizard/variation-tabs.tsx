"use client";

import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import type { WizardVariation } from "./wizard-store";

interface VariationTabsProps {
  variations: WizardVariation[];
  activeId: string;
  onSelect: (id: string) => void;
  onRename: (id: string, label: string) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}

/** Segmented variation control: "1 Ohm", "2 Ohm", "+". The active tab is editable. */
export function VariationTabs({
  variations,
  activeId,
  onSelect,
  onRename,
  onRemove,
  onAdd,
}: VariationTabsProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-md bg-muted p-1">
      {variations.map((v) => {
        const active = v.id === activeId;
        return (
          <div
            key={v.id}
            className={cn(
              "flex items-center gap-1 rounded px-1 transition-colors",
              active ? "bg-card shadow-cms-card" : "",
            )}
          >
            {active ? (
              <input
                value={v.label}
                onChange={(e) => onRename(v.id, e.target.value)}
                className="w-16 bg-transparent px-1 py-1 text-sm font-medium text-foreground outline-none"
                aria-label="Nome da variação"
              />
            ) : (
              <button
                type="button"
                onClick={() => onSelect(v.id)}
                className="px-2 py-1 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {v.label}
              </button>
            )}
            {active && variations.length > 1 && (
              <button
                type="button"
                aria-label="Remover variação"
                onClick={() => onRemove(v.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        );
      })}
      <button
        type="button"
        aria-label="Adicionar variação"
        onClick={onAdd}
        className="flex items-center justify-center rounded px-2 py-1 text-muted-foreground hover:bg-card hover:text-foreground"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
