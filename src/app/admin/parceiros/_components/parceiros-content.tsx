"use client";

import {
  deleteApiPartnerLocationsId,
  getApiGeocodeSearch,
  getGetApiPartnerLocationsAdminQueryKey,
  patchApiPartnerLocationsId,
  postApiPartnerLocations,
  postApiPartnerLocationsBulkDelete,
  postApiPartnerLocationsGeocodingRequeue,
  useGetApiPartnerLocationsAdmin,
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import {
  AdminRowAction,
  AdminRowActions,
} from "@/app/admin/_components/crud/admin-row-actions";
import { AdminSearchInput } from "@/app/admin/_components/crud/admin-search-input";
import { StatusBadge } from "@/app/admin/_components/crud/status-badge";
import { EditorFooter } from "@/app/admin/_components/crud/editor-footer";
import {
  getPartnerLocationDisplayStatus,
  PartnerLocationStatus,
} from "./partner-location-status";
import { cn } from "@/lib/utils";
import { isValidCoordinate } from "@/lib/geocode";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, FileUp, MapPin, Plus, Wrench } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { ImportPartnersDialog } from "./import-partners-dialog";

const PAGE_SIZE = 10;

const COUNTRIES = [
  ["BR", "Brasil"],
  ["US", "Estados Unidos"],
  ["AR", "Argentina"],
  ["BO", "Bolívia"],
  ["CL", "Chile"],
  ["CO", "Colômbia"],
  ["EC", "Equador"],
  ["MX", "México"],
  ["PA", "Panamá"],
  ["PY", "Paraguai"],
  ["PE", "Peru"],
  ["PR", "Porto Rico"],
  ["DO", "República Dominicana"],
  ["TT", "Trinidad e Tobago"],
  ["VE", "Venezuela"],
] as const;

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
  onToggle?: () => void;
  onDelete?: () => void;
  onRequeue?: () => void;
  isPending: boolean;
  isDeleting?: boolean;
  isRequeueing?: boolean;
}

