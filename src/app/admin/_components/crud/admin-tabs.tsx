"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface AdminTabItem {
  href: string;
  label: string;
  icon?: LucideIcon;
  /** Match exactly instead of prefix (default: false). */
  exact?: boolean;
}

interface AdminTabsProps {
  items: AdminTabItem[];
  className?: string;
}

/**
 * Route-based tab bar (Figma 1684-8363). Each tab is a deep-linkable sub-route;
 * the active tab is derived from the current pathname. Used to group the
 * Produtos area into Produtos · Categorias · Templates · Atributos.
 */
export function AdminTabs({ items, className }: AdminTabsProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex gap-1 border-b border-border", className)}>
      {items.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "-mb-px flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              active
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {Icon && <Icon className="size-4" />}
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
