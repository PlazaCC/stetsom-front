"use client";

import { useEffect, useState } from "react";
import { AdminConfirmDialog } from "./crud/admin-confirm-dialog";

/** How long before the session ends the editor is warned. */
const WARN_BEFORE_MS = 10 * 60 * 1000;

// Kept for the tab, so a reload does not ask again about the same session.
const DISMISSED_KEY = "stetsom:session-warning-dismissed";

function readDismissed(): number | null {
  try {
    const value = Number(window.sessionStorage.getItem(DISMISSED_KEY));
    return value > 0 ? value : null;
  } catch {
    return null;
  }
}

function writeDismissed(endsAt: number) {
  try {
    window.sessionStorage.setItem(DISMISSED_KEY, String(endsAt));
  } catch {
    // Without storage the warning just comes back after a reload.
  }
}

async function fetchSessionEnd(): Promise<number | null> {
  try {
    const res = await fetch("/api/auth/session", { cache: "no-store" });
    if (!res.ok) return null;
    const { refreshExpiresAt } = (await res.json()) as {
      refreshExpiresAt: string | null;
    };
    const time = refreshExpiresAt ? Date.parse(refreshExpiresAt) : NaN;
    return Number.isNaN(time) ? null : time;
  } catch {
    return null;
  }
}

/**
 * Warns a few minutes before the session ends for good. The access token
 * renews silently, but the refresh token does not, so the session has a hard
 * end; signing in again in another tab starts a new one without leaving the
 * page or its unsaved edits. Re-checked when the tab comes back into view, so
 * a sign-in made elsewhere clears the warning.
 */
export function SessionExpiryWarning() {
  const [endsAt, setEndsAt] = useState<number | null>(null);
  // The session end the warning was raised for, and the one it was put
  // aside for. A new sign-in brings a new end, which starts over.
  const [warnedFor, setWarnedFor] = useState<number | null>(null);
  const [dismissedFor, setDismissedFor] = useState<number | null>(() =>
    typeof window === "undefined" ? null : readDismissed(),
  );

  function dismiss() {
    if (endsAt === null) return;
    writeDismissed(endsAt);
    setDismissedFor(endsAt);
  }

  useEffect(() => {
    let cancelled = false;
    const check = () =>
      fetchSessionEnd().then((time) => {
        if (!cancelled) setEndsAt(time);
      });
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    check();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  useEffect(() => {
    if (endsAt === null || endsAt === dismissedFor) return;
    const timer = window.setTimeout(
      () => {
        // Once it has ended, the session-expired dialog takes over.
        if (Date.now() < endsAt) setWarnedFor(endsAt);
      },
      Math.max(0, endsAt - WARN_BEFORE_MS - Date.now()),
    );
    return () => window.clearTimeout(timer);
  }, [endsAt, dismissedFor]);

  const open =
    endsAt !== null && warnedFor === endsAt && dismissedFor !== endsAt;
  const endTime =
    endsAt === null
      ? ""
      : new Date(endsAt).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });

  return (
    <AdminConfirmDialog
      open={open}
      title="Sua sessão está terminando"
      description={`A sessão termina às ${endTime}. Entre novamente em uma nova aba para continuar sem perder o que está editando; depois, volte para esta aba.`}
      confirmLabel="Entrar em nova aba"
      cancelLabel="Agora não"
      onConfirm={() => {
        window.open("/admin/login?redirect=/admin", "_blank", "noopener");
        dismiss();
      }}
      onCancel={dismiss}
    />
  );
}
