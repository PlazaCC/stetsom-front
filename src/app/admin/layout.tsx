"use client";

import QueryProvider from "@/components/query-provider";
import { useAdminLogout } from "@/hooks/use-admin";
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
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/admin", label: "Home", icon: Home, exact: true },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/banners", label: "Banners", icon: Image },
  { href: "/admin/biblioteca", label: "Biblioteca", icon: Archive },
  { href: "/admin/mensagens", label: "Central de Mensagens", icon: Bell },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
  { href: "/admin/historico", label: "Histórico", icon: Clock },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
] as const;

function SidebarNav() {
  const pathname = usePathname();
  const logout = useAdminLogout();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="border-b px-6 py-5">
        <div className="flex items-center gap-2">
          <BarChart2 className="size-5 text-brand" />
          <span className="font-sans-condensed text-lg font-black uppercase text-brand-dark">
            CMS Stetsom
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-0.5">
          {NAV_LINKS.map(({ href, label, icon: Icon, ...rest }) => {
            const exact = "exact" in rest ? rest.exact : false;
            const isActive = exact
              ? pathname === href
              : pathname.startsWith(href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand text-white"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t p-3">
        <button
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-60"
        >
          <LogOut className="size-4 shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  );
}

function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="flex-1 overflow-y-auto bg-[#F2F3F7] p-6">
        {children}
      </main>
    </div>
  );
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

function AdminShell({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return isLoginPage ? <>{children}</> : <PanelLayout>{children}</PanelLayout>;
}

export default function AdminLayout({ children }: Readonly<AdminLayoutProps>) {
  return (
    <QueryProvider>
      <AdminShell>{children}</AdminShell>
    </QueryProvider>
  );
}
