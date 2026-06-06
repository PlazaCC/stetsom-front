"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  Archive,
  BarChart2,
  Building2,
  Clock,
  FileText,
  Home,
  Image,
  LayoutTemplate,
  ListChecks,
  LogOut,
  Mail,
  Package,
  Settings,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MAIN_NAV: {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}[] = [
  { href: "/admin", label: "Home", icon: Home, exact: true },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/paginas", label: "Páginas", icon: FileText },
  { href: "/admin/biblioteca", label: "Biblioteca", icon: Archive },
  { href: "/admin/banners", label: "Banners", icon: Image },
  { href: "/admin/representantes", label: "Representantes", icon: Building2 },
  { href: "/admin/assistencias", label: "Assist. Técnicas", icon: Wrench },
  { href: "/admin/atributos", label: "Atributos", icon: ListChecks },
  { href: "/admin/templates", label: "Templates", icon: LayoutTemplate },
];

const BOTTOM_NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
  { href: "/admin/historico", label: "Histórico", icon: Clock },
  { href: "/admin/mensagens", label: "Central de contato", icon: Mail },
  { href: "/admin/configuracoes", label: "Opções", icon: Settings },
];

function NavItem({
  href,
  label,
  icon: Icon,
  exact,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <li>
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
}

export function AdminSidebar() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <aside className="shadow-cms-sidebar flex w-60 shrink-0 flex-col border-r border-border bg-card">
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
          {MAIN_NAV.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </ul>
      </nav>

      <div className="border-t border-border px-2 py-2">
        <ul className="space-y-0.5">
          {BOTTOM_NAV.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </ul>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm font-medium text-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4 shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  );
}
