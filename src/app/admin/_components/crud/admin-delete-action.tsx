"use client";

import { useState } from "react";
import { AdminConfirmDialog } from "./admin-confirm-dialog";

interface AdminDeleteActionProps {
  /** Label do botão que abre o dialog */
  label?: string;
  /** Título do dialog de confirmação */
  confirmTitle: string;
  /** Descrição do dialog */
  confirmDescription?: string;
  /** Label do botão de confirmação destrutiva */
  confirmLabel?: string;
  /** Chamado após o usuário confirmar */
  onConfirm: () => void | Promise<void>;
  /** Exibe spinner enquanto true */
  isLoading?: boolean;
  /** Variant visual do botão gatilho */
  variant?: "danger" | "ghost-danger";
}

export function AdminDeleteAction({
  label = "Excluir",
  confirmTitle,
  confirmDescription,
  confirmLabel = "Sim, excluir",
  onConfirm,
  isLoading = false,
  variant = "ghost-danger",
}: AdminDeleteActionProps) {
  const [open, setOpen] = useState(false);

  async function handleConfirm() {
    await onConfirm();
    setOpen(false);
  }

  const buttonStyle =
    variant === "danger"
      ? "rounded-md bg-destructive px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      : "rounded-md px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={isLoading}
        className={buttonStyle}
      >
        {label}
      </button>

      <AdminConfirmDialog
        open={open}
        title={confirmTitle}
        description={confirmDescription}
        confirmLabel={confirmLabel}
        cancelLabel="Cancelar"
        destructive
        isPending={isLoading}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
