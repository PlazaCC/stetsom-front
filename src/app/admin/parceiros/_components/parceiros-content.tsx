"use client";

import {
  deleteApiPartnerLocationsId,
  getGetApiPartnerLocationsAdminQueryKey,
  useGetApiGeocodeCountries,
  patchApiPartnerLocationsId,
  postApiPartnerLocations,
  postApiPartnerLocationsIdLocationResolution,
  postApiPartnerLocationsLocationPreview,
  postApiPartnerLocationsLocationResolutions,
  putApiPartnerLocationsIdLocation,
  useGetApiPartnerLocationsAdmin,
  type PartnerLocation,
  type PartnerLocationResolution,
  type PartnerLocationType,
  type PatchApiPartnerLocationsIdBody,
  type PostApiPartnerLocationsBody,
  type PostApiPartnerLocationsBodyCountryCode,
} from "@/api/stetsom";
import { AdminConfirmDialog } from "@/app/admin/_components/crud/admin-confirm-dialog";
import { AdminFieldError } from "@/app/admin/_components/crud/admin-field-error";
import { AdminFormField } from "@/app/admin/_components/crud/admin-form-field";
import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/app/admin/_components/crud/admin-data-table";
import { AdminLabel } from "@/app/admin/_components/crud/admin-input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import {
  AdminRowAction,
  AdminRowActions,
} from "@/app/admin/_components/crud/admin-row-actions";
import { AdminSearchInput } from "@/app/admin/_components/crud/admin-search-input";
import {
  LocationMapStatusBadge,
  StatusBadge,
} from "@/app/admin/_components/crud/status-badge";
import { isValidCoordinate } from "@/lib/geocode";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { useApiFormErrors } from "@/lib/forms/api-form-errors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  CheckCheck,
  CheckCircle2,
  Ellipsis,
  ExternalLink,
  FileUp,
  LocateFixed,
  MapPin,
  Minus,
  Plus,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ImportPartnersDialog } from "./import-partners-dialog";
import dynamic from "next/dynamic";

const LocationMapPicker = dynamic(
  () =>
    import("./location-map-picker").then((module) => module.LocationMapPicker),
  { ssr: false },
);

const PAGE_SIZE = 10;
const COORDINATE_PATTERN = /[+-]?(?:\d+(?:[.,]\d+)?|[.,]\d+)/g;

function formatCoordinate(value: number) {
  return value.toFixed(8).replace(/\.?0+$/, "");
}

function parseCoordinates(value: string) {
  return (value.match(COORDINATE_PATTERN) ?? [])
    .map((coordinate) => Number(coordinate.replace(",", ".")))
    .filter(Number.isFinite);
}

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
  onSave: (data: PostApiPartnerLocationsBody, confirmLocation: boolean) => void;
  isPending: boolean;
  errors: Record<string, string>;
  onClearError: (path: string) => void;
}

function SelectionCheckbox({
  checked,
  indeterminate = false,
  globalSelected = false,
  label,
  onChange,
}: {
  checked: boolean;
  indeterminate?: boolean;
  globalSelected?: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked ? "true" : "false"}
      aria-label={label}
      onClick={onChange}
      className="inline-flex size-4 items-center justify-center rounded border border-input bg-background text-primary transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
    >
      {globalSelected ? (
        <CheckCheck className="size-3.5 stroke-[2.5]" />
      ) : indeterminate ? (
        <Minus className="size-3.5 stroke-[2.5]" />
      ) : checked ? (
        <Check className="size-3.5 stroke-[2.5]" />
      ) : null}
    </button>
  );
}

