/**
 * Reading the technical specifications table.
 *
 * MATRIX attributes are rendered as stacked cells. Each line carries its own
 * title and an optional description shown smaller beneath it:
 *
 *   Potência Máxima @ 14,4V   →   "1 x 3500W"  /  "1 OHM"
 *                                 "1 x 1800W"  /  "2 OHMS"
 *
 * Both parts are stored as separate fields, so nothing is parsed out of the
 * text. A line without a title is dropped: there is nothing to render.
 */

export type SpecEntry = {
  /** Main text, rendered at full size — e.g. "1 x 3500W". Required. */
  title: string;
  /** Condition it applies under, rendered smaller — e.g. "1 OHM". Optional. */
  description?: string;
};

/** Minimal shape shared by public and CMS variant attributes. */
type AttributeLike = {
  attribute_id: string;
  order: number;
  value: string;
  description?: string | null;
  attribute_type?: "TEXT" | "MATRIX";
};

/**
 * The lines a variant records for one attribute, in CMS order.
 *
 * Repetition is meaningful — it is how a matrix cell is built — so callers must
 * collect all matches instead of taking the first one.
 */
export function entriesForAttribute(
  attributes: AttributeLike[] | undefined,
  attributeId: string,
): SpecEntry[] {
  if (!attributes) return [];

  return attributes
    .filter((a) => a.attribute_id === attributeId)
    .sort((a, b) => a.order - b.order)
    .map((a) => ({
      title: a.value?.trim() ?? "",
      description: a.description?.trim() || undefined,
    }))
    .filter((entry) => entry.title !== "");
}

/** Single-line rendering for dense layouts that cannot stack entries. */
export function entriesToInlineText(entries: SpecEntry[]): string {
  return entries
    .map((e) => (e.description ? `${e.title} (${e.description})` : e.title))
    .join(" · ");
}
