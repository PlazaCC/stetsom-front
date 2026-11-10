"use client";

import { cn } from "@/lib/utils";
import { AdminFieldError } from "@/app/admin/_components/crud/admin-field-error";
import { Plus, X } from "lucide-react";
import type { WizardVariation } from "./wizard-store";

interface VariationTabsProps {
  variations: WizardVariation[];
  activeId: string;
  onSelect: (id: string) => void;
  onRename: (id: string, label: string) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
  errors?: Record<string, string>;
  onClearError?: (path?: string) => void;
}

/** Segmented variation control: "1 Ohm", "2 Ohm", "+". The active tab is editable. */
export function VariationTabs({
  variations,
  activeId,
  onSelect,
  onRename,
  onRemove,
  onAdd,
  errors = {},
  onClearError,
}: VariationTabsProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-md bg-muted p-1">
      {variations.map((v) => {
        const active = v.id === activeId;
        const variationIndex = variations.indexOf(v);
        const errorCount = Object.keys(errors).filter((path) =>
          path.startsWith(`variants.${variationIndex}.`),
        ).length;
        return (
          <div
            key={v.id}
            className={cn(
              "flex items-center gap-1 rounded px-1 transition-colors",
              active ? "bg-card shadow-cms-card" : "",
            )}
            aria-invalid={errorCount > 0}
          >
            {active ? (
              <div>
                <input
                  value={v.label}
                  name={`variants.${variationIndex}.name`}
                  data-field-path={`variants.${variationIndex}.name`}
                  aria-invalid={Boolean(
                    errors[`variants.${variationIndex}.name`],
                  )}
                  required
                  onChange={(e) => {
                    onClearError?.(`variants.${variationIndex}.name`);
                    onRename(v.id, e.target.value);
                  }}
                  className="w-16 bg-transparent px-1 py-1 text-sm font-medium text-foreground outline-none"
                  aria-label="Nome da variação"
                />
                <AdminFieldError
                  id={`variants.${variationIndex}.name-error`}
                  message={errors[`variants.${variationIndex}.name`]}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onSelect(v.id)}
                className="px-2 py-1 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {v.label}
              </button>
            )}
            {errorCount > 0 ? (
              <span
                className="text-xs text-destructive"
                aria-label={`${errorCount} erros`}
              >
                •{errorCount}
              </span>
            ) : null}
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
