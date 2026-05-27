"use client";

import type { PageSection } from "@/lib/api/contracts";
import { cn } from "@/lib/utils";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface HeroSlide {
  id: string;
  desktopImage: string;
  mobileImage: string;
  alt: string;
  href: string;
  label: string;
  title: string;
}

interface HeroCarouselData {
  slides: HeroSlide[];
}

interface Props {
  section: PageSection;
  onChange: (data: Record<string, unknown>) => void;
  onFileChange?: (key: string, file: File | null) => void;
}

function newSlide(): HeroSlide {
  return {
    id: crypto.randomUUID(),
    desktopImage: "",
    mobileImage: "",
    alt: "",
    href: "",
    label: "",
    title: "",
  };
}

export function SectionFormHeroCarousel({
  section,
  onChange,
  onFileChange,
}: Props) {
  const raw = section.data as unknown as HeroCarouselData;
  const [slides, setSlides] = useState<HeroSlide[]>(raw.slides ?? []);
  const [openIdx, setOpenIdx] = useState<number | null>(
    slides.length > 0 ? 0 : null,
  );
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  function handleFileChange(
    idx: number,
    field: "desktopImage" | "mobileImage",
    file: File | null,
  ) {
    const key = `slides.${idx}.${field}`;
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrls((prev) => ({ ...prev, [key]: url }));
      onFileChange?.(key, file);
    } else {
      const oldUrl = previewUrls[key];
      if (oldUrl) URL.revokeObjectURL(oldUrl);
      setPreviewUrls((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      onFileChange?.(key, null);
    }
  }

  function update(next: HeroSlide[]) {
    setSlides(next);
    onChange({ slides: next });
  }

  function updateSlide(idx: number, patch: Partial<HeroSlide>) {
    const next = slides.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    update(next);
  }

  function addSlide() {
    const next = [...slides, newSlide()];
    update(next);
    setOpenIdx(next.length - 1);
  }

  function removeSlide(idx: number) {
    const next = slides.filter((_, i) => i !== idx);
    update(next);
    if (openIdx !== null && openIdx >= next.length) {
      setOpenIdx(next.length > 0 ? next.length - 1 : null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          Slides ({slides.length})
        </p>
        <button
          type="button"
          onClick={addSlide}
          className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Plus className="size-3.5" />
          Adicionar slide
        </button>
      </div>

      {slides.length === 0 && (
        <div className="rounded-[12px] border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum slide cadastrado.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Clique em &quot;Adicionar slide&quot; para começar.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className="rounded-[12px] border border-border bg-card overflow-hidden"
          >
            {/* Header do slide */}
            <div className="flex items-center gap-3 px-4 py-3">
              <GripVertical className="size-4 shrink-0 text-muted-foreground" />
              <button
                type="button"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="flex-1 text-left"
              >
                <p className="text-sm font-medium text-foreground">
                  {slide.title || `Slide ${idx + 1}`}
                </p>
                {slide.label && (
                  <p className="text-xs text-muted-foreground">{slide.label}</p>
                )}
              </button>
              <button
                type="button"
                onClick={() => removeSlide(idx)}
                className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                title="Remover slide"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>

            {/* Campos expandidos */}
            {openIdx === idx && (
              <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <FieldGroup label="Título *">
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) =>
                        updateSlide(idx, { title: e.target.value })
                      }
                      placeholder="TÍTULO EM MAIÚSCULAS"
                      className={inputClass}
                    />
                  </FieldGroup>
                  <FieldGroup label="Label / Subtítulo">
                    <input
                      type="text"
                      value={slide.label}
                      onChange={(e) =>
                        updateSlide(idx, { label: e.target.value })
                      }
                      placeholder="ex: Stetsom Digital Bass"
                      className={inputClass}
                    />
                  </FieldGroup>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <FieldGroup label="Imagem Desktop (Upload)">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        handleFileChange(idx, "desktopImage", file);
                      }}
                      className={fileInputClass}
                    />
                    {(previewUrls[`slides.${idx}.desktopImage`] ??
                      slide.desktopImage) && (
                      <div className="relative mt-2 overflow-hidden rounded-md border border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            previewUrls[`slides.${idx}.desktopImage`] ??
                            slide.desktopImage
                          }
                          alt="Preview"
                          className="h-20 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleFileChange(idx, "desktopImage", null)
                          }
                          className="absolute right-1 top-1 flex size-6 items-center justify-center rounded bg-black/50 text-xs text-white hover:bg-black/70"
                          title="Remover imagem"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    )}
                  </FieldGroup>
                  <FieldGroup label="Imagem Mobile (Upload)">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        handleFileChange(idx, "mobileImage", file);
                      }}
                      className={fileInputClass}
                    />
                    {(previewUrls[`slides.${idx}.mobileImage`] ??
                      slide.mobileImage) && (
                      <div className="relative mt-2 overflow-hidden rounded-md border border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            previewUrls[`slides.${idx}.mobileImage`] ??
                            slide.mobileImage
                          }
                          alt="Preview"
                          className="h-20 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleFileChange(idx, "mobileImage", null)
                          }
                          className="absolute right-1 top-1 flex size-6 items-center justify-center rounded bg-black/50 text-xs text-white hover:bg-black/70"
                          title="Remover imagem"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    )}
                  </FieldGroup>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <FieldGroup label="Texto alternativo (alt)">
                    <input
                      type="text"
                      value={slide.alt}
                      onChange={(e) =>
                        updateSlide(idx, { alt: e.target.value })
                      }
                      placeholder="Descrição da imagem para acessibilidade"
                      className={inputClass}
                    />
                  </FieldGroup>
                  <FieldGroup label="Link de destino">
                    <input
                      type="text"
                      value={slide.href}
                      onChange={(e) =>
                        updateSlide(idx, { href: e.target.value })
                      }
                      placeholder="/produtos ou https://..."
                      className={inputClass}
                    />
                  </FieldGroup>
                </div>
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

const fileInputClass = cn(
  "h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground file:mr-3 file:rounded file:border-0 file:bg-muted file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-foreground",
  "focus:outline-none focus:ring-1 focus:ring-brand",
);
