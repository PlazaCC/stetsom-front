/**
 * Layout of the technical specifications table: sections (attribute groups),
 * each with its rows (attributes), shared by the product page, the comparator
 * and the CMS preview.
 *
 * Spec lines arrive flat per variant. The API keeps the lines of a group
 * contiguous, so a section's position is where its first line appears; an
 * attribute shows up once, in the section where it is first seen.
 */

export type SpecRow = {
  attribute_id: string;
  attribute_name?: string | null;
};

export type SpecSection = {
  /** Null for lines saved before groups existed — rendered without a title. */
  group_id: string | null;
  group_name?: string | null;
  rows: SpecRow[];
};

/** Minimal shape shared by public and CMS-preview spec lines. */
type SpecLineLike = {
  attribute_id: string;
  attribute_name?: string | null;
  group_id?: string | null;
  group_name?: string | null;
  order: number;
};

/**
 * Union of the sections and rows recorded by every variant given — one
 * product's variants, or several products' when comparing — in first-seen
 * order.
 */
export function buildSpecSections(
  variants: Array<{ attributes: SpecLineLike[] }>,
): SpecSection[] {
  const sections: SpecSection[] = [];
  const sectionByKey = new Map<string, SpecSection>();
  const seenAttributes = new Set<string>();

  for (const variant of variants) {
    const lines = [...variant.attributes].sort((a, b) => a.order - b.order);
    for (const line of lines) {
      if (seenAttributes.has(line.attribute_id)) continue;
      seenAttributes.add(line.attribute_id);

      const key = line.group_id ?? "";
      let section = sectionByKey.get(key);
      if (!section) {
        section = {
          group_id: line.group_id ?? null,
          group_name: line.group_name,
          rows: [],
        };
        sectionByKey.set(key, section);
        sections.push(section);
      }
      section.group_name ??= line.group_name;
      section.rows.push({
        attribute_id: line.attribute_id,
        attribute_name: line.attribute_name,
      });
    }
  }

  return sections;
}

/** Keeps only the rows `hasRow` accepts, dropping sections left empty. */
export function filterSpecSections(
  sections: SpecSection[],
  hasRow: (attributeId: string) => boolean,
): SpecSection[] {
  return sections
    .map((section) => ({
      ...section,
      rows: section.rows.filter((row) => hasRow(row.attribute_id)),
    }))
    .filter((section) => section.rows.length > 0);
}

/**
 * Section titles are shown only when the table actually has groups. A legacy
 * product with no grouped lines renders as a plain list, as it always did.
 */
export function hasGroupedSections(sections: SpecSection[]): boolean {
  return sections.some((section) => section.group_id !== null);
}
