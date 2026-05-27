"use client";

import type { PageSection } from "@/lib/api/contracts";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  FieldGroup,
  inputClass,
  fileInputClass,
  EmptyState,
} from "./form-utils";

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
  autoplay?: boolean;
  interval?: number;
  effect?: "slide" | "fade";
  maxSlides?: number;
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
  const [autoplay, setAutoplay] = useState(raw.autoplay ?? true);
  const [interval, setInterval] = useState(raw.interval ?? 5000);
  const [effect, setEffect] = useState<"slide" | "fade">(raw.effect ?? "slide");
  const [maxSlides, setMaxSlides] = useState(raw.maxSlides ?? 5);
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

  function emit(nextSlides: HeroSlide[]) {
    setSlides(nextSlides);
    onChange({
      slides: nextSlides,
      autoplay,
      interval,
      effect,
      maxSlides,
    });
  }

  function updateSlide(idx: number, patch: Partial<HeroSlide>) {
    const next = slides.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    emit(next);
  }

  function addSlide() {
    const next = [...slides, newSlide()];
    emit(next);
    setOpenIdx(next.length - 1);
  }

  function removeSlide(idx: number) {
    const next = slides.filter((_, i) => i !== idx);
    emit(next);
    if (openIdx !== null && openIdx >= next.length) {
      setOpenIdx(next.length > 0 ? next.length - 1 : null);
    }
  }

  function emitConfig(updates: Partial<HeroCarouselData>) {
    const next = { slides, autoplay, interval, effect, maxSlides, ...updates };
    onChange({
      slides: next.slides ?? slides,
      autoplay: next.autoplay,
      interval: next.interval,
      effect: next.effect,
      maxSlides: next.maxSlides,
    });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[12px] border border-border bg-card p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Configuração do Carousel
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={autoplay}
              onChange={(e) => {
                setAutoplay(e.target.checked);
                emitConfig({ autoplay: e.target.checked });
              }}
              className="accent-brand"
            />
            Autoplay
          </label>
          <FieldGroup label="Intervalo (ms)">
            <input
              type="number"
              value={interval}
              onChange={(e) => {
                setInterval(Number(e.target.value));
                emitConfig({ interval: Number(e.target.value) });
              }}
              className={inputClass}
            />
          </FieldGroup>
          <FieldGroup label="Efeito">
            <select
              value={effect}
              onChange={(e) => {
                setEffect(e.target.value as "slide" | "fade");
                emitConfig({ effect: e.target.value as "slide" | "fade" });
              }}
              className={inputClass}
            >
              <option value="slide">Slide</option>
              <option value="fade">Fade</option>
            </select>
          </FieldGroup>
          <FieldGroup label="Máx. slides">
            <input
              type="number"
              min={1}
              max={10}
              value={maxSlides}
              onChange={(e) => {
                setMaxSlides(Number(e.target.value));
                emitConfig({ maxSlides: Number(e.target.value) });
              }}
              className={inputClass}
            />
          </FieldGroup>
        </div>
      </div>

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
        <EmptyState
          title="Nenhum slide cadastrado."
          description='Clique em "Adicionar slide" para começar.'
        />
      )}

      <div className="space-y-2">
        {slides.map((slide, idx) => (
          <SlideCard
            key={slide.id}
            slide={slide}
            idx={idx}
            isOpen={openIdx === idx}
            previewUrls={previewUrls}
            onToggle={() => setOpenIdx(openIdx === idx ? null : idx)}
            onUpdate={(patch) => updateSlide(idx, patch)}
            onRemove={() => removeSlide(idx)}
            onFileChange={(field, file) => handleFileChange(idx, field, file)}
          />
        ))}
      </div>
    </div>
  );
}

interface SlideCardProps {
  slide: HeroSlide;
  idx: number;
  isOpen: boolean;
  previewUrls: Record<string, string>;
  onToggle: () => void;
  onUpdate: (patch: Partial<HeroSlide>) => void;
  onRemove: () => void;
  onFileChange: (
    field: "desktopImage" | "mobileImage",
    file: File | null,
  ) => void;
}

function SlideCard({
  slide,
  idx,
  isOpen,
  previewUrls,
  onToggle,
  onUpdate,
  onRemove,
  onFileChange,
}: SlideCardProps) {
  const desktopSrc =
    previewUrls[`slides.${idx}.desktopImage`] ?? slide.desktopImage;
  const mobileSrc =
    previewUrls[`slides.${idx}.mobileImage`] ?? slide.mobileImage;

  return (
    <div className="rounded-[12px] border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <GripVertical className="size-4 shrink-0 text-muted-foreground" />
        <button type="button" onClick={onToggle} className="flex-1 text-left">
          <p className="text-sm font-medium text-foreground">
            {slide.title || `Slide ${idx + 1}`}
          </p>
          {slide.label && (
            <p className="text-xs text-muted-foreground">{slide.label}</p>
          )}
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          title="Remover slide"
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
                value={slide.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="TÍTULO EM MAIÚSCULAS"
                className={inputClass}
              />
            </FieldGroup>
            <FieldGroup label="Label / Subtítulo">
              <input
                type="text"
                value={slide.label}
                onChange={(e) => onUpdate({ label: e.target.value })}
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
                onChange={(e) =>
                  onFileChange("desktopImage", e.target.files?.[0] ?? null)
                }
                className={fileInputClass}
              />
              <ImagePreview
                src={desktopSrc}
                alt="Preview desktop"
                onClear={() => onFileChange("desktopImage", null)}
              />
            </FieldGroup>
            <FieldGroup label="Imagem Mobile (Upload)">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  onFileChange("mobileImage", e.target.files?.[0] ?? null)
                }
                className={fileInputClass}
              />
              <ImagePreview
                src={mobileSrc}
                alt="Preview mobile"
                onClear={() => onFileChange("mobileImage", null)}
              />
            </FieldGroup>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <FieldGroup label="Texto alternativo (alt)">
              <input
                type="text"
                value={slide.alt}
                onChange={(e) => onUpdate({ alt: e.target.value })}
                placeholder="Descrição da imagem para acessibilidade"
                className={inputClass}
              />
            </FieldGroup>
            <FieldGroup label="Link de destino">
              <input
                type="text"
                value={slide.href}
                onChange={(e) => onUpdate({ href: e.target.value })}
                placeholder="/produtos ou https://..."
                className={inputClass}
              />
            </FieldGroup>
          </div>
        </div>
      )}
    </div>
  );
}

function ImagePreview({
  src,
  alt,
  onClear,
}: {
  src: string;
  alt: string;
  onClear: () => void;
}) {
  if (!src) return null;

  return (
    <div className="relative mt-2 overflow-hidden rounded-md border border-border">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-20 w-full object-cover" />
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
