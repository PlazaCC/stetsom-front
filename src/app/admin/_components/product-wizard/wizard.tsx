"use client";

import type { CmsProductDetailPayload } from "@/api/stetsom/model";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import { EditorFooter } from "@/app/admin/_components/crud/editor-footer";
import { ProductWizardStepSuccess } from "@/app/admin/_components/product-wizard-step-success";
import { Eye, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useReducer, useState } from "react";
import { buildPreviewModel } from "./build-preview-model";
import { EditorPanel } from "./editor-panel";
import { escapeTarget, type EditorTarget } from "./editor-target";
import { PreviewCanvas } from "./preview-canvas";
import { ProductEditorLayout } from "./product-editor-layout";
import { useWizardMutations } from "./use-wizard-mutations";
import { initWizardState, wizardReducer } from "./wizard-store";

interface ProductWizardProps {
  initial?: CmsProductDetailPayload;
  mode: "create" | "edit";
}

export function ProductWizard({ initial, mode }: ProductWizardProps) {
  const router = useRouter();
  const [state, dispatch] = useReducer(wizardReducer, undefined, () =>
    initWizardState(mode, initial),
  );

  // What the contextual panel is focused on. Driven by clicks in the preview
  // (intents) and by the panel's own section navigator.
  const [selection, setSelection] = useState<EditorTarget>({ kind: "general" });
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");

  const {
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
  } = useWizardMutations(mode, state, dispatch);

  // Escape collapses a drill-in selection back to its section root. Covers focus
  // in the panel; the preview frame handles Escape for clicks on the canvas.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelection((s) => escapeTarget(s));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
  const previewModel = buildPreviewModel(state, categories, attributes);

  return (
    <AdminPageLayout
      contentClassName="overflow-hidden p-0"
      footer={
        <EditorFooter
          onBack={() => router.push("/admin/produtos")}
          previewAction={
            hasSaved
              ? {
                  key: "preview",
                  label: "Visualizar",
                  icon: Eye,
                  onClick: handlePreview,
                }
              : undefined
          }
          saveDraftAction={
            state.isDirty
              ? {
                  key: "save-draft",
                  label: "Salvar rascunho",
                  icon: Save,
                  onClick: handleSaveDraft,
                }
              : undefined
          }
          deleteAction={
            mode === "edit" && state.productId
              ? {
                  label: "Excluir produto",
                  confirmTitle: `Excluir "${state.name.pt}"?`,
                  confirmDescription:
                    "O produto será removido permanentemente. Esta ação não pode ser desfeita.",
                  confirmLabel: "Sim, excluir",
                  onConfirm: handleDelete,
                  isLoading: deleteMutation.isPending,
                }
              : undefined
          }
          onPrimary={handlePublish}
          primaryLabel={
            mode === "create" ? "Publicar produto" : "Salvar alterações"
          }
          isPrimaryLoading={isSaving}
        />
      }
    >
      <ProductEditorLayout
        device={device}
        preview={
          <PreviewCanvas
            model={previewModel}
            selection={selection}
            onIntent={setSelection}
            device={device}
            onDeviceChange={setDevice}
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
          />
        }
      />
    </AdminPageLayout>
  );
}
