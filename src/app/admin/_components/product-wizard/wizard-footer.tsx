"use client";

import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Eye,
  Loader2,
  MoreHorizontal,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminConfirmDialog } from "@/app/admin/_components/crud/admin-confirm-dialog";
import { useState } from "react";
import type { WizardStep } from "./wizard-store";

interface WizardFooterProps {
  step: WizardStep;
  isSaving: boolean;
  publishLabel: string;
  hasProductId: boolean;
  onSaveDraft: () => void;
  onCancel: () => void;
  onBack: () => void;
  onNext: () => void;
  onPublish: () => void;
  onDelete: () => void;
  onPreview: () => void;
}

const secondaryBtn =
  "inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60";

const IS_FINAL = 5;

export function WizardFooter({
  step,
  isSaving,
  publishLabel,
  hasProductId,
  onSaveDraft,
  onCancel,
  onBack,
  onNext,
  onPublish,
  onDelete,
  onPreview,
}: WizardFooterProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isFinal = step === IS_FINAL;

  return (
    <>
      <div className="flex items-center justify-between gap-4 rounded-[16px] border border-border bg-card px-6 py-4">
        <div className="flex items-center gap-3">
          {isFinal && (
            <button
              type="button"
              onClick={onPreview}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <Eye className="size-4" />
              Pré-visualizar
            </button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80 disabled:opacity-60"
            >
              <MoreHorizontal className="size-4" />
              Ações
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem onClick={onSaveDraft}>
                <Save className="size-4 text-amber-600" />
                <span>Salvar como rascunho</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled={!hasProductId} onClick={onPreview}>
                <Eye className="size-4 text-primary" />
                <span>Link para preview</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                disabled={!hasProductId}
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="size-4" />
                <span>Excluir produto</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-3">
          {!isFinal && (
            <>
              <button type="button" onClick={onCancel} className={secondaryBtn}>
                <X className="size-4" />
                Cancelar
              </button>
              <button type="button" onClick={onBack} className={secondaryBtn}>
                ← Voltar
              </button>
            </>
          )}

          {isFinal ? (
            <>
              <button type="button" onClick={onBack} className={secondaryBtn}>
                ← Voltar
              </button>
              <button
                type="button"
                onClick={onPublish}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {isSaving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                {publishLabel}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onNext}
              className={cn(
                "inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60",
              )}
            >
              Próximo
              <ArrowRight className="size-4" />
            </button>
          )}
        </div>
      </div>

      <AdminConfirmDialog
        open={showDeleteConfirm}
        title="Excluir produto?"
        description="O produto será removido permanentemente. Esta ação não pode ser desfeita."
        confirmLabel="Sim, excluir"
        destructive
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDelete();
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
