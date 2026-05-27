"use client";

import {
  AdminInput,
  AdminLabel,
  AdminSelect,
  AdminTextarea,
} from "@/app/admin/_components/crud/admin-input";
import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import type { Category, ProductStatus, Subcategory } from "@/lib/api/contracts";
import { ImagePlus, X } from "lucide-react";

export interface ProductInfo {
  name: string;
  slug: string;
  category_id: string;
  subcategory_id: string;
  status: ProductStatus;
  badge: string;
  description: string;
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
  onChange: (key: keyof ProductInfo, value: string | string[]) => void;
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
    const previewUrl = URL.createObjectURL(file);
    onSet(previewUrl);
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
  onChange,
  onCoverFile,
}: ProductWizardStep1Props) {
  const filteredSubcategories = subcategories.filter(
    (s) => s.category_id === info.category_id,
  );

  function setAdditionalImage(index: number, url: string) {
    const next = [...info.additional_images];
    next[index] = url;
    onChange("additional_images", next);
  }

  function clearAdditionalImage(index: number) {
    const next = [...info.additional_images];
    next.splice(index, 1);
    onChange("additional_images", next);
  }

  const extraSlots = Array.from({
    length: Math.max(0, 5 - info.additional_images.length),
  });

  return (
    <div className="space-y-6">
      <AdminFormSection
        title="Fotos do produto"
        description="Selecione a capa e imagens adicionais. A primeira imagem é usada como thumbnail no catálogo."
      >
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          <div className="col-span-2 row-span-2 sm:col-span-2">
            <AdminLabel className="mb-1 block text-xs">Capa *</AdminLabel>
            <div className="aspect-square">
              <ImageSlot
                url={info.cover_image_url}
                label="Foto principal"
                onSet={(url) => onChange("cover_image_url", url)}
                onUploadFile={onCoverFile}
                onClear={
                  info.cover_image_url
                    ? () => onChange("cover_image_url", "")
                    : undefined
                }
              />
            </div>
          </div>

          {info.additional_images.map((url, i) => (
            <ImageSlot
              key={i}
              url={url}
              label={`Foto ${i + 2}`}
              onSet={(v) => setAdditionalImage(i, v)}
              onClear={() => clearAdditionalImage(i)}
            />
          ))}

          {extraSlots.map((_, i) => (
            <ImageSlot
              key={`empty-${i}`}
              url=""
              label={`Foto ${info.additional_images.length + i + 2}`}
              onSet={(url) =>
                setAdditionalImage(info.additional_images.length + i, url)
              }
            />
          ))}
        </div>
      </AdminFormSection>

      <AdminFormSection title="Identificação">
        <div className="space-y-4">
          <div>
            <AdminLabel>Nome do produto *</AdminLabel>
            <AdminInput
              required
              value={info.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Ex: ST-4000EQ"
            />
          </div>

          <div>
            <AdminLabel>Slug (URL)</AdminLabel>
            <AdminInput
              value={info.slug}
              onChange={(e) => onChange("slug", e.target.value)}
              placeholder="st-4000eq"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              /produtos/{info.slug || "slug-do-produto"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <AdminLabel>Categoria *</AdminLabel>
              <AdminSelect
                value={info.category_id}
                onChange={(e) => {
                  onChange("category_id", e.target.value);
                  onChange("subcategory_id", "");
                }}
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
                onChange={(e) => onChange("subcategory_id", e.target.value)}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <AdminLabel>Data de lançamento</AdminLabel>
              <AdminInput
                type="date"
                value={info.launch_date}
                onChange={(e) => onChange("launch_date", e.target.value)}
              />
            </div>

            <div>
              <AdminLabel>Badge (opcional)</AdminLabel>
              <AdminInput
                value={info.badge}
                onChange={(e) => onChange("badge", e.target.value)}
                placeholder="Ex: LANÇAMENTO, DESTAQUE"
              />
            </div>
          </div>

          <div>
            <AdminLabel>Status *</AdminLabel>
            <div className="flex gap-4 pt-1">
              {(["ACTIVE", "DISCONTINUED"] as const).map((s) => (
                <label
                  key={s}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={info.status === s}
                    onChange={() => onChange("status", s)}
                    className="accent-brand"
                  />
                  <span className="text-sm text-foreground">
                    {s === "ACTIVE" ? "Ativo" : "Descontinuado"}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Descrição">
        <AdminTextarea
          rows={5}
          value={info.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Descrição completa do produto..."
        />
      </AdminFormSection>

      <AdminFormSection title="Vídeo (opcional)">
        <AdminInput
          type="url"
          value={info.video_url}
          onChange={(e) => onChange("video_url", e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </AdminFormSection>
    </div>
  );
}
