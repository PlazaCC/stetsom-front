"use client";

import { AdminLabel } from "@/app/admin/_components/crud/admin-input";
import { useGetApiTemplates } from "@/api/stetsom";
import { Plus } from "lucide-react";
import Link from "next/link";

interface CategoryTemplatesSectionProps {
  categoryId: string;
}

export function CategoryTemplatesSection({
  categoryId,
}: CategoryTemplatesSectionProps) {
  const { data: templates = [] } = useGetApiTemplates();
  const categoryTemplates = templates.filter(
    (t) => t.category_id === categoryId,
  );

  return (
    <div className="rounded-md border border-border bg-muted/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <AdminLabel className="mb-0">Templates</AdminLabel>
        <Link
          href={`/admin/produtos/categorias/${categoryId}/templates/novo`}
          className="flex h-8 items-center gap-1 rounded-md border border-border bg-card px-3 text-xs font-medium hover:bg-muted"
        >
          <Plus className="size-3.5" />
          Novo template
        </Link>
      </div>
      <div className="space-y-1">
        {categoryTemplates.length === 0 && (
          <p className="py-2 text-center text-xs text-muted-foreground">
            Nenhum template nesta categoria
          </p>
        )}
        {categoryTemplates.map((template) => (
          <div
            key={template.id}
            className="flex items-center gap-2 rounded bg-card px-2 py-1.5"
          >
            <span className="flex-1 text-sm font-medium text-foreground">
              {template.name.pt}
            </span>
            <span className="text-xs text-muted-foreground">
              {template.attributes.length} atributos
            </span>
            <Link
              href={`/admin/produtos/categorias/${categoryId}/templates/${template.id}`}
              className="text-xs font-medium text-brand hover:underline"
            >
              Editar
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
