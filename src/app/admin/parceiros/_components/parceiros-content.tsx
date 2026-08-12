"use client";

import {
  deleteApiPartnerLocationsId,
  getApiGeocodeSearch,
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
import { AdminLabel } from "@/app/admin/_components/crud/admin-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import {
  AdminRowAction,
  AdminRowActions,
} from "@/app/admin/_components/crud/admin-row-actions";
import { AdminSearchInput } from "@/app/admin/_components/crud/admin-search-input";
import { StatusBadge } from "@/app/admin/_components/crud/status-badge";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileUp, MapPin, Plus, Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import { ImportPartnersDialog } from "./import-partners-dialog";

const PAGE_SIZE = 10;

const TAB_CONFIG: Record<
  PartnerLocationType,
  {
    noun: string;
    createLabel: string;
    emptyTitle: string;
    emptyDescription: string;
  }
> = {
  REPRESENTATIVE: {
    noun: "representante",
    createLabel: "Novo representante",
    emptyTitle: "Nenhum representante cadastrado",
    emptyDescription: "Crie um representante para exibir no site.",
  },
  SERVICE_CENTER: {
    noun: "assistência",
    createLabel: "Nova assistência",
    emptyTitle: "Nenhuma assistência cadastrada",
    emptyDescription: "Crie uma assistência técnica para exibir no site.",
  },
};

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
  // Coordinates place the partner on the public map. They are filled by the CEP
  // lookup rather than typed, but stay editable for a manual correction.
  const [lat, setLat] = useState<number | null>(location?.lat ?? null);
  const [lng, setLng] = useState<number | null>(location?.lng ?? null);
  const [lookup, setLookup] = useState<{
    status: "idle" | "loading" | "notFound" | "noCoords" | "error" | "done";
    message?: string;
  }>({ status: "idle" });

  async function handleZipLookup() {
    const digits = zip.replace(/\D/g, "");
    if (digits.length !== 8) {
      setLookup({ status: "error", message: "Informe um CEP de 8 dígitos." });
      return;
    }

    setLookup({ status: "loading" });
    try {
      const { results } = await getApiGeocodeSearch({ q: digits });
      const hit = results[0];
      if (!hit) {
        setLookup({ status: "notFound", message: "CEP não encontrado." });
        return;
      }

      setCity(hit.city);
      setState(hit.state);
      // The endpoint resolves the address via ViaCEP but only has coordinates
      // for cities present in its static dataset, so they can come back absent.
      if (hit.lat !== undefined && hit.lng !== undefined) {
        setLat(hit.lat);
        setLng(hit.lng);
        setLookup({ status: "done", message: hit.displayName });
        return;
      }
      setLookup({
        status: "noCoords",
        message:
          "Endereço encontrado, mas sem coordenadas para esta cidade. Preencha manualmente para aparecer no mapa.",
      });
    } catch {
      setLookup({
        status: "error",
        message: "Não foi possível consultar o CEP agora.",
      });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      type,
      name,
      address,
      city,
      state,
      zip,
      lat,
      lng,
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
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <AdminLabel>Nome</AdminLabel>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <AdminLabel>Endereço</AdminLabel>
            <Input
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <AdminLabel>Cidade</AdminLabel>
              <Input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <AdminLabel>UF</AdminLabel>
              <Input
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
              <div className="flex gap-2">
                <Input
                  required
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="00000-000"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleZipLookup}
                  disabled={lookup.status === "loading"}
                  className="shrink-0"
                >
                  {lookup.status === "loading" ? "Buscando…" : "Buscar"}
                </Button>
              </div>
            </div>
            <div>
              <AdminLabel>
                {isRepresentative ? "Região" : "Especialidade"}
              </AdminLabel>
              {isRepresentative ? (
                <Input
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                />
              ) : (
                <Input
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                />
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <AdminLabel>Telefone</AdminLabel>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <AdminLabel>E-mail</AdminLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="rounded-md border border-border p-3">
            <div className="mb-2 flex items-center gap-1.5">
              <MapPin className="size-3.5 text-muted-foreground" />
              <AdminLabel className="mb-0">Coordenadas do mapa</AdminLabel>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <AdminLabel>Latitude</AdminLabel>
                <Input
                  type="number"
                  step="any"
                  value={lat ?? ""}
                  onChange={(e) =>
                    setLat(
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                  placeholder="-23.5505"
                />
              </div>
              <div>
                <AdminLabel>Longitude</AdminLabel>
                <Input
                  type="number"
                  step="any"
                  value={lng ?? ""}
                  onChange={(e) =>
                    setLng(
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                  placeholder="-46.6333"
                />
              </div>
            </div>
            <p
              className={cn(
                "mt-2 text-xs",
                lookup.status === "error" || lookup.status === "notFound"
                  ? "text-destructive"
                  : "text-muted-foreground",
              )}
            >
              {lookup.message ??
                (lat !== null && lng !== null
                  ? "Preenchidas. Use “Buscar” no CEP para atualizar."
                  : "Sem coordenadas, o parceiro não aparece no mapa. Use “Buscar” no CEP.")}
            </p>
          </div>
          <div>
            <AdminLabel>Website</AdminLabel>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
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

// ── Conteúdo de parceiros ──────────────────────────────────────────────────────

interface ParceirosContentProps {
  activeType: PartnerLocationType;
}

export function ParceirosContent({ activeType }: ParceirosContentProps) {
  const queryClient = useQueryClient();
  const tab = TAB_CONFIG[activeType];

  const { data: locations = [], isLoading } = useGetApiPartnerLocations({
    type: activeType,
  });

  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [page, setPage] = useState(1);

  const states = useMemo(
    () =>
      Array.from(new Set(locations.map((l) => l.state).filter(Boolean))).sort(),
    [locations],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return locations.filter((l) => {
      const matchesQuery =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q);
      const matchesState = !stateFilter || l.state === stateFilter;
      return matchesQuery && matchesState;
    });
  }, [locations, query, stateFilter]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editing, setEditing] = useState<PartnerLocation | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<
    PartnerLocation | undefined
  >();
  const [toggleTarget, setToggleTarget] = useState<
    PartnerLocation | undefined
  >();

  function invalidate() {
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
      render: (l) => (
        <StatusBadge status={l.is_active ? "ACTIVE" : "INACTIVE"} />
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "text-right",
      className: "text-right",
      render: (l) => (
        <AdminRowActions>
          <AdminRowAction onClick={() => openEdit(l)}>Editar</AdminRowAction>
          <AdminRowAction onClick={() => setToggleTarget(l)}>
            {l.is_active ? "Desativar" : "Ativar"}
          </AdminRowAction>
          <AdminRowAction
            variant="destructive"
            onClick={() => setDeleteTarget(l)}
          >
            Excluir
          </AdminRowAction>
        </AdminRowActions>
      ),
    },
  ];

  const createAction = (
    <button
      type="button"
      onClick={openCreate}
      className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80"
    >
      <Plus className="size-4" />
      {tab.createLabel}
    </button>
  );

  const headerActions = (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setImportOpen(true)}
        className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
      >
        <FileUp className="size-4" />
        Importar planilha
      </button>
      {createAction}
    </div>
  );

  const hasActiveFilters = Boolean(query.trim() || stateFilter);

  return (
    <>
      <AdminPageLayout>
        <AdminDataTable
          columns={columns}
          data={paginated}
          isLoading={isLoading}
          keyExtractor={(l) => l.id}
          emptyTitle={
            hasActiveFilters ? "Nenhum parceiro encontrado" : tab.emptyTitle
          }
          emptyDescription={
            hasActiveFilters
              ? "Ajuste a busca ou o estado selecionado."
              : tab.emptyDescription
          }
          emptyIcon={activeType === "REPRESENTATIVE" ? MapPin : Wrench}
          emptyAction={hasActiveFilters ? undefined : createAction}
          action={headerActions}
          toolbar={
            <div className="flex flex-wrap items-center gap-3">
              <AdminSearchInput
                value={query}
                onChange={(v) => {
                  setQuery(v);
                  setPage(1);
                }}
                placeholder="Buscar por nome ou cidade"
                className="max-w-64"
              />
              <select
                value={stateFilter}
                onChange={(e) => {
                  setStateFilter(e.target.value);
                  setPage(1);
                }}
                className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
              >
                <option value="">Todas as UFs</option>
                {states.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
          }
          pagination={{
            page,
            pageSize: PAGE_SIZE,
            total: filtered.length,
            onPageChange: setPage,
          }}
        />
      </AdminPageLayout>

      {formOpen && (
        <PartnerLocationForm
          type={editing?.type ?? activeType}
          location={editing}
          onClose={closeForm}
          onSave={handleSave}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {importOpen && (
        <ImportPartnersDialog
          type={activeType}
          noun={tab.noun}
          onClose={() => setImportOpen(false)}
          onImported={invalidate}
        />
      )}

      <AdminConfirmDialog
        open={!!toggleTarget}
        title={
          toggleTarget?.is_active
            ? `Desativar ${tab.noun}?`
            : `Ativar ${tab.noun}?`
        }
        description={`${toggleTarget?.name} será ${toggleTarget?.is_active ? (tab.noun.endsWith("a") ? "desativada" : "desativado") : tab.noun.endsWith("a") ? "ativada" : "ativado"}.`}
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
