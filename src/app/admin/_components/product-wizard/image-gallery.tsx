"use client";

import { ImagePlus, X } from "lucide-react";
import { rectSortingStrategy } from "@dnd-kit/sortable";
import { SortableList } from "@/app/admin/_components/crud/sortable-list";
import type { WizardImage } from "./wizard-store";

const MAX_IMAGES = 7;

interface ImageGalleryProps {
  images: WizardImage[];
  onChange: (images: WizardImage[]) => void;
}

function reindex(list: WizardImage[]): WizardImage[] {
  return list.map((img, i) => ({ ...img, order: i }));
}

function makeImage(file: File, order: number): WizardImage {
  return {
    id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    file,
    preview_url: URL.createObjectURL(file),
    order,
  };
}

export function ImageGallery({ images, onChange }: ImageGalleryProps) {
  function addImage(file: File | undefined) {
    if (!file) return;
    onChange(reindex([...images, makeImage(file, images.length)]));
  }

  function removeImage(id: string) {
    onChange(reindex(images.filter((img) => img.id !== id)));
  }

  const emptyCount = MAX_IMAGES - images.length;

  return (
    <>
      <SortableList
        items={images}
        getId={(img) => img.id}
        onReorder={(list) => onChange(reindex(list))}
        strategy={rectSortingStrategy}
        className="grid grid-cols-2 gap-3 space-y-0 sm:grid-cols-3 md:grid-cols-4"
        renderItem={(img, handle) => (
          <div
            key={img.id}
            className="group relative aspect-square overflow-hidden rounded-md border border-border bg-muted"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.preview_url}
              alt={img.id}
              className="h-full w-full object-cover"
            />
            {img.order === 0 && (
              <span className="absolute top-2 left-2 rounded bg-foreground/80 px-2 py-0.5 text-2xs font-semibold text-background uppercase">
                Capa
              </span>
            )}
            <div className="absolute inset-0 flex items-start justify-end gap-1 bg-black/0 p-1.5 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
              <div className="[&_button]:!active:cursor-grabbing flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-primary/80 [&_button]:!cursor-grab">
                {handle}
              </div>
              <button
                type="button"
                aria-label="Remover"
                onClick={() => removeImage(img.id)}
                className="flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-destructive/80"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        )}
      />

      {/* Empty upload slots */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: emptyCount }).map((_, i) => {
          const slotIndex = images.length + i + 1;
          return (
            <label
              key={`slot-${slotIndex}`}
              className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border bg-card text-center text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              <ImagePlus className="size-6" />
              <span className="text-xs font-medium">
                {slotIndex === 1 ? "Foto de capa" : `Foto ${slotIndex}`}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  addImage(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
          );
        })}
      </div>
    </>
  );
}
