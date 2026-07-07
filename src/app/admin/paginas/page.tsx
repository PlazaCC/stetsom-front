"use client";

import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/app/admin/_components/crud/admin-data-table";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import {
  AdminRowAction,
  AdminRowActions,
} from "@/app/admin/_components/crud/admin-row-actions";
import { ExternalLink } from "lucide-react";
import { PAGE_LABELS, PAGE_PUBLIC_HREFS } from "./_components/page-constants";

type PageRow = {
  id: string;
  slug: string;
  title: { pt: string };
  updated_at: string | null;
};

const PAGES: PageRow[] = Object.entries(PAGE_LABELS).map(([slug, title]) => ({
  id: slug,
  slug,
  title: { pt: title },
  updated_at: null,
}));

const columns: AdminTableColumn<PageRow>[] = [
  {
    key: "title",
    header: "Página",
    render: (page) => (
      <span className="font-medium text-foreground">{page.title.pt}</span>
    ),
  },
  {
    key: "url",
    header: "URL",
    render: (page) => (
      <span className="font-mono text-xs text-muted-foreground">
        {PAGE_PUBLIC_HREFS[page.slug] ?? `/${page.slug}`}
      </span>
    ),
  },
  {
    key: "updated_at",
    header: "Última atualização",
    render: (page) => (
      <span className="text-xs text-muted-foreground">
        {page.updated_at
          ? new Date(page.updated_at).toLocaleDateString("pt-BR")
          : "—"}
      </span>
    ),
  },
  {
    key: "actions",
    header: "",
    headerClassName: "text-right",
    className: "text-right",
    render: (page) => (
      <AdminRowActions>
        <AdminRowAction
          href={PAGE_PUBLIC_HREFS[page.slug] ?? `/${page.slug}`}
          target="_blank"
        >
          <span className="inline-flex items-center gap-1">
            <ExternalLink className="size-3" />
            Ver
          </span>
        </AdminRowAction>
        <AdminRowAction href={`/admin/paginas/${page.slug}`}>
          Editar
        </AdminRowAction>
      </AdminRowActions>
    ),
  },
];

export default function AdminPaginasPage() {
  return (
    <AdminPageLayout>
      <AdminDataTable
        columns={columns}
        data={PAGES}
        keyExtractor={(page) => page.slug}
        emptyTitle="Nenhuma página"
        emptyDescription="Nenhuma página institucional disponível."
        toolbar={
          <p className="text-xs text-muted-foreground">
            Gerencie o conteúdo das seções das páginas institucionais do site.
          </p>
        }
      />
    </AdminPageLayout>
  );
}
