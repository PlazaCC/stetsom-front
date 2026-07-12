import {
  Archive,
  Award,
  BookOpen,
  BookText,
  Building2,
  Clock,
  FileText,
  Home,
  Image as ImageIcon,
  LayoutTemplate,
  ListChecks,
  Mail,
  Package,
  Scale,
  Settings,
  Shapes,
  Tags,
  Users,
  Video,
  Wrench,
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

export const config: Record<string, AppRouteStaticData> = {
  "/admin": { label: "Dashboard", icon: Home, section: "admin" },

  // Catálogo — produtos, categorias, templates e atributos como rotas irmãs.
  "/admin/produtos": { label: "Produtos", icon: Package, section: "admin" },
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
  "/admin/categorias": { label: "Categorias", icon: Tags, section: "admin" },
  "/admin/categorias/[id]/templates/novo": {
    label: "Novo template",
    icon: LayoutTemplate,
    section: "admin",
  },
  "/admin/categorias/[id]/templates/[templateId]": {
    label: "Editar template",
    icon: LayoutTemplate,
    section: "admin",
  },
  "/admin/templates": {
    label: "Templates",
    icon: LayoutTemplate,
    section: "admin",
  },
  "/admin/atributos": {
    label: "Atributos",
    icon: ListChecks,
    section: "admin",
  },

  // Páginas (CMS sections)
  "/admin/paginas": { label: "Páginas", icon: FileText, section: "admin" },
  "/admin/paginas/[pageId]": {
    label: "Editar página",
    icon: FileText,
    section: "admin",
  },

  "/admin/biblioteca": {
    label: "Biblioteca",
    icon: Archive,
    section: "admin",
    tabs: [
      {
        href: "/admin/biblioteca/fotos",
        label: "Fotos",
        icon: ImageIcon,
        exact: true,
      },
      {
        href: "/admin/biblioteca/videos",
        label: "Vídeos",
        icon: Video,
        exact: true,
      },
      {
        href: "/admin/biblioteca/3d",
        label: "Arquivos 3D",
        icon: Archive,
        exact: true,
      },
      {
        href: "/admin/biblioteca/manuais",
        label: "Manuais",
        icon: BookOpen,
        exact: true,
      },
      {
        href: "/admin/biblioteca/catalogos",
        label: "Catálogos",
        icon: BookText,
        exact: true,
      },
      {
        href: "/admin/biblioteca/certificados",
        label: "Certificados",
        icon: Award,
        exact: true,
      },
      {
        href: "/admin/biblioteca/packs",
        label: "Packs de imagem",
        icon: Package,
        exact: true,
      },
      {
        href: "/admin/biblioteca/icones",
        label: "Ícones de categoria",
        icon: Shapes,
        exact: true,
      },
    ],
  },
  "/admin/biblioteca/fotos": {
    label: "Biblioteca",
    icon: Archive,
    section: "admin",
    hideInBreadcrumb: true,
  },
  "/admin/biblioteca/videos": {
    label: "Biblioteca",
    icon: Archive,
    section: "admin",
    hideInBreadcrumb: true,
  },
  "/admin/biblioteca/manuais": {
    label: "Biblioteca",
    icon: Archive,
    section: "admin",
    hideInBreadcrumb: true,
  },
  "/admin/biblioteca/catalogos": {
    label: "Biblioteca",
    icon: Archive,
    section: "admin",
    hideInBreadcrumb: true,
  },
  "/admin/biblioteca/certificados": {
    label: "Biblioteca",
    icon: Archive,
    section: "admin",
    hideInBreadcrumb: true,
  },
  "/admin/biblioteca/packs": {
    label: "Biblioteca",
    icon: Archive,
    section: "admin",
    hideInBreadcrumb: true,
  },
  "/admin/biblioteca/icones": {
    label: "Biblioteca",
    icon: Archive,
    section: "admin",
    hideInBreadcrumb: true,
  },
  "/admin/biblioteca/3d": {
    label: "Biblioteca",
    icon: Archive,
    section: "admin",
    hideInBreadcrumb: true,
  },
  "/admin/banners": { label: "Banners", icon: ImageIcon, section: "admin" },
  "/admin/banners/novo": {
    label: "Cadastrar banner",
    icon: ImageIcon,
    section: "admin",
  },
  "/admin/banners/[id]": {
    label: "Editar banner",
    icon: ImageIcon,
    section: "admin",
  },
  "/admin/parceiros": {
    label: "Parceiros",
    icon: Building2,
    section: "admin",
    tabs: [
      {
        href: "/admin/parceiros/representantes",
        label: "Representantes",
        icon: Building2,
        exact: true,
      },
      {
        href: "/admin/parceiros/assistencias",
        label: "Assist. Técnicas",
        icon: Wrench,
        exact: true,
      },
    ],
  },
  "/admin/parceiros/representantes": {
    label: "Parceiros",
    icon: Building2,
    section: "admin",
    hideInBreadcrumb: true,
  },
  "/admin/parceiros/assistencias": {
    label: "Parceiros",
    icon: Building2,
    section: "admin",
    hideInBreadcrumb: true,
  },
  "/admin/usuarios": { label: "Usuários", icon: Users, section: "admin" },
  "/admin/historico": { label: "Histórico", icon: Clock, section: "admin" },
  "/admin/mensagens": {
    label: "Central de contato",
    icon: Mail,
    section: "admin",
    tabs: [
      {
        href: "/admin/mensagens/contatos",
        label: "Contatos",
        icon: Mail,
        exact: true,
      },
      {
        href: "/admin/mensagens/departamentos",
        label: "Departamentos",
        icon: Building2,
        exact: true,
      },
    ],
  },
  "/admin/mensagens/contatos": {
    label: "Central de contato",
    icon: Mail,
    section: "admin",
    hideInBreadcrumb: true,
  },
  "/admin/mensagens/departamentos": {
    label: "Central de contato",
    icon: Mail,
    section: "admin",
    hideInBreadcrumb: true,
  },
  "/admin/configuracoes": {
    label: "Configurações",
    icon: Settings,
    section: "admin",
    tabs: [
      {
        href: "/admin/configuracoes/identidade-visual",
        label: "Identidade Visual",
        icon: ImageIcon,
        exact: true,
      },
      {
        href: "/admin/configuracoes/empresa",
        label: "Empresa",
        icon: Building2,
        exact: true,
      },
      {
        href: "/admin/configuracoes/redes-sociais",
        label: "Redes Sociais",
        icon: Mail,
        exact: true,
      },
      {
        href: "/admin/configuracoes/paginas-legais",
        label: "Páginas Legais",
        icon: Scale,
        exact: true,
      },
    ],
  },
  "/admin/configuracoes/identidade-visual": {
    label: "Configurações",
    icon: Settings,
    section: "admin",
    hideInBreadcrumb: true,
  },
  "/admin/configuracoes/empresa": {
    label: "Configurações",
    icon: Settings,
    section: "admin",
    hideInBreadcrumb: true,
  },
  "/admin/configuracoes/redes-sociais": {
    label: "Configurações",
    icon: Settings,
    section: "admin",
    hideInBreadcrumb: true,
  },
  "/admin/configuracoes/paginas-legais": {
    label: "Configurações",
    icon: Settings,
    section: "admin",
    hideInBreadcrumb: true,
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
