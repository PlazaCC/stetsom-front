import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Canonical row-action controls for admin tables — the bordered "pill" style
 * from the Produtos reference. Use `AdminRowActions` as the trailing cell
 * wrapper and `AdminRowAction` for each Editar/Excluir/… control so every
 * list page shares one interaction and one look.
 */
export function AdminRowActions({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-end gap-2", className)}>
      {children}
    </div>
  );
}

const VARIANT_CLASS = {
  default: "border-border text-foreground hover:bg-muted",
  destructive: "border-destructive/40 text-destructive hover:bg-destructive/10",
} as const;

type AdminRowActionProps = {
  /** When set, renders a `next/link`; otherwise a `<button>`. */
  href?: string;
  /** Link target (e.g. "_blank" to open the public site in a new tab). */
  target?: string;
  rel?: string;
  onClick?: () => void;
  variant?: keyof typeof VARIANT_CLASS;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function AdminRowAction({
  href,
  target,
  rel,
  onClick,
  variant = "default",
  disabled,
  className,
  children,
}: AdminRowActionProps) {
  const classes = cn(
    "rounded border px-3 py-1 text-xs font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
    VARIANT_CLASS[variant],
    className,
  );

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
        className={classes}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
