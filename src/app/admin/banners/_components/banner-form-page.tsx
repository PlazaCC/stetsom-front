"use client";

import type {
  Banner,
  PatchApiBannersIdBody,
  PostApiBannersBody,
  I18nString,
} from "@/api/stetsom/model";
import {
  postApiBanners,
  patchApiBannersId,
  deleteApiBannersId,
  getGetApiBannersQueryKey,
} from "@/api/stetsom";
import type { LibraryPickedAsset } from "@/app/admin/_components/crud/library-asset-ref";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

  const isSaving = createBanner.isPending || updateBanner.isPending;

  function handleDraftChange(
    key: keyof BannerFormState,
    value: string | I18nString,
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  /** Both keys of an image slot move together, so they are set in one update. */
  function handleImagePick(
    slot: "desktop" | "mobile",
    asset: LibraryPickedAsset | null,
  ) {
    setDraft((prev) => ({
      ...prev,
      [`${slot}_image_library_id`]: asset?.library_id ?? "",
      [`${slot}_image_url`]: asset?.file_url ?? "",
    }));
  }

  function buildPayload(): PostApiBannersBody {
    return {
      name: draft.name,
      product_id: draft.product_id || null,
      desktop_image_library_id: draft.desktop_image_library_id,
      mobile_image_library_id: draft.mobile_image_library_id || null,
      link_url: draft.link_url || null,
      href: draft.href || null,
      title: draft.title.pt ? draft.title : undefined,
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
      desktop_image_library_id: draft.desktop_image_library_id || undefined,
      mobile_image_library_id: draft.mobile_image_library_id || null,
      link_url: draft.link_url || null,
      href: draft.href || null,
      title: draft.title.pt ? draft.title : undefined,
      label: draft.label || null,
      order: draft.order ?? undefined,
      status: draft.status,
      available_locales: draft.locale ? [toApiLocale(draft.locale)] : undefined,
      display_from: draft.display_from || null,
      display_until: draft.display_until || null,
    };
  }

  // Images are already in the library when the form is submitted, so saving is a
  // single request — no presign round-trip and no upload step afterwards.
  async function handleSave() {
    if (isCreating) {
      await createBanner.mutateAsync(buildPayload());
    } else if (initialBanner) {
      await updateBanner.mutateAsync({
        id: initialBanner.id,
        body: buildUpdatePayload(),
      });
    } else {
      return;
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
      onImagePick={handleImagePick}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={initialBanner ? handleDelete : undefined}
      isDeleting={deleteBanner.isPending}
    />
  );
}
