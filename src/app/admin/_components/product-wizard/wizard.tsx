"use client";

import {
  deleteApiProductsId,
  patchApiProductsId,
  postApiProducts,
  useGetApiAttributes,
  useGetApiCategories,
  useGetApiTemplates,
} from "@/api/stetsom";
import type {
  CmsProductDetailPayload,
  PostApiProductsBody,
  ProductStatus,
} from "@/api/stetsom/model";
import { AdminDeleteAction } from "@/app/admin/_components/crud/admin-delete-action";
import { AdminSaveBar } from "@/app/admin/_components/crud/admin-save-bar";
import { ProductWizardStepSuccess } from "@/app/admin/_components/product-wizard-step-success";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { slugify } from "@/lib/utils/slugify";
import { useMutation } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useReducer, useState } from "react";
import { buildPreviewModel } from "./build-preview-model";
import { EditorPanel } from "./editor-panel";
import { escapeTarget, type EditorTarget } from "./editor-target";
import { PreviewCanvas } from "./preview-canvas";
import { ProductEditorLayout } from "./product-editor-layout";
import { syncBlocks, syncFiles, syncImages } from "./wizard-sync";
import {
  buildPayload,
  combineLaunchDate,
  deriveStatus,
  initWizardState,
  wizardReducer,
  type PublishIntent,
} from "./wizard-store";

interface ProductWizardProps {
  initial?: CmsProductDetailPayload;
  mode: "create" | "edit";
}

interface ProductMutationResult {
  id: string;
  slug: string;
  status: ProductStatus;
}

export function ProductWizard({ initial, mode }: ProductWizardProps) {
  const router = useRouter();
  const adminToast = useAdminToast();
  const [state, dispatch] = useReducer(wizardReducer, undefined, () =>
    initWizardState(mode, initial),
  );

  const [publishedResult, setPublishedResult] =
    useState<ProductMutationResult | null>(null);

  // What the contextual panel is focused on. Driven by clicks in the preview
  // (intents) and by the panel's own section navigator.
  const [selection, setSelection] = useState<EditorTarget>({ kind: "general" });
  const [device, setDevice] = useState<"mobile" | "desktop">("desktop");

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

  // Escape collapses a drill-in selection back to its section root. Covers focus
  // in the panel; the preview frame handles Escape for clicks on the canvas.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelection((s) => escapeTarget(s));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
      await syncBlocks(id, state.blocks, state.initialBlockIds);
      await syncImages(id, state.images, state.initialImageIds);
      await syncFiles(id, state.files, state.initialFileIds);
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

  if (publishedResult) {
    return (
      <ProductWizardStepSuccess
        result={publishedResult}
        mode={mode}
        onContinueEditing={() => setPublishedResult(null)}
      />
    );
  }

  const hasSaved = !!state.productId;
  const previewModel = buildPreviewModel(state, categories);
  const previewSlug = state.slug.pt || slugify(state.name.pt);
  const realPageHref =
    hasSaved && previewSlug
      ? `/api/draft?slug=${encodeURIComponent(previewSlug)}`
      : null;

  return (
    <ProductEditorLayout
      device={device}
      preview={
        <PreviewCanvas
          model={previewModel}
          selection={selection}
          onIntent={setSelection}
          device={device}
          onDeviceChange={setDevice}
          hasSavedProduct={hasSaved}
          realPageHref={realPageHref}
        />
      }
      panel={
        <EditorPanel
          state={state}
          dispatch={dispatch}
          selection={selection}
          onSelectionChange={setSelection}
          categories={categories}
          lines={lines}
          attributes={attributes}
          templates={templates}
          compact={device === "desktop"}
          footer={
            <AdminSaveBar
              onSaveDraft={handleSaveDraft}
              onPublish={handlePublish}
              isLoading={isSaving}
              isDirty={state.isDirty}
              className="px-4 py-3"
              publishLabel={
                mode === "create" ? "Publicar produto" : "Salvar alterações"
              }
              saveDraftLabel="Salvar rascunho"
              draftSavedPrefix="Salvo às"
              actions={
                <div className="flex items-center gap-2">
                  {hasSaved && (
                    <button
                      type="button"
                      onClick={handlePreview}
                      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                    >
                      <Eye className="size-4" />
                    </button>
                  )}
                  {mode === "edit" && state.productId && (
                    <AdminDeleteAction
                      label="Excluir produto"
                      confirmTitle={`Excluir "${state.name.pt}"?`}
                      confirmDescription="O produto será removido permanentemente. Esta ação não pode ser desfeita."
                      confirmLabel="Sim, excluir"
                      onConfirm={handleDelete}
                      isLoading={deleteMutation.isPending}
                    />
                  )}
                </div>
              }
            />
          }
        />
      }
    />
  );
}
