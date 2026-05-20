"use client";

import { useAdminLogout } from "@/hooks/use-admin";
import { cn } from "@/lib/utils";
import {
  Archive,
  BarChart2,
  Bell,
  Clock,
  Home,
  Image,
  LogOut,
  Package,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS: {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}[] = [
  { href: "/admin", label: "Home", icon: Home, exact: true },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/banners", label: "Banners", icon: Image },
  { href: "/admin/biblioteca", label: "Biblioteca", icon: Archive },
  { href: "/admin/mensagens", label: "Central de Mensagens", icon: Bell },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
  { href: "/admin/historico", label: "Histórico", icon: Clock },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const logout = useAdminLogout();

  return (
    <aside
      className="flex w-60 shrink-0 flex-col border-r border-border bg-card"
      style={{ boxShadow: "0px 0px 8.8px 0px rgba(0,0,0,0.2)" }}
    >
      <div className="px-4 py-5">
        <div className="flex items-center gap-2">
          <BarChart2 className="size-5 text-brand" />
          <span className="font-mono text-base font-bold uppercase text-foreground">
            CMS Stetsom
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-2">
        <p className="mb-2 px-2 text-xs font-medium text-foreground/50">
          Funções
        </p>
        <ul className="space-y-0.5">
          {NAV_LINKS.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact
              ? pathname === href
              : pathname.startsWith(href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-2 rounded px-2 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-cms-active-item text-foreground"
                      : "text-foreground/60 hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-2">
        <button
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm font-medium text-foreground/60 transition-colors hover:bg-muted hover:text-foreground disabled:opacity-60"
        >
          <LogOut className="size-4 shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  );
}
