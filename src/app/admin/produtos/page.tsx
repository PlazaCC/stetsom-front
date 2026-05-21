"use client";

import { AdminActionBar } from "@/app/admin/_components/crud/admin-action-bar";
import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/app/admin/_components/crud/admin-data-table";
import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import { AdminSearchInput } from "@/app/admin/_components/crud/admin-search-input";
import { useCmsProducts } from "@/hooks/use-cms";
import type { CmsProductRow, ProductStatus } from "@/lib/api/contracts";
import { cn } from "@/lib/utils";
import { Package, Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const STATUS_LABELS: Record<ProductStatus, string> = {
  ACTIVE: "Ativo",
  DISCONTINUED: "Descontinuado",
};

const LOCALE_LABEL: Record<string, string> = {
  "pt-BR": "PT",
  en: "EN",
  es: "ES",
};

function LocaleFlags({ locales }: { locales: string[] }) {
  return (
    <span className="flex gap-1">
      {locales.map((l) => (
        <span
          key={l}
          title={l}
          className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground"
        >
          {LOCALE_LABEL[l] ?? l}
        </span>
      ))}
    </span>
  );
}

export default function AdminProdutos() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ProductStatus>(
    "ALL",
  );
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const cmsProducts = useCmsProducts({
    q: query || undefined,
    status: statusFilter,
    page,
    pageSize,
  });

  const rows = useMemo<CmsProductRow[]>(
    () => cmsProducts.data?.items ?? [],
    [cmsProducts.data?.items],
  );

  const columns: AdminTableColumn<CmsProductRow>[] = [
    {
      key: "thumb",
      header: "",
      className: "w-12",
      render: (row) => (
        <div className="size-10 overflow-hidden rounded-md bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={row.thumbnail_url}
            alt={row.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      ),
    },
    {
      key: "name",
      header: "Nome",
      render: (row) => (
        <div>
          <p className="font-medium text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.slug}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Categoria / Linha",
      render: (row) => (
        <div>
          <p className="text-sm text-foreground">{row.category}</p>
          {row.subcategory && (
            <p className="text-xs text-muted-foreground">{row.subcategory}</p>
          )}
        </div>
      ),
    },
    {
      key: "languages",
      header: "Idiomas",
      render: (row) => <LocaleFlags locales={row.languages} />,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-xs font-medium",
            row.status === "ACTIVE"
              ? "border-cms-step-done bg-cms-step-done text-white"
              : "border-cms-step-pending bg-cms-step-pending text-muted-foreground",
          )}
        >
          {STATUS_LABELS[row.status]}
        </span>
      ),
    },
    {
      key: "is_published",
      header: "Publicação",
      render: (row) => (
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-xs font-medium",
            row.is_published
              ? "border-cms-active-item bg-cms-active-item text-foreground"
              : "border-border bg-muted text-muted-foreground",
          )}
        >
          {row.is_published ? "Publicado" : "Rascunho"}
        </span>
      ),
    },
    {
      key: "updated_at",
      header: "Atualizado",
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.updated_at).toLocaleDateString("pt-BR")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "text-right",
      className: "text-right",
      render: (row) => (
        <Link
          href={`/admin/produtos/${row.id}`}
          className="rounded border border-border px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          Editar
        </Link>
      ),
    },
  ];

  return (
    <AdminListPage
      title="Produtos"
      icon={Package}
      action={
        <AdminActionBar>
          <button
            type="button"
            className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Importar planilha
          </button>
          <Link
            href="/admin/produtos/novo"
            className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80"
          >
            <Plus className="size-4" />
            Cadastrar produto
          </Link>
        </AdminActionBar>
      }
      toolbar={
        <div className="flex items-center gap-3">
          <AdminSearchInput
            value={query}
            onChange={setQuery}
            placeholder="Buscar por nome ou slug"
            className="max-w-72"
          />
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "ALL" | ProductStatus)
            }
            className="h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="ALL">Todos os status</option>
            <option value="ACTIVE">Ativo</option>
            <option value="DISCONTINUED">Descontinuado</option>
          </select>
          {cmsProducts.data && (
            <span className="ml-auto text-xs text-muted-foreground">
              {cmsProducts.data.total} itens
            </span>
          )}
        </div>
      }
    >
      <AdminDataTable
        columns={columns}
        data={rows}
        isLoading={cmsProducts.isLoading}
        keyExtractor={(row) => row.id}
        emptyTitle="Nenhum produto encontrado"
        emptyDescription="Cadastre um novo produto ou ajuste os filtros."
        pagination={
          cmsProducts.data
            ? {
                page,
                pageSize,
                total: cmsProducts.data.total,
                onPageChange: setPage,
              }
            : undefined
        }
      />
    </AdminListPage>
  );
}
