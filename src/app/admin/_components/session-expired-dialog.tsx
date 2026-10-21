"use client";

import { SESSION_EXPIRED_EVENT } from "@/lib/api/session-refresh";
import { useEffect, useState } from "react";
import { AdminConfirmDialog } from "./crud/admin-confirm-dialog";

/**
 * Shown when the refresh token is gone too and the session cannot be renewed
 * silently. Signing in again in another tab restores the cookies without
 * leaving this page, so unsaved edits survive and can be saved afterwards.
 */
export function SessionExpiredDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(SESSION_EXPIRED_EVENT, show);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, show);
  }, []);

  return (
    <AdminConfirmDialog
      open={open}
      title="Sua sessão expirou"
      description="Entre novamente em uma nova aba para não perder o que está editando. Depois, volte para esta aba e salve de novo."
      confirmLabel="Entrar em nova aba"
      cancelLabel="Fechar"
      onConfirm={() => {
        window.open("/admin/login?redirect=/admin", "_blank", "noopener");
        setOpen(false);
      }}
      onCancel={() => setOpen(false)}
    />
  );
}
