"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Loader2, MoreVertical, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

  /** Itens do dropdown "..." — o menu só é renderizado se ao menos um destes existir. */
  previewAction?: EditorFooterMenuAction;
  saveDraftAction?: EditorFooterMenuAction;
  deleteAction?: EditorFooterDeleteAction;
  extraMenuActions?: EditorFooterMenuAction[];

  /** Texto de status inline no cluster esquerdo, ex: "Salvo às 14:32". */
  statusText?: string;

  /** Cluster direito — a única CTA primária. */
  onPrimary: () => void;
  primaryLabel: string;
  isPrimaryLoading?: boolean;
  isPrimaryDisabled?: boolean;

  className?: string;
}

export function EditorFooter({
  onBack,
  backLabel = "Voltar",
  previewAction,
  saveDraftAction,
  deleteAction,
  extraMenuActions,
  statusText,
  onPrimary,
  primaryLabel,
  isPrimaryLoading = false,
  isPrimaryDisabled = false,
  className,
}: EditorFooterProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const menuActions = [
    ...(previewAction ? [previewAction] : []),
    ...(saveDraftAction ? [saveDraftAction] : []),
    ...(extraMenuActions ?? []),
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

        {hasMenu && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="icon-md"
                  aria-label="Mais ações"
                />
              }
            >
              <MoreVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {menuActions.map((action) => (
                <DropdownMenuItem
                  key={action.key}
                  disabled={action.disabled}
                  onClick={action.onClick}
                >
                  {action.icon && <action.icon />}
                  {action.label}
                </DropdownMenuItem>
              ))}
              {deleteAction && (
                <>
                  {menuActions.length > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={deleteAction.isLoading}
                    onClick={() => setDeleteOpen(true)}
                  >
                    <DeleteIcon />
                    {deleteAction.label}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {statusText && (
          <span className="text-xs text-muted-foreground">{statusText}</span>
        )}
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
        <Button
          type="button"
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
