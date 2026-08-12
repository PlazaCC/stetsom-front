"use client";

import {
  AdminFormSection,
  AdminFormSectionContent,
  AdminFormSectionTitle,
} from "@/app/admin/_components/crud/admin-form-section";
import { AdminLabel } from "@/app/admin/_components/crud/admin-input";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import { EditorFooter } from "@/app/admin/_components/crud/editor-footer";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { LibraryAssetPicker } from "@/app/admin/_components/crud/library-asset-picker";
import type { LibraryPickedAsset } from "@/app/admin/_components/crud/library-asset-ref";
import { ProductCombobox } from "@/app/admin/_components/crud/product-combobox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Banner, BannerStatus, I18nString } from "@/api/stetsom/model";
import { toDisplayLocale } from "@/lib/api/i18n-utils";
import { Image } from "lucide-react";

/**
 * Banner form state — UI layer representation.
 *
 * API mapping:
 * - locale -> available_locales[0] (singular to array)
 * - *_image_library_id -> sent to the API
 * - *_image_url -> preview only; the picker resolves it from the id when absent
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
  desktop_image_url: string;
  mobile_image_library_id: string;
  mobile_image_url: string;
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
  desktop_image_url: "",
  mobile_image_library_id: "",
  mobile_image_url: "",
};

export function bannerToFormState(b: Banner): BannerFormState {
  return {
    name: b.name,
    product_id: b.product_id ?? "",
    status: b.status,
    title: b.title ?? { pt: "" },
    label: b.label ?? "",
    href: b.href ?? "",
    link_url: b.link_url ?? "",
    display_from: b.display_from ? b.display_from.split("T")[0] : "",
    display_until: b.display_until ? b.display_until.split("T")[0] : "",
    order: b.order ?? 0,
    locale: toDisplayLocale(b.available_locales?.[0] ?? "pt"),
    // Only the ids are persisted — LibraryAssetPicker resolves the preview URLs.
    desktop_image_library_id: b.desktop_image_library_id ?? "",
    desktop_image_url: "",
    mobile_image_library_id: b.mobile_image_library_id ?? "",
    mobile_image_url: "",
  };
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
  onDraftChange: (
    key: keyof BannerFormState,
    value: string | I18nString,
  ) => void;
  /** Sets the id and preview URL of one image slot in a single update. */
  onImagePick: (
    slot: "desktop" | "mobile",
    asset: LibraryPickedAsset | null,
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
  onImagePick,
  onSave,
  onCancel,
  onDelete,
  isDeleting,
}: BannerFormProps) {
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <AdminLabel>Produto associado (opcional)</AdminLabel>
                  <ProductCombobox
                    value={draft.product_id}
                    onChange={(productId) =>
                      onDraftChange("product_id", productId)
                    }
                  />
                </div>
                <div>
                  <AdminLabel>URL de destino para produto</AdminLabel>
                  <Input
                    value={draft.link_url}
                    onChange={(e) => onDraftChange("link_url", e.target.value)}
                    placeholder="/produtos/st-4000eq"
                  />
                </div>
              </div>

              <div>
                <AdminLabel>Link personalizado (opcional)</AdminLabel>
                <Input
                  type="url"
                  value={draft.href}
                  onChange={(e) => onDraftChange("href", e.target.value)}
                  placeholder="https://exemplo.com/promocao"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Use este campo para links externos. Mutuamente exclusivo com
                  produto.
                </p>
              </div>

              <I18nInput
                label="Título do banner (opcional)"
                value={draft.title}
                onChange={(title) => onDraftChange("title", title)}
                placeholder="Texto que aparece sobre o banner"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <AdminLabel>Etiqueta (opcional)</AdminLabel>
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
                    value={draft.order}
                    onChange={(e) =>
                      onDraftChange(
                        "order",
                        String(Number(e.target.value) || 0),
                      )
                    }
                    placeholder="0"
                  />
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
                    onValueChange={(value) =>
                      onDraftChange("status", value ?? "")
                    }
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
                <LibraryAssetPicker
                  label="Imagem desktop *"
                  type="IMAGE"
                  value={{
                    library_id: draft.desktop_image_library_id,
                    file_url: draft.desktop_image_url,
                  }}
                  onChange={(asset) => onImagePick("desktop", asset)}
                />
                <LibraryAssetPicker
                  label="Imagem mobile (opcional)"
                  type="IMAGE"
                  value={{
                    library_id: draft.mobile_image_library_id,
                    file_url: draft.mobile_image_url,
                  }}
                  onChange={(asset) => onImagePick("mobile", asset)}
                />
              </div>
            </AdminFormSectionContent>
          </AdminFormSection>
        </div>

        {/* Preview side panel */}
        <div className="space-y-4">
          <AdminFormSection title="Prévia — Desktop" raw>
            <AdminFormSectionContent>
              <div className="overflow-hidden rounded-md border border-border bg-muted">
                {draft.desktop_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={draft.desktop_image_url}
                    alt="Preview desktop"
                    className="h-36 w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-36 items-center justify-center">
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <Image className="size-10 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            </AdminFormSectionContent>

            {draft.mobile_image_url && (
              <>
                <AdminFormSectionTitle
                  title="Prévia — Mobile"
                  className="border-t"
                />
                <AdminFormSectionContent>
                  <div className="overflow-hidden rounded-md border border-border bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={draft.mobile_image_url}
                      alt="Preview mobile"
                      className="h-24 w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
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
