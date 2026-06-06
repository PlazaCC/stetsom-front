"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface FilterChip {
  /** Stable key used for removal. */
  key: string;
  label: string;
}

interface FilterChipsProps {
  chips: FilterChip[];
  onRemove: (key: string) => void;
  className?: string;
}

/** Removable filter chips (e.g. "Amplificadores ✕", "Publicado ✕"). */
export function FilterChips({ chips, onRemove, className }: FilterChipsProps) {
  if (chips.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background"
        >
          {chip.label}
          <button
            type="button"
            aria-label={`Remover filtro ${chip.label}`}
            onClick={() => onRemove(chip.key)}
            className="text-background/70 transition-colors hover:text-background"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
    </div>
  );
}
