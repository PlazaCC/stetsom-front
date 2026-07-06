"use client";

import { AdminActionBar } from "@/app/admin/_components/crud/admin-action-bar";
import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/app/admin/_components/crud/admin-data-table";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import { AdminStatusToggle } from "@/app/admin/_components/crud/admin-status-toggle";
import type {
  Banner,
  BannersPayload,
  BannerWithUploads,
  PostApiBannersBody,
  PatchApiBannersIdBody,
  UploadPresignResponse,
  I18nString,
} from "@/api/stetsom/model";
import {
  getGetApiBannersQueryKey,
  postApiBanners,
  patchApiBannersId,
  deleteApiBannersId,
} from "@/api/stetsom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useInlineUpload } from "@/hooks/use-inline-upload";
import { toApiLocale } from "@/lib/api/i18n-utils";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Plus } from "lucide-react";
import { useState } from "react";
import {
  BannerFormState,
  BannerForm,
  EMPTY_FORM_STATE,
  bannerToFormState,
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
  const [draft, setDraft] = useState<BannerFormState>(EMPTY_FORM_STATE);
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
    setDraft(EMPTY_FORM_STATE);
    setDesktopImageFile(null);
    setMobileImageFile(null);
    setIsCreating(true);
  }

  function openEdit(banner: Banner) {
    setDraft(bannerToFormState(banner));
    setDesktopImageFile(null);
    setMobileImageFile(null);
    setEditingBanner(banner);
  }

  function closeForm() {
    setIsCreating(false);
    setEditingBanner(null);
  }

  function handleDraftChange(
    key: keyof BannerFormState,
    value: string | I18nString,
  ) {
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
      href: draft.href || null,
      title: (draft.title as I18nString).pt
        ? (draft.title as I18nString)
        : undefined,
      label: draft.label || null,
      order: draft.order ?? 0,
      status: draft.status,
      available_locales: draft.locale ? [toApiLocale(draft.locale)] : undefined,
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
      href: draft.href || null,
      title: (draft.title as I18nString).pt
        ? (draft.title as I18nString)
        : undefined,
      label: draft.label || null,
      order: draft.order ?? undefined,
      status: draft.status,
      available_locales: draft.locale ? [toApiLocale(draft.locale)] : undefined,
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

  const columns: AdminTableColumn<Banner>[] = [
    {
      key: "preview",
      header: "Preview",
      className: "w-20",
      render: () => (
        <div className="flex h-10 w-16 items-center justify-center overflow-hidden rounded-md bg-muted">
          <ImageIcon className="size-4 text-muted-foreground/40" />
        </div>
      ),
    },
    {
      key: "name",
      header: "Nome",
      render: (banner) => (
        <div>
          <p className="font-medium text-foreground">{banner.name}</p>
          {banner.link_url && (
            <p className="mt-0.5 max-w-40 truncate text-xs text-muted-foreground">
              {banner.link_url}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "available_locales",
      header: "Idioma",
      render: (banner) => (
        <span className="text-xs text-muted-foreground">
          {toLocaleDisplay(banner.available_locales?.[0] ?? "pt-BR")}
        </span>
      ),
    },
    {
      key: "display_from",
      header: "Exibição",
      render: (banner) => (
        <span className="text-xs text-muted-foreground">
          {formatDateRange(banner.display_from, banner.display_until)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (banner) => (
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
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "text-right",
      className: "text-right",
      render: (banner) => (
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => openEdit(banner)}
            className="text-xs font-medium text-primary hover:underline"
          >
            Editar
          </button>
        </div>
      ),
    },
  ];

  if (isFormOpen) {
    return (
      <BannerForm
        draft={draft}
        isCreating={isCreating}
        isSaving={isSaving}
        onDraftChange={handleDraftChange}
        onSave={handleSave}
        onCancel={closeForm}
        onDesktopFile={setDesktopImageFile}
        onMobileFile={setMobileImageFile}
        onClearDesktopFile={() => setDesktopImageFile(null)}
        onClearMobileFile={() => setMobileImageFile(null)}
        onDelete={
          editingBanner
            ? async () => {
                await handleDelete(editingBanner.id);
                closeForm();
              }
            : undefined
        }
        isDeleting={deleteBanner.isPending}
      />
    );
  }

  return (
    <AdminPageLayout>
      <AdminDataTable
        columns={columns}
        data={banners}
        keyExtractor={(banner) => banner.id}
        emptyTitle="Nenhum banner cadastrado"
        emptyDescription="Banners são exibidos no hero da página inicial."
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
      />
    </AdminPageLayout>
  );
}
