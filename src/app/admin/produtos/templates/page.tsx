"use client";

import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/app/admin/_components/crud/admin-data-table";
import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import { ProdutosTabs } from "@/app/admin/produtos/_components/produtos-tabs";
import { useGetApiCategories, useGetApiTemplates } from "@/api/stetsom";
import type { Template } from "@/api/stetsom";
import { cn } from "@/lib/utils";
import { LayoutTemplate, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminTemplatesPage() {
  const router = useRouter();
  const { data: templates = [], isLoading } = useGetApiTemplates();
  const { data: categories = [] } = useGetApiCategories();
  const [pickerOpen, setPickerOpen] = useState(false);

  function categoryName(t: Template): string {
    return categories.find((c) => c.id === t.category_id)?.name ?? "—";
  }

  const columns: AdminTableColumn<Template>[] = [
    {
      key: "name.pt",
      header: "Nome (PT)",
      render: (t) => (
        <span className="font-medium text-foreground">{t.name.pt}</span>
      ),
    },
    {
      key: "attributes",
      header: "Atributos",
      render: (t) => (
        <span className="text-muted-foreground">{t.attributes.length}</span>
      ),
    },
    {
      key: "category",
      header: "Categoria",
      render: (t) => (
        <span className="text-muted-foreground">{categoryName(t)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "text-right",
      className: "text-right",
      render: (t) => (
        <Link
          href={`/admin/produtos/categorias/${t.category_id}/templates/${t.id}`}
          className="rounded border border-border px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          Editar
        </Link>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <ProdutosTabs />
      <AdminListPage
        title="Templates"
        icon={LayoutTemplate}
        action={
          <div className="relative">
            <button
              type="button"
              onClick={() => setPickerOpen((o) => !o)}
              disabled={categories.length === 0}
              className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80 disabled:opacity-60"
            >
              <Plus className="size-4" />
              Novo template
            </button>
            {pickerOpen && (
              <div className="absolute right-0 top-11 z-10 w-56 rounded-md border border-border bg-card p-1 shadow-lg">
                <p className="px-2 py-1.5 text-xs text-muted-foreground">
                  Escolha a categoria
                </p>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setPickerOpen(false);
                      router.push(
                        `/admin/produtos/categorias/${cat.id}/templates/novo`,
                      );
                    }}
                    className={cn(
                      "block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-muted",
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        }
      >
        <AdminDataTable
          columns={columns}
          data={templates}
          isLoading={isLoading}
          keyExtractor={(t) => t.id}
          emptyTitle="Nenhum template cadastrado"
          emptyDescription="Templates definem os atributos técnicos de cada categoria."
        />
      </AdminListPage>
    </div>
  );
}
