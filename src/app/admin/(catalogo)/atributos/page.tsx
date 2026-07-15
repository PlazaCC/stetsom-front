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
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {attribute ? "Editar Atributo" : "Novo Atributo"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <I18nInput label="Nome" required value={name} onChange={setName} />
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
        data={attributes}
        isLoading={isLoading}
        keyExtractor={(a) => a.id}
        emptyTitle="Nenhum atributo cadastrado"
        emptyDescription="Crie atributos para organizar as especificações dos produtos."
        emptyIcon={ListFilter}
        emptyAction={createAttributeAction}
        action={createAttributeAction}
      />
    </AdminPageLayout>
  );
}
