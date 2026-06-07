import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "muted" | "info";

const TONE_CLASS: Record<Tone, string> = {
  success: "border-cms-step-done bg-cms-step-done text-white",
  warning: "border-amber-400 bg-amber-100 text-amber-700",
  muted: "border-border bg-muted text-muted-foreground",
  info: "border-cms-active-item bg-cms-active-item text-foreground",
};

/** Status → label + tone, covering product and banner status enums. */
const STATUS_MAP: Record<string, { label: string; tone: Tone }> = {
  PUBLISHED: { label: "Publicado", tone: "success" },
  ACTIVE: { label: "Ativo", tone: "success" },
  DRAFT: { label: "Rascunho", tone: "warning" },
  SCHEDULED: { label: "Agendado", tone: "info" },
  INACTIVE: { label: "Inativo", tone: "muted" },
  DISCONTINUED: { label: "Descontinuado", tone: "muted" },
};

interface StatusBadgeProps {
  status: string;
  /** Override the resolved label. */
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const entry = STATUS_MAP[status] ?? { label: status, tone: "muted" as Tone };
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-xs font-medium",
        TONE_CLASS[entry.tone],
        className,
      )}
    >
      {label ?? entry.label}
    </span>
  );
}
