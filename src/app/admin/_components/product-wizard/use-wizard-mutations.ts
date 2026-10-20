import {
  deleteApiProductsId,
  patchApiProductsId,
  postApiProducts,
  useGetApiAttributeGroups,
  useGetApiAttributes,
  useGetApiCategoriesAdmin,
  useGetApiTemplates,
} from "@/api/stetsom";
import type {
  PatchApiProductsIdBody,
  PostApiProductsBody,
  ProductStatus,
} from "@/api/stetsom/model";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type Dispatch } from "react";
import { syncBlocks, syncFiles, syncImages } from "./wizard-sync";
import {
  buildPayload,
  combineLaunchDate,
  deriveStatus,
  selectProductSlug,
  findSpecIssues,
  templateLayoutOf,
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

  const categoriesQuery = useGetApiCategoriesAdmin();
  // A template belongs to a single category, so only the selected category's
  // templates may be applied. Without a category there is nothing to offer —
  // skip the request instead of listing templates from every category.
  const templatesQuery = useGetApiTemplates(
    state.category_id ? { category_id: state.category_id } : undefined,
    { query: { enabled: Boolean(state.category_id) } },
  );
  const attributesQuery = useGetApiAttributes();
  const attributeGroupsQuery = useGetApiAttributeGroups();

  const categories = useMemo(
    () =>
      (categoriesQuery.data ?? []).map((c) => ({
        id: c.id,
        name: c.name.pt,
      })),
    [categoriesQuery.data],
  );
  const lines = useMemo(
    () =>
      (categoriesQuery.data ?? []).flatMap((c) =>
        c.lines.map((l) => ({
          id: l.line_id,
          name: l.name.pt,
          category_id: c.id,
        })),
      ),
    [categoriesQuery.data],
  );
  const templates = templatesQuery.data ?? [];
  const attributes = attributesQuery.data ?? [];
  const attributeGroups = attributeGroupsQuery.data ?? [];

  const createMutation = useMutation({
    mutationFn: (body: PostApiProductsBody) => postApiProducts(body),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: PatchApiProductsIdBody }) =>
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
    const basePayload =
      status === "DRAFT" ? payload : { ...payload, status: "DRAFT" as const };

    let id = state.productId;
    if (id) {
      await updateMutation.mutateAsync({ id, body: basePayload });
    } else {
      const created = await createMutation.mutateAsync(basePayload);
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
        throw syncErr;
      }
    }

    if (status !== "DRAFT") {
      await updateMutation.mutateAsync({
        id: id!,
        body: { status, launch_date: payload.launch_date },
      });
    }

    dispatch({ type: "mark_saved", productId: id!, status });
    const slug = selectProductSlug(state);
    return {
      id: id!,
      slug,
      status,
    };
  }

  /**
   * Spec lines the API would refuse — no group, or off-template. Reported up
   * front so the toast names the variation and attribute.
   */
  function reportSpecIssues(): boolean {
    const issues = findSpecIssues(state, {
      attributeName: (id) =>
        attributes.find((a) => a.id === id)?.name.pt ?? "atributo",
      groupName: (id) =>
        attributeGroups.find((g) => g.id === id)?.name.pt ?? "outro grupo",
      templateLayout: templateLayoutOf(
        templates.find((t) => t.id === state.template_id),
      ),
    });
    if (issues.length === 0) return false;
    adminToast.error(
      "Revise as especificações antes de salvar",
      issues.slice(0, 3).join(" ") +
        (issues.length > 3 ? ` (+${issues.length - 3})` : ""),
    );
    return true;
  }

  async function handleSaveDraft() {
    if (reportSpecIssues()) return;
    try {
      await handleSave("draft");
      adminToast.draft(state.name.pt || undefined);
    } catch (err) {
      adminToast.apiError(err, "Erro ao salvar rascunho");
    }
  }

  async function handlePublish() {
    if (reportSpecIssues()) return;
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
    const slug = selectProductSlug(state);
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
    attributeGroups,
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
