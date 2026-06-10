"use client";

import { AdminConfirmDialog } from "@/app/admin/_components/crud/admin-confirm-dialog";
import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/app/admin/_components/crud/admin-data-table";
import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import {
  AdminInput,
  AdminLabel,
} from "@/app/admin/_components/crud/admin-input";
import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { LibraryAssetPicker } from "@/app/admin/_components/crud/library-asset-picker";
import { ProdutosTabs } from "@/app/admin/produtos/_components/produtos-tabs";
import {
  deleteApiCategoriesId,
  deleteApiCategoriesIdLinesLineId,
  getGetApiCategoriesQueryKey,
  patchApiCategoriesId,
  postApiCategories,
  postApiCategoriesIdLines,
  useGetApiCategories,
  useGetApiCategoriesId,
  useGetApiTemplates,
} from "@/api/stetsom";
import type {
  I18nString,
  PatchApiCategoriesIdBody,
  PostApiCategoriesBody,
  PublicCategory,
} from "@/api/stetsom/model";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImageIcon, Plus, Tags, Trash2 } from "lucide-react";
import { useState } from "react";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface DisplayLine {
  line_id: string;
  name: string;
  order: number;
}

export default function AdminCategoriasPage() {
  const queryClient = useQueryClient();
  const { data: categories = [], isLoading } = useGetApiCategories();
  const { data: templates = [] } = useGetApiTemplates();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PublicCategory | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<
    PublicCategory | undefined
  >();

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getGetApiCategoriesQueryKey() });
  }

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApiCategoriesId(id),
    onSuccess: () => {
      invalidate();
      setDeleteTarget(undefined);
    },
  });

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
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setEditing(c);
              setFormOpen(true);
            }}
            className="text-xs font-medium text-brand hover:underline"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(c)}
            className="text-xs font-medium text-destructive hover:underline"
          >
            Excluir
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <ProdutosTabs />
      <AdminListPage
        title="Categorias"
        icon={Tags}
        action={
          <button
            type="button"
            onClick={() => {
              setEditing(undefined);
              setFormOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80"
          >
            <Plus className="size-4" />
            Nova categoria
          </button>
        }
      >
        <AdminDataTable
          columns={columns}
          data={categories}
          isLoading={isLoading}
          keyExtractor={(c) => c.id}
          emptyTitle="Nenhuma categoria cadastrada"
          emptyDescription="Categorias organizam o catálogo e suas linhas internas."
        />
      </AdminListPage>

      {formOpen && (
        <CategoryForm
          categoryId={editing?.id}
          fallbackCategory={editing}
          onClose={() => {
            setFormOpen(false);
            setEditing(undefined);
          }}
          onSaved={invalidate}
        />
      )}

      <AdminConfirmDialog
        open={!!deleteTarget}
        title="Excluir categoria?"
        description={`${deleteTarget?.name} será removida permanentemente.`}
        confirmLabel="Excluir"
        destructive
        isPending={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
        onCancel={() => setDeleteTarget(undefined)}
      />
    </div>
  );
}

function CategoryForm({
  categoryId,
  fallbackCategory,
  onClose,
  onSaved,
}: {
  categoryId?: string;
  fallbackCategory?: PublicCategory;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!categoryId;

  // /api/categories/:id may not be implemented yet — fall back to list data on error.
  const { data: full, isLoading } = useGetApiCategoriesId(categoryId ?? "", {
    query: { enabled: isEdit },
  });

  if (isEdit && isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-cms-overlay p-4">
        <div className="rounded-md bg-card px-6 py-4 text-sm text-muted-foreground">
          Carregando…
        </div>
      </div>
    );
  }

  const lines = full
    ? full.lines.map((l) => ({
        line_id: l.line_id,
        name: l.name.pt,
        order: l.order,
      }))
    : (fallbackCategory?.lines ?? []).map((l) => ({
        line_id: l.line_id,
        name: l.name,
        order: l.order,
      }));

  return (
    <CategoryFormInner
      categoryId={categoryId}
      initialName={full?.name ?? { pt: fallbackCategory?.name ?? "" }}
      initialSlug={full?.slug ?? { pt: fallbackCategory?.slug ?? "" }}
      initialOrder={full?.order ?? fallbackCategory?.order ?? 0}
      initialIconId={full?.icon_library_id ?? fallbackCategory?.icon_library_id}
      lines={lines}
      isEdit={isEdit}
      onClose={onClose}
      onSaved={onSaved}
    />
  );
}

function CategoryFormInner({
  categoryId,
  initialName,
  initialSlug,
  initialOrder,
  initialIconId,
  lines,
  isEdit,
  onClose,
  onSaved,
}: {
  categoryId?: string;
  initialName: I18nString;
  initialSlug: I18nString;
  initialOrder: number;
  initialIconId?: string;
  lines: DisplayLine[];
  isEdit: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const queryClient = useQueryClient();
  const [name, setName] = useState<I18nString>(initialName);
  const [slug, setSlug] = useState<I18nString>(initialSlug);
  const [order, setOrder] = useState(initialOrder);
  const [icon, setIcon] = useState<{
    library_id?: string;
    file_url?: string;
  } | null>(initialIconId ? { library_id: initialIconId } : null);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getGetApiCategoriesQueryKey() });
  }

  const createMutation = useMutation({
    mutationFn: (body: PostApiCategoriesBody) => postApiCategories(body),
    onSuccess: () => {
      invalidate();
      onSaved();
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: PatchApiCategoriesIdBody;
    }) => patchApiCategoriesId(id, body),
    onSuccess: () => {
      invalidate();
      onSaved();
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = {
      name,
      slug: slug.pt ? slug : { pt: slugify(name.pt) },
      icon_library_id: icon?.library_id,
      order,
    };
    if (categoryId) {
      updateMutation.mutate({ id: categoryId, body });
    } else {
      createMutation.mutate(body);
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cms-overlay p-4">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto">
        <AdminFormSection
          title={isEdit ? "Editar Categoria" : "Nova Categoria"}
          className="shadow-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <I18nInput label="Nome" required value={name} onChange={setName} />
            <I18nInput label="Slug" value={slug} onChange={setSlug} />
            <div>
              <AdminLabel>Ordem</AdminLabel>
              <AdminInput
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
              />
            </div>
            <LibraryAssetPicker
              label="Ícone"
              type="CATEGORY_ICON"
              variant="image"
              value={icon}
              onChange={(a) => setIcon(a)}
            />

            {categoryId && (
              <LinesManager
                categoryId={categoryId}
                lines={lines}
                onChanged={invalidate}
              />
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-md border border-border py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                {isEdit ? "Fechar" : "Cancelar"}
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 rounded-md bg-foreground py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80 disabled:opacity-60"
              >
                {isPending ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </AdminFormSection>
      </div>
    </div>
  );
}

function LinesManager({
  categoryId,
  lines,
  onChanged,
}: {
  categoryId: string;
  lines: DisplayLine[];
  onChanged: () => void;
}) {
  const [newName, setNewName] = useState<I18nString>({ pt: "" });

  const addMutation = useMutation({
    mutationFn: () =>
      postApiCategoriesIdLines(categoryId, {
        name: newName,
        slug: { pt: slugify(newName.pt) },
        order: lines.length,
      }),
    onSuccess: () => {
      setNewName({ pt: "" });
      onChanged();
    },
  });

  const removeMutation = useMutation({
    mutationFn: (lineId: string) =>
      deleteApiCategoriesIdLinesLineId(categoryId, lineId),
    onSuccess: onChanged,
  });

  return (
    <div className="rounded-md border border-border bg-muted/30 p-3">
      <AdminLabel>Linhas</AdminLabel>
      <div className="space-y-1">
        {lines.length === 0 && (
          <p className="py-2 text-center text-xs text-muted-foreground">
            Nenhuma linha cadastrada
          </p>
        )}
        {lines
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((line) => (
            <div
              key={line.line_id}
              className="flex items-center gap-2 rounded bg-card px-2 py-1.5"
            >
              <span className="flex-1 text-sm text-foreground">
                {line.name}
              </span>
              <button
                type="button"
                aria-label="Remover linha"
                onClick={() => removeMutation.mutate(line.line_id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
      </div>
      <div className="mt-2 flex items-end gap-2">
        <I18nInput
          className="flex-1"
          value={newName}
          onChange={setNewName}
          placeholder="Nova linha"
        />
        <button
          type="button"
          disabled={!newName.pt || addMutation.isPending}
          onClick={() => addMutation.mutate()}
          className="flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          <Plus className="size-4" />
          Adicionar
        </button>
      </div>
    </div>
  );
}
