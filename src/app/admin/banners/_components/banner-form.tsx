"use client";

import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import { AdminPanel } from "@/app/admin/_components/admin-panel";
import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import {
  AdminInput,
  AdminLabel,
  AdminSelect,
} from "@/app/admin/_components/crud/admin-input";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import type { Banner, BannerStatus, I18nString } from "@/api/stetsom/model";
import { toDisplayLocale } from "@/lib/cms/locale-utils";
import { ArrowLeft, Image, X } from "lucide-react";
import { useRef } from "react";

/**
 * Banner form state - UI layer representation
 *
 * API mapping:
 * - locale -> available_locales[0] (singular to array)
 * - desktop_image_url/mobile_image_url -> preview URLs (not sent to API)
 * - File objects handled separately in parent component
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
  desktop_image_url: string;
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
  desktop_image_url: "",
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
    desktop_image_url: "",
    mobile_image_url: "",
  };
}

export function statusLabel(status: BannerStatus): string {
  if (status === "ACTIVE") return "Ativo";
  if (status === "SCHEDULED") return "Agendado";
  return "Inativo";
}

export function statusBadgeClass(status: BannerStatus): string {
  if (status === "ACTIVE")
    return "border border-cms-step-done bg-cms-step-done text-white";
  if (status === "SCHEDULED")
    return "border border-cms-active-item bg-cms-active-item text-foreground";
  return "bg-muted text-muted-foreground border border-border";
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

function ImageUploadSlot({
  url,
  label,
  accept = "image/*",
  onFile,
  onClear,
}: {
  url: string;
  label: string;
  accept?: string;
  onFile: (file: File) => void;
  onClear?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    onFile(file);
  }

  return (
    <div className="relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-md border border-dashed border-border bg-muted p-4">
      {url ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={label}
            className="h-28 w-full rounded object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
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
        <div
          className="flex cursor-pointer flex-col items-center gap-1"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          role="button"
          tabIndex={0}
        >
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image className="size-6 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

interface BannerFormProps {
  draft: BannerFormState;
  isCreating: boolean;
  isSaving: boolean;
  onDraftChange: (
    key: keyof BannerFormState,
    value: string | I18nString,
  ) => void;
  onSave: () => void;
  onCancel: () => void;
  onDesktopFile?: (file: File) => void;
  onMobileFile?: (file: File) => void;
  onClearDesktopFile?: () => void;
  onClearMobileFile?: () => void;
}

export function BannerForm({
  draft,
  isCreating,
  isSaving,
  onDraftChange,
  onSave,
  onCancel,
  onDesktopFile,
  onMobileFile,
  onClearDesktopFile,
  onClearMobileFile,
}: BannerFormProps) {
  return (
    <div className="flex flex-col gap-5">
      <AdminPanel className="flex items-center justify-between p-5">
        <AdminPageHeader
          title={isCreating ? "Novo banner" : "Editar banner"}
          icon={Image}
        />
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar para lista
        </button>
      </AdminPanel>

      <div className="grid grid-cols-[1fr_360px] gap-5">
        <div className="space-y-5">
          <AdminFormSection title="Informações do banner">
            <div className="space-y-4">
              <div>
                <AdminLabel>Nome do banner *</AdminLabel>
                <AdminInput
                  required
                  value={draft.name}
                  onChange={(e) => onDraftChange("name", e.target.value)}
                  placeholder="Ex: ST-4000EQ — Lançamento 2026"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <AdminLabel>Produto associado (opcional)</AdminLabel>
                  <AdminInput
                    value={draft.product_id}
                    onChange={(e) =>
                      onDraftChange("product_id", e.target.value)
                    }
                    placeholder="ID do produto"
                  />
                </div>
                <div>
                  <AdminLabel>URL de destino para produto</AdminLabel>
                  <AdminInput
                    value={draft.link_url}
                    onChange={(e) => onDraftChange("link_url", e.target.value)}
                    placeholder="/produtos/st-4000eq"
                  />
                </div>
              </div>

              <div>
                <AdminLabel>Link personalizado (opcional)</AdminLabel>
                <AdminInput
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
                  <AdminInput
                    value={draft.label}
                    onChange={(e) => onDraftChange("label", e.target.value)}
                    placeholder="Ex: LANÇAMENTO"
                  />
                </div>
                <div>
                  <AdminLabel>Ordem</AdminLabel>
                  <AdminInput
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
                  <AdminSelect
                    value={draft.locale}
                    onChange={(e) => onDraftChange("locale", e.target.value)}
                  >
                    <option value="pt-BR">🇧🇷 Português (BR)</option>
                    <option value="en">🇺🇸 English</option>
                    <option value="es">🇪🇸 Español</option>
                  </AdminSelect>
                </div>
                <div>
                  <AdminLabel>Status</AdminLabel>
                  <AdminSelect
                    value={draft.status}
                    onChange={(e) => onDraftChange("status", e.target.value)}
                  >
                    <option value="ACTIVE">Ativo</option>
                    <option value="INACTIVE">Inativo</option>
                    <option value="SCHEDULED">Agendado</option>
                  </AdminSelect>
                </div>
              </div>
            </div>
          </AdminFormSection>

          <AdminFormSection
            title="Período de exibição"
            description="Deixe em branco para exibir indefinidamente."
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <AdminLabel>Início</AdminLabel>
                <AdminInput
                  type="date"
                  value={draft.display_from}
                  onChange={(e) =>
                    onDraftChange("display_from", e.target.value)
                  }
                />
              </div>
              <div>
                <AdminLabel>Fim</AdminLabel>
                <AdminInput
                  type="date"
                  value={draft.display_until}
                  onChange={(e) =>
                    onDraftChange("display_until", e.target.value)
                  }
                />
              </div>
            </div>
          </AdminFormSection>

          <AdminFormSection title="Imagens">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <AdminLabel>Imagem desktop *</AdminLabel>
                <ImageUploadSlot
                  url={draft.desktop_image_url}
                  label="Clique para selecionar"
                  onFile={(file) => {
                    const previewUrl = URL.createObjectURL(file);
                    onDraftChange("desktop_image_url", previewUrl);
                    onDesktopFile?.(file);
                  }}
                  onClear={
                    draft.desktop_image_url
                      ? () => {
                          onDraftChange("desktop_image_url", "");
                          onClearDesktopFile?.();
                        }
                      : undefined
                  }
                />
              </div>
              <div>
                <AdminLabel>Imagem mobile (opcional)</AdminLabel>
                <ImageUploadSlot
                  url={draft.mobile_image_url}
                  label="Clique para selecionar"
                  onFile={(file) => {
                    const previewUrl = URL.createObjectURL(file);
                    onDraftChange("mobile_image_url", previewUrl);
                    onMobileFile?.(file);
                  }}
                  onClear={
                    draft.mobile_image_url
                      ? () => {
                          onDraftChange("mobile_image_url", "");
                          onClearMobileFile?.();
                        }
                      : undefined
                  }
                />
              </div>
            </div>
          </AdminFormSection>
        </div>

        {/* Preview side panel */}
        <div className="space-y-4">
          <AdminFormSection title="Prévia — Desktop">
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
          </AdminFormSection>

          {draft.mobile_image_url && (
            <AdminFormSection title="Prévia — Mobile">
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
            </AdminFormSection>
          )}
        </div>
      </div>

      <AdminPanel className="flex items-center justify-end gap-3 px-5 py-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {isCreating ? "Criar banner" : "Salvar alterações"}
        </button>
      </AdminPanel>
    </div>
  );
}
