"use client";

import { AdminActionBar } from "@/app/admin/_components/crud/admin-action-bar";
import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import { AdminStatusToggle } from "@/app/admin/_components/crud/admin-status-toggle";
import type { Banner, BannerStatus, Locale } from "@/lib/api/contracts";
import { MOCK_CMS_BANNERS } from "@/lib/mock/admin-cms";
import { ArrowLeft, Image, Plus } from "lucide-react";
import { useState } from "react";
import {
  AdminInput,
  AdminLabel,
  AdminSelect,
} from "../_components/crud/admin-input";
import { AdminFormSection } from "../_components/crud/admin-form-section";
import { AdminPanel } from "../_components/admin-panel";
import { AdminPageHeader } from "../_components/admin-page-header";

interface BannerDraft {
  name: string;
  product_id: string;
  desktop_image_url: string;
  mobile_image_url: string;
  link_url: string;
  status: BannerStatus;
  locale: Locale;
  display_from: string;
  display_until: string;
}

const EMPTY_DRAFT: BannerDraft = {
  name: "",
  product_id: "",
  desktop_image_url: "",
  mobile_image_url: "",
  link_url: "",
  status: "ACTIVE",
  locale: "pt-BR",
  display_from: "",
  display_until: "",
};

function bannerToDraft(b: Banner): BannerDraft {
  return {
    name: b.name,
    product_id: b.product_id ?? "",
    desktop_image_url: b.desktop_image_url,
    mobile_image_url: b.mobile_image_url ?? "",
    link_url: b.link_url ?? "",
    status: b.status,
    locale: b.locale,
    display_from: b.display_from ? b.display_from.split("T")[0] : "",
    display_until: b.display_until ? b.display_until.split("T")[0] : "",
  };
}

function statusLabel(status: BannerStatus): string {
  if (status === "ACTIVE") return "Ativo";
  if (status === "SCHEDULED") return "Agendado";
  return "Inativo";
}

function statusBadgeClass(status: BannerStatus): string {
  if (status === "ACTIVE")
    return "bg-green-50 text-green-700 border border-green-200";
  if (status === "SCHEDULED")
    return "bg-blue-50 text-blue-700 border border-blue-200";
  return "bg-muted text-muted-foreground border border-border";
}

function formatDateRange(from?: string, until?: string): string {
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

function BannerForm({
  draft,
  isCreating,
  onDraftChange,
  onSave,
  onCancel,
}: {
  draft: BannerDraft;
  isCreating: boolean;
  onDraftChange: (key: keyof BannerDraft, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
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
                  <AdminLabel>URL de destino (opcional)</AdminLabel>
                  <AdminInput
                    value={draft.link_url}
                    onChange={(e) => onDraftChange("link_url", e.target.value)}
                    placeholder="/produtos/st-4000eq"
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
                    <option value="es">🇲🇽 Español</option>
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
            <div className="space-y-4">
              <div>
                <AdminLabel>Imagem desktop *</AdminLabel>
                <AdminInput
                  value={draft.desktop_image_url}
                  onChange={(e) =>
                    onDraftChange("desktop_image_url", e.target.value)
                  }
                  placeholder="/uploads/banner-desktop.jpg"
                />
              </div>
              <div>
                <AdminLabel>Imagem mobile (opcional)</AdminLabel>
                <AdminInput
                  value={draft.mobile_image_url}
                  onChange={(e) =>
                    onDraftChange("mobile_image_url", e.target.value)
                  }
                  placeholder="/uploads/banner-mobile.jpg"
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
          disabled={!draft.name || !draft.desktop_image_url}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {isCreating ? "Criar banner" : "Salvar alterações"}
        </button>
      </AdminPanel>
    </div>
  );
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>(MOCK_CMS_BANNERS);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [draft, setDraft] = useState<BannerDraft>(EMPTY_DRAFT);

  const isFormOpen = isCreating || editingBanner !== null;

  function openCreate() {
    setDraft(EMPTY_DRAFT);
    setIsCreating(true);
  }

  function openEdit(banner: Banner) {
    setDraft(bannerToDraft(banner));
    setEditingBanner(banner);
  }

  function closeForm() {
    setIsCreating(false);
    setEditingBanner(null);
  }

  function handleDraftChange(key: keyof BannerDraft, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    const now = new Date().toISOString();
    if (isCreating) {
      const next: Banner = {
        id: `banner-${Date.now()}`,
        name: draft.name,
        product_id: draft.product_id || undefined,
        desktop_image_url: draft.desktop_image_url,
        mobile_image_url: draft.mobile_image_url || undefined,
        link_url: draft.link_url || undefined,
        status: draft.status,
        locale: draft.locale,
        display_from: draft.display_from || undefined,
        display_until: draft.display_until || undefined,
        order: banners.length + 1,
        created_at: now,
        updated_at: now,
        created_by: "usr-1",
      };
      setBanners((prev) => [...prev, next]);
    } else if (editingBanner) {
      setBanners((prev) =>
        prev.map((b) =>
          b.id === editingBanner.id
            ? {
                ...b,
                name: draft.name,
                product_id: draft.product_id || undefined,
                desktop_image_url: draft.desktop_image_url,
                mobile_image_url: draft.mobile_image_url || undefined,
                link_url: draft.link_url || undefined,
                status: draft.status,
                locale: draft.locale,
                display_from: draft.display_from || undefined,
                display_until: draft.display_until || undefined,
                updated_at: now,
              }
            : b,
        ),
      );
    }
    closeForm();
  }

  function toggleStatus(id: string) {
    setBanners((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: b.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }
          : b,
      ),
    );
  }

  if (isFormOpen) {
    return (
      <BannerForm
        draft={draft}
        isCreating={isCreating}
        onDraftChange={handleDraftChange}
        onSave={handleSave}
        onCancel={closeForm}
      />
    );
  }

  return (
    <AdminListPage
      title="Banners"
      icon={Image}
      action={
        <AdminActionBar>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80"
          >
            <Plus className="size-4" />
            Novo banner
          </button>
        </AdminActionBar>
      }
      toolbar={
        <p className="text-xs text-muted-foreground">
          {banners.length} {banners.length === 1 ? "banner" : "banners"}{" "}
          cadastrado{banners.length !== 1 ? "s" : ""}.
        </p>
      }
    >
      <div className="overflow-hidden rounded-[16px] border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="w-20 px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Preview
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Idioma
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Exibição
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {banners.map((banner) => (
                <tr key={banner.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="h-10 w-16 overflow-hidden rounded-md bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={banner.desktop_image_url}
                        alt={banner.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{banner.name}</p>
                    {banner.link_url && (
                      <p className="mt-0.5 max-w-40 truncate text-xs text-muted-foreground">
                        {banner.link_url}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {banner.locale === "pt-BR"
                      ? "🇧🇷 PT"
                      : banner.locale === "en"
                        ? "🇺🇸 EN"
                        : "🇲🇽 ES"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {formatDateRange(banner.display_from, banner.display_until)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {banner.status !== "SCHEDULED" && (
                        <AdminStatusToggle
                          active={banner.status === "ACTIVE"}
                          onToggle={() => toggleStatus(banner.id)}
                        />
                      )}
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(banner.status)}`}
                      >
                        {statusLabel(banner.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(banner)}
                      className="text-xs font-medium text-brand hover:underline"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminListPage>
  );
}
