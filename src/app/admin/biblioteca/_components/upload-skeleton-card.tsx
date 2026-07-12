"use client";

import type { UploadEntry, UploadStage } from "@/hooks/use-upload";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AlertCircle, Loader2 } from "lucide-react";

const STAGE_LABEL: Record<UploadStage, string> = {
  idle: "Na fila…",
  presigning: "Preparando…",
  uploading: "Enviando…",
  registering: "Registrando…",
  done: "Concluído",
  error: "Falhou",
};

/** Square placeholder shown in the grid for an in-flight (or failed) upload. */
export function UploadSkeletonCard({ entry }: { entry: UploadEntry }) {
  const isError = entry.status === "error";

  return (
    <div
      className={cn(
        "relative flex aspect-square w-full flex-col overflow-hidden rounded-xl border bg-card",
        isError && "border-destructive/50",
      )}
    >
      {entry.previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={entry.previewUrl}
          alt={entry.fileName}
          className="absolute inset-0 size-full object-cover opacity-40"
        />
      ) : (
        <Skeleton className="absolute inset-0 rounded-none" />
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
        {isError ? (
          <AlertCircle className="size-7 text-destructive" />
        ) : (
          <Loader2 className="size-7 animate-spin text-primary" />
        )}
        <p className="line-clamp-2 text-xs font-medium text-foreground">
          {entry.fileName}
        </p>
        <p
          className={cn(
            "text-2xs",
            isError ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {isError
            ? (entry.error ?? STAGE_LABEL.error)
            : STAGE_LABEL[entry.status]}
        </p>
      </div>

      {!isError && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${entry.progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
