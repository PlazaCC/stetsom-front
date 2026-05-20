"use client";

import { AdminActionBar } from "@/app/admin/_components/crud/admin-action-bar";
import { AdminDrawer } from "@/app/admin/_components/crud/admin-drawer";
import {
  AdminInput,
  AdminLabel,
  AdminSelect,
} from "@/app/admin/_components/crud/admin-input";
import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import { AdminSortableRow } from "@/app/admin/_components/crud/admin-sortable-row";
import { AdminStatusToggle } from "@/app/admin/_components/crud/admin-status-toggle";
import type { Banner, BannerStatus } from "@/lib/api/contracts";
import { MOCK_CMS_BANNERS } from "@/lib/mock/admin-cms";
import { Image, Plus } from "lucide-react";
import { useState } from "react";

interface BannerDraft {
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  link_label: string;
  status: BannerStatus;
}

const EMPTY_DRAFT: BannerDraft = {
  title: "",
  subtitle: "",
  image_url: "",
  link_url: "",
  link_label: "",
  status: "ACTIVE",
};

function bannerToDraft(b: Banner): BannerDraft {
  return {
    title: b.title,
    subtitle: b.subtitle ?? "",
    image_url: b.image_url,
    link_url: b.link_url ?? "",
    link_label: b.link_label ?? "",
    status: b.status,
  };
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>(MOCK_CMS_BANNERS);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [draft, setDraft] = useState<BannerDraft>(EMPTY_DRAFT);

  const drawerOpen = isCreating || editingBanner !== null;
  const drawerTitle = isCreating ? "Novo banner" : "Editar banner";

  function openCreate() {
    setDraft(EMPTY_DRAFT);
    setIsCreating(true);
  }

  function openEdit(banner: Banner) {
    setDraft(bannerToDraft(banner));
    setEditingBanner(banner);
  }

  function closeDrawer() {
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
        title: draft.title,
        subtitle: draft.subtitle || undefined,
        image_url: draft.image_url,
        link_url: draft.link_url || undefined,
        link_label: draft.link_label || undefined,
        status: draft.status,
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
                title: draft.title,
                subtitle: draft.subtitle || undefined,
                image_url: draft.image_url,
                link_url: draft.link_url || undefined,
                link_label: draft.link_label || undefined,
                status: draft.status,
                updated_at: now,
              }
            : b,
        ),
      );
    }
    closeDrawer();
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

  function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setOverId(null);
      return;
    }
    setBanners((prev) => {
      const items = [...prev];
      const fromIndex = items.findIndex((b) => b.id === draggedId);
      const toIndex = items.findIndex((b) => b.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const [removed] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, removed);
      return items.map((b, i) => ({ ...b, order: i + 1 }));
    });
    setDraggedId(null);
    setOverId(null);
  }

  return (
    <>
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
            Arraste as linhas para reordenar. A ordem aqui reflete a exibição no
            site.
          </p>
        }
      >
        <div className="overflow-hidden rounded-[16px] border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="w-8 px-2 py-3" />
                  <th className="w-20 px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Ordem
                  </th>
                  <th className="w-20 px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Preview
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Título
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Link
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
                  <AdminSortableRow
                    key={banner.id}
                    id={banner.id}
                    isDragging={draggedId === banner.id}
                    isOver={overId === banner.id && draggedId !== banner.id}
                    onDragStart={setDraggedId}
                    onDragOver={(e, id) => {
                      e.preventDefault();
                      setOverId(id);
                    }}
                    onDrop={handleDrop}
                    onDragEnd={() => {
                      setDraggedId(null);
                      setOverId(null);
                    }}
                  >
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {banner.order}
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-10 w-16 overflow-hidden rounded-md bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={banner.image_url}
                          alt={banner.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">
                          {banner.title}
                        </p>
                        {banner.subtitle && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {banner.subtitle}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="max-w-40 px-4 py-3">
                      <span className="block truncate text-xs text-muted-foreground">
                        {banner.link_url ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <AdminStatusToggle
                          active={banner.status === "ACTIVE"}
                          onToggle={() => toggleStatus(banner.id)}
                        />
                        <span className="text-xs text-muted-foreground">
                          {banner.status === "ACTIVE" ? "Ativo" : "Inativo"}
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
                  </AdminSortableRow>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AdminListPage>

      <AdminDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        title={drawerTitle}
        width="w-[480px]"
      >
        <div className="space-y-4">
          <div>
            <AdminLabel>Título</AdminLabel>
            <AdminInput
              required
              value={draft.title}
              onChange={(e) => handleDraftChange("title", e.target.value)}
              placeholder="Ex: ST-4000EQ — O Amplificador Definitivo"
            />
          </div>

          <div>
            <AdminLabel>Subtítulo (opcional)</AdminLabel>
            <AdminInput
              value={draft.subtitle}
              onChange={(e) => handleDraftChange("subtitle", e.target.value)}
              placeholder="Breve descrição exibida no banner"
            />
          </div>

          <div>
            <AdminLabel>URL da imagem</AdminLabel>
            <AdminInput
              value={draft.image_url}
              onChange={(e) => handleDraftChange("image_url", e.target.value)}
              placeholder="/uploads/banner.jpg"
            />
            {draft.image_url && (
              <div className="mt-2 h-24 overflow-hidden rounded-md bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={draft.image_url}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <AdminLabel>URL do link (opcional)</AdminLabel>
              <AdminInput
                value={draft.link_url}
                onChange={(e) => handleDraftChange("link_url", e.target.value)}
                placeholder="/produtos/st-4000eq"
              />
            </div>
            <div>
              <AdminLabel>Label do link (opcional)</AdminLabel>
              <AdminInput
                value={draft.link_label}
                onChange={(e) =>
                  handleDraftChange("link_label", e.target.value)
                }
                placeholder="Ver produto"
              />
            </div>
          </div>

          <div>
            <AdminLabel>Status</AdminLabel>
            <AdminSelect
              value={draft.status}
              onChange={(e) => handleDraftChange("status", e.target.value)}
            >
              <option value="ACTIVE">Ativo</option>
              <option value="INACTIVE">Inativo</option>
            </AdminSelect>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeDrawer}
              className="flex-1 rounded-md border border-border py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!draft.title || !draft.image_url}
              className="flex-1 rounded-md bg-foreground py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {isCreating ? "Criar banner" : "Salvar alterações"}
            </button>
          </div>
        </div>
      </AdminDrawer>
    </>
  );
}
