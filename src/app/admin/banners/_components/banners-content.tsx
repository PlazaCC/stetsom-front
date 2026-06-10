"use client";

import { AdminActionBar } from "@/app/admin/_components/crud/admin-action-bar";
import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import { AdminStatusToggle } from "@/app/admin/_components/crud/admin-status-toggle";
import type {
  Banner,
  BannersPayload,
  BannerWithUploads,
  PostApiBannersBody,
  PatchApiBannersIdBody,
  UploadPresignResponse,
} from "@/api/stetsom/model";
import {
  getGetApiBannersQueryKey,
  postApiBanners,
  patchApiBannersId,
  deleteApiBannersId,
} from "@/api/stetsom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useInlineUpload } from "@/hooks/use-inline-upload";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Plus } from "lucide-react";
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

function toLocaleDisplay(locale: string): string {
  if (locale === "pt-BR" || locale === "pt") return "PT";
  if (locale === "en") return "EN";
  return "ES";
}

export function BannersContent({
  initialBanners,
}: {
  initialBanners: BannersPayload;
}) {
  const queryClient = useQueryClient();
  const banners = initialBanners.items;
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [draft, setDraft] = useState<BannerDraft>(EMPTY_DRAFT);
  const [desktopImageFile, setDesktopImageFile] = useState<File | null>(null);
  const [mobileImageFile, setMobileImageFile] = useState<File | null>(null);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getGetApiBannersQueryKey() });
  }

  const createBanner = useMutation({
    mutationFn: (body: PostApiBannersBody) => postApiBanners(body),
  });
  const updateBanner = useMutation({
    mutationFn: ({ id, body }: { id: string; body: PatchApiBannersIdBody }) =>
      patchApiBannersId(id, body),
  });
  const deleteBanner = useMutation({
    mutationFn: (id: string) => deleteApiBannersId(id),
    onSuccess: invalidate,
  });
  const inlineUpload = useInlineUpload();

  const isFormOpen = isCreating || editingBanner !== null;
  const isSaving =
    createBanner.isPending ||
    updateBanner.isPending ||
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

  function buildPayload(): PostApiBannersBody {
    const payload: PostApiBannersBody = {
      name: draft.name,
      product_id: draft.product_id || null,
      desktop_image: desktopImageFile
        ? {
            fileName: desktopImageFile.name,
            mimeType: desktopImageFile.type,
            sizeBytes: desktopImageFile.size,
          }
        : { fileName: "", mimeType: "", sizeBytes: 0 },
      link_url: draft.link_url || null,
      status: draft.status as PostApiBannersBody["status"],
      available_locales: draft.locale
        ? ([
            draft.locale === "pt-BR" ? "pt" : draft.locale,
          ] as PostApiBannersBody["available_locales"])
        : undefined,
      display_from: draft.display_from || null,
      display_until: draft.display_until || null,
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

  function buildUpdatePayload(): PatchApiBannersIdBody {
    const payload: PatchApiBannersIdBody = {
      name: draft.name || undefined,
      product_id: draft.product_id || null,
      link_url: draft.link_url || null,
      status: draft.status as PatchApiBannersIdBody["status"],
      available_locales: draft.locale
        ? ([
            draft.locale === "pt-BR" ? "pt" : draft.locale,
          ] as PatchApiBannersIdBody["available_locales"])
        : undefined,
      display_from: draft.display_from || null,
      display_until: draft.display_until || null,
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
      result = await createBanner.mutateAsync(payload);
    } else if (editingBanner) {
      const payload = buildUpdatePayload();
      result = await updateBanner.mutateAsync({
        id: editingBanner.id,
        body: payload,
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
      await inlineUpload.upload(
        result.uploads as Record<string, UploadPresignResponse>,
        fileMap,
      );
    }

    closeForm();
    invalidate();
  }

  async function handleDelete(id: string) {
    await deleteBanner.mutateAsync(id);
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
      icon={ImageIcon}
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
                    <div className="flex h-10 w-16 items-center justify-center overflow-hidden rounded-md bg-muted">
                      <ImageIcon className="size-4 text-muted-foreground/40" />
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
                    {toLocaleDisplay(banner.available_locales?.[0] ?? "pt-BR")}
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
                            await updateBanner.mutateAsync({
                              id: banner.id,
                              body: { status: newStatus },
                            });
                            invalidate();
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
                      disabled={deleteBanner.isPending}
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
