"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { History } from "lucide-react";

interface DraftRestoreBannerProps {
  /** ISO time of the draft's last autosave. */
  savedAt: string;
  /** The record was saved again after the draft was written. */
  changedSince?: boolean;
  onRestore: () => void;
  onDiscard: () => void;
  className?: string;
}

function formatSavedAt(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? "antes"
    : date.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
}

/** Offers back the unsaved edits an editor left in an earlier session. */
export function DraftRestoreBanner({
  savedAt,
  changedSince = false,
  onRestore,
  onDiscard,
  className,
}: DraftRestoreBannerProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-wrap items-center gap-3 border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900",
        className,
      )}
    >
      <History className="size-4 shrink-0" />
      <p className="min-w-0 flex-1">
        Há alterações não salvas de {formatSavedAt(savedAt)}.
        {changedSince &&
          " Este conteúdo foi salvo de novo depois disso: restaurar substitui a versão atual."}
      </p>
      <div className="flex shrink-0 gap-2">
        <Button type="button" size="sm" variant="outline" onClick={onDiscard}>
          Descartar
        </Button>
        <Button type="button" size="sm" onClick={onRestore}>
          Restaurar rascunho
        </Button>
      </div>
    </div>
  );
}
