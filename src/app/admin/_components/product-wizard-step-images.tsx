"use client";

import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import { SortableList } from "@/app/admin/_components/crud/sortable-list";
import type { WizardProductImage } from "@/app/admin/_components/product-wizard-types";
import { ImagePlus, Star, X } from "lucide-react";

interface ProductWizardStepImagesProps {
  images: WizardProductImage[];
  onImagesChange: (images: WizardProductImage[]) => void;
}

function ProductGallery({
  images,
  onChange,
}: {
  images: WizardProductImage[];
  onChange: (images: WizardProductImage[]) => void;
}) {
  function reindex(list: WizardProductImage[]): WizardProductImage[] {
    return list.map((img, i) => ({ ...img, order: i }));
  }

  function addFiles(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files).map((file, i) => ({
      id: `img-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
      file,
      preview_url: URL.createObjectURL(file),
      order: images.length + i,
    }));
    onChange(reindex([...images, ...next]));
  }

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <SortableList
          items={images}
          getId={(img) => img.id}
          onReorder={(list) => onChange(reindex(list))}
          renderItem={(img, handle) => (
            <div className="flex items-center gap-3 rounded-md border border-border bg-card p-2">
              {handle}
              <div className="relative size-14 shrink-0 overflow-hidden rounded bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.preview_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="flex-1 text-xs text-muted-foreground">
                {img.order === 0 ? (
                  <span className="inline-flex items-center gap-1 font-medium text-foreground">
                    <Star className="size-3 fill-primary text-primary" />
                    Capa
                  </span>
                ) : (
                  `Imagem ${img.order + 1}`
                )}
              </span>
              <button
                type="button"
                aria-label="Remover imagem"
                onClick={() =>
                  onChange(reindex(images.filter((i) => i.id !== img.id)))
                }
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="size-4" />
              </button>
            </div>
          )}
        />
      )}
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border bg-card py-4 text-sm text-muted-foreground hover:border-primary hover:text-foreground">
        <ImagePlus className="size-5" />
        Adicionar imagens
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>
    </div>
  );
}

export function ProductWizardStepImages({
  images,
  onImagesChange,
}: ProductWizardStepImagesProps) {
  return (
    <AdminFormSection
      title="Fotos do produto"
      description="A primeira imagem (arraste para reordenar) é a capa usada no catálogo."
    >
      <ProductGallery images={images} onChange={onImagesChange} />
    </AdminFormSection>
  );
}
