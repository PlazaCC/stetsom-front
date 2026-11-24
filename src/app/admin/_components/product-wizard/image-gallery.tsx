"use client";

import { ImagePlus, Star, X } from "lucide-react";
import { rectSortingStrategy } from "@dnd-kit/sortable";
import { SortableList } from "@/app/admin/_components/crud/sortable-list";
import { LibraryPickerModal } from "@/app/admin/_components/crud/library-asset-picker";
import type { LibraryPickedAsset } from "@/app/admin/_components/crud/library-asset-ref";
import { reindexByOrder } from "@/lib/utils/reindex";
import type { WizardImage } from "./wizard-store";
import { useState } from "react";

interface ImageGalleryProps {
  images: WizardImage[];
  onChange: (images: WizardImage[]) => void;
}

export function ImageGallery({ images, onChange }: ImageGalleryProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  function addImage(asset: LibraryPickedAsset) {
    const added: WizardImage = {
      id: crypto.randomUUID(),
      library_id: asset.library_id,
      preview_url: asset.file_url ?? "",
      order: images.length,
      is_highlight: false,
    };
    onChange(reindexByOrder([...images, added]));
  }

  function removeImage(id: string) {
    onChange(reindexByOrder(images.filter((img) => img.id !== id)));
  }

  // Only one image can be the home highlight banner. Clicking an already
  // selected image clears it, leaving the product without a highlight.
  function toggleHighlight(id: string) {
    onChange(
      images.map((img) => ({
        ...img,
        is_highlight: img.id === id ? !img.is_highlight : false,
      })),
    );
  }

  const nextSlotIndex = images.length + 1;

  return (
    <>
      <SortableList
        items={images}
        getId={(img) => img.id}
        onReorder={(list) => onChange(reindexByOrder(list))}
        strategy={rectSortingStrategy}
        className="grid grid-cols-2 gap-3 space-y-0 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6"
        append={
          // Always-available slot — opens the library picker (browse or upload).
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border bg-card text-center text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
          >
            <ImagePlus className="size-6" />
            <span className="text-xs font-medium">
              {nextSlotIndex === 1 ? "Foto de capa" : "Adicionar foto"}
            </span>
          </button>
        }
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
            <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
              <span className="rounded bg-foreground/80 px-2 py-0.5 text-2xs font-semibold text-background uppercase">
                {img.order === 0 ? "Capa" : img.order}
              </span>
              {img.is_highlight && (
                <span className="flex items-center gap-1 rounded bg-primary px-2 py-0.5 text-2xs font-semibold text-primary-foreground uppercase">
                  <Star className="size-3 fill-current" />
                  Destaque
                </span>
              )}
            </div>
            <div className="absolute inset-0 flex items-start justify-end gap-1 bg-black/0 p-1.5 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
              <div className="flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-primary/80 [&_button]:cursor-grab [&_button]:active:cursor-grabbing">
                {handle}
              </div>
              <button
                type="button"
                aria-label={
                  img.is_highlight
                    ? "Remover dos destaques"
                    : "Usar como banner de destaque"
                }
                aria-pressed={img.is_highlight}
                title={
                  img.is_highlight
                    ? "Remover dos destaques"
                    : "Usar como banner de destaque"
                }
                onClick={() => toggleHighlight(img.id)}
                className={`flex size-7 items-center justify-center rounded-full text-white hover:bg-primary/80 ${
                  img.is_highlight ? "bg-primary" : "bg-black/60"
                }`}
              >
                <Star
                  className={`size-4 ${img.is_highlight ? "fill-current" : ""}`}
                />
              </button>
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

      {pickerOpen && (
        <LibraryPickerModal
          type="IMAGE"
          accept="image/*"
          onClose={() => setPickerOpen(false)}
          onPick={(asset) => {
            addImage(asset);
            setPickerOpen(false);
          }}
        />
      )}
    </>
  );
}
