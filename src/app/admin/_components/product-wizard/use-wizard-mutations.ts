import {
  deleteApiProductsId,
  patchApiProductsId,
  postApiProducts,
  useGetApiAttributes,
  useGetApiCategories,
  useGetApiTemplates,
} from "@/api/stetsom";
import type { PostApiProductsBody, ProductStatus } from "@/api/stetsom/model";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { slugify } from "@/lib/utils/slugify";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type Dispatch } from "react";
import { syncBlocks, syncFiles, syncImages } from "./wizard-sync";
import {
  buildPayload,
  combineLaunchDate,
  deriveStatus,
  type PublishIntent,
  type WizardAction,
  type WizardState,
} from "./wizard-store";

export interface ProductMutationResult {
  id: string;
  slug: string;
  status: ProductStatus;
}

/**
 * Data-fetching, mutations, and save/publish/delete/preview handlers for the
 * product wizard. Kept separate from `wizard.tsx` so that file stays
 * composition/JSX only.
 */
export function useWizardMutations(
  mode: "create" | "edit",
  state: WizardState,
  dispatch: Dispatch<WizardAction>,
) {
  const router = useRouter();
  const adminToast = useAdminToast();

  const [publishedResult, setPublishedResult] =
    useState<ProductMutationResult | null>(null);

  const categoriesQuery = useGetApiCategories();
  const templatesQuery = useGetApiTemplates();
  const attributesQuery = useGetApiAttributes();

  const categories = useMemo(
    () => (categoriesQuery.data ?? []).map((c) => ({ id: c.id, name: c.name })),
    [categoriesQuery.data],
  );
  const lines = useMemo(
    () =>
      (categoriesQuery.data ?? []).flatMap((c) =>
        c.lines.map((l) => ({
          id: l.line_id,
          name: l.name,
          category_id: c.id,
        })),
      ),
    [categoriesQuery.data],
  );
  const templates = templatesQuery.data ?? [];
  const attributes = attributesQuery.data ?? [];

  const createMutation = useMutation({
    mutationFn: (body: PostApiProductsBody) => postApiProducts(body),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: PostApiProductsBody }) =>
      patchApiProductsId(id, body),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApiProductsId(id),
  });

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  useEffect(() => {
    if (!state.isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [state.isDirty]);

  async function handleSave(
    intent: PublishIntent,
  ): Promise<ProductMutationResult> {
    const launchISO = combineLaunchDate(state.launch_date, state.launch_time);
    const status = deriveStatus(intent, launchISO);
    const payload = buildPayload(state, status);

    let id = state.productId;
    if (id) {
      await updateMutation.mutateAsync({ id, body: payload });
    } else {
      const created = await createMutation.mutateAsync(payload);
      id = created.id;
    }

    if (id) {
      try {
        await syncBlocks(id, state.blocks, state.initialBlockIds);
        await syncImages(id, state.images, state.initialImageIds);
        await syncFiles(id, state.files, state.initialFileIds);
      } catch (syncErr) {
        adminToast.apiError(
          syncErr,
          "Produto salvo, mas houve erro ao sincronizar blocos/mídias.",
        );
      }
    }

    dispatch({ type: "mark_saved", productId: id!, status });
    const slug = state.slug.pt || slugify(state.name.pt);
    return {
      id: id!,
      slug,
      status,
    };
  }

  async function handleSaveDraft() {
    try {
      await handleSave("draft");
      adminToast.draft(state.name.pt || undefined);
    } catch (err) {
      adminToast.apiError(err, "Erro ao salvar rascunho");
    }
  }

  async function handlePublish() {
    try {
      const result = await handleSave("publish");
      adminToast.success(
        mode === "create"
          ? "Produto publicado com sucesso!"
          : "Produto atualizado com sucesso!",
        "As alterações já estão visíveis no catálogo.",
      );
      setPublishedResult(result);
    } catch (err) {
      adminToast.apiError(err, "Erro ao publicar produto");
    }
  }

  async function handleDelete() {
    if (!state.productId) return;
    try {
      await deleteMutation.mutateAsync(state.productId);
      adminToast.deleted(state.name.pt || undefined);
      router.push("/admin/produtos");
    } catch (err) {
      adminToast.apiError(err, "Erro ao excluir produto");
    }
  }

  function handlePreview() {
    if (!state.productId) {
      adminToast.error(
        "Salve o produto para abrir a página real. O preview ao vivo está no painel ao lado.",
      );
      return;
    }
    const slug = state.slug.pt || slugify(state.name.pt);
    window.open(
      `/api/draft?slug=${encodeURIComponent(slug)}`,
      "_blank",
      "noopener",
    );
  }

  return {
    categories,
    lines,
    templates,
    attributes,
    isSaving,
    deleteMutation,
    publishedResult,
    setPublishedResult,
    handleSaveDraft,
    handlePublish,
    handleDelete,
    handlePreview,
  };
}
