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
  deleteApiRepresentativesId,
  getGetApiRepresentativesQueryKey,
  patchApiRepresentativesId,
  postApiRepresentatives,
  useGetApiRepresentatives,
  type PatchApiRepresentativesIdBody,
  type PostApiRepresentativesBody,
  type Representative,
} from "@/api/stetsom";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, Plus } from "lucide-react";
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

interface RepresentativeFormProps {
  rep?: Representative;
  onClose: () => void;
  onSave: (
    data: PostApiRepresentativesBody | PatchApiRepresentativesIdBody,
  ) => void;
  isPending: boolean;
}

function RepresentativeForm({
  rep,
  onClose,
  onSave,
  isPending,
}: RepresentativeFormProps) {
  const [name, setName] = useState(rep?.name ?? "");
  const [address, setAddress] = useState(rep?.address ?? "");
  const [city, setCity] = useState(rep?.city ?? "");
  const [state, setState] = useState(rep?.state ?? "");
  const [zip, setZip] = useState(rep?.zip ?? "");
  const [phone, setPhone] = useState(rep?.phone ?? "");
  const [email, setEmail] = useState(rep?.email ?? "");
  const [website, setWebsite] = useState(rep?.website ?? "");
  const [region, setRegion] = useState(rep?.region ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body: PostApiRepresentativesBody | PatchApiRepresentativesIdBody = {
      name,
      address,
      city,
      state,
      zip,
      phone: phone || null,
      email: email || null,
      website: website || null,
      region: region || null,
    };
    onSave(body);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cms-overlay p-4">
      <div className="w-full max-w-lg">
        <AdminFormSection
          title={rep ? "Editar Representante" : "Novo Representante"}
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
                <AdminLabel>Região</AdminLabel>
                <AdminInput
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <AdminLabel>Telefone</AdminLabel>
                <AdminInput
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
            <div>
              <AdminLabel>Website</AdminLabel>
              <AdminInput
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
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

export default function AdminRepresentantesPage() {
  const queryClient = useQueryClient();
  const { data: reps = [], isLoading } = useGetApiRepresentatives();
  const [formOpen, setFormOpen] = useState(false);
  const [editingRep, setEditingRep] = useState<Representative | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<
    Representative | undefined
  >();
  const [toggleTarget, setToggleTarget] = useState<
    Representative | undefined
  >();

  const createMutation = useMutation({
    mutationFn: (body: PostApiRepresentativesBody) =>
      postApiRepresentatives(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getGetApiRepresentativesQueryKey(),
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
      body: PatchApiRepresentativesIdBody;
    }) => patchApiRepresentativesId(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getGetApiRepresentativesQueryKey(),
      });
      closeForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApiRepresentativesId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getGetApiRepresentativesQueryKey(),
      });
      setDeleteTarget(undefined);
    },
  });

  function openCreate() {
    setEditingRep(undefined);
    setFormOpen(true);
  }

  function openEdit(rep: Representative) {
    setEditingRep(rep);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingRep(undefined);
  }

  function handleSave(
    data: PostApiRepresentativesBody | PatchApiRepresentativesIdBody,
  ) {
    if (editingRep) {
      updateMutation.mutate({
        id: editingRep.id,
        body: data as PatchApiRepresentativesIdBody,
      });
    } else {
      createMutation.mutate(data as PostApiRepresentativesBody);
    }
  }

  const columns: AdminTableColumn<Representative>[] = [
    {
      key: "name",
      header: "Nome",
      render: (r) => (
        <span className="font-medium text-foreground">{r.name}</span>
      ),
    },
    {
      key: "city",
      header: "Cidade/UF",
      render: (r) => (
        <span className="text-muted-foreground">
          {r.city}/{r.state}
        </span>
      ),
    },
    {
      key: "phone",
      header: "Telefone",
      render: (r) => (
        <span className="text-muted-foreground">{r.phone ?? "—"}</span>
      ),
    },
    {
      key: "email",
      header: "E-mail",
      render: (r) => (
        <span className="text-muted-foreground">{r.email ?? "—"}</span>
      ),
    },
    {
      key: "region",
      header: "Região",
      render: (r) => (
        <span className="text-muted-foreground">{r.region ?? "—"}</span>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      render: (r) => <StatusBadge active={r.is_active} />,
    },
    {
      key: "actions",
      header: "",
      headerClassName: "text-right",
      className: "text-right",
      render: (r) => (
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => openEdit(r)}
            className="text-xs font-medium text-brand hover:underline"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => setToggleTarget(r)}
            className="text-xs font-medium text-muted-foreground hover:underline"
          >
            {r.is_active ? "Desativar" : "Ativar"}
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(r)}
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
        title="Representantes"
        icon={Building2}
        action={
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80"
          >
            <Plus className="size-4" />
            Novo representante
          </button>
        }
      >
        <AdminDataTable
          columns={columns}
          data={reps}
          isLoading={isLoading}
          keyExtractor={(r) => r.id}
          emptyTitle="Nenhum representante cadastrado"
          emptyDescription="Crie um representante para exibir no site."
        />
      </AdminListPage>

      {formOpen && (
        <RepresentativeForm
          rep={editingRep}
          onClose={closeForm}
          onSave={handleSave}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <AdminConfirmDialog
        open={!!toggleTarget}
        title={
          toggleTarget?.is_active
            ? "Desativar representante?"
            : "Ativar representante?"
        }
        description={`${toggleTarget?.name} será ${toggleTarget?.is_active ? "desativado" : "ativado"}.`}
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
        title="Excluir representante?"
        description={`${deleteTarget?.name} será removido permanentemente.`}
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
