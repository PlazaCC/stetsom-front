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
import {
  deleteApiTechnicalAssistancesId,
  getGetApiTechnicalAssistancesQueryKey,
  patchApiTechnicalAssistancesId,
  postApiTechnicalAssistances,
  useGetApiTechnicalAssistances,
  type PatchApiTechnicalAssistancesIdBody,
  type PostApiTechnicalAssistancesBody,
  type TechnicalAssistance,
} from "@/api/stetsom";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Wrench } from "lucide-react";
import { useState } from "react";

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-xs font-medium",
        active
          ? "border-cms-step-done bg-cms-step-done text-white"
          : "border-cms-step-pending bg-cms-step-pending text-muted-foreground",
      )}
    >
      {active ? "Ativo" : "Inativo"}
    </span>
  );
}

interface AssistanceFormProps {
  assistance?: TechnicalAssistance;
  onClose: () => void;
  onSave: (
    data: PostApiTechnicalAssistancesBody | PatchApiTechnicalAssistancesIdBody,
  ) => void;
  isPending: boolean;
}

function AssistanceForm({
  assistance,
  onClose,
  onSave,
  isPending,
}: AssistanceFormProps) {
  const [name, setName] = useState(assistance?.name ?? "");
  const [address, setAddress] = useState(assistance?.address ?? "");
  const [city, setCity] = useState(assistance?.city ?? "");
  const [state, setState] = useState(assistance?.state ?? "");
  const [zip, setZip] = useState(assistance?.zip ?? "");
  const [phone, setPhone] = useState(assistance?.phone ?? "");
  const [email, setEmail] = useState(assistance?.email ?? "");
  const [specialty, setSpecialty] = useState(assistance?.specialty ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body:
      | PostApiTechnicalAssistancesBody
      | PatchApiTechnicalAssistancesIdBody = {
      name,
      address,
      city,
      state,
      zip,
      phone,
      email: email || null,
      specialty: specialty || null,
    };
    onSave(body);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cms-overlay p-4">
      <div className="w-full max-w-lg">
        <AdminFormSection
          title={
            assistance
              ? "Editar Assistência Técnica"
              : "Nova Assistência Técnica"
          }
          className="shadow-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <AdminLabel>Nome</AdminLabel>
              <AdminInput
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <AdminLabel>Endereço</AdminLabel>
              <AdminInput
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <AdminLabel>Cidade</AdminLabel>
                <AdminInput
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <AdminLabel>UF</AdminLabel>
                <AdminInput
                  required
                  maxLength={2}
                  className="uppercase"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <AdminLabel>CEP</AdminLabel>
                <AdminInput
                  required
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                />
              </div>
              <div>
                <AdminLabel>Especialidade</AdminLabel>
                <AdminInput
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <AdminLabel>Telefone</AdminLabel>
                <AdminInput
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <AdminLabel>E-mail</AdminLabel>
                <AdminInput
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
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

export default function AdminAssistenciasPage() {
  const queryClient = useQueryClient();
  const { data: assistances = [], isLoading } = useGetApiTechnicalAssistances();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TechnicalAssistance | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<
    TechnicalAssistance | undefined
  >();
  const [toggleTarget, setToggleTarget] = useState<
    TechnicalAssistance | undefined
  >();

  const createMutation = useMutation({
    mutationFn: (body: PostApiTechnicalAssistancesBody) =>
      postApiTechnicalAssistances(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getGetApiTechnicalAssistancesQueryKey(),
      });
      closeForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: PatchApiTechnicalAssistancesIdBody;
    }) => patchApiTechnicalAssistancesId(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getGetApiTechnicalAssistancesQueryKey(),
      });
      closeForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApiTechnicalAssistancesId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getGetApiTechnicalAssistancesQueryKey(),
      });
      setDeleteTarget(undefined);
    },
  });

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(a: TechnicalAssistance) {
    setEditing(a);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(undefined);
  }

  function handleSave(
    data: PostApiTechnicalAssistancesBody | PatchApiTechnicalAssistancesIdBody,
  ) {
    if (editing) {
      updateMutation.mutate({
        id: editing.id,
        body: data as PatchApiTechnicalAssistancesIdBody,
      });
    } else {
      createMutation.mutate(data as PostApiTechnicalAssistancesBody);
    }
  }

  const columns: AdminTableColumn<TechnicalAssistance>[] = [
    {
      key: "name",
      header: "Nome",
      render: (a) => (
        <span className="font-medium text-foreground">{a.name}</span>
      ),
    },
    {
      key: "city",
      header: "Cidade/UF",
      render: (a) => (
        <span className="text-muted-foreground">
          {a.city}/{a.state}
        </span>
      ),
    },
    {
      key: "phone",
      header: "Telefone",
      render: (a) => (
        <span className="text-muted-foreground">{a.phone ?? "—"}</span>
      ),
    },
    {
      key: "specialty",
      header: "Especialidade",
      render: (a) => (
        <span className="text-muted-foreground">{a.specialty ?? "—"}</span>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      render: (a) => <StatusBadge active={a.is_active} />,
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
            onClick={() => openEdit(a)}
            className="text-xs font-medium text-brand hover:underline"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => setToggleTarget(a)}
            className="text-xs font-medium text-muted-foreground hover:underline"
          >
            {a.is_active ? "Desativar" : "Ativar"}
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

  return (
    <>
      <AdminListPage
        title="Assistências Técnicas"
        icon={Wrench}
        action={
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80"
          >
            <Plus className="size-4" />
            Nova assistência
          </button>
        }
      >
        <AdminDataTable
          columns={columns}
          data={assistances}
          isLoading={isLoading}
          keyExtractor={(a) => a.id}
          emptyTitle="Nenhuma assistência cadastrada"
          emptyDescription="Crie uma assistência técnica para exibir no site."
        />
      </AdminListPage>

      {formOpen && (
        <AssistanceForm
          assistance={editing}
          onClose={closeForm}
          onSave={handleSave}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <AdminConfirmDialog
        open={!!toggleTarget}
        title={
          toggleTarget?.is_active
            ? "Desativar assistência?"
            : "Ativar assistência?"
        }
        description={`${toggleTarget?.name} será ${toggleTarget?.is_active ? "desativada" : "ativada"}.`}
        confirmLabel={toggleTarget?.is_active ? "Desativar" : "Ativar"}
        destructive={toggleTarget?.is_active}
        isPending={updateMutation.isPending}
        onConfirm={() => {
          if (!toggleTarget) return;
          updateMutation.mutate({
            id: toggleTarget.id,
            body: { is_active: !toggleTarget.is_active },
          });
          setToggleTarget(undefined);
        }}
        onCancel={() => setToggleTarget(undefined)}
      />

      <AdminConfirmDialog
        open={!!deleteTarget}
        title="Excluir assistência?"
        description={`${deleteTarget?.name} será removida permanentemente.`}
        confirmLabel="Excluir"
        destructive
        isPending={deleteMutation.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteMutation.mutate(deleteTarget.id);
        }}
        onCancel={() => setDeleteTarget(undefined)}
      />
    </>
  );
}
