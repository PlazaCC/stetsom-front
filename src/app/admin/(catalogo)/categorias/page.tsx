"use client";

import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/app/admin/_components/crud/admin-data-table";
import { useGetApiCategories, useGetApiTemplates } from "@/api/stetsom";
import type { PublicCategory } from "@/api/stetsom/model";
import { ImageIcon, Plus } from "lucide-react";
import Link from "next/link";

export default function AdminCategoriasPage() {
  const { data: categories = [], isLoading } = useGetApiCategories();
  const { data: templates = [] } = useGetApiTemplates();

  function templateCount(categoryId: string): number {
    return templates.filter((t) => t.category_id === categoryId).length;
  }

  const columns: AdminTableColumn<PublicCategory>[] = [
    {
      key: "icon",
      header: "Ícone",
      className: "w-16",
      render: () => (
        <div className="flex size-10 items-center justify-center rounded-md bg-muted">
          <ImageIcon className="size-5 text-muted-foreground/50" />
        </div>
      ),
    },
    {
      key: "name",
      header: "Categoria",
      render: (c) => (
        <span className="font-medium text-foreground">{c.name}</span>
      ),
    },
    {
      key: "templates",
      header: "Templates",
      render: (c) => (
        <span className="text-muted-foreground">{templateCount(c.id)}</span>
      ),
    },
    {
      key: "lines",
      header: "Linhas",
      render: (c) => (
        <span className="text-muted-foreground">{c.lines.length}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "text-right",
      className: "text-right",
      render: (c) => (
        <Link
          href={`/admin/categorias/${c.id}`}
          className="rounded border border-border px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          Editar
        </Link>
      ),
    },
  ];

  return (
    <div className="px-4 py-4 lg:px-5 lg:py-5">
      <AdminDataTable
        columns={columns}
        data={categories}
        isLoading={isLoading}
        keyExtractor={(c) => c.id}
        emptyTitle="Nenhuma categoria cadastrada"
        emptyDescription="Categorias organizam o catálogo e suas linhas internas."
        action={
          <Link
            href="/admin/categorias/nova"
            className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80"
          >
            <Plus className="size-4" />
            Nova categoria
          </Link>
        }
      />
    </div>
  );
}
