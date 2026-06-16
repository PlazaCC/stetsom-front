"use client";

import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import {
  AdminInput,
  AdminLabel,
  AdminSelect,
} from "@/app/admin/_components/crud/admin-input";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { SortableList } from "@/app/admin/_components/crud/sortable-list";
import type {
  WizardProductImage,
  WizardProductStatus,
} from "@/app/admin/_components/product-wizard-types";
import type { I18nString } from "@/api/stetsom/model";
import { ImagePlus, Star, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}
interface Subcategory {
  id: string;
  name: string;
  slug: string;
  category_id: string;
}
interface TemplateOption {
  id: string;
  name: string;
  category_id: string;
}

export interface ProductInfo {
  name: I18nString;
  slug: I18nString;
  description: I18nString;
  sku: string;
  category_id: string;
  subcategory_id: string;
  template_id: string;
  status: WizardProductStatus;
  is_featured: boolean;
  is_spotlight: boolean;
  launch_date: string;
  launch_time: string;
  available_locales: ("pt" | "en" | "es")[];
}

interface ProductWizardStep1Props {
  info: ProductInfo;
  categories: Category[];
  subcategories: Subcategory[];
  templates: TemplateOption[];
  images: WizardProductImage[];
  onPatch: (patch: Partial<ProductInfo>) => void;
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

export function ProductWizardStep1({
  info,
  categories,
  subcategories,
  templates,
  images,
  onPatch,
  onImagesChange,
}: ProductWizardStep1Props) {
  const filteredSubcategories = subcategories.filter(
    (s) => s.category_id === info.category_id,
  );
  const filteredTemplates = templates.filter(
    (t) => t.category_id === info.category_id,
  );

  return (
    <div className="space-y-6">
      <AdminFormSection
        title="Fotos do produto"
        description="A primeira imagem (arraste para reordenar) é a capa usada no catálogo."
      >
        <ProductGallery images={images} onChange={onImagesChange} />
      </AdminFormSection>

      <AdminFormSection title="Identificação">
        <div className="space-y-4">
          <I18nInput
            label="Nome do produto"
            required
            value={info.name}
            onChange={(name) => onPatch({ name })}
            placeholder="Ex: ST-4000EQ"
          />

          <I18nInput
            label="Slug (URL)"
            value={info.slug}
            onChange={(slug) => onPatch({ slug })}
            placeholder="st-4000eq"
          />

          <div>
            <AdminLabel>SKU</AdminLabel>
            <AdminInput
              value={info.sku}
              onChange={(e) => onPatch({ sku: e.target.value })}
              placeholder="Código único"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <AdminLabel>Categoria *</AdminLabel>
              <AdminSelect
                value={info.category_id}
                onChange={(e) =>
                  onPatch({
                    category_id: e.target.value,
                    subcategory_id: "",
                    template_id: "",
                  })
                }
              >
                <option value="">Selecione...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </AdminSelect>
            </div>

            <div>
              <AdminLabel>Linha (subcategoria)</AdminLabel>
              <AdminSelect
                value={info.subcategory_id}
                onChange={(e) => onPatch({ subcategory_id: e.target.value })}
                disabled={
                  !info.category_id || filteredSubcategories.length === 0
                }
              >
                <option value="">
                  {filteredSubcategories.length === 0
                    ? "Nenhuma"
                    : "Selecione..."}
                </option>
                {filteredSubcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </AdminSelect>
            </div>
          </div>

          <div>
            <AdminLabel>Template de atributos</AdminLabel>
            <AdminSelect
              value={info.template_id}
              onChange={(e) => onPatch({ template_id: e.target.value })}
              disabled={!info.category_id || filteredTemplates.length === 0}
            >
              <option value="">
                {filteredTemplates.length === 0 ? "Nenhum" : "Selecione..."}
              </option>
              {filteredTemplates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </AdminSelect>
          </div>

          <div className="flex gap-6 pt-1">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={info.is_featured}
                onChange={(e) => onPatch({ is_featured: e.target.checked })}
                className="size-4 accent-primary"
              />
              <span className="text-sm text-foreground">Destaque</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={info.is_spotlight}
                onChange={(e) => onPatch({ is_spotlight: e.target.checked })}
                className="size-4 accent-primary"
              />
              <span className="text-sm text-foreground">Spotlight</span>
            </label>
          </div>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Descrição">
        <I18nInput
          multiline
          value={info.description}
          onChange={(description) => onPatch({ description })}
          placeholder="Descrição curta do produto..."
        />
      </AdminFormSection>
    </div>
  );
}