function PartnerLocationForm({
  type,
  location,
  onClose,
  onSave,
  isPending,
  errors,
  onClearError,
}: PartnerLocationFormProps) {
  const { data: countriesResponse } = useGetApiGeocodeCountries();
  const countries = countriesResponse?.countries ?? [];
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
  const [email, setEmail] = useState(location?.email ?? "");
  const [website, setWebsite] = useState(location?.website ?? "");
  const [region, setRegion] = useState(location?.region ?? "");
  const [specialty, setSpecialty] = useState(location?.specialty ?? "");
  const [isActive, setIsActive] = useState(location?.is_active ?? true);
  // Coordinates place the partner on the public map. They are filled by the CEP
  // lookup rather than typed, but stay editable for a manual correction.
  const [lat, setLat] = useState<number | null>(location?.lat ?? null);
  const [lng, setLng] = useState<number | null>(location?.lng ?? null);
  const [requestedMapPosition, setRequestedMapPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [preview, setPreview] = useState<PartnerLocationResolution | null>(
    null,
  );
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function loadPreview() {
    if (zip.trim().length < 2 && city.trim().length < 2) {
      setPreview({
        status: "INSUFFICIENT_DATA",
        reason: "Informe CEP ou cidade para buscar uma sugestão.",
      });
      return;
    }

    setIsPreviewLoading(true);
    try {
      const result = await postApiPartnerLocationsLocationPreview({
        country_code: countryCode as PostApiPartnerLocationsBodyCountryCode,
        zip: zip || null,
        city: city || null,
        state: state || null,
      });
      setPreview(result);
    } catch {
      setPreview({
        status: "NOT_FOUND",
        reason: "Não foi possível consultar o catálogo GeoNames agora.",
      });
    } finally {
      setIsPreviewLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void loadPreview(), 450);
    return () => window.clearTimeout(timer);
    // The preview is deliberately refreshed only after a geographic change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryCode, zip, city, state]);

  function getFormData(): PostApiPartnerLocationsBody {
    return {
      type,
      name,
      country_code: countryCode as PostApiPartnerLocationsBodyCountryCode,
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
      is_active: isActive,
    };
  }

  function validateCoordinates(): boolean {
    if (
      (lat === null) !== (lng === null) ||
      (lat !== null && !isValidCoordinate(lat, lng))
    ) {
      setFormError("Informe latitude e longitude válidas juntas.");
      return false;
    }
    setFormError(null);
    return true;
  }

  function applyCoordinates(value: string, field: "lat" | "lng") {
    onClearError(field);
    const values = parseCoordinates(value);
    if (values.length >= 2) {
      const [nextLat, nextLng] = values;
      if (isValidCoordinate(nextLat, nextLng)) {
        setLat(nextLat);
        setLng(nextLng);
        setFormError(null);
        return;
      }
      setFormError(
        "As coordenadas coladas estão fora dos limites geográficos.",
      );
      return;
    }

    const [coordinate] = values;
    if (coordinate === undefined) {
      if (!value.trim()) {
        if (field === "lat") setLat(null);
        else setLng(null);
        setFormError(null);
      }
      return;
    }
    if (
      (field === "lat" && (coordinate < -90 || coordinate > 90)) ||
      (field === "lng" && (coordinate < -180 || coordinate > 180))
    ) {
      setFormError("A coordenada está fora dos limites geográficos.");
      return;
    }
    if (field === "lat") setLat(coordinate);
    else setLng(coordinate);
    setFormError(null);
  }

  function handleSubmit(e: React.FormEvent, confirmLocation = false) {
    e.preventDefault();
    if (!validateCoordinates()) return;
    onSave(getFormData(), confirmLocation);
  }

  const canSave =
    Boolean(name.trim() && address.trim() && city.trim()) && !formError;
  const canConfirm = canSave && isValidCoordinate(lat, lng);
  const hasOriginalPosition = isValidCoordinate(location?.lat, location?.lng);
  const locationChangedFromOriginal =
    hasOriginalPosition && (lat !== location?.lat || lng !== location?.lng);
  const errorId = (field: string) => `partner-location-${field}-error`;
  const inputErrorProps = (field: string) => ({
    name: field,
    "data-field-path": field,
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? errorId(field) : undefined,
  });

  const editing = !!location;
  const countryName =
    countries.find((country) => country.code === countryCode)?.name ??
    countryCode;
  const mapsSearch = [name, address, city, state, zip, countryName]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(", ");
  const mapsUrl = mapsSearch
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsSearch)}`
    : null;
  const title = isRepresentative
    ? editing
      ? "Editar Representante"
      : "Novo Representante"
    : editing
      ? "Editar Assistência Técnica"
      : "Nova Assistência Técnica";

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <DialogBody className="space-y-4 px-4 py-4 sm:px-6">
            <AdminFormField
              label="Nome"
              htmlFor="partner-location-name"
              required
              error={errors.name}
              errorId={errorId("name")}
            >
              <Input
                id="partner-location-name"
                required
                value={name}
                {...inputErrorProps("name")}
                onChange={(e) => {
                  setName(e.target.value);
                  onClearError("name");
                }}
              />
            </AdminFormField>
            <AdminFormField
              label="Endereço"
              htmlFor="partner-location-address"
              required
              error={errors.address}
              errorId={errorId("address")}
            >
              <Input
                id="partner-location-address"
                required
                value={address}
                {...inputErrorProps("address")}
                onChange={(e) => {
                  setAddress(e.target.value);
                  onClearError("address");
                }}
              />
            </AdminFormField>
            <AdminFormField
              label="País"
              htmlFor="partner-location-country-code"
              required
              error={errors.country_code}
              errorId={errorId("country_code")}
            >
              <select
                id="partner-location-country-code"
                value={countryCode}
                {...inputErrorProps("country_code")}
                onChange={(event) => {
                  setCountryCode(event.target.value);
                  onClearError("country_code");
                }}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </AdminFormField>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <AdminFormField
                  label="Cidade"
                  htmlFor="partner-location-city"
                  required
                  error={errors.city}
                  errorId={errorId("city")}
                >
                  <Input
                    id="partner-location-city"
                    required
                    value={city}
                    {...inputErrorProps("city")}
                    onChange={(e) => {
                      setCity(e.target.value);
                      onClearError("city");
                    }}
                  />
                </AdminFormField>
              </div>
              <div>
                <AdminLabel>Estado / província</AdminLabel>
                <Input
                  maxLength={100}
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <AdminLabel>Código postal ou localidade</AdminLabel>
                <div className="flex gap-2">
                  <Input
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="Cidade, região ou código postal"
                    className="min-w-0 flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void loadPreview()}
                    disabled={isPreviewLoading}
                    className="shrink-0"
                  >
                    {isPreviewLoading ? "Buscando…" : "Buscar localidade"}
                  </Button>
                </div>
              </div>
              <div className="sm:col-span-2">
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
            <div className="grid gap-3">
              <div>
                <AdminLabel>Telefone</AdminLabel>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <AdminLabel>E-mail</AdminLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <AdminLabel>Website</AdminLabel>
                <Input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/20 px-4 py-3">
              <div className="min-w-0">
                <AdminLabel className="mb-0">Visível no localizador</AdminLabel>
                <p className="mt-1 text-xs text-muted-foreground">
                  {isActive
                    ? "Ativo. Coordenadas aproximadas aparecem identificadas no localizador público."
                    : "Inativo. Fica oculto do localizador público."}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <StatusBadge status={isActive ? "ACTIVE" : "INACTIVE"} />
                <Switch
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  aria-label="Alternar visibilidade no localizador"
                />
              </div>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <div className="mb-3 flex items-center gap-1.5">
                <MapPin className="size-3.5 text-muted-foreground" />
                <AdminLabel className="mb-0">Coordenadas do mapa</AdminLabel>
              </div>
              <div className="grid gap-4">
                <LocationMapPicker
                  lat={lat}
                  lng={lng}
                  onLocationRequest={(nextLat, nextLng) =>
                    setRequestedMapPosition({ lat: nextLat, lng: nextLng })
                  }
                />
                {preview?.status === "FOUND" && (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-xs">
                    <div>
                      <p className="font-semibold text-foreground">
                        Sugestão GeoNames · {preview.display_name}
                      </p>
                      <p className="mt-0.5 text-muted-foreground">
                        Posição aproximada por{" "}
                        {preview.precision === "POSTAL_CODE" ? "CEP" : "cidade"}
                        . Revise antes de publicar.
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setLat(preview.lat);
                        setLng(preview.lng);
                      }}
                    >
                      Usar sugestão
                    </Button>
                  </div>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <AdminLabel>Latitude</AdminLabel>
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={lat === null ? "" : formatCoordinate(lat)}
                      {...inputErrorProps("lat")}
                      onChange={(e) => applyCoordinates(e.target.value, "lat")}
                      onPaste={(event) => {
                        const pasted = event.clipboardData.getData("text");
                        if (parseCoordinates(pasted).length >= 2) {
                          event.preventDefault();
                          applyCoordinates(pasted, "lat");
                        }
                      }}
                      placeholder="-23.5505"
                    />
                  </div>
                  <div>
                    <AdminLabel>Longitude</AdminLabel>
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={lng === null ? "" : formatCoordinate(lng)}
                      {...inputErrorProps("lng")}
                      onChange={(e) => applyCoordinates(e.target.value, "lng")}
                      onPaste={(event) => {
                        const pasted = event.clipboardData.getData("text");
                        if (parseCoordinates(pasted).length >= 2) {
                          event.preventDefault();
                          applyCoordinates(pasted, "lng");
                        }
                      }}
                      placeholder="-46.6333"
                    />
                  </div>
                </div>
                {locationChangedFromOriginal && (
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-300/70 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                    <span>
                      Coordenadas alteradas em relação ao cadastro original.
                    </span>
                    <button
                      type="button"
                      className="font-semibold underline underline-offset-4 hover:no-underline"
                      onClick={() => {
                        setLat(location?.lat ?? null);
                        setLng(location?.lng ?? null);
                        setFormError(null);
                      }}
                    >
                      Reverter coordenadas
                    </button>
                  </div>
                )}
                <AdminFieldError
                  id={errorId("lat")}
                  message={errors.lat ?? errors.lng ?? formError}
                />
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/70 pt-3">
                {mapsUrl ? (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary underline-offset-4 hover:underline"
                  >
                    <ExternalLink className="size-3.5" />
                    Abrir endereço no Google Maps
                  </a>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Preencha o endereço para abrir no Google Maps e conferir as
                    coordenadas.
                  </p>
                )}
              </div>
              <div className="mt-3 space-y-2">
                {preview && preview.status !== "FOUND" && (
                  <p className="text-xs text-muted-foreground">
                    {preview.reason}
                  </p>
                )}
                <div className="rounded-md bg-background/70 p-2.5 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">
                    Como copiar coordenadas exatas
                  </p>
                  <ol className="mt-1 list-decimal space-y-0.5 pl-4">
                    <li>Abra o endereço no Google Maps.</li>
                    <li>Clique com o botão direito no ponto correto.</li>
                    <li>
                      Cole o par em qualquer campo: os valores serão separados e
                      normalizados automaticamente.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </DialogBody>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="outline"
              disabled={isPending || !canSave}
            >
              {isPending ? "Salvando..." : "Salvar como pendente"}
            </Button>
            {canConfirm && (
              <Button
                type="button"
                disabled={isPending}
                onClick={(event) => handleSubmit(event, true)}
              >
                <CheckCircle2 className="size-4" />
                Salvar e confirmar
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
      <AdminConfirmDialog
        open={requestedMapPosition !== null}
        title="Alterar ponto no mapa?"
        description={
          requestedMapPosition
            ? `A localização será atualizada para latitude ${formatCoordinate(requestedMapPosition.lat)} e longitude ${formatCoordinate(requestedMapPosition.lng)}.`
            : ""
        }
        confirmLabel="Usar este ponto"
        onConfirm={() => {
          if (!requestedMapPosition) return;
          setLat(requestedMapPosition.lat);
          setLng(requestedMapPosition.lng);
          setFormError(null);
          setRequestedMapPosition(null);
        }}
        onCancel={() => setRequestedMapPosition(null)}
      />
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
  const formErrors = useApiFormErrors();
  const tab = TAB_CONFIG[activeType];

  const { data: locations = [], isLoading } = useGetApiPartnerLocationsAdmin({
    type: activeType,
  });

  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [mapStatusFilter, setMapStatusFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchProgress, setBatchProgress] = useState<{
    completed: number;
    total: number;
  } | null>(null);
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
      const hasCoordinates = l.lat !== undefined && l.lng !== undefined;
      const mapStatus = l.location_verified
        ? "CONFIRMED"
        : hasCoordinates
          ? "PENDING_CONFIRMATION"
          : "MISSING";
      return (
        matchesQuery &&
        matchesState &&
        (!mapStatusFilter || mapStatus === mapStatusFilter)
      );
    });
  }, [locations, mapStatusFilter, query, stateFilter]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const visibleIds = paginated.map((location) => location.id);
  const selectedVisibleCount = visibleIds.filter((id) =>
    selectedIds.includes(id),
  ).length;
  const allVisibleSelected =
    visibleIds.length > 0 && selectedVisibleCount === visibleIds.length;
  const allFilteredSelected =
    filtered.length > 0 &&
    filtered.every((location) => selectedIds.includes(location.id));

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
      queryKey: getGetApiPartnerLocationsAdminQueryKey(),
    });
  }

  const createMutation = useMutation({
    mutationFn: async ({
      body,
      confirmLocation,
    }: {
      body: PostApiPartnerLocationsBody;
      confirmLocation: boolean;
    }) => {
      const saved = await postApiPartnerLocations(body);
      if (
        confirmLocation &&
        body.lat !== null &&
        body.lat !== undefined &&
        body.lng !== null &&
        body.lng !== undefined
      ) {
        await putApiPartnerLocationsIdLocation(saved.id, {
          lat: body.lat,
          lng: body.lng,
        });
      }
      return saved;
    },
    onSuccess: () => {
      invalidate();
      closeForm();
      toast.success(
        `${tab.noun === "assistência" ? "Assistência" : "Representante"} criado com sucesso.`,
      );
    },
    onError: (error) => {
      formErrors.capture(error);
      toast.apiError(error, `Não foi possível criar ${tab.noun}.`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      body,
      confirmLocation,
    }: {
      id: string;
      body: PatchApiPartnerLocationsIdBody;
      confirmLocation: boolean;
    }) => {
      const saved = await patchApiPartnerLocationsId(id, body);
      if (
        confirmLocation &&
        body.lat !== null &&
        body.lat !== undefined &&
        body.lng !== null &&
        body.lng !== undefined
      ) {
        await putApiPartnerLocationsIdLocation(saved.id, {
          lat: body.lat,
          lng: body.lng,
        });
      }
      return saved;
    },
    onSuccess: () => {
      invalidate();
      closeForm();
      toast.success(
        `${tab.noun === "assistência" ? "Assistência" : "Representante"} salvo com sucesso.`,
      );
    },
    onError: (error) => {
      formErrors.capture(error);
      toast.apiError(error, `Não foi possível salvar ${tab.noun}.`);
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

  const resolveOneMutation = useMutation({
    mutationFn: (id: string) => postApiPartnerLocationsIdLocationResolution(id),
    onSuccess: () => {
      invalidate();
      toast.success(
        "Localização aproximada atualizada. Confirme o ponto para publicar.",
      );
    },
    onError: (error) =>
      toast.apiError(error, "Não foi possível localizar o parceiro"),
  });

  const resolveSelectedMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const chunks = Array.from(
        { length: Math.ceil(ids.length / 50) },
        (_, index) => ids.slice(index * 50, index * 50 + 50),
      );
      const total = {
        processed: 0,
        resolved: 0,
        not_found: 0,
        insufficient_data: 0,
        skipped_confirmed: 0,
      };
      setBatchProgress({ completed: 0, total: ids.length });
      for (const chunk of chunks) {
        const summary = await postApiPartnerLocationsLocationResolutions({
          ids: chunk,
        });
        total.processed += summary.processed;
        total.resolved += summary.resolved;
        total.not_found += summary.not_found;
        total.insufficient_data += summary.insufficient_data;
        total.skipped_confirmed += summary.skipped_confirmed;
        setBatchProgress({ completed: total.processed, total: ids.length });
      }
      return total;
    },
    onSuccess: (summary) => {
      invalidate();
      setSelectedIds([]);
      setBatchProgress(null);
      toast.success(
        `${summary.resolved} localizações preenchidas; ${summary.insufficient_data} precisam de cidade ou CEP; ${summary.skipped_confirmed} já confirmadas.`,
      );
    },
    onError: (error) => {
      setBatchProgress(null);
      toast.apiError(
        error,
        "Não foi possível localizar os parceiros selecionados",
      );
    },
  });

  function openCreate() {
    formErrors.clear();
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(location: PartnerLocation) {
    formErrors.clear();
    setEditing(location);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(undefined);
    formErrors.clear();
  }

  function handleSave(
    data: PostApiPartnerLocationsBody,
    confirmLocation: boolean,
  ) {
    if (editing) {
      updateMutation.mutate({ id: editing.id, body: data, confirmLocation });
    } else {
      createMutation.mutate({ body: data, confirmLocation });
    }
  }

  function toggleSelected(id: string) {
    setSelectedIds((ids) =>
      ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id],
    );
  }

  function toggleVisibleSelection() {
    setSelectedIds((ids) => {
      if (allFilteredSelected)
        return ids.filter((id) => !filtered.some((item) => item.id === id));
      if (allVisibleSelected)
        return ids.filter((id) => !visibleIds.includes(id));
      return Array.from(new Set([...ids, ...visibleIds]));
    });
  }

  function selectAllFiltered() {
    setSelectedIds(filtered.map((location) => location.id));
  }

  function mapsUrl(location: PartnerLocation) {
    const search = [
      location.name,
      location.address,
      location.city,
      location.state,
      location.zip,
      location.country_code,
    ]
      .filter(Boolean)
      .join(", ");
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(search)}`;
  }

  const columns: AdminTableColumn<PartnerLocation>[] = [
    {
      key: "select",
      header: (
        <SelectionCheckbox
          checked={allVisibleSelected}
          indeterminate={selectedVisibleCount > 0 && !allVisibleSelected}
          globalSelected={allFilteredSelected}
          label="Selecionar parceiros visíveis"
          onChange={toggleVisibleSelection}
        />
      ),
      className: "w-10",
      render: (l) => (
        <SelectionCheckbox
          label={`Selecionar ${l.name}`}
          checked={selectedIds.includes(l.id)}
          onChange={() => toggleSelected(l.id)}
        />
      ),
    },
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
      key: "map",
      header: "Mapa",
      render: (l) => {
        if (l.location_verified) {
          return <LocationMapStatusBadge status="CONFIRMED" />;
        }
        if (l.lat !== undefined && l.lng !== undefined) {
          return <LocationMapStatusBadge status="APPROXIMATE" />;
        }
        return <LocationMapStatusBadge status="MISSING" />;
      },
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
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger
                render={
                  <DropdownMenuTrigger
                    render={
                      <Button type="button" variant="outline" size="icon-sm" />
                    }
                    aria-label={`Ações para ${l.name}`}
                  />
                }
              >
                <Ellipsis className="size-4" />
              </TooltipTrigger>
              <TooltipContent>Ações</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={() => resolveOneMutation.mutate(l.id)}>
                <LocateFixed className="size-4" /> Localizar no mapa
              </DropdownMenuItem>
              <DropdownMenuItem
                render={
                  <a
                    href={mapsUrl(l)}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <ExternalLink className="size-4" /> Abrir no Google Maps
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setToggleTarget(l)}>
                {l.is_active ? "Desativar" : "Ativar"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setDeleteTarget(l)}
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
      {selectedIds.length > 0 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={resolveSelectedMutation.isPending}
          onClick={() => resolveSelectedMutation.mutate(selectedIds)}
        >
          <LocateFixed className="size-4" />
          {batchProgress
            ? `Localizando ${batchProgress.completed}/${batchProgress.total}`
            : `Encontrar localizações (${selectedIds.length})`}
        </Button>
      )}
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

  const hasActiveFilters = Boolean(
    query.trim() || stateFilter || mapStatusFilter,
  );

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
              <select
                value={mapStatusFilter}
                onChange={(e) => {
                  setMapStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
              >
                <option value="">Todos no mapa</option>
                <option value="CONFIRMED">No mapa</option>
                <option value="PENDING_CONFIRMATION">
                  Aguardando confirmação
                </option>
                <option value="MISSING">Sem coordenadas</option>
              </select>
              {selectedIds.length > 0 && !allFilteredSelected && (
                <button
                  type="button"
                  onClick={selectAllFiltered}
                  className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Selecionar todos os {filtered.length} resultados
                </button>
              )}
              {allFilteredSelected && (
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Limpar seleção
                </button>
              )}
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
          errors={formErrors.errors}
          onClearError={formErrors.clear}
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
