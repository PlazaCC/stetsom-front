"use client";

import type {
  Banner,
  BannerPayload,
  I18nString,
  PatchApiBannersIdBody,
  PostApiBannersBody,
} from "@/api/stetsom/model";
import {
  postApiBanners,
  patchApiBannersId,
  deleteApiBannersId,
  getGetApiBannersQueryKey,
} from "@/api/stetsom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { toApiLocale } from "@/i18n/locale";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BannerFormState,
  BannerForm,
  EMPTY_FORM_STATE,
  bannerToFormState,
} from "./banner-form";

/**
 * `<input type="date">` gives "YYYY-MM-DD"; the API wants ISO datetimes. The
 * period covers whole local days: from the start of the first to the end of
 * the last.
 */
function dateInputToIso(value: string, edge: "start" | "end"): string | null {
  if (!value) return null;
  const time = edge === "start" ? "T00:00:00" : "T23:59:59.999";
  return new Date(`${value}${time}`).toISOString();
}

/** The API needs `pt` whenever a title is sent; an all-empty title clears it. */
function titlePayload(title: I18nString): I18nString | null {
  const hasAny = [title.pt, title.en, title.es].some((v) => v?.trim());
  return hasAny ? title : null;
}

/** Mirrors the API's create/update rules so the editor gets a reason up front. */
function validateDraft(draft: BannerFormState): string[] {
  const issues: string[] = [];
  if (!draft.name.trim()) issues.push("Informe o nome do banner.");
  if (!draft.desktop_image_library_id) issues.push("Escolha a imagem desktop.");
  if (!draft.product_id && !draft.href.trim())
    issues.push("Associe um produto ou informe um link.");
  if (
    !draft.product_id &&
    draft.href.trim() &&
    !/^(\/|https?:\/\/)/i.test(draft.href.trim())
  )
    issues.push('O link deve começar com "http://", "https://" ou "/".');
  if (draft.product_id && draft.link_url && !/^[?#]/.test(draft.link_url))
    issues.push('Os parâmetros da URL devem começar com "?" ou "#".');
  if (
    (draft.title.en?.trim() || draft.title.es?.trim()) &&
    !draft.title.pt.trim()
  )
    issues.push("Preencha o título em português antes dos outros idiomas.");
  if (
    draft.display_from &&
    draft.display_until &&
    draft.display_until < draft.display_from
  )
    issues.push("O fim do período deve ser depois do início.");
  return issues;
}

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
  const toast = useAdminToast();
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
    onError: (e) => toast.apiError(e, "Não foi possível criar o banner"),
  });
  const updateBanner = useMutation({
    mutationFn: ({ id, body }: { id: string; body: PatchApiBannersIdBody }) =>
      patchApiBannersId(id, body),
    onError: (e) => toast.apiError(e, "Não foi possível salvar o banner"),
  });
  const deleteBanner = useMutation({
    mutationFn: (id: string) => deleteApiBannersId(id),
    onSuccess: invalidate,
    onError: (e) => toast.apiError(e, "Não foi possível excluir o banner"),
  });
  const isSaving = createBanner.isPending || updateBanner.isPending;

  function handleDraftChange<K extends keyof BannerFormState>(
    key: K,
    value: BannerFormState[K],
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function buildPayload(): PostApiBannersBody {
    const isProductDestination = Boolean(draft.product_id);
    return {
      name: draft.name,
      product_id: draft.product_id || null,
      desktop_image_library_id: draft.desktop_image_library_id,
      mobile_image_library_id: draft.mobile_image_library_id || null,
      link_url: isProductDestination ? draft.link_url || null : null,
      href: isProductDestination ? null : draft.href || null,
      title: titlePayload(draft.title),
      label: draft.label || null,
      order: draft.order ?? 0,
      status: draft.status,
      available_locales: draft.locale ? [toApiLocale(draft.locale)] : undefined,
      display_from: dateInputToIso(draft.display_from, "start"),
      display_until: dateInputToIso(draft.display_until, "end"),
    };
  }

  function buildUpdatePayload(): PatchApiBannersIdBody {
    const isProductDestination = Boolean(draft.product_id);
    return {
      name: draft.name || undefined,
      product_id: draft.product_id || null,
      desktop_image_library_id: draft.desktop_image_library_id || undefined,
      mobile_image_library_id: draft.mobile_image_library_id || null,
      link_url: isProductDestination ? draft.link_url || null : null,
      href: isProductDestination ? null : draft.href || null,
      title: titlePayload(draft.title),
      label: draft.label || null,
      order: draft.order ?? undefined,
      status: draft.status,
      available_locales: draft.locale ? [toApiLocale(draft.locale)] : undefined,
      display_from: dateInputToIso(draft.display_from, "start"),
      display_until: dateInputToIso(draft.display_until, "end"),
    };
  }

  async function handleSave() {
    const issues = validateDraft(draft);
    if (issues.length > 0) {
      toast.error("Revise o banner antes de salvar", issues.join(" "));
      return;
    }

    let result: BannerPayload;

    try {
      if (isCreating) {
        result = await createBanner.mutateAsync(buildPayload());
      } else if (initialBanner) {
        result = await updateBanner.mutateAsync({
          id: initialBanner.id,
          body: buildUpdatePayload(),
        });
      } else {
        return;
      }
    } catch {
      // The mutation's onError already surfaced the toast; stay on the form.
      return;
    }
    void result.banner;

    invalidate();
    router.push("/admin/banners");
  }

  async function handleDelete() {
    if (!initialBanner) return;
    try {
      await deleteBanner.mutateAsync(initialBanner.id);
    } catch {
      return;
    }
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
      onDelete={initialBanner ? handleDelete : undefined}
      isDeleting={deleteBanner.isPending}
    />
  );
}
