"use client";

import { AdminActionBar } from "@/app/admin/_components/crud/admin-action-bar";
import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/app/admin/_components/crud/admin-data-table";
import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import { AdminSearchInput } from "@/app/admin/_components/crud/admin-search-input";
import { useCmsProducts } from "@/hooks/use-cms";
import type { ProductStatus } from "@/lib/api/contracts";
import { Package, Plus } from "lucide-react";
import { useMemo, useState } from "react";

type ProductRow = {
  id: string;
  name: string;
  category: string;
  status: ProductStatus;
  updated_at: string;
};

const STATUS_LABELS: Record<ProductStatus, string> = {
  ACTIVE: "Ativo",
  DISCONTINUED: "Descontinuado",
};

export default function AdminProdutos() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ProductStatus>(
    "ALL",
  );

  const cmsProducts = useCmsProducts({
    q: query || undefined,
    status: statusFilter,
    page: 1,
    pageSize: 24,
  });

  const rows = useMemo<ProductRow[]>(
    () => cmsProducts.data?.items ?? [],
    [cmsProducts.data?.items],
  );

  const columns: AdminTableColumn<ProductRow>[] = [
    {
      key: "name",
      header: "Nome",
      render: (row) => (
        <span className="font-medium text-foreground">{row.name}</span>
      ),
    },
    {
      key: "category",
      header: "Categoria",
      render: (row) => (
        <span className="text-muted-foreground">{row.category}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={
            row.status === "ACTIVE"
              ? "rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700"
              : "rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700"
          }
        >
          {STATUS_LABELS[row.status]}
        </span>
      ),
    },
    {
      key: "updated_at",
      header: "Atualizado em",
      render: (row) => (
        <span className="text-muted-foreground">{row.updated_at}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "text-right",
      className: "text-right",
      render: () => (
        <button className="rounded border border-border px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted">
          Editar
        </button>
      ),
    },
  ];

  return (
    <AdminListPage
      title="Produtos"
      icon={Package}
      action={
        <AdminActionBar>
          <button className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            Importar planilha
          </button>
          <button className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80">
            <Plus className="size-4" />
            Cadastrar produto
          </button>
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
      />
    </AdminListPage>
  );
}
