"use client";

import { AdminActionBar } from "@/app/admin/_components/crud/admin-action-bar";
import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import { AdminStatusToggle } from "@/app/admin/_components/crud/admin-status-toggle";
import type { Banner } from "@/lib/api/contracts";
import { Image, Plus } from "lucide-react";
import { useState } from "react";
import {
  BannerDraft,
  BannerForm,
  EMPTY_DRAFT,
  bannerToDraft,
  formatDateRange,
  statusBadgeClass,
  statusLabel,
} from "./banner-form";

export function BannersContent({
  initialBanners,
}: {
  initialBanners: Banner[];
}) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
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
            type="button"
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
                        : "🇪🇸 ES"}
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
                      type="button"
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
