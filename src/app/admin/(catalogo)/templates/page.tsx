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
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function AdminTemplatesPage() {
  const router = useRouter();
  const { data: templates = [], isLoading } = useGetApiTemplates();
  const { data: categories = [] } = useGetApiCategories();
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pickerOpen) return;
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [pickerOpen]);

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
        emptyDescription="Templates definem os atributos técnicos de cada categoria."
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
              <div
                ref={pickerRef}
                className="absolute top-11 right-0 z-10 w-56 rounded-md border border-border bg-card p-1 shadow-cms-card-lg"
              >
                <p className="px-2 py-1.5 text-xs text-muted-foreground">
                  Escolha a categoria
                </p>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setPickerOpen(false);
                      router.push(`/admin/categorias/${cat.id}/templates/novo`);
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
      />
    </AdminPageLayout>
  );
}
