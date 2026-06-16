"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  Archive,
  BarChart2,
  Building2,
  ChevronDown,
  Clock,
  FileText,
  Home,
  Image,
  LogOut,
  Mail,
  Package,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavLeaf {
  href: string;
  label: string;
  icon?: LucideIcon;
  exact?: boolean;
}

interface NavNode extends NavLeaf {
  /** When present, the item renders as a collapsible accordion group. */
  children?: NavLeaf[];
}

const MAIN_NAV: NavNode[] = [
  { href: "/admin", label: "Home", icon: Home, exact: true },
  {
    href: "/admin/produtos",
    label: "Produtos",
    icon: Package,
    children: [
      { href: "/admin/produtos", label: "Todos", exact: true },
      { href: "/admin/produtos/categorias", label: "Categorias" },
      { href: "/admin/produtos/templates", label: "Templates" },
      { href: "/admin/produtos/atributos", label: "Atributos" },
    ],
  },
  { href: "/admin/paginas", label: "Páginas", icon: FileText },
  { href: "/admin/biblioteca", label: "Biblioteca", icon: Archive },
  { href: "/admin/banners", label: "Banners", icon: Image },
  { href: "/admin/parceiros", label: "Parceiros", icon: Building2 },
];

const BOTTOM_NAV: NavNode[] = [
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
  { href: "/admin/historico", label: "Histórico", icon: Clock },
  { href: "/admin/mensagens", label: "Central de contato", icon: Mail },
  { href: "/admin/configuracoes", label: "Opções", icon: Settings },
];

function isItemActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname.startsWith(href);
}

/** Single leaf link — Mantine NavLink look (active = blue subtle + blue text). */
function NavLink({ item, indented }: { item: NavLeaf; indented?: boolean }) {
  const pathname = usePathname();
  const active = isItemActive(pathname, item.href, item.exact);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2 rounded-md py-1.5 text-sm font-medium transition-colors",
        indented ? "pl-9 pr-2" : "px-2",
        active
          ? "bg-cms-primary-subtle text-cms-primary"
          : "text-foreground/70 hover:bg-muted hover:text-foreground",
      )}
    >
      {Icon && <Icon className="size-4 shrink-0" />}
      {item.label}
    </Link>
  );
}

/** Collapsible accordion group. Auto-opens when a descendant route is active. */
function NavGroup({ node }: { node: NavNode }) {
  const pathname = usePathname();
  const Icon = node.icon;
  const childActive = node.children!.some((c) =>
    isItemActive(pathname, c.href, c.exact),
  );
  const [open, setOpen] = useState(childActive);

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
          childActive
            ? "text-cms-primary"
            : "text-foreground/70 hover:bg-muted hover:text-foreground",
        )}
      >
        {Icon && <Icon className="size-4 shrink-0" />}
        {node.label}
        <ChevronDown
          className={cn(
            "ml-auto size-4 shrink-0 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <ul className="mt-0.5 space-y-0.5">
          {node.children!.map((child) => (
            <li key={child.href}>
              <NavLink item={child} indented />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function NavItems({ items }: { items: NavNode[] }) {
  return (
    <ul className="space-y-0.5">
      {items.map((item) =>
        item.children ? (
          <NavGroup key={item.href} node={item} />
        ) : (
          <li key={item.href}>
            <NavLink item={item} />
          </li>
        ),
      )}
    </ul>
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
          {/* Brand mark — intentional Stetsom red */}
          <BarChart2 className="size-5 text-brand" />
          <span className="text-base font-bold uppercase text-foreground">
            CMS Stetsom
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-2">
        <p className="mb-2 px-2 text-xs font-medium text-foreground/50">
          Funções
        </p>
        <NavItems items={MAIN_NAV} />
      </nav>

      <div className="border-t border-border px-2 py-2">
        <NavItems items={BOTTOM_NAV} />
        <button
          type="button"
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4 shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  );
}
