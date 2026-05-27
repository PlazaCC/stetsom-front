"use client";

import type { PageSection } from "@/lib/api/contracts";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface StatItem {
  value: string;
  label: string;
}

interface StatsData {
  stats: StatItem[];
}

interface Props {
  section: PageSection;
  onChange: (data: Record<string, unknown>) => void;
}

export function SectionFormStats({ section, onChange }: Props) {
  const raw = section.data as unknown as StatsData;
  const [stats, setStats] = useState<StatItem[]>(raw.stats ?? []);

  function update(next: StatItem[]) {
    setStats(next);
    onChange({ stats: next });
  }

  function updateStat(idx: number, patch: Partial<StatItem>) {
    update(stats.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  }

  function addStat() {
    update([...stats, { value: "", label: "" }]);
  }

  function removeStat(idx: number) {
    update(stats.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          Números ({stats.length})
        </p>
        <button
          type="button"
          onClick={addStat}
          className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Plus className="size-3.5" />
          Adicionar número
        </button>
      </div>

      {stats.length === 0 && (
        <div className="rounded-[12px] border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum número cadastrado.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex items-end gap-3 rounded-[12px] border border-border bg-card px-4 py-3"
          >
            <div className="flex-1 space-y-1">
              <label className="block text-xs font-medium text-muted-foreground">
                Valor
              </label>
              <input
                type="text"
                value={stat.value}
                onChange={(e) => updateStat(idx, { value: e.target.value })}
                placeholder="ex: 35+"
                className={inputClass}
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="block text-xs font-medium text-muted-foreground">
                Label
              </label>
              <input
                type="text"
                value={stat.label}
                onChange={(e) => updateStat(idx, { label: e.target.value })}
                placeholder="ex: Anos de história"
                className={inputClass}
              />
            </div>
            <button
              type="button"
              onClick={() => removeStat(idx)}
              className="mb-0.5 flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Os números aparecem em linha na página pública. Recomendado: 4 itens.
      </p>
    </div>
  );
}

const inputClass = cn(
  "h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground",
  "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-brand",
);
