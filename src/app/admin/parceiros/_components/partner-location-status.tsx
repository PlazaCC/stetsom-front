import { ExternalLink, Loader2, MapPin, Timer } from "lucide-react";
import type { PartnerLocation } from "@/api/stetsom";
import { isValidCoordinate } from "@/lib/geocode";
import { StatusBadge } from "@/app/admin/_components/crud/status-badge";

export type PartnerLocationDisplayStatus =
  | "CONFIGURED"
  | "PENDING"
  | "PROCESSING"
  | "NOT_CONFIGURED";

export function getPartnerLocationDisplayStatus(
  location: PartnerLocation,
): PartnerLocationDisplayStatus {
  if (location.geocode_status === "PROCESSING") return "PROCESSING";
  if (location.geocode_status === "PENDING") return "PENDING";
  if (location.has_map_location && mapUrl(location)) return "CONFIGURED";
  return "NOT_CONFIGURED";
}

function mapUrl(location: PartnerLocation) {
  if (!isValidCoordinate(location.lat, location.lng)) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.lat},${location.lng}`)}`;
}

export function PartnerLocationStatus({
  location,
  onRequeue,
  isRequeueing = false,
}: {
  location: PartnerLocation;
  onRequeue?: () => void;
  isRequeueing?: boolean;
}) {
  const url = location.has_map_location ? mapUrl(location) : null;
  const displayStatus = getPartnerLocationDisplayStatus(location);

  if (displayStatus === "PROCESSING") {
    return (
      <div className="flex items-center gap-2">
        <StatusBadge status="PROCESSING" label="Sincronizando" />
        <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (displayStatus === "PENDING") {
    return (
      <div className="flex items-center gap-2">
        <StatusBadge status="PENDING" label="Em fila" />
        <Timer className="size-3.5 text-muted-foreground" />
      </div>
    );
  }

  if (displayStatus === "CONFIGURED" && url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full border border-cms-step-done bg-cms-step-done px-2 py-0.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
      >
        <MapPin className="size-3.5" />
        Configurada
        <ExternalLink className="size-3" />
      </a>
    );
  }

  const badge = <StatusBadge status="INACTIVE" label="Não configurada" />;
  if (!onRequeue) return badge;

  return (
    <button
      type="button"
      title="Enviar novamente para a fila de geocodificação"
      aria-label={`Enviar ${location.name} novamente para a fila de geocodificação`}
      onClick={onRequeue}
      disabled={isRequeueing}
      className="disabled:cursor-wait disabled:opacity-60"
    >
      {badge}
    </button>
  );
}
