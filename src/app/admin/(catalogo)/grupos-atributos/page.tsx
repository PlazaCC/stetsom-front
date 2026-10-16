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
  deleteApiAttributeGroupsId,
  getGetApiAttributeGroupsQueryKey,
  patchApiAttributeGroupsId,
  postApiAttributeGroups,
  useGetApiAttributeGroups,
  type AttributeGroup,
  type I18nString,
} from "@/api/stetsom";
import { OrvalApiError, toApiError } from "@/api/stetsom/orval-client";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Layers, Plus } from "lucide-react";
import { useState } from "react";

function AttributeGroupForm({
  group,
  onClose,
  onSave,
  isPending,
}: {
  group?: AttributeGroup;
  onClose: () => void;
  onSave: (name: I18nString) => void;
  isPending: boolean;
}) {
  const [name, setName] = useState<I18nString>(group?.name ?? { pt: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(name);
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {group ? "Editar grupo de atributos" : "Novo grupo de atributos"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <I18nInput label="Nome" required value={name} onChange={setName} />
          <p className="text-xs text-muted-foreground">
            Vira o título da seção na tabela de especificações — ex.:
            Alimentação, Potência e áudio, Dados gerais.
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

export default function AdminGruposAtributosPage() {
  const queryClient = useQueryClient();
  const toast = useAdminToast();
  const { data: groups = [], isLoading } = useGetApiAttributeGroups();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AttributeGroup | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<
    AttributeGroup | undefined
  >();

  function invalidate() {
    queryClient.invalidateQueries({
      queryKey: getGetApiAttributeGroupsQueryKey(),
    });
  }

  const createMutation = useMutation({
    mutationFn: (name: I18nString) => postApiAttributeGroups({ name }),
    onSuccess: () => {
      invalidate();
      closeForm();
    },
    onError: (error) => toast.apiError(error, "Erro ao criar o grupo."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: I18nString }) =>
      patchApiAttributeGroupsId(id, { name }),
    onSuccess: () => {
      invalidate();
      closeForm();
    },
    onError: (error) => toast.apiError(error, "Erro ao salvar o grupo."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApiAttributeGroupsId(id),
    onSuccess: () => {
      invalidate();
      setDeleteTarget(undefined);
    },
    onError: (error) => {
      setDeleteTarget(undefined);
      // 409 here means the group is still in use, not a duplicate record.
      const apiError =
        error instanceof OrvalApiError ? error : toApiError(error);
      if (apiError.code === "CONFLICT") {
        toast.error(
          "Este grupo está em uso",
          "Remova-o dos templates e produtos que o usam antes de excluir.",
        );
        return;
      }
      toast.apiError(error, "Erro ao excluir o grupo.");
    },
  });

  function closeForm() {
    setFormOpen(false);
    setEditing(undefined);
  }

  function handleSave(name: I18nString) {
    if (editing) updateMutation.mutate({ id: editing.id, name });
    else createMutation.mutate(name);
  }

  const columns: AdminTableColumn<AttributeGroup>[] = [
    {
      key: "name.pt",
      header: "Nome (PT)",
      render: (g) => (
        <span className="font-medium text-foreground">{g.name.pt}</span>
      ),
    },
    {
      key: "name.en",
      header: "Nome (EN)",
      render: (g) => (
        <span className="text-muted-foreground">{g.name.en ?? "—"}</span>
      ),
    },
    {
      key: "name.es",
      header: "Nome (ES)",
      render: (g) => (
        <span className="text-muted-foreground">{g.name.es ?? "—"}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "text-right",
      className: "text-right",
      render: (g) => (
        <AdminRowActions>
          <AdminRowAction
            onClick={() => {
              setEditing(g);
              setFormOpen(true);
            }}
          >
            Editar
          </AdminRowAction>
          <AdminRowAction
            variant="destructive"
            onClick={() => setDeleteTarget(g)}
          >
            Excluir
          </AdminRowAction>
        </AdminRowActions>
      ),
    },
  ];

  const createGroupAction = (
    <button
      type="button"
      onClick={() => {
        setEditing(undefined);
        setFormOpen(true);
      }}
      className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80"
    >
      <Plus className="size-4" />
      Novo grupo
    </button>
  );

  return (
    <AdminPageLayout>
      {formOpen && (
        <AttributeGroupForm
          group={editing}
          onClose={closeForm}
          onSave={handleSave}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}
      <AdminConfirmDialog
        open={!!deleteTarget}
        title="Excluir grupo de atributos?"
        description={`${deleteTarget?.name.pt} será removido. Grupos em uso por templates ou produtos não podem ser excluídos.`}
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
        data={groups}
        isLoading={isLoading}
        keyExtractor={(g) => g.id}
        emptyTitle="Nenhum grupo cadastrado"
        emptyDescription="Grupos organizam os atributos em seções na tabela de especificações."
        emptyIcon={Layers}
        emptyAction={createGroupAction}
        action={createGroupAction}
      />
    </AdminPageLayout>
  );
}
