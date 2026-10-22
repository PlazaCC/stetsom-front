"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Loader2, MoreVertical, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Button,
  buttonVariants,
  type ButtonVariant,
} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminConfirmDialog } from "./admin-confirm-dialog";

export interface EditorFooterMenuAction {
  key: string;
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: ButtonVariant;
}

export interface EditorFooterDeleteAction {
  label: string;
  icon?: LucideIcon;
  confirmTitle: string;
  confirmDescription?: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
}

export interface EditorFooterProps {
  /** Cluster esquerdo — navegação de volta. Omitir se não há para onde voltar. */
  onBack?: () => void;
  backLabel?: string;

  /** Itens do botão "Ações" — o menu só é renderizado se ao menos um destes existir. */
  previewAction?: EditorFooterMenuAction;
  /** Ação de rascunho, exibida como o primeiro item do menu de ações. */
  saveDraftAction?: EditorFooterMenuAction;
  /** Ação secundária visível à esquerda da CTA primária. */
  secondaryAction?: EditorFooterMenuAction;
  deleteAction?: EditorFooterDeleteAction;
  extraMenuActions?: EditorFooterMenuAction[];

  /** Texto de status inline no cluster esquerdo, ex: "Salvo às 14:32". */
  statusText?: string;

  /** Cluster direito — a única CTA primária. */
  onPrimary: () => void;
  primaryLabel: string;
  primaryVariant?: ButtonVariant;
  isPrimaryLoading?: boolean;
  isPrimaryDisabled?: boolean;

  className?: string;
}

export function EditorFooter({
  onBack,
  backLabel = "Voltar",
  previewAction,
  saveDraftAction,
  secondaryAction,
  deleteAction,
  extraMenuActions,
  statusText,
  onPrimary,
  primaryLabel,
  primaryVariant = "default",
  isPrimaryLoading = false,
  isPrimaryDisabled = false,
  className,
}: EditorFooterProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const menuActions = [
    ...(saveDraftAction ? [saveDraftAction] : []),
    ...(extraMenuActions ?? []),
    ...(previewAction ? [previewAction] : []),
  ];
  const hasMenu = menuActions.length > 0 || !!deleteAction;
  const DeleteIcon = deleteAction?.icon ?? Trash2;

  async function handleDeleteConfirm() {
    await deleteAction?.onConfirm();
    setDeleteOpen(false);
  }

  return (
    <div
      className={cn(
        "z-10 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-card px-6 py-4",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {onBack && (
          <Button type="button" variant="outline" size="md" onClick={onBack}>
            {backLabel}
          </Button>
        )}

        {statusText && (
          <span className="text-xs text-muted-foreground">{statusText}</span>
        )}
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
        {hasMenu && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  disabled={isPrimaryLoading}
                />
              }
            >
              <MoreVertical className="size-4" />
              Ações
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="top"
              className="w-56 space-y-2 p-2"
            >
              {menuActions.map((action) => {
                const isLoading = action.isLoading ?? false;
                return (
                  <DropdownMenuItem
                    key={action.key}
                    disabled={isPrimaryLoading || action.disabled || isLoading}
                    onClick={action.onClick}
                    className={buttonVariants({
                      variant: action.variant ?? "outline",
                      size: "md",
                      className: "h-10 w-full justify-start",
                    })}
                  >
                    {isLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      action.icon && <action.icon />
                    )}
                    {action.label}
                  </DropdownMenuItem>
                );
              })}
              {deleteAction && (
                <>
                  {menuActions.length > 0 && (
                    <DropdownMenuSeparator className="my-2" />
                  )}
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={isPrimaryLoading || deleteAction.isLoading}
                    onClick={() => setDeleteOpen(true)}
                    className={buttonVariants({
                      variant: "destructive",
                      size: "md",
                      className: "h-10 w-full justify-start",
                    })}
                  >
                    <DeleteIcon />
                    {deleteAction.label}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {secondaryAction && (
          <Button
            type="button"
            variant={secondaryAction.variant ?? "outline"}
            size="md"
            onClick={secondaryAction.onClick}
            disabled={
              isPrimaryLoading ||
              isPrimaryDisabled ||
              secondaryAction.disabled ||
              secondaryAction.isLoading
            }
          >
            {secondaryAction.isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              secondaryAction.icon && <secondaryAction.icon />
            )}
            {secondaryAction.label}
          </Button>
        )}
        <Button
          type="button"
          variant={primaryVariant}
          size="md"
          onClick={onPrimary}
          disabled={isPrimaryLoading || isPrimaryDisabled}
        >
          {isPrimaryLoading && <Loader2 className="size-4 animate-spin" />}
          {primaryLabel}
        </Button>
      </div>

      {deleteAction && (
        <AdminConfirmDialog
          open={deleteOpen}
          title={deleteAction.confirmTitle}
          description={deleteAction.confirmDescription}
          confirmLabel={deleteAction.confirmLabel ?? "Sim, excluir"}
          cancelLabel="Cancelar"
          destructive
          isPending={deleteAction.isLoading}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteOpen(false)}
        />
      )}
    </div>
  );
}
