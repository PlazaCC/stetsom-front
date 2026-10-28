"use client";

import { Button, type ButtonVariant } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type AdminActionDialogSize = "sm" | "md" | "lg" | "xl";

interface AdminDialogAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  loadingLabel?: string;
  variant?: ButtonVariant;
}

interface AdminActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: AdminActionDialogSize;
  cancelAction?: AdminDialogAction;
  primaryAction?: AdminDialogAction;
  footerStart?: React.ReactNode;
  bodyClassName?: string;
  contentClassName?: string;
  showCloseButton?: boolean;
}

const SIZE_CLASSES: Record<AdminActionDialogSize, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-3xl",
  xl: "sm:max-w-5xl",
};

function ActionButton({ action }: { action: AdminDialogAction }) {
  return (
    <Button
      type="button"
      variant={action.variant}
      disabled={action.disabled || action.isLoading}
      onClick={action.onClick}
    >
      {action.isLoading ? <Loader2 className="size-4 animate-spin" /> : null}
      {action.isLoading ? (action.loadingLabel ?? "Aguarde...") : action.label}
    </Button>
  );
}

/**
 * Standard shell for CMS action and form dialogs. The header and footer remain
 * visible while only the body scrolls.
 */
export function AdminActionDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = "md",
  cancelAction,
  primaryAction,
  footerStart,
  bodyClassName,
  contentClassName,
  showCloseButton = true,
}: AdminActionDialogProps) {
  const isPending = Boolean(
    cancelAction?.isLoading || primaryAction?.isLoading,
  );
  const hasFooter = Boolean(cancelAction || primaryAction || footerStart);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && isPending) return;
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent
        showCloseButton={showCloseButton && !isPending}
        className={cn(
          "flex max-h-[min(90dvh,56rem)] flex-col gap-0 overflow-hidden p-0",
          SIZE_CLASSES[size],
          contentClassName,
        )}
      >
        <DialogHeader className="shrink-0 gap-1 border-b border-border px-5 py-4 pr-12">
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        <div
          data-slot="admin-dialog-body"
          className={cn(
            "min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4",
            bodyClassName,
          )}
        >
          {children}
        </div>

        {hasFooter ? (
          <div
            data-slot="admin-dialog-footer"
            className="flex shrink-0 flex-col-reverse gap-3 border-t border-border bg-muted/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">{footerStart}</div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              {cancelAction ? <ActionButton action={cancelAction} /> : null}
              {primaryAction ? <ActionButton action={primaryAction} /> : null}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export type { AdminActionDialogProps, AdminDialogAction };
