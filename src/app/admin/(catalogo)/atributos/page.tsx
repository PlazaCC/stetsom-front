"use client";

import { AdminConfirmDialog } from "@/app/admin/_components/crud/admin-confirm-dialog";
import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/app/admin/_components/crud/admin-data-table";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import {
  AdminRowAction,
  AdminRowActions,
} from "@/app/admin/_components/crud/admin-row-actions";
import { AdminSearchInput } from "@/app/admin/_components/crud/admin-search-input";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  deleteApiAttributesId,
  getGetApiAttributesQueryKey,
  patchApiAttributesId,
  postApiAttributes,
  useGetApiAttributes,
  type Attribute,
  type I18nString,
  type PatchApiAttributesIdBody,
  type PostApiAttributesBody,
} from "@/api/stetsom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ListFilter, Plus } from "lucide-react";
import { useMemo, useState } from "react";

type SortKey = "name-asc" | "name-desc" | "newest" | "oldest";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "name-asc", label: "Nome (A–Z)" },
  { value: "name-desc", label: "Nome (Z–A)" },
  { value: "newest", label: "Mais recentes" },
  { value: "oldest", label: "Mais antigos" },
];

/** Lowercase without accents, so "potencia" finds "Potência". */
function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function matches(attribute: Attribute, query: string) {
  if (!query) return true;
  const { pt, en, es } = attribute.name;
  return [pt, en, es].some((name) => name && normalize(name).includes(query));
}

function compare(a: Attribute, b: Attribute, sort: SortKey) {
  switch (sort) {
    case "name-asc":
      return a.name.pt.localeCompare(b.name.pt, "pt-BR", { numeric: true });
    case "name-desc":
      return b.name.pt.localeCompare(a.name.pt, "pt-BR", { numeric: true });
    case "newest":
      return b.created_at.localeCompare(a.created_at);
    case "oldest":
      return a.created_at.localeCompare(b.created_at);
  }
}

function AttributeForm({
  attribute,
  onClose,
  onSave,
  isPending,
}: {
  attribute?: Attribute;
  onClose: () => void;
  onSave: (data: PostApiAttributesBody | PatchApiAttributesIdBody) => void;
  isPending: boolean;
}) {
  const [name, setName] = useState<I18nString>(attribute?.name ?? { pt: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ name });
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {attribute ? "Editar Atributo" : "Novo Atributo"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <I18nInput label="Nome" required value={name} onChange={setName} />
          <p className="text-xs text-muted-foreground">
            No produto, cada atributo recebe uma ou mais entradas (valor +
            rótulo opcional). Várias entradas aparecem lado a lado no site.
          </p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminAtributosPage() {
  const queryClient = useQueryClient();
  const { data: attributes = [], isLoading } = useGetApiAttributes();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Attribute | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Attribute | undefined>();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("name-asc");

  // The list is small and fully loaded, so search and sort run client-side.
  const visibleAttributes = useMemo(() => {
    const normalizedQuery = normalize(query);
    return attributes
      .filter((a) => matches(a, normalizedQuery))
      .sort((a, b) => compare(a, b, sort));
  }, [attributes, query, sort]);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getGetApiAttributesQueryKey() });
  }

  const createMutation = useMutation({
    mutationFn: (body: PostApiAttributesBody) => postApiAttributes(body),
    onSuccess: () => {
      invalidate();
      closeForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: PatchApiAttributesIdBody;
    }) => patchApiAttributesId(id, body),
    onSuccess: () => {
      invalidate();
      closeForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApiAttributesId(id),
    onSuccess: () => {
      invalidate();
      setDeleteTarget(undefined);
    },
  });

  function closeForm() {
    setFormOpen(false);
    setEditing(undefined);
  }

  function handleSave(data: PostApiAttributesBody | PatchApiAttributesIdBody) {
    if (editing) {
      updateMutation.mutate({ id: editing.id, body: data });
    } else {
      createMutation.mutate(data as PostApiAttributesBody);
    }
  }

  const columns: AdminTableColumn<Attribute>[] = [
    {
      key: "name.pt",
      header: "Nome (PT)",
      render: (a) => (
        <span className="font-medium text-foreground">{a.name.pt}</span>
      ),
    },
    {
      key: "name.en",
      header: "Nome (EN)",
      render: (a) => (
        <span className="text-muted-foreground">{a.name.en ?? "—"}</span>
      ),
    },
    {
      key: "name.es",
      header: "Nome (ES)",
      render: (a) => (
        <span className="text-muted-foreground">{a.name.es ?? "—"}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "text-right",
      className: "text-right",
      render: (a) => (
        <AdminRowActions>
          <AdminRowAction
            onClick={() => {
              setEditing(a);
              setFormOpen(true);
            }}
          >
            Editar
          </AdminRowAction>
          <AdminRowAction
            variant="destructive"
            onClick={() => setDeleteTarget(a)}
          >
            Excluir
          </AdminRowAction>
        </AdminRowActions>
      ),
    },
  ];

  const createAttributeAction = (
    <button
      type="button"
      onClick={() => {
        setEditing(undefined);
        setFormOpen(true);
      }}
      className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80"
    >
      <Plus className="size-4" />
      Novo atributo
    </button>
  );

  return (
    <AdminPageLayout>
      {formOpen && (
        <AttributeForm
          attribute={editing}
          onClose={closeForm}
          onSave={handleSave}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}
      <AdminConfirmDialog
        open={!!deleteTarget}
        title="Excluir atributo?"
        description={`${deleteTarget?.name.pt} será removido permanentemente.`}
        confirmLabel="Excluir"
        destructive
        isPending={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
        onCancel={() => setDeleteTarget(undefined)}
      />
      <AdminDataTable
        columns={columns}
        data={visibleAttributes}
        isLoading={isLoading}
        keyExtractor={(a) => a.id}
        emptyTitle={
          query ? "Nenhum atributo encontrado" : "Nenhum atributo cadastrado"
        }
        emptyDescription={
          query
            ? "Tente outro termo — a busca considera os nomes em PT, EN e ES."
            : "Crie atributos para organizar as especificações dos produtos."
        }
        emptyIcon={ListFilter}
        emptyAction={query ? undefined : createAttributeAction}
        action={createAttributeAction}
        toolbar={
          <div className="flex flex-wrap items-center gap-3">
            <AdminSearchInput
              value={query}
              onChange={setQuery}
              placeholder="Buscar atributo"
              className="w-64 max-w-full"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Ordenar atributos"
              className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {!isLoading && (
              <span className="text-xs text-muted-foreground">
                {visibleAttributes.length === attributes.length
                  ? `${attributes.length} atributos`
                  : `${visibleAttributes.length} de ${attributes.length} atributos`}
              </span>
            )}
          </div>
        }
      />
    </AdminPageLayout>
  );
}
