"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus, Tags } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getGetApiCategoriesAdminQueryKey,
  putApiCategoriesOrder,
  useGetApiCategoriesAdmin,
} from "@/api/stetsom";
import type { Category } from "@/api/stetsom/model";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toApiError } from "@/api/stetsom/orval-client";

export function CategoriesList() {
  const query = useGetApiCategoriesAdmin();
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [localCategories, setLocalCategories] = useState<Category[] | null>(
    null,
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(inputValue.trim().toLocaleLowerCase());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [inputValue]);

  const filtered = useMemo(() => {
    const categories = [...(localCategories ?? query.data ?? [])].sort(
      (a, b) => a.order - b.order,
    );
    if (!search) return categories;
    return categories.filter((category) =>
      [category.name.pt, category.name.en, category.name.es, category.slug.pt]
        .filter(Boolean)
        .some((value) => value!.toLocaleLowerCase().includes(search)),
    );
  }, [localCategories, query.data, search]);
  const reorderMutation = useMutation({
    mutationFn: (ordered: Category[]) =>
      putApiCategoriesOrder({
        category_ids: ordered.map((category) => category.id),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getGetApiCategoriesAdminQueryKey(),
      });
      setLocalCategories(null);
    },
    onError: async () => {
      setLocalCategories(null);
      await queryClient.invalidateQueries({
        queryKey: getGetApiCategoriesAdminQueryKey(),
      });
    },
  });
  function moveCategory(categoryId: string, direction: -1 | 1) {
    const ordered = [...(query.data ?? [])].sort((a, b) => a.order - b.order);
    const index = ordered.findIndex((category) => category.id === categoryId);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= ordered.length) return;
    const next = [...ordered];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    const normalized = next.map((category, position) => ({
      ...category,
      order: position,
    }));
    setLocalCategories(normalized);
    reorderMutation.mutate(normalized);
  }
  const action = (
    <Link
      href="/admin/categorias/novo"
      className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background hover:opacity-80"
    >
      <Plus className="size-4" />
      Nova categoria
    </Link>
  );
  const columns: AdminTableColumn<Category>[] = [
    {
      key: "name",
      header: "Categoria",
      render: (category) => (
        <span className="font-medium">{category.name.pt}</span>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      render: (category) => (
        <span className="text-muted-foreground">/{category.slug.pt}</span>
      ),
    },
    {
      key: "lines",
      header: "Linhas",
      render: (category) => category.lines.length,
    },
    {
      key: "actions",
      header: "Ações",
      headerClassName: "text-right",
      className: "text-right",
      render: (category) => (
        <AdminRowActions>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            title="Mover categoria para cima"
            aria-label={`Mover ${category.name.pt} para cima`}
            disabled={category.order === 0 || reorderMutation.isPending}
            onClick={() => moveCategory(category.id, -1)}
          >
            <ChevronUp />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            title="Mover categoria para baixo"
            aria-label={`Mover ${category.name.pt} para baixo`}
            disabled={
              category.order === (query.data?.length ?? 1) - 1 ||
              reorderMutation.isPending
            }
            onClick={() => moveCategory(category.id, 1)}
          >
            <ChevronDown />
          </Button>
          <AdminRowAction href={`/admin/categorias/${category.id}`}>
            Editar
          </AdminRowAction>
        </AdminRowActions>
      ),
    },
  ];

  if (query.isError) return <ErrorState error={query.error} />;
  return (
    <AdminPageLayout>
      <AdminDataTable
        columns={columns}
        data={filtered}
        isLoading={query.isLoading}
        keyExtractor={(category) => category.id}
        emptyTitle={
          search
            ? "Nenhuma categoria encontrada"
            : "Nenhuma categoria cadastrada"
        }
        emptyDescription={
          search
            ? "Ajuste a busca para encontrar categorias."
            : "Cadastre categorias para organizar o catálogo."
        }
        emptyIcon={Tags}
        emptyAction={search ? undefined : action}
        action={action}
        toolbar={
          <AdminSearchInput
            value={inputValue}
            onChange={setInputValue}
            placeholder="Buscar categoria"
            className="max-w-72"
          />
        }
      />
    </AdminPageLayout>
  );
}

function ErrorState({ error: queryError }: { error: unknown }) {
  const error = toApiError(queryError);
  const isAuthError = error.status === 401 || error.status === 403;
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm">
      <p className="text-destructive">
        {isAuthError
          ? "Sua sessão expirou ou não há permissão."
          : "Não foi possível carregar as categorias. Tente novamente."}
      </p>
      {isAuthError && (
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
