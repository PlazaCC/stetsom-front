import { cn } from "@/lib/utils";
import type { SpecEntry } from "@/lib/specs/matrix";

interface SpecValueProps {
  /** Lines this variant records for the attribute, in CMS order. */
  entries: SpecEntry[];
  className?: string;
}

/**
 * A single cell of the technical specifications table.
 *
 * One line without a description renders as plain text. Anything else stacks,
 * with each description set beneath its title in smaller type.
 */
export function SpecValue({ entries, className }: SpecValueProps) {
  if (entries.length === 0) return <span className={className}>—</span>;

  const only = entries.length === 1 ? entries[0]! : null;
  if (only && !only.description) {
    return <span className={className}>{only.title}</span>;
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {entries.map((entry, i) => (
        <div key={`${entry.title}-${i}`}>
          <div className="font-sans text-sm font-bold text-brand-dark">
            {entry.title}
          </div>
          {entry.description && (
            <div className="font-sans-condensed text-2xs leading-tight font-semibold text-text-subtle uppercase">
              {entry.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
