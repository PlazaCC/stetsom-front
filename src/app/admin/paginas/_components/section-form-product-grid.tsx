"use client";

import type { PageSection } from "@/lib/api/contracts";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { FieldGroup, inputClass, EmptyState } from "./form-utils";

interface ProductTab {
  id: string;
  label: string;
  categorySlug?: string;
}

interface ProductGridData {
  label?: string;
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
  tabs?: ProductTab[];
}

interface Props {
  section: PageSection;
  onChange: (data: Record<string, unknown>) => void;
}

export function SectionFormProductGrid({ section, onChange }: Props) {
  const raw = section.data as ProductGridData;
  const [data, setData] = useState<ProductGridData>(raw);

  function updateRoot(patch: Partial<ProductGridData>) {
    const next = { ...data, ...patch };
    setData(next);
    onChange(next as Record<string, unknown>);
  }

  function updateTab(idx: number, patch: Partial<ProductTab>) {
    const next = (data.tabs ?? []).map((t, i) =>
      i === idx ? { ...t, ...patch } : t,
    );
    updateRoot({ tabs: next });
  }

  function addTab() {
    const next = [
      ...(data.tabs ?? []),
      { id: crypto.randomUUID(), label: "", categorySlug: "" },
    ];
    updateRoot({ tabs: next });
  }

  function removeTab(idx: number) {
    updateRoot({ tabs: (data.tabs ?? []).filter((_, i) => i !== idx) });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[12px] border border-border bg-card p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Cabeçalho
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <FieldGroup label="Label / Eyebrow">
            <input
              type="text"
              value={data.label ?? ""}
              onChange={(e) => updateRoot({ label: e.target.value })}
              placeholder="ex: Novidades"
              className={inputClass}
            />
          </FieldGroup>
          <FieldGroup label="Título">
            <input
              type="text"
              value={data.title ?? ""}
              onChange={(e) => updateRoot({ title: e.target.value })}
              placeholder="ex: Nossos Produtos"
              className={inputClass}
            />
          </FieldGroup>
          <FieldGroup label="Label do CTA">
            <input
              type="text"
              value={data.ctaLabel ?? ""}
              onChange={(e) => updateRoot({ ctaLabel: e.target.value })}
              placeholder="ex: Ver todos"
              className={inputClass}
            />
          </FieldGroup>
          <FieldGroup label="Link do CTA">
            <input
              type="text"
              value={data.ctaHref ?? ""}
              onChange={(e) => updateRoot({ ctaHref: e.target.value })}
              placeholder="/produtos"
              className={inputClass}
            />
          </FieldGroup>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">
            Abas de filtro ({(data.tabs ?? []).length})
          </p>
          <p className="text-xs text-muted-foreground">
            A primeira aba sem categorySlug é a aba &quot;Todos&quot;.
          </p>
        </div>
        <button
          type="button"
          onClick={addTab}
          className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Plus className="size-3.5" />
          Adicionar aba
        </button>
      </div>

      {(data.tabs ?? []).length === 0 && (
        <EmptyState
          title="Nenhuma aba configurada."
          description='Clique em "Adicionar aba" para começar.'
        />
      )}

      <div className="space-y-2">
        {(data.tabs ?? []).map((tab, idx) => (
          <div
            key={tab.id}
            className="flex items-end gap-3 rounded-[12px] border border-border bg-card px-4 py-3"
          >
            <FieldGroup label="Label da aba" className="flex-1">
              <input
                type="text"
                value={tab.label}
                onChange={(e) => updateTab(idx, { label: e.target.value })}
                placeholder="ex: Amplificadores"
                className={inputClass}
              />
            </FieldGroup>
            <FieldGroup
              label="Slug da categoria (vazio = Todos)"
              className="flex-1"
            >
              <input
                type="text"
                value={tab.categorySlug ?? ""}
                onChange={(e) =>
                  updateTab(idx, { categorySlug: e.target.value || undefined })
                }
                placeholder="ex: amplificadores"
                className={inputClass}
              />
            </FieldGroup>
            <button
              type="button"
              onClick={() => removeTab(idx)}
              className="mb-0.5 flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
