"use client";

import {
  deleteApiPartnerLocationsId,
  getGetApiPartnerLocationsQueryKey,
  patchApiPartnerLocationsId,
  postApiPartnerLocations,
  useGetApiPartnerLocations,
  type PartnerLocation,
  type PartnerLocationType,
  type PatchApiPartnerLocationsIdBody,
  type PostApiPartnerLocationsBody,
} from "@/api/stetsom";
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
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, Plus, Wrench, type LucideIcon } from "lucide-react";
import { useState } from "react";

const TABS: {
  type: PartnerLocationType;
  label: string;
  icon: LucideIcon;
  /** Singular noun used in dialog/button copy. */
  noun: string;
  createLabel: string;
  emptyTitle: string;
  emptyDescription: string;
}[] = [
  {
    type: "REPRESENTATIVE",
    label: "Representantes",
    icon: Building2,
    noun: "representante",
    createLabel: "Novo representante",
    emptyTitle: "Nenhum representante cadastrado",
    emptyDescription: "Crie um representante para exibir no site.",
  },
  {
    type: "SERVICE_CENTER",
    label: "Assist. Técnicas",
    icon: Wrench,
    noun: "assistência",
    createLabel: "Nova assistência",
    emptyTitle: "Nenhuma assistência cadastrada",
    emptyDescription: "Crie uma assistência técnica para exibir no site.",
  },
];

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

interface PartnerLocationFormProps {
  type: PartnerLocationType;
  location?: PartnerLocation;
  onClose: () => void;
  onSave: (data: PostApiPartnerLocationsBody) => void;
  isPending: boolean;
}

function PartnerLocationForm({
  type,
  location,
  onClose,
  onSave,
  isPending,
}: PartnerLocationFormProps) {
  const isRepresentative = type === "REPRESENTATIVE";
  const [name, setName] = useState(location?.name ?? "");
  const [address, setAddress] = useState(location?.address ?? "");
  const [city, setCity] = useState(location?.city ?? "");
  const [state, setState] = useState(location?.state ?? "");
  const [zip, setZip] = useState(location?.zip ?? "");
  const [phone, setPhone] = useState(location?.phone ?? "");
  const [email, setEmail] = useState(location?.email ?? "");
  const [website, setWebsite] = useState(location?.website ?? "");
  const [region, setRegion] = useState(location?.region ?? "");
  const [specialty, setSpecialty] = useState(location?.specialty ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      type,
      name,
      address,
      city,
      state,
      zip,
      phone: phone || null,
      email: email || null,
      website: website || null,
      region: region || null,
      specialty: specialty || null,
    });
  }

  const editing = !!location;
  const title = isRepresentative
    ? editing
      ? "Editar Representante"
      : "Novo Representante"
    : editing
      ? "Editar Assistência Técnica"
      : "Nova Assistência Técnica";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cms-overlay p-4">
      <div className="w-full max-w-lg">
        <AdminFormSection title={title} className="shadow-xl">
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
                <AdminLabel>
                  {isRepresentative ? "Região" : "Especialidade"}
                </AdminLabel>
                {isRepresentative ? (
                  <AdminInput
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  />
                ) : (
                  <AdminInput
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                  />
                )}
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

