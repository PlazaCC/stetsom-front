"use client";

import type { PageSection } from "@/lib/api/contracts";
import { cn } from "@/lib/utils";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  FieldGroup,
  SectionCard,
  inputClass,
  fileInputClass,
  EmptyState,
} from "./form-utils";

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
  onFileChange?: (key: string, file: File | null) => void;
}

export function SectionFormValues({ section, onChange, onFileChange }: Props) {
  const raw = section.data as unknown as ValuesData;
  const [data, setData] = useState<ValuesData>({
    ...raw,
    values: raw.values ?? [],
  });
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleFileChange(file: File | null) {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onFileChange?.("image", file);
    } else {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      onFileChange?.("image", null);
    }
  }

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
      <SectionCard title="Cabeçalho">
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
        <FieldGroup label="Descrição" className="mt-3">
          <textarea
            rows={2}
            value={data.description ?? ""}
            onChange={(e) => updateRoot({ description: e.target.value })}
            placeholder="Texto descritivo da seção..."
            className={cn(inputClass, "h-auto py-2")}
          />
        </FieldGroup>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <FieldGroup label="Imagem lateral (Upload)">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                handleFileChange(file);
              }}
              className={fileInputClass}
            />
            <ImagePreview
              src={previewUrl ?? data.image ?? ""}
              onClear={() => handleFileChange(null)}
            />
          </FieldGroup>
          <FieldGroup label="Alt da imagem" className="mt-0">
            <input
              type="text"
              value={data.imageAlt ?? ""}
              onChange={(e) => updateRoot({ imageAlt: e.target.value })}
              placeholder="Laboratório Stetsom"
              className={inputClass}
            />
          </FieldGroup>
        </div>
      </SectionCard>

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
        <EmptyState
          title="Nenhum valor cadastrado."
          description='Clique em "Adicionar valor" para começar.'
        />
      )}

      <div className="space-y-2">
        {data.values.map((value, idx) => (
          <ValueCard
            key={value.id}
            value={value}
            idx={idx}
            isOpen={openIdx === idx}
            onToggle={() => setOpenIdx(openIdx === idx ? null : idx)}
            onUpdate={(patch) => updateValue(idx, patch)}
            onRemove={() => removeValue(idx)}
          />
        ))}
      </div>
    </div>
  );
}

interface ValueCardProps {
  value: ValueItem;
  idx: number;
  isOpen: boolean;
  onToggle: () => void;
  onUpdate: (patch: Partial<ValueItem>) => void;
  onRemove: () => void;
}

function ValueCard({
  value,
  idx,
  isOpen,
  onToggle,
  onUpdate,
  onRemove,
}: ValueCardProps) {
  return (
    <div className="rounded-[12px] border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={onToggle}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform",
              isOpen && "rotate-180",
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
          onClick={onRemove}
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldGroup label="Título *">
              <input
                type="text"
                value={value.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="ex: Inovação"
                className={inputClass}
              />
            </FieldGroup>
            <FieldGroup label="Ícone (Lucide name)">
              <input
                type="text"
                value={value.icon}
                onChange={(e) => onUpdate({ icon: e.target.value })}
                placeholder="ex: zap, shield-check, rocket"
                className={inputClass}
              />
            </FieldGroup>
          </div>
          <FieldGroup label="Descrição *">
            <textarea
              rows={2}
              value={value.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Tecnologia de ponta desenvolvida internamente."
              className={cn(inputClass, "h-auto py-2")}
            />
          </FieldGroup>
        </div>
      )}
    </div>
  );
}

function ImagePreview({ src, onClear }: { src: string; onClear: () => void }) {
  if (!src) return null;

  return (
    <div className="relative mt-2 overflow-hidden rounded-md border border-border">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="Preview" className="h-20 w-full object-cover" />
      <button
        type="button"
        onClick={onClear}
        className="absolute right-1 top-1 flex size-6 items-center justify-center rounded bg-black/50 text-xs text-white hover:bg-black/70"
        title="Remover imagem"
      >
        <Trash2 className="size-3" />
      </button>
    </div>
  );
}
