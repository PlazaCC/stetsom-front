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
  LayoutGrid,
  LayoutTemplate,
  ListChecks,
  LogOut,
  Mail,
  Package,
  Settings,
  Tags,
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
  children?: NavLeaf[];
}

const MAIN_NAV: NavNode[] = [
  { href: "/admin", label: "Home", icon: Home, exact: true },
  {
    href: "/admin/produtos",
    label: "Catálogo",
    icon: LayoutGrid,
    children: [
      { href: "/admin/produtos", label: "Produtos", icon: Package },
      { href: "/admin/categorias", label: "Categorias", icon: Tags },
      { href: "/admin/templates", label: "Templates", icon: LayoutTemplate },
      { href: "/admin/atributos", label: "Atributos", icon: ListChecks },
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
function NavLink({
  item,
  indented,
  onClose,
}: {
  item: NavLeaf;
  indented?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const active = isItemActive(pathname, item.href, item.exact);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClose}
      className={cn(
        "flex items-center gap-2 rounded-md py-2 text-sm font-medium transition-colors",
        indented ? "pr-2 pl-9" : "px-2",
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

function NavGroup({ node, onClose }: { node: NavNode; onClose?: () => void }) {
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
          "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors",
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
              <NavLink item={child} indented onClose={onClose} />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function NavItems({
  items,
  onClose,
}: {
  items: NavNode[];
  onClose?: () => void;
}) {
  return (
    <ul className="space-y-0.5">
      {items.map((item) =>
        item.children ? (
          <NavGroup key={item.href} node={item} onClose={onClose} />
        ) : (
          <li key={item.href}>
            <NavLink item={item} onClose={onClose} />
          </li>
        ),
      )}
    </ul>
  );
}

export function AdminSidebar({
  open,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <>
      {/* Scrim para mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-cms-overlay lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 shrink-0 flex-col border-r border-border bg-card shadow-cms-sidebar transition-transform lg:static lg:z-auto lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:overflow-y-auto",
        )}
      >
        <div className="px-4 py-5">
          <div className="flex items-center gap-2">
            {/* Brand mark — intentional Stetsom red */}
            <BarChart2 className="size-5 text-brand" />
            <span className="text-base font-bold text-foreground uppercase">
              CMS Stetsom
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-2">
          <p className="mb-2 px-2 text-xs font-medium text-foreground/50">
            Funções
          </p>
          <NavItems items={MAIN_NAV} onClose={onClose} />
        </nav>

        <div className="border-t border-border px-2 py-2">
          <NavItems items={BOTTOM_NAV} onClose={onClose} />
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="size-4 shrink-0" />
            Sair
          </button>
        </div>

        {/* Botão de fechar no topo para mobile */}
        {open && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-md text-foreground hover:bg-muted focus:ring-2 focus:ring-primary focus:outline-none lg:hidden"
            aria-label="Fechar menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </aside>
    </>
  );
}
