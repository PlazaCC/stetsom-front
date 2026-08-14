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
import {
  useGetApiProductsAdmin,
  useGetApiProductsAdminId,
  useGetApiLibraryId,
} from "@/api/stetsom";
import type { CmsProductRow } from "@/api/stetsom/model";
import { currentAssetUrl } from "@/app/admin/_components/crud/library-asset-ref";
import { toDisplayLocale } from "@/lib/api/i18n-utils";
import { Image, Check, ChevronDown, X } from "lucide-react";
import { useEffect, useState } from "react";

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
    desktop_image_library_id: b.desktop_image_library_id,
    mobile_image_library_id: b.mobile_image_library_id ?? "",
  };
}

export function ProductReferenceField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loadedProducts, setLoadedProducts] = useState<CmsProductRow[]>([]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);
  const { data, isLoading, isError } = useGetApiProductsAdmin(
    { page, pageSize: 20, q: debouncedQuery || undefined },
    { query: { enabled: open } },
  );
  const { data: selectedProduct } = useGetApiProductsAdminId(value, {
    query: { enabled: Boolean(value) && !open },
  });
  const products = data?.items ?? [];
  useEffect(() => {
    if (!data) return;
    const timer = setTimeout(() => {
      setLoadedProducts((current) =>
        page === 1
          ? data.items
          : [
              ...current,
              ...data.items.filter(
                (item) => !current.some((existing) => existing.id === item.id),
              ),
            ],
      );
    }, 0);
    return () => clearTimeout(timer);
  }, [data, page]);
  const hasMore = Boolean(data && page < data.totalPages);
  const selected =
    products.find((product) => product.id === value) ??
    selectedProduct?.product;
  const selectedName = selected
    ? typeof selected.name === "string"
      ? selected.name
      : selected.name.pt
    : "";
  const selectedSku = selected && "sku" in selected ? selected.sku : null;

  return (
    <div className="relative">
      <button
        type="button"
        className="flex h-9 w-full items-center justify-between rounded-md border border-border bg-card px-3 text-left text-sm"
        onClick={() => setOpen((current) => !current)}
      >
        <span
          className={selected ? "text-foreground" : "text-muted-foreground"}
        >
          {selected
            ? `${selectedName}${selectedSku ? ` · ${selectedSku}` : ""}`
            : "Selecione um produto"}
        </span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-md border border-border bg-card p-2 shadow-lg">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome ou SKU"
            autoFocus
          />
          <div className="mt-2 max-h-64 overflow-y-auto">
            {isLoading && (
              <p className="p-3 text-sm text-muted-foreground">Carregando...</p>
            )}
            {isError && (
              <p className="p-3 text-sm text-destructive">
                Não foi possível carregar produtos.
              </p>
            )}
            {!isLoading && !isError && products.length === 0 && (
              <p className="p-3 text-sm text-muted-foreground">
                Nenhum produto encontrado.
              </p>
            )}
            {loadedProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                className="flex w-full items-start gap-2 rounded p-2 text-left hover:bg-muted"
                onClick={() => {
                  onChange(product.id);
                  setOpen(false);
                }}
              >
                {product.id === value ? (
                  <Check className="mt-0.5 size-4" />
                ) : (
                  <span className="size-4" />
                )}
                <div className="size-8 shrink-0 overflow-hidden rounded bg-muted">
                  {product.thumbnail_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.thumbnail_url}
                      alt=""
                      className="size-full object-cover"
                    />
                  )}
                </div>
                <span className="min-w-0 text-sm">
                  <span className="block truncate">{product.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {[
                      product.sku,
                      product.category,
                      product.status,
                      product.is_discontinued ? "Descontinuado" : "",
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
              </button>
            ))}
            {hasMore && (
              <button
                type="button"
                className="w-full p-2 text-sm text-primary hover:bg-muted"
                onClick={() => setPage((current) => current + 1)}
              >
                Ver mais
              </button>
            )}
          </div>
          {value && (
            <button
              type="button"
              className="mt-2 flex w-full items-center justify-center gap-1 border-t border-border pt-2 text-xs text-muted-foreground hover:text-destructive"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
            >
              <X className="size-3" /> Limpar seleção
            </button>
          )}
        </div>
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
  onDraftChange: (
    key: keyof BannerFormState,
    value: string | I18nString,
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
                    <ProductReferenceField
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
                <div>
                  <AdminLabel>Imagem desktop *</AdminLabel>
                  <LibraryAssetPicker
                    value={{ library_id: draft.desktop_image_library_id }}
                    type="IMAGE"
                    variant="image"
                    accept="image/*"
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
              <div className="overflow-hidden rounded-md border border-border bg-muted">
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
              </div>
            </AdminFormSectionContent>

            {draft.mobile_image_library_id && (
              <>
                <AdminFormSectionTitle
                  title="Prévia — Mobile"
                  className="border-t"
                />
                <AdminFormSectionContent>
                  <div className="overflow-hidden rounded-md border border-border bg-muted">
                    <BannerImagePreview
                      libraryId={draft.mobile_image_library_id}
                      alt="Preview mobile"
                      className="h-24 w-full object-cover"
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
