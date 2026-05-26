"use client";

import type { UploadEntry } from "@/hooks/use-upload";
import { cn } from "@/lib/utils";
import { Check, Loader2, X } from "lucide-react";

const STAGE_LABEL: Record<UploadEntry["status"], string> = {
  idle: "Na fila…",
  presigning: "Preparando…",
  uploading: "Enviando…",
  registering: "Registrando…",
  done: "Concluído",
  error: "Erro",
};

export function UploadProgressList({
  entries,
  onClear,
}: {
  entries: UploadEntry[];
  onClear: () => void;
}) {
  if (entries.length === 0) return null;

  const allDone = entries.every(
    (e) => e.status === "done" || e.status === "error",
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          Uploads em andamento
        </p>
        {allDone && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Limpar
          </button>
        )}
      </div>

      <ul className="space-y-2">
        {entries.map((entry) => (
          <li key={entry.id} className="flex items-center gap-3">
            <span className="shrink-0">
              {entry.status === "done" ? (
                <Check className="size-4 text-green-500" />
              ) : entry.status === "error" ? (
                <X className="size-4 text-destructive" />
              ) : (
                <Loader2 className="size-4 animate-spin text-brand" />
              )}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm text-foreground">
                  {entry.fileName}
                </span>
                <span
                  className={cn(
                    "shrink-0 text-xs",
                    entry.status === "done" && "text-green-500",
                    entry.status === "error" && "text-destructive",
                    !["done", "error"].includes(entry.status) &&
                      "text-muted-foreground",
                  )}
                >
                  {entry.status === "error"
                    ? entry.error
                    : STAGE_LABEL[entry.status]}
                </span>
              </div>

              {entry.status !== "error" && (
                <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      entry.status === "done" ? "bg-green-500" : "bg-brand",
                    )}
                    style={{ width: `${entry.progress}%` }}
                  />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
