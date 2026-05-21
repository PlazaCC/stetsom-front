import type {
  AdminDashboardPayload,
  CmsProductDetailPayload,
} from "@/lib/api/contracts";
import {
  CATALOG_CATEGORIES,
  CATALOG_PRODUCT_BLOCKS,
  CATALOG_PRODUCT_FILES,
  CATALOG_PRODUCTS,
  CATALOG_SUBCATEGORIES,
} from "@/lib/mock/catalog";

const ASSETS = {
  primary: "/figma-assets/raw/fill_EPTO4T_3d86cd17.png",
} as const;

const NOW = '2026-05-12T00:00:00.000Z';

export function buildCmsProductDetail(
  id: string,
): CmsProductDetailPayload | null {
  const product = CATALOG_PRODUCTS.find((p) => p.id === id);
  if (!product) return null;

  const category = CATALOG_CATEGORIES.find((c) => c.id === product.category_id);
  if (!category) return null;

  const subcategory = product.subcategory_id
    ? CATALOG_SUBCATEGORIES.find((s) => s.id === product.subcategory_id)
    : undefined;

  return {
    product,
    blocks: CATALOG_PRODUCT_BLOCKS.filter(
      (b) => b.product_id === product.id,
    ).sort((a, b) => a.order - b.order),
    files: CATALOG_PRODUCT_FILES.filter((f) => f.product_id === product.id),
    category,
    subcategory,
  };
}

export const ADMIN_DASHBOARD_PAYLOAD: AdminDashboardPayload = {
  title: "Painel Administrativo",
  subtitle: "Indicadores de operação para a apresentação do CMS Stetsom.",
  metrics: [
    {
      id: "metric-active-products",
      label: "Produtos ativos",
      value: 7,
      sub: "1 descontinuado",
    },
    {
      id: "metric-banners",
      label: "Banners rotativos",
      value: 4,
      thumbnail_url: ASSETS.primary,
      sub: "1 agendado",
    },
    {
      id: "metric-emails-pending",
      label: "E-mails pendentes",
      value: 3,
      sub: "7 no total",
    },
  ],
  recentActivities: [
    {
      id: "activity-1",
      title: "Produto atualizado",
      description: "ST-2000EQ MONO recebeu nova versão de manual.",
      timestamp: NOW,
    },
    {
      id: "activity-2",
      title: "Conteúdo publicado",
      description: "Página de suporte teve FAQ revisado.",
      timestamp: NOW,
    },
    {
      id: 'activity-3',
      title: 'Status alterado',
      description: 'ST-350.4 MINI marcado como descontinuado.',
      timestamp: NOW,
    },
  ],
  scheduleItems: [
    {
      id: "sched-1",
      label: "Banner 'Lançamento 2026' entra no ar",
      date: "2026-06-01T00:00:00.000Z",
      type: "banner",
    },
    {
      id: "sched-2",
      label: "ST-4000EQ 4 CANAIS — publicação agendada",
      date: "2026-05-25T10:00:00.000Z",
      type: "product",
    },
  ],
  quickActions: [
    {
      id: "qa-1",
      label: "Novo produto",
      href: "/admin/produtos/novo",
      icon: "package",
    },
    {
      id: "qa-2",
      label: "Novo banner",
      href: "/admin/banners/novo",
      icon: "image",
    },
    {
      id: "qa-3",
      label: "Upload arquivo",
      href: "/admin/biblioteca",
      icon: "upload",
    },
    {
      id: "qa-4",
      label: "Ver mensagens",
      href: "/admin/mensagens",
      icon: "mail",
    },
  ],
};
