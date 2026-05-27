"use client";

import type { PageSection } from "@/lib/api/contracts";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface HeroStaticData {
  label?: string;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  watermark?: string;
  watermarkText?: string;
}

interface Props {
  section: PageSection;
  onChange: (data: Record<string, unknown>) => void;
  onFileChange?: (key: string, file: File | null) => void;
}

export function SectionFormHeroStatic({
  section,
  onChange,
  onFileChange,
}: Props) {
  const raw = section.data as HeroStaticData;
  const [data, setData] = useState<HeroStaticData>(raw);
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

  function update(patch: Partial<HeroStaticData>) {
    const next = { ...data, ...patch };
    setData(next);
    onChange(next as Record<string, unknown>);
  }

  const hasWatermark =
    section.type === "CATALOG_HERO" ? "watermark" : "watermarkText";

  return (
    <div className="space-y-4">
      <SectionCard title="Textos">
        <div className="space-y-3">
          <FieldGroup label="Label / Eyebrow">
            <input
              type="text"
              value={data.label ?? ""}
              onChange={(e) => update({ label: e.target.value })}
              placeholder="ex: Catálogo de Produtos"
              className={inputClass}
            />
          </FieldGroup>
          <FieldGroup label="Título *">
            <input
              type="text"
              value={data.title ?? ""}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="TÍTULO EM MAIÚSCULAS"
              className={inputClass}
            />
          </FieldGroup>
          {section.type === "HERO_STATIC" && (
            <FieldGroup label="Descrição">
              <textarea
                rows={2}
                value={data.description ?? ""}
                onChange={(e) => update({ description: e.target.value })}
                placeholder="Texto descritivo opcional abaixo do título"
                className={cn(inputClass, "h-auto py-2")}
              />
            </FieldGroup>
          )}
          <FieldGroup
            label={
              section.type === "CATALOG_HERO" ? "Watermark" : "Texto Watermark"
            }
          >
            <input
              type="text"
              value={(data as Record<string, string>)[hasWatermark] ?? ""}
              onChange={(e) =>
                update({
                  [hasWatermark]: e.target.value,
                } as Partial<HeroStaticData>)
              }
              placeholder="ex: CATÁLOGO"
              className={inputClass}
            />
          </FieldGroup>
        </div>
      </SectionCard>

      {(section.type === "HERO_STATIC" || section.type === "CATALOG_HERO") && (
        <SectionCard title="Imagem de fundo">
          <div className="space-y-3">
            <FieldGroup label="Upload da imagem">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  handleFileChange(file);
                }}
                className={fileInputClass}
              />
            </FieldGroup>
            <FieldGroup label="Texto alternativo (alt)">
              <input
                type="text"
                value={data.imageAlt ?? ""}
                onChange={(e) => update({ imageAlt: e.target.value })}
                placeholder="Descrição da imagem para acessibilidade"
                className={inputClass}
              />
            </FieldGroup>

            {(previewUrl ?? data.image) && (
              <div className="relative overflow-hidden rounded-md border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl ?? data.image}
                  alt={data.imageAlt ?? "Preview"}
                  className="h-32 w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleFileChange(null)}
                  className="absolute right-1 top-1 flex size-6 items-center justify-center rounded bg-black/50 text-xs text-white hover:bg-black/70"
                  title="Remover imagem"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            )}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[12px] border border-border bg-card p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      {children}
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

const fileInputClass = cn(
  "h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground file:mr-3 file:rounded file:border-0 file:bg-muted file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-foreground",
  "focus:outline-none focus:ring-1 focus:ring-brand",
);
