"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface AdminSaveBarProps {
  onBack?: () => void;
  onNext?: () => void;
  onSaveDraft?: () => void;
  onPublish?: () => void;
  isLoading?: boolean;
  isDirty?: boolean;
  draftSavedAt?: Date | null;
  publishLabel?: string;
  saveDraftLabel?: string;
  nextLabel?: string;
  backLabel?: string;
  draftSavedPrefix?: string;
  className?: string;
  /** Secondary actions rendered on the left (e.g. delete, preview). */
  actions?: React.ReactNode;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminSaveBar({
  onBack,
  onNext,
  onSaveDraft,
  onPublish,
  isLoading = false,
  isDirty = false,
  draftSavedAt,
  publishLabel,
  saveDraftLabel,
  nextLabel,
  backLabel,
  draftSavedPrefix,
  className,
  actions,
}: AdminSaveBarProps) {
  return (
    <div
      className={cn(
        "z-10 flex items-center justify-between gap-4 border-t border-border bg-card px-6 py-4",
        className,
      )}
    >
      {/* Left: back + draft status */}
      <div className="flex items-center gap-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
          >
            {backLabel}
          </button>
        )}
        {draftSavedAt && (
          <span className="text-xs text-muted-foreground">
            {draftSavedPrefix ?? "Saved at"} {formatTime(draftSavedAt)}
          </span>
        )}
        {actions}
      </div>

      {/* Right: save draft + next/publish */}
      <div className="flex items-center gap-3">
        {onSaveDraft && isDirty && (
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isLoading}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
          >
            {saveDraftLabel ?? "Save draft"}
          </button>
        )}

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isLoading && <Loader2 className="size-4 animate-spin" />}
            {nextLabel}
          </button>
        )}

        {onPublish && (
          <button
            type="button"
            onClick={onPublish}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isLoading && <Loader2 className="size-4 animate-spin" />}
            {publishLabel}
          </button>
        )}
      </div>
    </div>
  );
}
