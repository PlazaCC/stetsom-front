import { cn } from "@/lib/utils";
import type { SpecEntry } from "@/lib/specs/matrix";

interface SpecValueProps {
  /** Lines this variant records for the attribute, in CMS order. */
  entries: SpecEntry[];
  /** Smaller type for dense layouts such as the comparator. */
  size?: "default" | "compact";
  className?: string;
}

/**
 * A single cell of the technical specifications table.
 *
 * One line without a description renders as plain text, keeping any line
 * breaks typed in the CMS ("Freq: …" / "Boost: …"). A matrix cell lays its
 * entries side by side, split by a thin rule, each with its description
 * beneath the value:
 *
 *   1 x 3500W │ 1 x 1800W
 *   @1 OHM    │ @2 OHMS
 *
 * Entries wrap to a new line instead of squeezing when the column is narrow.
 */
export function SpecValue({
  entries,
  size = "default",
  className,
}: SpecValueProps) {
  if (entries.length === 0) return <span className={className}>—</span>;

  const only = entries.length === 1 ? entries[0]! : null;
  if (only && !only.description) {
    return (
      <span className={cn("whitespace-pre-line", className)}>{only.title}</span>
    );
  }

  const compact = size === "compact";
  return (
    <div
      className={cn(
        "flex flex-wrap items-start",
        compact ? "gap-y-1.5" : "gap-y-2",
        className,
      )}
    >
      {entries.map((entry, i) => (
        <div
          key={`${entry.title}-${i}`}
          className={cn(
            "whitespace-nowrap",
            i > 0 && "border-l border-brand-dark/30",
            compact ? "px-2 first:pl-0" : "px-3 first:pl-0",
          )}
        >
          <div
            className={cn(
              "font-sans font-bold text-brand-dark",
              compact ? "text-2xs" : "text-sm",
            )}
          >
            {entry.title}
          </div>
          {entry.description && (
            <div
              className={cn(
                "font-sans-condensed font-semibold text-text-subtle uppercase",
                compact ? "text-[0.625rem]" : "text-2xs",
                // After the size: tailwind-merge drops a line height that
                // precedes a font-size class.
                "leading-tight",
              )}
            >
              {entry.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
