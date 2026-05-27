"use client";

import type { PageSection } from "@/lib/api/contracts";
import { cn } from "@/lib/utils";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface ValueItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface ValuesData {
  label?: string;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  values: ValueItem[];
}

interface Props {
  section: PageSection;
  onChange: (data: Record<string, unknown>) => void;
}

export function SectionFormValues({ section, onChange }: Props) {
  const raw = section.data as unknown as ValuesData;
  const [data, setData] = useState<ValuesData>({
    ...raw,
    values: raw.values ?? [],
  });
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  function updateRoot(patch: Partial<ValuesData>) {
    const next = { ...data, ...patch };
    setData(next);
    onChange(next as Record<string, unknown>);
  }

  function updateValue(idx: number, patch: Partial<ValueItem>) {
    const next = data.values.map((v, i) =>
      i === idx ? { ...v, ...patch } : v,
    );
    updateRoot({ values: next });
  }

  function addValue() {
    const next = [
      ...data.values,
      { id: crypto.randomUUID(), icon: "", title: "", description: "" },
    ];
    updateRoot({ values: next });
    setOpenIdx(next.length - 1);
  }

  function removeValue(idx: number) {
    const next = data.values.filter((_, i) => i !== idx);
    updateRoot({ values: next });
    if (openIdx !== null && openIdx >= next.length) {
      setOpenIdx(next.length > 0 ? next.length - 1 : null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Textos da seção */}
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
              placeholder="ex: Qualidade Inovadora"
              className={inputClass}
            />
          </FieldGroup>
          <FieldGroup label="Título">
            <input
              type="text"
              value={data.title ?? ""}
              onChange={(e) => updateRoot({ title: e.target.value })}
              placeholder="ex: O que nos move"
              className={inputClass}
            />
          </FieldGroup>
        </div>
        <FieldGroup label="Descrição">
          <textarea
            rows={2}
            value={data.description ?? ""}
            onChange={(e) => updateRoot({ description: e.target.value })}
            placeholder="Texto descritivo da seção..."
            className={cn(inputClass, "h-auto py-2")}
          />
        </FieldGroup>
        <div className="grid gap-3 sm:grid-cols-2">
          <FieldGroup label="Imagem lateral (URL)">
            <input
              type="text"
              value={data.image ?? ""}
              onChange={(e) => updateRoot({ image: e.target.value })}
              placeholder="/figma-assets/raw/..."
              className={inputClass}
            />
          </FieldGroup>
          <FieldGroup label="Alt da imagem">
            <input
              type="text"
              value={data.imageAlt ?? ""}
              onChange={(e) => updateRoot({ imageAlt: e.target.value })}
              placeholder="Laboratório Stetsom"
              className={inputClass}
            />
          </FieldGroup>
        </div>
      </div>

      {/* Valores */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          Valores ({data.values.length})
        </p>
        <button
          type="button"
          onClick={addValue}
          className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Plus className="size-3.5" />
          Adicionar valor
        </button>
      </div>

      {data.values.length === 0 && (
        <div className="rounded-[12px] border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum valor cadastrado.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {data.values.map((value, idx) => (
          <div
            key={value.id}
            className="rounded-[12px] border border-border bg-card overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <button
                type="button"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="flex flex-1 items-center gap-2 text-left"
              >
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform",
                    openIdx === idx && "rotate-180",
                  )}
                />
                <p className="text-sm font-medium text-foreground">
                  {value.title || `Valor ${idx + 1}`}
                </p>
                {value.icon && (
                  <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                    {value.icon}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => removeValue(idx)}
                className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>

            {openIdx === idx && (
              <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <FieldGroup label="Título *">
                    <input
                      type="text"
                      value={value.title}
                      onChange={(e) =>
                        updateValue(idx, { title: e.target.value })
                      }
                      placeholder="ex: Inovação"
                      className={inputClass}
                    />
                  </FieldGroup>
                  <FieldGroup label="Ícone (Lucide name)">
                    <input
                      type="text"
                      value={value.icon}
                      onChange={(e) =>
                        updateValue(idx, { icon: e.target.value })
                      }
                      placeholder="ex: zap, shield-check, rocket"
                      className={inputClass}
                    />
                  </FieldGroup>
                </div>
                <FieldGroup label="Descrição *">
                  <textarea
                    rows={2}
                    value={value.description}
                    onChange={(e) =>
                      updateValue(idx, { description: e.target.value })
                    }
                    placeholder="Tecnologia de ponta desenvolvida internamente."
                    className={cn(inputClass, "h-auto py-2")}
                  />
                </FieldGroup>
              </div>
            )}
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
