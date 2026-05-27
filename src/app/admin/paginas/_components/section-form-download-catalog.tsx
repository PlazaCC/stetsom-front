"use client";

import type { PageSection } from "@/lib/api/contracts";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface DownloadCategory {
  id: string;
  label: string;
}

interface DownloadCatalogData {
  label?: string;
  title?: string;
  description?: string;
  categories?: DownloadCategory[];
}

interface Props {
  section: PageSection;
  onChange: (data: Record<string, unknown>) => void;
}

export function SectionFormDownloadCatalog({ section, onChange }: Props) {
  const raw = section.data as DownloadCatalogData;
  const [data, setData] = useState<DownloadCatalogData>(raw);

  function updateRoot(patch: Partial<DownloadCatalogData>) {
    const next = { ...data, ...patch };
    setData(next);
    onChange(next as Record<string, unknown>);
  }

  function updateCategory(idx: number, patch: Partial<DownloadCategory>) {
    const next = (data.categories ?? []).map((c, i) =>
      i === idx ? { ...c, ...patch } : c,
    );
    updateRoot({ categories: next });
  }

  function addCategory() {
    const next = [
      ...(data.categories ?? []),
      { id: crypto.randomUUID(), label: "" },
    ];
    updateRoot({ categories: next });
  }

  function removeCategory(idx: number) {
    updateRoot({
      categories: (data.categories ?? []).filter((_, i) => i !== idx),
    });
  }

  return (
    <div className="space-y-4">
      {/* Textos */}
      <div className="rounded-[12px] border border-border bg-card p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Cabeçalho
        </p>
        <FieldGroup label="Label / Eyebrow">
          <input
            type="text"
            value={data.label ?? ""}
            onChange={(e) => updateRoot({ label: e.target.value })}
            placeholder="ex: Materiais Técnicos"
            className={inputClass}
          />
        </FieldGroup>
        <FieldGroup label="Título">
          <input
            type="text"
            value={data.title ?? ""}
            onChange={(e) => updateRoot({ title: e.target.value })}
            placeholder="ex: Downloads"
            className={inputClass}
          />
        </FieldGroup>
        <FieldGroup label="Descrição">
          <textarea
            rows={2}
            value={data.description ?? ""}
            onChange={(e) => updateRoot({ description: e.target.value })}
            placeholder="Manuais, catálogos e certificados disponíveis para download."
            className={cn(inputClass, "h-auto py-2")}
          />
        </FieldGroup>
      </div>

      {/* Categorias de filtro */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">
            Categorias de filtro ({(data.categories ?? []).length})
          </p>
          <p className="text-xs text-muted-foreground">
            Os arquivos são carregados da biblioteca automaticamente e filtrados
            por tipo.
          </p>
        </div>
        <button
          type="button"
          onClick={addCategory}
          className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Plus className="size-3.5" />
          Adicionar categoria
        </button>
      </div>

      {(data.categories ?? []).length === 0 && (
        <div className="rounded-[12px] border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhuma categoria de filtro configurada.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {(data.categories ?? []).map((cat, idx) => (
          <div
            key={cat.id}
            className="flex items-end gap-3 rounded-[12px] border border-border bg-card px-4 py-3"
          >
            <div className="flex-1 space-y-1">
              <label className="block text-xs font-medium text-muted-foreground">
                Nome da categoria
              </label>
              <input
                type="text"
                value={cat.label}
                onChange={(e) => updateCategory(idx, { label: e.target.value })}
                placeholder="ex: Manuais"
                className={inputClass}
              />
            </div>
            <button
              type="button"
              onClick={() => removeCategory(idx)}
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

function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass = cn(
  "h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground",
  "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-brand",
);
