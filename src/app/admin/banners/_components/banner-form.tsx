"use client";

import {
  AdminFormSection,
  AdminFormSectionContent,
  AdminFormSectionTitle,
} from "@/app/admin/_components/crud/admin-form-section";
import { AdminLabel } from "@/app/admin/_components/crud/admin-input";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import { AdminProductPicker } from "@/app/admin/_components/crud/admin-product-picker";
import { EditorFooter } from "@/app/admin/_components/crud/editor-footer";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { Input } from "@/components/ui/input";
import { LibraryAssetPicker } from "@/app/admin/_components/crud/library-asset-picker";
import type { LibraryPickedAsset } from "@/app/admin/_components/crud/library-asset-ref";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Banner, BannerStatus, I18nString } from "@/api/stetsom/model";
import { useGetApiLibraryId } from "@/api/stetsom";
import { currentAssetUrl } from "@/app/admin/_components/crud/library-asset-ref";
import { toApiLocale, toDisplayLocale } from "@/i18n/locale";
import { cn } from "@/lib/utils";
import { Image } from "lucide-react";
import { useState } from "react";

/**
 * Banner form state - UI layer representation
 *
 * API mapping:
 * - locale -> available_locales[0] (singular to array)
 * - library ids are the canonical image references sent to the API
 */
export interface BannerFormState {
  name: string;
  product_id: string;
  status: BannerStatus;
  title: I18nString;
  label: string;
  href: string;
  link_url: string;
  display_from: string;
  display_until: string;
  order: number;
  locale: string;
  desktop_image_library_id: string;
  mobile_image_library_id: string;
}

export const EMPTY_FORM_STATE: BannerFormState = {
  name: "",
  product_id: "",
  status: "ACTIVE",
  title: { pt: "" },
  label: "",
  href: "",
  link_url: "",
  display_from: "",
  display_until: "",
  order: 0,
  locale: "pt-BR",
  desktop_image_library_id: "",
  mobile_image_library_id: "",
};

/**
 * Recommended art sizes, derived from the home hero (`hero-carousel.tsx`): it is
 * full-width and 800px tall from `lg`, and 520px tall below `sm`, where the
 * mobile image takes over. Images are cropped with `object-cover`, so keep text
 * and products inside the central area.
 */
export const BANNER_IMAGE_HINTS = {
  desktop:
    "Recomendado: 1920 × 800 px (12:5). Mantenha textos e produtos no centro da arte.",
  mobile:
    "Recomendado: 1080 × 1440 px (3:4). Usada em telas menores que 640 px; sem ela, a imagem desktop é recortada.",
} as const;

/** ISO datetime → "YYYY-MM-DD" in local time, for `<input type="date">`. The
 *  end of the period is stored as 23:59 local, which is the next day in UTC. */
function isoToDateInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function bannerToFormState(b: Banner): BannerFormState {
  return {
    name: b.name,
    product_id: b.product_id ?? "",
    status: b.status,
    title: b.title ?? { pt: "" },
    label: b.label ?? "",
    href: b.href ?? "",
    link_url: b.link_url ?? "",
    display_from: isoToDateInput(b.display_from),
    display_until: isoToDateInput(b.display_until),
    order: b.order ?? 0,
    locale: toDisplayLocale(b.available_locales?.[0] ?? "pt"),
    desktop_image_library_id: b.desktop_image_library_id,
    mobile_image_library_id: b.mobile_image_library_id ?? "",
  };
}

/**
 * Label + title over the preview image, laid out like the home hero
 * (`hero-carousel.tsx`) at preview scale, in the banner's language.
 */
function BannerTextOverlay({ draft }: { draft: BannerFormState }) {
  const locale = toApiLocale(draft.locale);
  const title = draft.title[locale]?.trim() || draft.title.pt.trim();
  const label = draft.label.trim();
  if (!title && !label) return null;

  return (
    // The gradient keeps white text legible in the preview even before an
    // image is chosen.
    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-3 pt-8 pb-3">
      {label && (
        <p className="font-sans-condensed text-[10px] font-medium text-brand uppercase">
          {label}
        </p>
      )}
      {title && (
        <p
          className={cn(
            "font-sans-condensed text-base leading-none font-black whitespace-pre-line text-white uppercase",
            label && "mt-1",
          )}
        >
          {title}
        </p>
      )}
    </div>
  );
}

