"use client";

import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/app/admin/_components/crud/admin-data-table";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import {
  FilterChips,
  type FilterChip,
} from "@/app/admin/_components/crud/filter-chips";
import { useGetApiAudit } from "@/api/stetsom";
import type { AuditEntry, AuditEntryAction } from "@/api/stetsom/model";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";
import { useState } from "react";

const ACTION_META: Record<
  AuditEntryAction,
  { label: string; className: string }
> = {
  CREATE: {
    label: "Criou",
    className: "border-cms-step-done bg-cms-step-done text-white",
  },
  UPDATE: {
    label: "Editou",
    className: "border-cms-active-item bg-cms-active-item text-foreground",
  },
  DELETE: {
    label: "Excluiu",
    className: "border-border bg-muted text-muted-foreground",
  },
  PUBLISH: {
    label: "Publicou",
    className: "border-cms-step-done bg-cms-step-done text-white",
  },
  LOGIN: {
    label: "Entrou",
    className: "border-border bg-muted text-muted-foreground",
  },
  LOGOUT: {
    label: "Saiu",
    className: "border-border bg-muted text-muted-foreground",
  },
};

const ENTITY_LABELS: Record<string, string> = {
  products: "Produtos",
  banners: "Banners",
  pages: "Páginas",
  categories: "Categorias",
  templates: "Templates",
  attributes: "Atributos",
  users: "Usuários",
  library: "Biblioteca",
};

const ENTITY_OPTIONS = Object.keys(ENTITY_LABELS);

const PAGE_SIZE = 20;

const columns: AdminTableColumn<AuditEntry>[] = [
  {
    key: "user_name",
    header: "Usuário",
    render: (e) => (
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-semibold text-foreground">
          {e.user_avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={e.user_avatar}
              alt={e.user_name}
              className="h-full w-full object-cover"
            />
          ) : (
            e.user_name.charAt(0).toUpperCase()
          )}
        </div>
        <span className="text-sm font-medium text-foreground">
          {e.user_name}
        </span>
      </div>
    ),
  },
  {
    key: "action",
    header: "Ação",
    render: (e) => {
      const meta = ACTION_META[e.action];
      return (
        <span
          className={cn(
            "inline-flex rounded-full border px-2 py-0.5 text-xs font-medium",
            meta.className,
          )}
        >
          {meta.label}
        </span>
      );
    },
  },
  {
    key: "action_sentence",
    header: "Detalhe",
    render: (e) => (
      <span className="text-sm text-foreground">{e.action_sentence}</span>
    ),
  },
  {
    key: "created_at",
    header: "Data",
    render: (e) => (
      <span className="text-xs text-muted-foreground">
        {new Date(e.created_at).toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    ),
  },
];

export default function AdminHistoricoPage() {
  const [entity, setEntity] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const audit = useGetApiAudit({
    entity: entity ?? undefined,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });
  const entries = audit.data?.items ?? [];

  const chips: FilterChip[] = entity
    ? [{ key: "entity", label: ENTITY_LABELS[entity] ?? entity }]
    : [];

  return (
    <AdminPageLayout>
      <AdminDataTable
        columns={columns}
        data={entries}
        isLoading={audit.isLoading}
        keyExtractor={(e) => e.id}
        emptyTitle="Nenhuma entrada registrada"
        emptyDescription="As ações dos usuários no CMS aparecerão aqui."
        toolbar={
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setFilterOpen((o) => !o)}
                  className="flex h-9 items-center gap-1.5 rounded-md bg-foreground px-3 text-sm font-medium text-background"
                >
                  <Filter className="size-4" />
                  Filtrar por entidade
                </button>
                {filterOpen && (
                  <div className="absolute top-10 left-0 z-10 w-48 rounded-md border border-border bg-card p-1 shadow-cms-card-lg">
                    {ENTITY_OPTIONS.map((ent) => (
                      <button
                        key={ent}
                        type="button"
                        onClick={() => {
                          setEntity(ent);
                          setPage(1);
                          setFilterOpen(false);
                        }}
                        className={cn(
                          "block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-muted",
                          entity === ent && "font-semibold text-primary",
                        )}
                      >
                        {ENTITY_LABELS[ent]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {audit.data && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {audit.data.total} entradas
                </span>
              )}
            </div>
            <FilterChips
              chips={chips}
              onRemove={() => {
                setEntity(null);
                setPage(1);
              }}
            />
          </div>
        }
        pagination={
          audit.data
            ? {
                page,
                pageSize: PAGE_SIZE,
                total: audit.data.total,
                onPageChange: setPage,
              }
            : undefined
        }
      />
    </AdminPageLayout>
  );
}
