import { cn } from "@/lib/utils";
import { BadgeCheck, MapPin, MapPinOff, type LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Tone = "success" | "warning" | "muted" | "info";

const TONE_CLASS: Record<Tone, string> = {
  success: "border-cms-step-done bg-cms-step-done text-white",
  warning: "border-amber-400 bg-amber-100 text-amber-700",
  muted: "border-border bg-muted text-muted-foreground",
  info: "border-cms-active-item bg-cms-active-item text-foreground",
};

/**
 * Status → label + tone. Covers product/banner status enums plus audit-log
 * actions, so every admin surface resolves to one shared badge system.
 */
const STATUS_MAP: Record<string, { label: string; tone: Tone }> = {
  // Content status
  PUBLISHED: { label: "Publicado", tone: "success" },
  ACTIVE: { label: "Ativo", tone: "success" },
  DRAFT: { label: "Rascunho", tone: "warning" },
  SCHEDULED: { label: "Agendado", tone: "info" },
  INACTIVE: { label: "Inativo", tone: "muted" },
  DISCONTINUED: { label: "Descontinuado", tone: "muted" },
  // Audit-log actions
  CREATE: { label: "Criou", tone: "success" },
  PUBLISH: { label: "Publicou", tone: "success" },
  UPDATE: { label: "Editou", tone: "info" },
  DELETE: { label: "Excluiu", tone: "muted" },
  LOGIN: { label: "Entrou", tone: "muted" },
  LOGOUT: { label: "Saiu", tone: "muted" },
};

interface StatusBadgeProps {
  status: string;
  /** Override the resolved label. */
  label?: string;
  /** Short explanation shown on hover/focus. */
  tooltip?: string;
  className?: string;
}

export function StatusBadge({
  status,
  label,
  tooltip,
  className,
}: StatusBadgeProps) {
  const entry = STATUS_MAP[status] ?? { label: status, tone: "muted" as Tone };
  const displayLabel = label ?? entry.label;
  return (
    <Tooltip>
      <TooltipTrigger
        render={<span className="inline-flex max-w-full" tabIndex={0} />}
      >
        <span
          className={cn(
            "inline-flex max-w-full items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
            TONE_CLASS[entry.tone],
            className,
          )}
        >
          <span className="truncate">{displayLabel}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent>{tooltip ?? displayLabel}</TooltipContent>
    </Tooltip>
  );
}

export type LocationMapStatus = "CONFIRMED" | "APPROXIMATE" | "MISSING";

const LOCATION_MAP_STATUS: Record<
  LocationMapStatus,
  { label: string; description: string; icon: LucideIcon; className: string }
> = {
  CONFIRMED: {
    label: "No mapa",
    description:
      "Localização confirmada. Este parceiro pode aparecer no mapa público.",
    icon: BadgeCheck,
    className:
      "border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  APPROXIMATE: {
    label: "Aproximado",
    description:
      "Sugestão do GeoNames ainda não confirmada. Revise o ponto antes de publicar.",
    icon: MapPin,
    className:
      "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300",
  },
  MISSING: {
    label: "Sem dados",
    description:
      "Sem coordenadas. Informe CEP ou cidade para obter uma sugestão e confirme o ponto.",
    icon: MapPinOff,
    className:
      "border-red-200 bg-red-100 text-red-700 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-300",
  },
};

/** Shared location state badge for CMS tables and forms. */
export function LocationMapStatusBadge({
  status,
}: {
  status: LocationMapStatus;
}) {
  const entry = LOCATION_MAP_STATUS[status];
  const Icon = entry.icon;

  return (
    <Tooltip>
      <TooltipTrigger
        render={<span className="inline-flex max-w-full" tabIndex={0} />}
      >
        <span
          className={cn(
            "inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
            entry.className,
          )}
        >
          <Icon className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">{entry.label}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-64 text-center">
        {entry.description}
      </TooltipContent>
    </Tooltip>
  );
}
