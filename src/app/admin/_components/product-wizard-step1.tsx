"use client";

import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import {
  AdminInput,
  AdminLabel,
  AdminSelect,
} from "@/app/admin/_components/crud/admin-input";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import type { WizardProductStatus } from "@/app/admin/_components/product-wizard-types";
import type { I18nString } from "@/api/stetsom/model";
import { ImagePlus, X } from "lucide-react";

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
  badge: string;
  cover_image_url: string;
  additional_images: string[];
  video_url: string;
  launch_date: string;
  launch_time: string;
}

interface ProductWizardStep1Props {
  info: ProductInfo;
  categories: Category[];
  subcategories: Subcategory[];
  templates: TemplateOption[];
  onPatch: (patch: Partial<ProductInfo>) => void;
  onCoverFile?: (file: File) => void;
}

function ImageSlot({
  url,
  label,
  onSet,
  onClear,
  onUploadFile,
}: {
  url: string;
  label: string;
  onSet: (url: string) => void;
  onClear?: () => void;
  onUploadFile?: (file: File) => void;
}) {
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    onSet(URL.createObjectURL(file));
    onUploadFile?.(file);
  }

  return (
    <div className="relative flex aspect-square flex-col items-center justify-center gap-1 overflow-hidden rounded-md border border-dashed border-border bg-muted text-center">
      {url ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={label}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <X className="size-3" />
            </button>
          )}
        </>
      ) : (
        <>
          <ImagePlus className="size-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{label}</span>
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 cursor-pointer opacity-0"
            title={label}
            onChange={handleFile}
          />
        </>
      )}
    </div>
  );
}

export function ProductWizardStep1({
  info,
  categories,
  subcategories,
  templates,
  onPatch,
  onCoverFile,
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
        title="Foto do produto"
        description="A imagem de capa é usada como thumbnail no catálogo."
      >
        <div className="w-40">
          <ImageSlot
            url={info.cover_image_url}
            label="Foto principal"
            onSet={(url) => onPatch({ cover_image_url: url })}
            onUploadFile={onCoverFile}
            onClear={
              info.cover_image_url
                ? () => onPatch({ cover_image_url: "" })
                : undefined
            }
          />
        </div>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <AdminLabel>SKU</AdminLabel>
              <AdminInput
                value={info.sku}
                onChange={(e) => onPatch({ sku: e.target.value })}
                placeholder="Código único"
              />
            </div>
            <div>
              <AdminLabel>Badge (opcional)</AdminLabel>
              <AdminInput
                value={info.badge}
                onChange={(e) => onPatch({ badge: e.target.value })}
                placeholder="Ex: LANÇAMENTO"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                className="size-4 accent-brand"
              />
              <span className="text-sm text-foreground">Destaque</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={info.is_spotlight}
                onChange={(e) => onPatch({ is_spotlight: e.target.checked })}
                className="size-4 accent-brand"
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

      <AdminFormSection title="Vídeo (opcional)">
        <AdminInput
          type="url"
          value={info.video_url}
          onChange={(e) => onPatch({ video_url: e.target.value })}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </AdminFormSection>
    </div>
  );
}