function BannerImagePreview({
  libraryId,
  alt,
  className,
}: {
  libraryId: string;
  alt: string;
  className: string;
}) {
  const { data } = useGetApiLibraryId(libraryId, {
    query: { enabled: Boolean(libraryId) },
  });
  const url = data ? currentAssetUrl(data) : "";
  return url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={alt} className={className} />
  ) : (
    <div className={className} />
  );
}

export function formatDateRange(from?: string, until?: string): string {
  if (!from && !until) return "—";
  const fmt = (s: string) =>
    new Date(s).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  if (from && until) return `${fmt(from)} – ${fmt(until)}`;
  if (from) return `A partir de ${fmt(from)}`;
  return `Até ${fmt(until!)}`;
}

interface BannerFormProps {
  draft: BannerFormState;
  isCreating: boolean;
  isSaving: boolean;
  onDraftChange: <K extends keyof BannerFormState>(
    key: K,
    value: BannerFormState[K],
  ) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export function BannerForm({
  draft,
  isCreating,
  isSaving,
  onDraftChange,
  onSave,
  onCancel,
  onDelete,
  isDeleting,
}: BannerFormProps) {
  const [destinationType, setDestinationType] = useState<"product" | "link">(
    draft.product_id ? "product" : "link",
  );

  return (
    <AdminPageLayout
      footer={
        <EditorFooter
          onBack={onCancel}
          deleteAction={
            !isCreating && onDelete
              ? {
                  label: "Excluir banner",
                  confirmTitle: `Excluir "${draft.name}"?`,
                  confirmDescription:
                    "O banner será removido permanentemente. Esta ação não pode ser desfeita.",
                  confirmLabel: "Sim, excluir",
                  onConfirm: onDelete,
                  isLoading: isDeleting,
                }
              : undefined
          }
          onPrimary={onSave}
          primaryLabel={isCreating ? "Criar banner" : "Salvar alterações"}
          isPrimaryLoading={isSaving}
        />
      }
    >
      <div className="grid grid-cols-[1fr_360px] gap-5">
        <div className="space-y-5">
          <AdminFormSection title="Informações do banner" raw>
            <AdminFormSectionContent>
              <div>
                <AdminLabel>Nome do banner *</AdminLabel>
                <Input
                  required
                  value={draft.name}
                  onChange={(e) => onDraftChange("name", e.target.value)}
                  placeholder="Ex: ST-4000EQ — Lançamento 2026"
                />
              </div>

              <div>
                <AdminLabel>Destino do banner</AdminLabel>
                <Select
                  value={destinationType}
                  onValueChange={(value) => {
                    if (value === "product") {
                      setDestinationType("product");
                      onDraftChange("href", "");
                    } else {
                      setDestinationType("link");
                      onDraftChange("product_id", "");
                      onDraftChange("link_url", "");
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">Associar produto</SelectItem>
                    <SelectItem value="link">Link personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {destinationType === "product" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <AdminLabel>Produto associado</AdminLabel>
                    <AdminProductPicker
                      value={draft.product_id}
                      onChange={(value) => onDraftChange("product_id", value)}
                    />
                  </div>
                  <div>
                    <AdminLabel>Parâmetros da URL do produto</AdminLabel>
                    <Input
                      value={draft.link_url}
                      onChange={(e) =>
                        onDraftChange("link_url", e.target.value)
                      }
                      placeholder="?utm_source=home"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <AdminLabel>Link personalizado</AdminLabel>
                  <Input
                    type="url"
                    value={draft.href}
                    onChange={(e) => onDraftChange("href", e.target.value)}
                    placeholder="https://exemplo.com/promocao"
                  />
                </div>
              )}

              <I18nInput
                label="Título do banner"
                value={draft.title}
                onChange={(title) => onDraftChange("title", title)}
                placeholder="Texto que aparece sobre o banner"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <AdminLabel>Etiqueta</AdminLabel>
                  <Input
                    value={draft.label}
                    onChange={(e) => onDraftChange("label", e.target.value)}
                    placeholder="Ex: LANÇAMENTO"
                  />
                </div>
                <div>
                  <AdminLabel>Ordem</AdminLabel>
                  <Input
                    type="number"
                    min={0}
                    step={1}
                    value={draft.order}
                    onChange={(e) =>
                      onDraftChange(
                        "order",
                        Math.max(0, Math.trunc(Number(e.target.value) || 0)),
                      )
                    }
                    placeholder="0"
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Menor número aparece primeiro no carrossel da home.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <AdminLabel>Idioma</AdminLabel>
                  <Select
                    value={draft.locale}
                    onValueChange={(value) =>
                      onDraftChange("locale", value ?? "")
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">🇧🇷 Português (BR)</SelectItem>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="es">🇪🇸 Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <AdminLabel>Status</AdminLabel>
                  <Select
                    value={draft.status}
                    onValueChange={(value) => {
                      if (value) onDraftChange("status", value as BannerStatus);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Ativo</SelectItem>
                      <SelectItem value="INACTIVE">Inativo</SelectItem>
                      <SelectItem value="SCHEDULED">Agendado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AdminFormSectionContent>

            <AdminFormSectionTitle
              title="Período de exibição"
              description="Deixe em branco para exibir indefinidamente."
              className="border-t"
            />
            <AdminFormSectionContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <AdminLabel>Início</AdminLabel>
                  <Input
                    type="date"
                    value={draft.display_from}
                    onChange={(e) =>
                      onDraftChange("display_from", e.target.value)
                    }
                  />
                </div>
                <div>
                  <AdminLabel>Fim</AdminLabel>
                  <Input
                    type="date"
                    value={draft.display_until}
                    onChange={(e) =>
                      onDraftChange("display_until", e.target.value)
                    }
                  />
                </div>
              </div>
            </AdminFormSectionContent>

            <AdminFormSectionTitle title="Imagens" className="border-t" />
            <AdminFormSectionContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <AdminLabel>Imagem desktop *</AdminLabel>
                  <LibraryAssetPicker
                    value={{ library_id: draft.desktop_image_library_id }}
                    type="IMAGE"
                    variant="image"
                    accept="image/*"
                    hint={BANNER_IMAGE_HINTS.desktop}
                    onChange={(asset: LibraryPickedAsset | null) =>
                      onDraftChange(
                        "desktop_image_library_id",
                        asset?.library_id ?? "",
                      )
                    }
                  />
                </div>
                <div>
                  <AdminLabel>Imagem mobile</AdminLabel>
                  <LibraryAssetPicker
                    value={
                      draft.mobile_image_library_id
                        ? { library_id: draft.mobile_image_library_id }
                        : null
                    }
                    type="IMAGE"
                    variant="image"
                    accept="image/*"
                    hint={BANNER_IMAGE_HINTS.mobile}
                    onChange={(asset: LibraryPickedAsset | null) =>
                      onDraftChange(
                        "mobile_image_library_id",
                        asset?.library_id ?? "",
                      )
                    }
                  />
                </div>
              </div>
            </AdminFormSectionContent>
          </AdminFormSection>
        </div>

        {/* Preview side panel */}
        <div className="space-y-4">
          <AdminFormSection title="Prévia — Desktop" raw>
            <AdminFormSectionContent>
              <div className="relative overflow-hidden rounded-md border border-border bg-muted">
                {draft.desktop_image_library_id ? (
                  <BannerImagePreview
                    libraryId={draft.desktop_image_library_id}
                    alt="Preview desktop"
                    className="h-36 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-36 items-center justify-center">
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <Image className="size-10 text-muted-foreground/30" />
                  </div>
                )}
                <BannerTextOverlay draft={draft} />
              </div>
            </AdminFormSectionContent>

            {draft.mobile_image_library_id && (
              <>
                <AdminFormSectionTitle
                  title="Prévia — Mobile"
                  className="border-t"
                />
                <AdminFormSectionContent>
                  <div className="relative overflow-hidden rounded-md border border-border bg-muted">
                    <BannerImagePreview
                      libraryId={draft.mobile_image_library_id}
                      alt="Preview mobile"
                      className="h-24 w-full object-cover"
                    />
                    <BannerTextOverlay draft={draft} />
                  </div>
                </AdminFormSectionContent>
              </>
            )}
          </AdminFormSection>
        </div>
      </div>
    </AdminPageLayout>
  );
}