function PartnerLocationForm({
  type,
  location,
  onClose,
  onSave,
  onToggle,
  onDelete,
  onRequeue,
  isPending,
  isDeleting = false,
  isRequeueing = false,
}: PartnerLocationFormProps) {
  const isRepresentative = type === "REPRESENTATIVE";
  const [name, setName] = useState(location?.name ?? "");
  const [countryCode, setCountryCode] = useState(
    location?.country_code ?? "BR",
  );
  const [address, setAddress] = useState(location?.address ?? "");
  const [city, setCity] = useState(location?.city ?? "");
  const [state, setState] = useState(location?.state ?? "");
  const [zip, setZip] = useState(location?.zip ?? "");
  const [phone, setPhone] = useState(location?.phone ?? "");
  const [phone2, setPhone2] = useState(location?.phone2 ?? "");
  const [email, setEmail] = useState(location?.email ?? "");
  const [website, setWebsite] = useState(location?.website ?? "");
  const [specialty, setSpecialty] = useState(location?.specialty ?? "");
  // Coordinates are filled asynchronously by default and stay editable for
  // verification or an explicit administrative correction.
  const [lat, setLat] = useState<number | null>(location?.lat ?? null);
  const [lng, setLng] = useState<number | null>(location?.lng ?? null);
  const [coordinatesTouched, setCoordinatesTouched] = useState(false);
  const [lookup, setLookup] = useState<{
    status: "idle" | "loading" | "notFound" | "noCoords" | "error" | "done";
    message?: string;
  }>({ status: "idle" });
  const [formError, setFormError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleZipLookup() {
    if (zip.trim().length < 2) {
      setLookup({
        status: "error",
        message: "Informe um código postal válido.",
      });
      return;
    }

    setLookup({ status: "loading" });
    try {
      const { results } = await getApiGeocodeSearch({
        q: zip.trim(),
        country_code: countryCode,
        purpose: "address",
      });
      const hit = results[0];
      if (!hit) {
        setLookup({
          status: "notFound",
          message: "Código postal não encontrado.",
        });
        return;
      }

      if (hit.address) setAddress(hit.address);
      if (hit.city) setCity(hit.city);
      if (hit.state) setState(hit.state);
      if (hit.postalCode) setZip(hit.postalCode);
      setLookup({
        status: "done",
        message: `${hit.displayName} · aguardando geocodificação`,
      });
    } catch {
      setLookup({
        status: "error",
        message: "Não foi possível consultar o código postal agora.",
      });
    }
  }

  function submit() {
    if (
      (lat === null) !== (lng === null) ||
      (lat !== null && !isValidCoordinate(lat, lng))
    ) {
      setFormError("Informe latitude e longitude válidas juntas.");
      return;
    }
    setFormError(null);
    const coordinates =
      !location || coordinatesTouched ? { lat, lng } : undefined;
    onSave({
      type,
      name,
      country_code: countryCode,
      address,
      city,
      state,
      zip,
      ...coordinates,
      phone: phone || null,
      phone2: phone2 || null,
      email: email || null,
      website: website || null,
      specialty: isRepresentative ? null : specialty || null,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submit();
  }

  const editing = !!location;
  const addressChanged =
    !!location &&
    [
      [address, location.address],
      [city, location.city],
      [state, location.state],
      [zip, location.zip],
      [countryCode, location.country_code],
    ].some(([current, original]) => current.trim() !== original.trim());
  const canRequeue =
    !!location &&
    getPartnerLocationDisplayStatus(location) === "NOT_CONFIGURED";
  const extraMenuActions = [
    ...(location && onToggle
      ? [
          {
            key: "toggle",
            label: location.is_active ? "Desativar" : "Ativar",
            onClick: onToggle,
            variant: location.is_active
              ? ("destructive" as const)
              : ("success" as const),
          },
        ]
      : []),
    ...(canRequeue && onRequeue
      ? [
          {
            key: "requeue-geocoding",
            label: addressChanged
              ? "Salve antes de reenviar"
              : "Enviar novamente para a fila",
            onClick: onRequeue,
            disabled: addressChanged,
            isLoading: isRequeueing,
          },
        ]
      : []),
  ];
  const hasCoordinates =
    lat !== null && lng !== null && isValidCoordinate(lat, lng);
  const mapsUrl = hasCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`
    : "https://www.google.com/maps";
  const title = isRepresentative
    ? editing
      ? "Editar Representante"
      : "Novo Representante"
    : editing
      ? "Editar Assistência Técnica"
      : "Nova Assistência Técnica";

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="px-4 pt-4 pr-12 pb-3">{title}</DialogTitle>
        </DialogHeader>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pt-3 pb-4">
            <p className="border-b border-border pb-2 text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              Dados do parceiro
            </p>
            <div>
              <AdminLabel>Nome</AdminLabel>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <p className="border-b border-border pt-2 pb-2 text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              Endereço
            </p>
            <div>
              <AdminLabel>Código postal</AdminLabel>
              <div className="flex gap-2">
                <Input
                  required={!["BO", "TT"].includes(countryCode)}
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder={
                    countryCode === "BR" ? "00000-000" : "Código postal"
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleZipLookup}
                  disabled={lookup.status === "loading"}
                  className="shrink-0"
                >
                  {lookup.status === "loading"
                    ? "Buscando…"
                    : "Buscar endereço"}
                </Button>
              </div>
              {lookup.message && (
                <p
                  className={cn(
                    "mt-2 text-xs",
                    lookup.status === "error" || lookup.status === "notFound"
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  {lookup.message}
                </p>
              )}
            </div>
            <div>
              <AdminLabel>Endereço completo</AdminLabel>
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
                <AdminLabel>
                  {countryCode === "BR" ? "UF" : "Estado / província"}
                </AdminLabel>
                <Input
                  required={!["BO", "PA", "DO", "TT"].includes(countryCode)}
                  maxLength={100}
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
            </div>
            <div>
              <AdminLabel>País</AdminLabel>
              <select
                required
                value={countryCode}
                onChange={(e) => {
                  setCountryCode(e.target.value);
                  setLookup({ status: "idle" });
                }}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
              >
                {COUNTRIES.map(([code, label]) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            {!isRepresentative && (
              <div>
                <AdminLabel>Especialidade</AdminLabel>
                <Input
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                />
              </div>
            )}
            <p className="border-b border-border pt-2 pb-2 text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              Contato
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <AdminLabel>Telefone</AdminLabel>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <AdminLabel>Telefone 2</AdminLabel>
                <Input
                  value={phone2}
                  onChange={(e) => setPhone2(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <AdminLabel>E-mail</AdminLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <AdminLabel>Website</AdminLabel>
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <p className="border-b border-border pt-2 pb-2 text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              Localização no mapa
            </p>
            <div className="rounded-md border border-border p-3">
              <div className="mb-2 flex items-center gap-1.5">
                <MapPin className="size-3.5 text-muted-foreground" />
                <AdminLabel className="mb-0">Localização</AdminLabel>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                Preenchimento automático. Ajuste as coordenadas se necessário.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <AdminLabel>Latitude</AdminLabel>
                  <Input
                    type="number"
                    step="any"
                    value={lat ?? ""}
                    onChange={(e) => {
                      setCoordinatesTouched(true);
                      setLat(
                        e.target.value === "" ? null : Number(e.target.value),
                      );
                    }}
                    placeholder="-0.0"
                  />
                </div>
                <div>
                  <AdminLabel>Longitude</AdminLabel>
                  <Input
                    type="number"
                    step="any"
                    value={lng ?? ""}
                    onChange={(e) => {
                      setCoordinatesTouched(true);
                      setLng(
                        e.target.value === "" ? null : Number(e.target.value),
                      );
                    }}
                    placeholder="-0.0"
                  />
                </div>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary underline-offset-4 hover:underline"
              >
                <ExternalLink className="size-3.5" />
                {hasCoordinates ? "Abrir localização" : "Buscar localização"}
              </a>
              <p
                className={cn(
                  "mt-2 text-xs",
                  lookup.status === "error" || lookup.status === "notFound"
                    ? "text-destructive"
                    : "text-muted-foreground",
                )}
              >
                {lookup.message ??
                  (hasCoordinates
                    ? location?.geocode_status === "MANUAL" ||
                      coordinatesTouched
                      ? "Coordenadas informadas ou corrigidas manualmente."
                      : "Coordenadas preenchidas automaticamente."
                    : "Sem coordenadas: o endereço seguirá para geocodificação automática.")}
              </p>
              {formError && (
                <p className="mt-2 text-xs text-destructive">{formError}</p>
              )}
            </div>
          </div>
          <EditorFooter
            onBack={onClose}
            backLabel="Cancelar"
            extraMenuActions={
              extraMenuActions.length > 0 ? extraMenuActions : undefined
            }
            deleteAction={
              location && onDelete
                ? {
                    label: "Excluir parceiro",
                    confirmTitle: `Excluir "${location.name}"?`,
                    confirmDescription:
                      "O parceiro deixará de aparecer nas listagens.",
                    onConfirm: onDelete,
                    isLoading: isDeleting,
                  }
                : undefined
            }
            onPrimary={() => formRef.current?.requestSubmit()}
            primaryLabel={isPending ? "Salvando..." : "Salvar"}
            isPrimaryLoading={isPending}
          />
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
  const toast = useAdminToast();
  const tab = TAB_CONFIG[activeType];

  const { data: locations = [], isLoading } = useGetApiPartnerLocationsAdmin({
    type: activeType,
  });

  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

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
      const matchesLocation =
        !locationFilter ||
        getPartnerLocationDisplayStatus(l) === locationFilter;
      return matchesQuery && matchesState && matchesLocation;
    });
  }, [locations, query, stateFilter, locationFilter]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectedExistingRowIds = selectedRowIds.filter((id) =>
    locations.some((location) => location.id === id),
  );
  const selectedRequeueIds = selectedExistingRowIds.filter((id) => {
    const location = locations.find((item) => item.id === id);
    return (
      location && getPartnerLocationDisplayStatus(location) === "NOT_CONFIGURED"
    );
  });

  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editing, setEditing] = useState<PartnerLocation | undefined>();
  const [toggleTarget, setToggleTarget] = useState<
    PartnerLocation | undefined
  >();
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  function invalidate() {
    queryClient.invalidateQueries({
      queryKey: getGetApiPartnerLocationsAdminQueryKey(),
    });
  }

  const createMutation = useMutation({
    mutationFn: (body: PostApiPartnerLocationsBody) =>
      postApiPartnerLocations(body),
    onSuccess: () => {
      invalidate();
      closeForm();
      toast.success(`${tab.noun} criado com sucesso`);
    },
    onError: (error) =>
      toast.apiError(error, `Não foi possível criar ${tab.noun}`),
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
      toast.success(`${tab.noun} atualizado com sucesso`);
    },
    onError: (error) =>
      toast.apiError(error, `Não foi possível atualizar ${tab.noun}`),
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
      closeForm();
      toast.success(`${tab.noun} atualizado com sucesso`);
    },
    onError: (error) =>
      toast.apiError(error, `Não foi possível atualizar ${tab.noun}`),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApiPartnerLocationsId(id),
    onSuccess: () => {
      invalidate();
      closeForm();
      toast.deleted("Parceiro");
    },
    onError: (error) =>
      toast.apiError(error, `Não foi possível excluir ${tab.noun}`),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => postApiPartnerLocationsBulkDelete({ ids }),
    onSuccess: (result) => {
      invalidate();
      setSelectedRowIds([]);
      setBulkDeleteOpen(false);
      toast.success(
        `${result.deleted} ${result.deleted === 1 ? "parceiro excluído" : "parceiros excluídos"}`,
      );
    },
    onError: (error) =>
      toast.apiError(error, `Não foi possível excluir ${tab.noun}s`),
  });

  const requeueMutation = useMutation({
    mutationFn: (ids: string[]) =>
      postApiPartnerLocationsGeocodingRequeue({ ids }),
    onSuccess: (result, ids) => {
      invalidate();
      setSelectedRowIds((current) => current.filter((id) => !ids.includes(id)));
      toast.success(
        result.queued === 1
          ? "Parceiro enviado para a fila"
          : `${result.queued} parceiros enviados para a fila`,
      );
    },
    onError: (error) =>
      toast.apiError(error, "Não foi possível reenviar para a fila"),
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
      key: "location",
      header: "Localização",
      render: (l) => (
        <PartnerLocationStatus
          location={l}
          onRequeue={() => requeueMutation.mutate([l.id])}
          isRequeueing={requeueMutation.isPending}
        />
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

  const tableFooter = selectedExistingRowIds.length > 0 && (
    <>
      <span className="text-muted-foreground">
        {selectedExistingRowIds.length} selecionado
        {selectedExistingRowIds.length === 1 ? "" : "s"}
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {selectedRequeueIds.length > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => requeueMutation.mutate(selectedRequeueIds)}
            disabled={requeueMutation.isPending}
          >
            Enviar para fila ({selectedRequeueIds.length})
          </Button>
        )}
        <Button
          type="button"
          variant="destructive"
          onClick={() => setBulkDeleteOpen(true)}
          disabled={bulkDeleteMutation.isPending}
        >
          Excluir selecionados ({selectedExistingRowIds.length})
        </Button>
      </div>
    </>
  );

  const hasActiveFilters = Boolean(
    query.trim() || stateFilter || locationFilter,
  );

  return (
    <>
      <AdminPageLayout>
        <AdminDataTable
          columns={columns}
          data={paginated}
          isLoading={isLoading}
          keyExtractor={(l) => l.id}
          selectable
          selectedRowIds={selectedRowIds}
          onSelectedRowIdsChange={setSelectedRowIds}
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
                  setSelectedRowIds([]);
                }}
                placeholder="Buscar por nome ou cidade"
                className="max-w-64"
              />
              <select
                value={stateFilter}
                onChange={(e) => {
                  setStateFilter(e.target.value);
                  setPage(1);
                  setSelectedRowIds([]);
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
              <select
                value={locationFilter}
                onChange={(e) => {
                  setLocationFilter(e.target.value);
                  setPage(1);
                  setSelectedRowIds([]);
                }}
                className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
              >
                <option value="">Todas as localizações</option>
                <option value="CONFIGURED">Configurada</option>
                <option value="PENDING">Em fila</option>
                <option value="PROCESSING">Sincronizando</option>
                <option value="NOT_CONFIGURED">Não configurada</option>
              </select>
            </div>
          }
          tableFooter={tableFooter}
          pagination={{
            page,
            pageSize: PAGE_SIZE,
            total: filtered.length,
            onPageChange: (nextPage) => {
              setPage(nextPage);
              setSelectedRowIds([]);
            },
          }}
        />
      </AdminPageLayout>

      {formOpen && (
        <PartnerLocationForm
          type={editing?.type ?? activeType}
          location={editing}
          onClose={closeForm}
          onSave={handleSave}
          onToggle={() => setToggleTarget(editing)}
          onDelete={() => editing && deleteMutation.mutate(editing.id)}
          onRequeue={() => editing && requeueMutation.mutate([editing.id])}
          isPending={createMutation.isPending || updateMutation.isPending}
          isDeleting={deleteMutation.isPending}
          isRequeueing={requeueMutation.isPending}
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
        open={bulkDeleteOpen}
        title={`Excluir ${selectedExistingRowIds.length} ${tab.noun}${selectedExistingRowIds.length === 1 ? "" : "s"}?`}
        description="Os registros selecionados deixarão de aparecer nas listagens. Esta ação não pode ser desfeita."
        confirmLabel="Excluir selecionados"
        destructive
        isPending={bulkDeleteMutation.isPending}
        onConfirm={() => bulkDeleteMutation.mutate(selectedExistingRowIds)}
        onCancel={() => setBulkDeleteOpen(false)}
      />
    </>
  );
}
