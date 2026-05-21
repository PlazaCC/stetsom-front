"use client";

import { cn } from "@/lib/utils";

interface AdminStatusToggleProps {
  active: boolean;
  onToggle: () => void;
  isPending?: boolean;
  className?: string;
}

export function AdminStatusToggle({
  active,
  onToggle,
  isPending,
  className,
}: AdminStatusToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={onToggle}
      disabled={isPending}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        active ? "bg-brand" : "bg-border",
        className,
      )}
    >
      <span className="sr-only">{active ? "Desativar" : "Ativar"}</span>
      <span
        className={cn(
          "pointer-events-none block size-4 rounded-full bg-background shadow-sm transition-transform",
          active ? "translate-x-4" : "translate-x-0",
        )}
      />
    </button>
  );
}
