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
import { useApiFormErrors } from "@/lib/forms/api-form-errors";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type Dispatch } from "react";
import {
  buildPayload,
  combineLaunchDate,
  deriveStatus,
  selectProductSlug,
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
  const formErrors = useApiFormErrors();

  const [publishedResult, setPublishedResult] =
    useState<ProductMutationResult | null>(null);
  const savingRef = useRef(false);
  const [isSavingCollections, setIsSavingCollections] = useState(false);

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
    deleteMutation.isPending ||
    isSavingCollections;

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
    if (savingRef.current) throw new Error("A save is already in progress");
    savingRef.current = true;
    setIsSavingCollections(true);

    try {
      const launchISO = combineLaunchDate(state.launch_date, state.launch_time);
      const status = deriveStatus(intent, launchISO);
      const payload = buildPayload(state, status);

      const product = state.productId
        ? await updateMutation.mutateAsync({
            id: state.productId,
            body: payload satisfies PatchApiProductsIdBody,
          })
        : await createMutation.mutateAsync(payload);

      dispatch({
        type: "mark_saved",
        productId: product.id,
        status: product.status,
        blocks: product.page_blocks.map((block) => ({
          id: block.block_id,
          type: block.type,
          data: block.data,
          order: block.order,
        })),
        images: product.images.map((image) => ({
          id: image.image_id,
          library_id: image.library_id,
          preview_url:
            image.image_url ??
            state.images.find((item) => item.id === image.image_id)
              ?.preview_url ??
            "",
          order: image.order,
        })),
        files: product.files.map((file) => ({
          id: file.file_id,
          library_id: file.library_id,
          file_url:
            file.file_url ??
            state.files.find((item) => item.id === file.file_id)?.file_url ??
            "",
          filename:
            file.filename ??
            state.files.find((item) => item.id === file.file_id)?.filename,
          type:
            (file.type as WizardState["files"][number]["type"]) ??
            state.files.find((item) => item.id === file.file_id)?.type ??
            "OTHER",
          locale: file.locale ?? null,
          is_active: file.is_active,
        })),
      });
      return {
        id: product.id,
        slug: product.slug,
        status: product.status,
      };
    } finally {
      savingRef.current = false;
      setIsSavingCollections(false);
    }
  }

  async function handleSaveDraft() {
    try {
      await handleSave("draft");
      adminToast.draft(state.name.pt || undefined);
    } catch (err) {
      formErrors.capture(err);
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
      formErrors.capture(err);
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
    formErrors,
  };
}
