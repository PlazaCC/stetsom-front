"use client";

import type { PageSection } from "./section-form-types";
import { cn } from "@/lib/utils";
import { GripVertical, Plus, X } from "lucide-react";
import { useState } from "react";

interface MilestonesData {
  items: string[];
}

interface Props {
  section: PageSection;
  onChange: (data: Record<string, unknown>) => void;
}

const inputClass = cn(
  "h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground font-sans-condensed uppercase",
  "placeholder:text-muted-foreground/60 placeholder:normal-case placeholder:font-sans focus:outline-none focus:ring-1 focus:ring-brand",
);

export function SectionFormMilestones({ section, onChange }: Props) {
  const raw = section.data as unknown as MilestonesData;
  const [items, setItems] = useState<string[]>(raw.items ?? []);
  const [newItem, setNewItem] = useState("");

  function update(next: string[]) {
    setItems(next);
    onChange({ items: next });
  }

  function addItem() {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    update([...items, trimmed.toUpperCase()]);
    setNewItem("");
  }

  function updateItem(idx: number, value: string) {
    update(items.map((item, i) => (i === idx ? value : item)));
  }

  function removeItem(idx: number) {
    update(items.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Estes textos aparecem em marquee (correndo) horizontalmente na página.
        Use caixa alta.
      </p>

      <div className="rounded-[12px] border border-border bg-card p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Marcos ({items.length})
        </p>

        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhum marco cadastrado.
          </p>
        )}

        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <GripVertical className="size-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem(idx, e.target.value.toUpperCase())}
                className={cn(inputClass, "flex-1")}
              />
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="NOVO MARCO (pressione Enter para adicionar)"
            className={cn(inputClass, "flex-1")}
          />
          <button
            type="button"
            onClick={addItem}
            disabled={!newItem.trim()}
            className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-muted disabled:opacity-40"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
