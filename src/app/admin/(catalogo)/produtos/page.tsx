"use client";

import Link from "next/link";
import { Filter, PackageOpen, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AdminActionBar } from "@/app/admin/_components/crud/admin-action-bar";
import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/app/admin/_components/crud/admin-data-table";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import { AdminSearchInput } from "@/app/admin/_components/crud/admin-search-input";
import {
  FilterChips,
  type FilterChip,
} from "@/app/admin/_components/crud/filter-chips";
import { StatusBadge } from "@/app/admin/_components/crud/status-badge";

import { useGetApiProductsAdmin } from "@/api/stetsom";
import type { CmsProductRow, CmsProductRowStatus } from "@/api/stetsom/model";

import { BrFlag, EsFlag, UsFlag } from "@/components/ui/flag-icons";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: { value: CmsProductRowStatus; label: string }[] = [
  { value: "PUBLISHED", label: "Publicado" },
  { value: "DRAFT", label: "Rascunho" },
  { value: "SCHEDULED", label: "Agendado" },
];

function localeActive(
  languages: string[],
  locale: "pt" | "en" | "es",
): boolean {
  if (locale === "pt")
    return languages.includes("pt") || languages.includes("pt-BR");
  return languages.includes(locale);
}

function LocaleFlags({ languages }: { languages: string[] }) {
  const flags = [
    { locale: "pt" as const, Flag: BrFlag },
    { locale: "en" as const, Flag: UsFlag },
    { locale: "es" as const, Flag: EsFlag },
  ];
  return (
    <span className="flex items-center gap-1.5">
      {flags.map(({ locale, Flag }) => (
        <span
          key={locale}
          title={locale}
          className={cn(
            "transition-opacity",
            localeActive(languages, locale) ? "opacity-100" : "opacity-25",
          )}
        >
          <Flag />
        </span>
      ))}
    </span>
  );
}

export default function AdminProdutos() {
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CmsProductRowStatus | null>(
    null,
  );
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    const t = setTimeout(() => setQuery(inputValue), 300);
    return () => clearTimeout(t);
  }, [inputValue]);

  const cmsProducts = useGetApiProductsAdmin({
    q: query || undefined,
    status: statusFilter ?? undefined,
    page,
    pageSize,
  });

  const rows = useMemo<CmsProductRow[]>(
    () => cmsProducts.data?.items ?? [],
    [cmsProducts.data?.items],
  );

  const chips: FilterChip[] = statusFilter
    ? [
        {
          key: "status",
          label:
            STATUS_OPTIONS.find((s) => s.value === statusFilter)?.label ??
            statusFilter,
        },
      ]
    : [];

  const columns: AdminTableColumn<CmsProductRow>[] = [
    {
      key: "name",
      header: "Produto",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="size-10 shrink-0 overflow-hidden rounded-md bg-muted">
            {row.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={row.thumbnail_url}
                alt={row.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : null}
          </div>
          <div>
            <p className="font-medium text-foreground">{row.name}</p>
            {row.line && (
              <p className="text-xs text-muted-foreground">{row.line}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Categoria",
      render: (row) => (
        <span className="text-sm text-foreground">{row.category}</span>
      ),
    },
    {
      key: "languages",
      header: "Idiomas",
      render: (row) => <LocaleFlags languages={row.languages} />,
    },
    {
      key: "is_discontinued",
      header: "Em linha",
      render: (row) => (
        <span className="text-sm font-medium text-foreground">
          {row.is_discontinued ? "Não" : "Sim"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Publicação",
      render: (row) => <StatusBadge status={row.status} />,
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

  const createProductAction = (
    <Link
      href="/admin/produtos/novo"
      className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80"
    >
      <Plus className="size-4" />
      Cadastrar produto
    </Link>
  );
  const hasActiveFilters = Boolean(query || statusFilter);

  if (cmsProducts.isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-4 py-4 text-center lg:px-11.75 lg:py-7.25">
        <p className="text-sm font-medium text-destructive">
          Sessão expirada ou sem permissão.
        </p>
        <Link
          href="/admin/login"
          className="text-sm text-primary underline underline-offset-4"
        >
          Fazer login novamente
        </Link>
      </div>
    );
  }

  return (
    <AdminPageLayout>
      <AdminDataTable
        columns={columns}
        data={rows}
        isLoading={cmsProducts.isLoading}
        keyExtractor={(row) => row.id}
        emptyTitle={
          hasActiveFilters
            ? "Nenhum produto corresponde aos filtros"
            : "Nenhum produto cadastrado"
        }
        emptyDescription={
          hasActiveFilters
            ? "Ajuste a busca ou os filtros para encontrar produtos."
            : "Cadastre o primeiro produto para começar a montar o catálogo."
        }
        emptyIcon={PackageOpen}
        emptyAction={hasActiveFilters ? undefined : createProductAction}
        action={
          <AdminActionBar>
            <button
              type="button"
              disabled
              className="rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground"
              title="Em breve"
            >
              Importar planilha
            </button>
            {createProductAction}
          </AdminActionBar>
        }
        toolbar={
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <AdminSearchInput
                value={inputValue}
                onChange={(v) => {
                  setInputValue(v);
                  setPage(1);
                }}
                placeholder="Procurar"
                className="max-w-72"
              />
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setFilterOpen((o) => !o)}
                  className="flex h-9 items-center gap-1.5 rounded-md bg-foreground px-3 text-sm font-medium text-background"
                >
                  <Filter className="size-4" />
                  Filtrar
                </button>
                {filterOpen && (
                  <div className="absolute top-10 left-0 z-10 w-44 rounded-md border border-border bg-card p-1 shadow-cms-card-lg">
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setStatusFilter(opt.value);
                          setPage(1);
                          setFilterOpen(false);
                        }}
                        className={cn(
                          "block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-muted",
                          statusFilter === opt.value &&
                            "font-semibold text-primary",
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <FilterChips
              chips={chips}
              onRemove={() => {
                setStatusFilter(null);
                setPage(1);
              }}
            />
          </div>
        }
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
    </AdminPageLayout>
  );
}
