"use client";

import Link from "next/link";
import { Layers, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useGetApiCategoriesAdmin } from "@/api/stetsom";
import type { Line } from "@/api/stetsom/model";
import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/app/admin/_components/crud/admin-data-table";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import { AdminSearchInput } from "@/app/admin/_components/crud/admin-search-input";
import {
  AdminRowAction,
  AdminRowActions,
} from "@/app/admin/_components/crud/admin-row-actions";
import { toApiError } from "@/api/stetsom/orval-client";

type LineRow = Line & { categoryId: string; categoryName: string };

export default function AdminLinhasPage() {
  const query = useGetApiCategoriesAdmin();
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(inputValue.trim().toLocaleLowerCase());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [inputValue]);

  const filtered = useMemo(() => {
    const rows = (query.data ?? []).flatMap((category) =>
      category.lines.map((line) => ({
        ...line,
        categoryId: category.id,
        categoryName: category.name.pt,
      })),
    );
    if (!search) return rows;
    return rows.filter((line) =>
      [
        line.name.pt,
        line.name.en,
        line.name.es,
        line.slug.pt,
        line.categoryName,
      ]
        .filter(Boolean)
        .some((value) => value!.toLocaleLowerCase().includes(search)),
    );
  }, [query.data, search]);
  const action = (
    <Link
      href="/admin/linhas/novo"
      className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background hover:opacity-80"
    >
      <Plus className="size-4" />
      Nova linha
    </Link>
  );
  const columns: AdminTableColumn<LineRow>[] = [
    {
      key: "name",
      header: "Linha",
      render: (line) => <span className="font-medium">{line.name.pt}</span>,
    },
    {
      key: "category",
      header: "Categoria",
      render: (line) => (
        <span className="text-muted-foreground">{line.categoryName}</span>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      render: (line) => (
        <span className="text-muted-foreground">/{line.slug.pt}</span>
      ),
    },
    {
      key: "products",
      header: "Capa",
      render: (line) => (line.cover_source ? "Configurada" : "Automática"),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "text-right",
      className: "text-right",
      render: (line) => (
        <AdminRowActions>
          <AdminRowAction
            href={`/admin/linhas/${line.line_id}?category=${line.categoryId}`}
          >
            Editar
          </AdminRowAction>
        </AdminRowActions>
      ),
    },
  ];

  if (query.isError) {
    const error = toApiError(query.error);
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm">
        <p className="text-destructive">
          {error.status === 401 || error.status === 403
            ? "Sua sessão expirou ou não há permissão."
            : "Não foi possível carregar as linhas. Tente novamente."}
        </p>
        {(error.status === 401 || error.status === 403) && (
          <Link
            href="/admin/login"
            className="text-primary underline underline-offset-4"
          >
            Fazer login novamente
          </Link>
        )}
      </div>
    );
  }
  return (
    <AdminPageLayout>
      <AdminDataTable
        columns={columns}
        data={filtered}
        isLoading={query.isLoading}
        keyExtractor={(line) => line.line_id}
        emptyTitle={
          search ? "Nenhuma linha encontrada" : "Nenhuma linha cadastrada"
        }
        emptyDescription={
          search
            ? "Ajuste a busca para encontrar linhas."
            : "Linhas organizam os produtos dentro de cada categoria."
        }
        emptyIcon={Layers}
        emptyAction={search ? undefined : action}
        action={action}
        toolbar={
          <AdminSearchInput
            value={inputValue}
            onChange={setInputValue}
            placeholder="Buscar linha ou categoria"
            className="max-w-72"
          />
        }
      />
    </AdminPageLayout>
  );
}
