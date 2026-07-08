"use client";

import type {
  Banner,
  BannerWithUploads,
  PatchApiBannersIdBody,
  PostApiBannersBody,
  UploadPresignResponse,
  I18nString,
} from "@/api/stetsom/model";
import {
  postApiBanners,
  patchApiBannersId,
  deleteApiBannersId,
  getGetApiBannersQueryKey,
} from "@/api/stetsom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useInlineUpload } from "@/hooks/use-inline-upload";
import { toApiLocale } from "@/lib/api/i18n-utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BannerFormState,
  BannerForm,
  EMPTY_FORM_STATE,
  bannerToFormState,
} from "./banner-form";

interface BannerFormPageProps {
  mode: "create";
}

interface BannerFormPageEditProps {
  mode: "edit";
  banner: Banner;
}

type Props = BannerFormPageProps | BannerFormPageEditProps;

export function BannerFormPage(props: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const isCreating = props.mode === "create";
  const initialBanner = props.mode === "edit" ? props.banner : null;

  const [draft, setDraft] = useState<BannerFormState>(
    initialBanner ? bannerToFormState(initialBanner) : EMPTY_FORM_STATE,
  );
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

  const isSaving =
    createBanner.isPending ||
    updateBanner.isPending ||
    inlineUpload.isUploading;

  function handleDraftChange(
    key: keyof BannerFormState,
    value: string | I18nString,
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function buildPayload(): PostApiBannersBody {
    return {
      name: draft.name,
      product_id: draft.product_id || null,
      desktop_image: desktopImageFile
        ? {
            fileName: desktopImageFile.name,
            mimeType: desktopImageFile.type,
            sizeBytes: desktopImageFile.size,
          }
        : { fileName: "", mimeType: "", sizeBytes: 0 },
      mobile_image: mobileImageFile
        ? {
            fileName: mobileImageFile.name,
            mimeType: mobileImageFile.type,
            sizeBytes: mobileImageFile.size,
          }
        : undefined,
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
  }

  function buildUpdatePayload(): PatchApiBannersIdBody {
    return {
      name: draft.name || undefined,
      product_id: draft.product_id || null,
      desktop_image: desktopImageFile
        ? {
            fileName: desktopImageFile.name,
            mimeType: desktopImageFile.type,
            sizeBytes: desktopImageFile.size,
          }
        : undefined,
      mobile_image: mobileImageFile
        ? {
            fileName: mobileImageFile.name,
            mimeType: mobileImageFile.type,
            sizeBytes: mobileImageFile.size,
          }
        : undefined,
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
  }

  async function handleSave() {
    let result: BannerWithUploads;

    if (isCreating) {
      const payload = buildPayload();
      result = await createBanner.mutateAsync(payload);
    } else if (initialBanner) {
      const payload = buildUpdatePayload();
      result = await updateBanner.mutateAsync({
        id: initialBanner.id,
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

    invalidate();
    router.push("/admin/banners");
  }

  async function handleDelete() {
    if (!initialBanner) return;
    await deleteBanner.mutateAsync(initialBanner.id);
    router.push("/admin/banners");
  }

  function handleCancel() {
    router.push("/admin/banners");
  }

  return (
    <BannerForm
      draft={draft}
      isCreating={isCreating}
      isSaving={isSaving}
      onDraftChange={handleDraftChange}
      onSave={handleSave}
      onCancel={handleCancel}
      onDesktopFile={setDesktopImageFile}
      onMobileFile={setMobileImageFile}
      onClearDesktopFile={() => setDesktopImageFile(null)}
      onClearMobileFile={() => setMobileImageFile(null)}
      onDelete={initialBanner ? handleDelete : undefined}
      isDeleting={deleteBanner.isPending}
    />
  );
}
