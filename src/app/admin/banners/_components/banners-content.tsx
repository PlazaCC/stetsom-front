"use client";

import { AdminActionBar } from "@/app/admin/_components/crud/admin-action-bar";
import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import { AdminStatusToggle } from "@/app/admin/_components/crud/admin-status-toggle";
import type {
  Banner,
  BannerWithUploads,
  CreateBannerInput,
} from "@/lib/api/contracts";
import { useBannerMutations } from "@/hooks/use-banner-mutations";
import { useInlineUpload } from "@/hooks/use-inline-upload";
import { cn } from "@/lib/utils";
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
  const [banners] = useState<Banner[]>(initialBanners);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [draft, setDraft] = useState<BannerDraft>(EMPTY_DRAFT);
  const [desktopImageFile, setDesktopImageFile] = useState<File | null>(null);
  const [mobileImageFile, setMobileImageFile] = useState<File | null>(null);

  const mutations = useBannerMutations();
  const inlineUpload = useInlineUpload();

  const isFormOpen = isCreating || editingBanner !== null;
  const isSaving =
    mutations.create.isPending ||
    mutations.update.isPending ||
    inlineUpload.isUploading;

  function openCreate() {
    setDraft(EMPTY_DRAFT);
    setDesktopImageFile(null);
    setMobileImageFile(null);
    setIsCreating(true);
  }

  function openEdit(banner: Banner) {
    setDraft(bannerToDraft(banner));
    setDesktopImageFile(null);
    setMobileImageFile(null);
    setEditingBanner(banner);
  }

  function closeForm() {
    setIsCreating(false);
    setEditingBanner(null);
  }

  function handleDraftChange(key: keyof BannerDraft, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function buildPayload(): CreateBannerInput {
    const payload: CreateBannerInput = {
      name: draft.name,
      product_id: draft.product_id || undefined,
      desktop_image: desktopImageFile
        ? {
            fileName: desktopImageFile.name,
            mimeType: desktopImageFile.type,
            sizeBytes: desktopImageFile.size,
          }
        : { fileName: "", mimeType: "", sizeBytes: 0 },
      link_url: draft.link_url || undefined,
      status: draft.status,
      locale: draft.locale,
      display_from: draft.display_from || undefined,
      display_until: draft.display_until || undefined,
    };

    if (mobileImageFile) {
      payload.mobile_image = {
        fileName: mobileImageFile.name,
        mimeType: mobileImageFile.type,
        sizeBytes: mobileImageFile.size,
      };
    }

    return payload;
  }

  function buildUpdatePayload(): Partial<CreateBannerInput> {
    const payload: Partial<CreateBannerInput> = {
      name: draft.name,
      product_id: draft.product_id || undefined,
      link_url: draft.link_url || undefined,
      status: draft.status,
      locale: draft.locale,
      display_from: draft.display_from || undefined,
      display_until: draft.display_until || undefined,
    };

    if (desktopImageFile) {
      payload.desktop_image = {
        fileName: desktopImageFile.name,
        mimeType: desktopImageFile.type,
        sizeBytes: desktopImageFile.size,
      };
    }

    if (mobileImageFile) {
      payload.mobile_image = {
        fileName: mobileImageFile.name,
        mimeType: mobileImageFile.type,
        sizeBytes: mobileImageFile.size,
      };
    }

    return payload;
  }

  async function handleSave() {
    let result: BannerWithUploads;

    if (isCreating) {
      const payload = buildPayload();
      result = await mutations.create.mutateAsync(payload);
    } else if (editingBanner) {
      const payload = buildUpdatePayload();
      result = await mutations.update.mutateAsync({
        id: editingBanner.id,
        input: payload,
      });
    } else {
      return;
    }

    const fileMap = new Map<string, File>();
    if (desktopImageFile && result.uploads?.desktop) {
      fileMap.set("desktop", desktopImageFile);
    }
    if (mobileImageFile && result.uploads?.mobile) {
      fileMap.set("mobile", mobileImageFile);
    }

    if (fileMap.size > 0 && result.uploads) {
      await inlineUpload.upload(result.uploads, fileMap);
    }

    closeForm();
  }

  async function handleDelete(id: string) {
    await mutations.remove.mutateAsync(id);
  }

  if (isFormOpen) {
    return (
      <BannerForm
        draft={draft}
        isCreating={isCreating}
        onDraftChange={handleDraftChange}
        onSave={handleSave}
        onCancel={closeForm}
        onDesktopFile={setDesktopImageFile}
        onMobileFile={setMobileImageFile}
        onClearDesktopFile={() => setDesktopImageFile(null)}
        onClearMobileFile={() => setMobileImageFile(null)}
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
            disabled={isSaving}
            className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80 disabled:opacity-50"
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
                      ? "PT"
                      : banner.locale === "en"
                        ? "EN"
                        : "ES"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {formatDateRange(banner.display_from, banner.display_until)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {banner.status !== "SCHEDULED" && (
                        <AdminStatusToggle
                          active={banner.status === "ACTIVE"}
                          onToggle={async () => {
                            const newStatus =
                              banner.status === "ACTIVE"
                                ? ("INACTIVE" as const)
                                : ("ACTIVE" as const);
                            await mutations.update.mutateAsync({
                              id: banner.id,
                              input: { status: newStatus },
                            });
                          }}
                        />
                      )}
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          statusBadgeClass(banner.status),
                        )}
                      >
                        {statusLabel(banner.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => openEdit(banner)}
                      className="text-xs font-medium text-brand hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(`Excluir banner "${banner.name}"?`)
                        ) {
                          handleDelete(banner.id);
                        }
                      }}
                      disabled={mutations.remove.isPending}
                      className="text-xs font-medium text-red-500 hover:underline disabled:opacity-50"
                    >
                      Excluir
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
