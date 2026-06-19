import {
  Archive,
  Building2,
  Clock,
  FileText,
  Home,
  Image as ImageIcon,
  LayoutTemplate,
  ListChecks,
  Mail,
  Package,
  Settings,
  Tags,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * A single tab inside a route's tab bar. Shape is compatible with
 * `AdminTabItem` consumed by `AdminTabs`.
 */
export type RouteTab = {
  href: string;
  label: string;
  icon?: LucideIcon;
  /** Match exactly instead of prefix (default: false). */
  exact?: boolean;
};

/**
 * Per-route static data. Drives the shell header: page title, breadcrumb and
 * tab bar. Kept section-agnostic so the same shape can later describe public
 * and dashboard areas, not only the admin/CMS.
 */
export type AppRouteStaticData = {
  /** Page title shown in the header (and default breadcrumb label). */
  label: string;
  /** Icon rendered beside the title. */
  icon?: LucideIcon;
  /** Tab bar for this area. Descendants that omit it inherit the nearest ancestor's. */
  tabs?: RouteTab[];
  /** Breadcrumb label for this segment when it should differ from `label`. */
  breadcrumbLabel?: string;
  /** Omit this segment from the derived breadcrumb. */
  hideInBreadcrumb?: boolean;
  /** Shell chrome toggles. Default is to show both. */
  showNavbar?: boolean;
  showSidebar?: boolean;
  /** Owning section. Reserved for future public/dashboard routes. */
  section?: "public" | "dashboard" | "admin";
};

/**
 * Route keys use Next.js dynamic-segment markers (`[id]`) so they mirror the
 * folder structure under `src/app/admin/`. Matching against a live pathname is
 * handled by `resolve-route.ts`.
 */

const PRODUTOS_TABS: RouteTab[] = [
  { href: "/admin/produtos", label: "Todos", icon: Package, exact: true },
  { href: "/admin/produtos/categorias", label: "Categorias", icon: Tags },
  {
    href: "/admin/produtos/templates",
    label: "Templates",
    icon: LayoutTemplate,
  },
  { href: "/admin/produtos/atributos", label: "Atributos", icon: ListChecks },
];

export const config: Record<string, AppRouteStaticData> = {
  "/admin": { label: "Dashboard", icon: Home, section: "admin" },

  // Produtos area — shares one tab bar across listing + configuration.
  "/admin/produtos": {
    label: "Produtos",
    icon: Package,
    tabs: PRODUTOS_TABS,
    section: "admin",
  },
  "/admin/produtos/novo": {
    label: "Cadastrar produto",
    icon: Package,
    section: "admin",
  },
  "/admin/produtos/[id]": {
    label: "Editar produto",
    icon: Package,
    section: "admin",
  },
  "/admin/produtos/categorias": {
    label: "Categorias",
    icon: Tags,
    tabs: PRODUTOS_TABS,
    section: "admin",
  },
  "/admin/produtos/categorias/nova": {
    label: "Nova categoria",
    icon: Tags,
    section: "admin",
  },
  "/admin/produtos/categorias/[id]": {
    label: "Editar categoria",
    icon: Tags,
    section: "admin",
  },
  "/admin/produtos/categorias/[id]/templates/novo": {
    label: "Novo template",
    icon: LayoutTemplate,
    section: "admin",
  },
  "/admin/produtos/categorias/[id]/templates/[templateId]": {
    label: "Editar template",
    icon: LayoutTemplate,
    section: "admin",
  },
  "/admin/produtos/templates": {
    label: "Templates",
    icon: LayoutTemplate,
    tabs: PRODUTOS_TABS,
    section: "admin",
  },
  "/admin/produtos/atributos": {
    label: "Atributos",
    icon: ListChecks,
    tabs: PRODUTOS_TABS,
    section: "admin",
  },

  // Páginas (CMS sections)
  "/admin/paginas": { label: "Páginas", icon: FileText, section: "admin" },
  "/admin/paginas/[pageId]": {
    label: "Editar página",
    icon: FileText,
    section: "admin",
  },
  "/admin/paginas/[pageId]/[sectionId]": {
    label: "Editar seção",
    icon: FileText,
    section: "admin",
  },

  "/admin/biblioteca": { label: "Biblioteca", icon: Archive, section: "admin" },
  "/admin/banners": { label: "Banners", icon: ImageIcon, section: "admin" },
  "/admin/parceiros": { label: "Parceiros", icon: Building2, section: "admin" },
  "/admin/usuarios": { label: "Usuários", icon: Users, section: "admin" },
  "/admin/historico": { label: "Histórico", icon: Clock, section: "admin" },
  "/admin/mensagens": {
    label: "Central de contato",
    icon: Mail,
    section: "admin",
  },
  "/admin/configuracoes": {
    label: "Configurações",
    icon: Settings,
    section: "admin",
  },
  "/admin/styleguide": {
    label: "Design System",
    hideInBreadcrumb: false,
    section: "admin",
  },

  // Login renders outside the shell — no chrome.
  "/admin/login": {
    label: "Login",
    showNavbar: false,
    showSidebar: false,
    hideInBreadcrumb: true,
    section: "admin",
  },
};
