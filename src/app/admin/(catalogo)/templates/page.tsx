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
import { useGetApiCategories, useGetApiTemplates } from "@/api/stetsom";
import type { Template } from "@/api/stetsom";
import { LayoutTemplate } from "lucide-react";
import { TemplateCreateAction } from "./_components/template-create-action";

export default function AdminTemplatesPage() {
  const { data: templates = [], isLoading } = useGetApiTemplates();
  const { data: categories = [] } = useGetApiCategories();

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
        <AdminRowActions>
          <AdminRowAction
            href={`/admin/categorias/${t.category_id}/templates/${t.id}`}
          >
            Editar
          </AdminRowAction>
        </AdminRowActions>
      ),
    },
  ];

  return (
    <AdminPageLayout>
      <AdminDataTable
        columns={columns}
        data={templates}
        isLoading={isLoading}
        keyExtractor={(t) => t.id}
        emptyTitle="Nenhum template cadastrado"
        emptyDescription="Crie um template para padronizar os dados técnicos de uma categoria."
        emptyIcon={LayoutTemplate}
        emptyAction={<TemplateCreateAction categories={categories} />}
        action={<TemplateCreateAction categories={categories} />}
      />
    </AdminPageLayout>
  );
}
