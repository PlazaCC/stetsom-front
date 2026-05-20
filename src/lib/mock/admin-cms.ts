import type { AdminDashboardPayload } from "@/lib/api/contracts";

const NOW = "2026-05-12T00:00:00.000Z";

export const ADMIN_DASHBOARD_PAYLOAD: AdminDashboardPayload = {
  title: "Painel Administrativo",
  subtitle: "Indicadores de operação para a apresentação do CMS Stetsom.",
  metrics: [
    {
      id: "metric-active-products",
      label: "Produtos ativos",
      value: "7",
      variation: "+2 este mês",
    },
    {
      id: "metric-discontinued-products",
      label: "Produtos descontinuados",
      value: "1",
      variation: "Sem alteração",
    },
    {
      id: "metric-open-tickets",
      label: "Tickets abertos",
      value: "14",
      variation: "-8% na semana",
    },
    {
      id: "metric-updated-pages",
      label: "Páginas atualizadas",
      value: "6",
      variation: "+3 hoje",
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
      description: "Página de suporte teve FAQ revisado e aprovado.",
      timestamp: NOW,
    },
    {
      id: "activity-3",
      title: "Status alterado",
      description: "ST-350.4 MINI marcado como descontinuado.",
      timestamp: NOW,
    },
  ],
};
