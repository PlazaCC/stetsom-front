"use client";

import { AdminConfirmDialog } from "@/app/admin/_components/crud/admin-confirm-dialog";
import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/app/admin/_components/crud/admin-data-table";
import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { ProdutosTabs } from "@/app/admin/produtos/_components/produtos-tabs";
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
import { ListChecks, Plus } from "lucide-react";
import { useState } from "react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cms-overlay p-4">
      <div className="w-full max-w-md">
        <AdminFormSection
          title={attribute ? "Editar Atributo" : "Novo Atributo"}
          className="shadow-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <I18nInput label="Nome" required value={name} onChange={setName} />
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-md border border-border py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Cancelar
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

export default function AdminAtributosPage() {
  const queryClient = useQueryClient();
  const { data: attributes = [], isLoading } = useGetApiAttributes();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Attribute | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Attribute | undefined>();

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
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setEditing(a);
              setFormOpen(true);
            }}
            className="text-xs font-medium text-brand hover:underline"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(a)}
            className="text-xs font-medium text-destructive hover:underline"
          >
            Excluir
          </button>
        </div>
      ),
    },
  ];

  const isDialogOpen = formOpen || !!deleteTarget;

  return (
    <div className="flex flex-col gap-5">
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

      <div inert={isDialogOpen || undefined}>
        <ProdutosTabs />
        <AdminListPage
          title="Atributos"
          icon={ListChecks}
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
              Novo atributo
            </button>
          }
        >
          <AdminDataTable
            columns={columns}
            data={attributes}
            isLoading={isLoading}
            keyExtractor={(a) => a.id}
            emptyTitle="Nenhum atributo cadastrado"
            emptyDescription="Atributos são usados nos templates de produtos."
          />
        </AdminListPage>
      </div>
    </div>
  );
}
