"use client";

import type { PageSection } from "./section-form-types";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { FieldGroup, inputClass, EmptyState } from "./form-utils";

interface Foundation {
  id: string;
  title: string;
  description: string;
}

interface FoundationsData {
  bases: Foundation[];
}

interface Props {
  section: PageSection;
  onChange: (data: Record<string, unknown>) => void;
}

export function SectionFormFoundations({ section, onChange }: Props) {
  const raw = section.data as unknown as FoundationsData;
  const [bases, setBases] = useState<Foundation[]>(raw.bases ?? []);

  function update(next: Foundation[]) {
    setBases(next);
    onChange({ bases: next });
  }

  function updateBase(idx: number, patch: Partial<Foundation>) {
    update(bases.map((b, i) => (i === idx ? { ...b, ...patch } : b)));
  }

  function addBase() {
    update([...bases, { id: crypto.randomUUID(), title: "", description: "" }]);
  }

  function removeBase(idx: number) {
    update(bases.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">
            Bases ({bases.length})
          </p>
          <p className="text-xs text-muted-foreground">
            Missão, Visão, Valores — ou customize conforme necessário.
          </p>
        </div>
        <button
          type="button"
          onClick={addBase}
          className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Plus className="size-3.5" />
          Adicionar base
        </button>
      </div>

      {bases.length === 0 && (
        <EmptyState
          title="Nenhuma base cadastrada."
          description='Clique em "Adicionar base" para começar.'
        />
      )}

      <div className="space-y-3">
        {bases.map((base, idx) => (
          <div
            key={base.id}
            className="rounded-[12px] border border-border bg-card p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                {base.title || `Base ${idx + 1}`}
              </p>
              <button
                type="button"
                onClick={() => removeBase(idx)}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
            <div className="space-y-3">
              <FieldGroup label="Título *">
                <input
                  type="text"
                  value={base.title}
                  onChange={(e) => updateBase(idx, { title: e.target.value })}
                  placeholder="ex: Missão"
                  className={inputClass}
                />
              </FieldGroup>
              <FieldGroup label="Descrição *">
                <textarea
                  rows={3}
                  value={base.description}
                  onChange={(e) =>
                    updateBase(idx, { description: e.target.value })
                  }
                  placeholder="Oferecer produtos de áudio automotivo de alta performance..."
                  className={cn(inputClass, "h-auto py-2")}
                />
              </FieldGroup>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
