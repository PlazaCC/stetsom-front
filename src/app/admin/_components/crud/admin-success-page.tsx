"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, type LucideIcon } from "lucide-react";
import Link from "next/link";

interface SuccessAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  external?: boolean;
}

interface AdminSuccessPageProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  actions: SuccessAction[];
  className?: string;
}

const BUTTON_STYLES: Record<NonNullable<SuccessAction["variant"]>, string> = {
  primary: "bg-foreground text-white hover:bg-foreground/90",
  secondary: "bg-cms-active-item text-foreground hover:bg-cms-active-item/80",
  outline: "border border-border bg-transparent text-foreground hover:bg-muted",
  ghost:
    "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
};

export function AdminSuccessPage({
  icon: Icon = CheckCircle2,
  title,
  subtitle,
  actions,
  className,
}: AdminSuccessPageProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 text-center",
        className,
      )}
    >
      <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-cms-step-done/10">
        <Icon className="size-8 text-cms-step-done" />
      </div>

      <h2 className="text-xl font-semibold text-foreground">{title}</h2>

      {subtitle && (
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {subtitle}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {actions.map((action, i) => {
          const style = BUTTON_STYLES[action.variant ?? "outline"];
          const base =
            "inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer";

          if (action.href) {
            return (
              <Link
                key={i}
                href={action.href}
                target={action.external ? "_blank" : undefined}
                rel={action.external ? "noopener noreferrer" : undefined}
                className={cn(base, style)}
              >
                {action.label}
              </Link>
            );
          }

          return (
            <button
              key={i}
              type="button"
              onClick={action.onClick}
              className={cn(base, style)}
            >
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