export default function AdminParceirosPage() {
  const queryClient = useQueryClient();
  const [activeType, setActiveType] =
    useState<PartnerLocationType>("REPRESENTATIVE");
  const tab = TABS.find((t) => t.type === activeType) ?? TABS[0];

  const { data: locations = [], isLoading } = useGetApiPartnerLocations({
    type: activeType,
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PartnerLocation | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<
    PartnerLocation | undefined
  >();
  const [toggleTarget, setToggleTarget] = useState<
    PartnerLocation | undefined
  >();

  function invalidate() {
    // Invalidate every list variant — keeps both tabs fresh.
    queryClient.invalidateQueries({
      queryKey: getGetApiPartnerLocationsQueryKey(),
    });
  }

  const createMutation = useMutation({
    mutationFn: (body: PostApiPartnerLocationsBody) =>
      postApiPartnerLocations(body),
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
      body: PatchApiPartnerLocationsIdBody;
    }) => patchApiPartnerLocationsId(id, body),
    onSuccess: () => {
      invalidate();
      closeForm();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: PatchApiPartnerLocationsIdBody;
    }) => patchApiPartnerLocationsId(id, body),
    onSuccess: () => {
      invalidate();
      setToggleTarget(undefined);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApiPartnerLocationsId(id),
    onSuccess: () => {
      invalidate();
      setDeleteTarget(undefined);
    },
  });

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(location: PartnerLocation) {
    setEditing(location);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(undefined);
  }

  function handleSave(data: PostApiPartnerLocationsBody) {
    if (editing) {
      updateMutation.mutate({ id: editing.id, body: data });
    } else {
      createMutation.mutate(data);
    }
  }

  const columns: AdminTableColumn<PartnerLocation>[] = [
    {
      key: "name",
      header: "Nome",
      render: (l) => (
        <span className="font-medium text-foreground">{l.name}</span>
      ),
    },
    {
      key: "city",
      header: "Cidade/UF",
      render: (l) => (
        <span className="text-muted-foreground">
          {l.city}/{l.state}
        </span>
      ),
    },
    {
      key: "phone",
      header: "Telefone",
      render: (l) => (
        <span className="text-muted-foreground">{l.phone ?? "—"}</span>
      ),
    },
    {
      key: "detail",
      header: activeType === "REPRESENTATIVE" ? "Região" : "Especialidade",
      render: (l) => (
        <span className="text-muted-foreground">
          {(activeType === "REPRESENTATIVE" ? l.region : l.specialty) ?? "—"}
        </span>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      render: (l) => <StatusBadge active={l.is_active} />,
    },
    {
      key: "actions",
      header: "",
      headerClassName: "text-right",
      className: "text-right",
      render: (l) => (
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => openEdit(l)}
            className="text-xs font-medium text-brand hover:underline"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => setToggleTarget(l)}
            className="text-xs font-medium text-muted-foreground hover:underline"
          >
            {l.is_active ? "Desativar" : "Ativar"}
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(l)}
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
        title="Parceiros"
        icon={Building2}
        toolbar={
          <nav className="flex gap-1 border-b border-border">
            {TABS.map(({ type, label, icon: Icon }) => {
              const active = type === activeType;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveType(type)}
                  className={cn(
                    "-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "border-brand text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              );
            })}
          </nav>
        }
        action={
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80"
          >
            <Plus className="size-4" />
            {tab.createLabel}
          </button>
        }
      >
        <AdminDataTable
          columns={columns}
          data={locations}
          isLoading={isLoading}
          keyExtractor={(l) => l.id}
          emptyTitle={tab.emptyTitle}
          emptyDescription={tab.emptyDescription}
        />
      </AdminListPage>

      {formOpen && (
        <PartnerLocationForm
          type={editing?.type ?? activeType}
          location={editing}
          onClose={closeForm}
          onSave={handleSave}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <AdminConfirmDialog
        open={!!toggleTarget}
        title={
          toggleTarget?.is_active
            ? `Desativar ${tab.noun}?`
            : `Ativar ${tab.noun}?`
        }
        description={`${toggleTarget?.name} será ${toggleTarget?.is_active ? "desativado" : "ativado"}.`}
        confirmLabel={toggleTarget?.is_active ? "Desativar" : "Ativar"}
        destructive={toggleTarget?.is_active}
        isPending={toggleMutation.isPending}
        onConfirm={() => {
          if (!toggleTarget) return;
          toggleMutation.mutate({
            id: toggleTarget.id,
            body: { is_active: !toggleTarget.is_active },
          });
        }}
        onCancel={() => setToggleTarget(undefined)}
      />

      <AdminConfirmDialog
        open={!!deleteTarget}
        title={`Excluir ${tab.noun}?`}
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
