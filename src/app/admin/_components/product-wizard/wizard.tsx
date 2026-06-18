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
import { AdminWizardPage } from "@/app/admin/_components/crud/admin-wizard-page";
import {
  AdminWizardTabs,
  type AdminWizardTab,
} from "@/app/admin/_components/crud/admin-wizard-tabs";
import { AdminPanel } from "@/app/admin/_components/admin-panel";
import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import { AdminSaveBar } from "@/app/admin/_components/crud/admin-save-bar";
import { ProductWizardStepSuccess } from "@/app/admin/_components/product-wizard-step-success";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { slugify } from "@/lib/utils/slugify";
import { useMutation } from "@tanstack/react-query";
import { Eye, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useReducer, useState } from "react";
import { buildPreviewModel } from "./build-preview-model";
import { PreviewPanel } from "./preview-panel";
import { StepCustomize } from "./step-customize";
import { StepFiles } from "./step-files";
import { StepGeneral } from "./step-general";
import { StepPublish } from "./step-publish";
import { StepSpecs } from "./step-specs";
import { syncBlocks, syncFiles, syncImages } from "./wizard-sync";
import {
  buildPayload,
  combineLaunchDate,
  deriveStatus,
  initWizardState,
  wizardReducer,
  type PublishIntent,
  type WizardStep,
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

const STEP_LABELS = [
  "Dados gerais",
  "Especificações técnicas",
  "Arquivos",
  "Blocos Customizados",
  "Publicação",
];

export function ProductWizard({ initial, mode }: ProductWizardProps) {
  const router = useRouter();
  const adminToast = useAdminToast();
  const [state, dispatch] = useReducer(wizardReducer, undefined, () =>
    initWizardState(mode, initial),
  );

  const [publishedResult, setPublishedResult] =
    useState<ProductMutationResult | null>(null);

  useEffect(() => {
    // The admin shell owns the page scroll on its <main>, not the window.
    document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
  }, [state.step]);

  const categoriesQuery = useGetApiCategories();
  const templatesQuery = useGetApiTemplates();
  const attributesQuery = useGetApiAttributes();

  const rawCategories = categoriesQuery.data ?? [];
  const categories = rawCategories.map((c) => ({ id: c.id, name: c.name }));
  const lines = rawCategories.flatMap((c) =>
    c.lines.map((l) => ({
      id: l.line_id,
      name: l.name,
      category_id: c.id,
    })),
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

  const tabs: AdminWizardTab[] = STEP_LABELS.map((label) => ({ label }));
  const title =
    mode === "create"
      ? "Novo Produto"
      : `Editar: ${state.name.pt || "Produto"}`;

  return (
    <div className="flex h-full flex-col">
      <AdminPanel className="flex flex-col justify-between">
        <AdminPageHeader title={title} />
        <AdminWizardTabs
          tabs={tabs}
          activeIndex={state.step - 1}
          onSelect={(index) =>
            dispatch({ type: "go_to_step", step: (index + 1) as WizardStep })
          }
        />
      </AdminPanel>

      <AdminWizardPage
        aside={
          <PreviewPanel
            model={previewModel}
            hasSavedProduct={hasSaved}
            realPageHref={realPageHref}
          />
        }
      >
        <div className="flex-1 space-y-5">
          {state.step === 1 && (
            <StepGeneral
              state={state}
              dispatch={dispatch}
              categories={categories}
              lines={lines}
            />
          )}
          {state.step === 2 && (
            <StepSpecs
              state={state}
              dispatch={dispatch}
              attributes={attributes}
              templates={templates}
            />
          )}
          {state.step === 3 && <StepFiles state={state} dispatch={dispatch} />}
          {state.step === 4 && (
            <StepCustomize state={state} dispatch={dispatch} />
          )}
          {state.step === 5 && (
            <StepPublish state={state} dispatch={dispatch} />
          )}
        </div>
      </AdminWizardPage>

      <AdminSaveBar
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        isLoading={isSaving}
        isDirty={state.isDirty}
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
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
              >
                <Eye className="size-4" />
                Pré-visualizar
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
    </div>
  );
}
