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
import { AdminConfirmDialog } from "@/app/admin/_components/crud/admin-confirm-dialog";
import type { AdminStep } from "@/app/admin/_components/crud/admin-step-indicator";
import { AdminWizardPage } from "@/app/admin/_components/crud/admin-wizard-page";
import { ProductWizardStepSuccess } from "@/app/admin/_components/product-wizard-step-success";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { slugify } from "@/lib/utils/slugify";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useReducer, useState } from "react";
import { buildPreviewModel } from "./build-preview-model";
import { PreviewPanel } from "./preview-panel";
import { StepCustomize } from "./step-customize";
import { StepFiles } from "./step-files";
import { StepGeneral } from "./step-general";
import { StepPublish } from "./step-publish";
import { StepSpecs } from "./step-specs";
import { WizardFooter } from "./wizard-footer";
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
  "Customização",
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
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

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

  function handleCancel() {
    if (state.isDirty) {
      setShowCancelConfirm(true);
      return;
    }
    router.push("/admin/produtos");
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

  const steps: AdminStep[] = STEP_LABELS.map((label, i) => ({
    label,
    status:
      state.step > i + 1 ? "done" : state.step === i + 1 ? "active" : "pending",
  }));

  const hasSaved = !!state.productId;
  const previewModel = buildPreviewModel(state, categories);
  const previewSlug = state.slug.pt || slugify(state.name.pt);
  const realPageHref =
    hasSaved && previewSlug
      ? `/api/draft?slug=${encodeURIComponent(previewSlug)}`
      : null;

  return (
    <div className="flex flex-col gap-5">
      <AdminWizardPage
        steps={steps}
        aside={
          <PreviewPanel
            model={previewModel}
            hasSavedProduct={hasSaved}
            realPageHref={realPageHref}
          />
        }
        onStepClick={(index) =>
          dispatch({ type: "go_to_step", step: (index + 1) as WizardStep })
        }
      >
        <div className="space-y-5">
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

          <WizardFooter
            step={state.step}
            isSaving={isSaving}
            publishLabel={
              mode === "create" ? "Publicar produto" : "Salvar alterações"
            }
            hasProductId={!!state.productId}
            onSaveDraft={handleSaveDraft}
            onCancel={handleCancel}
            onBack={() =>
              dispatch({
                type: "go_to_step",
                step: Math.max(state.step - 1, 1) as WizardStep,
              })
            }
            onNext={() =>
              dispatch({
                type: "go_to_step",
                step: Math.min(state.step + 1, 5) as WizardStep,
              })
            }
            onPublish={handlePublish}
            onDelete={handleDelete}
            onPreview={handlePreview}
          />
        </div>
      </AdminWizardPage>

      <AdminConfirmDialog
        open={showCancelConfirm}
        title="Sair sem salvar?"
        description="Você tem alterações não salvas. Deseja sair mesmo assim?"
        confirmLabel="Sair"
        destructive
        onConfirm={() => {
          setShowCancelConfirm(false);
          router.push("/admin/produtos");
        }}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </div>
  );
}
