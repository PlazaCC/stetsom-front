import type { FieldSpec } from "./section-field-spec";

export type FeaturedTabDraft = import("@/api/stetsom/model").FeaturedTabConfig;

export function featuredTabError(tab: FeaturedTabDraft): string | null {
  if (!tab.category_id) return "Selecione uma categoria.";
  if (
    !tab.hidden &&
    (tab.mode ?? "manual") === "manual" &&
    tab.product_ids.length === 0
  )
    return "Adicione ao menos 1 produto publicado ou selecione produtos recentes.";
  return null;
}

export function hasInvalidFeaturedTabs(
  fields: FieldSpec[],
  data: Record<string, unknown>,
): boolean {
  return fields.some(
    (field) =>
      field.kind === "featured-tabs" &&
      Array.isArray(data[field.key]) &&
      (data[field.key] as FeaturedTabDraft[]).some(
        (tab) => featuredTabError(tab) !== null,
      ),
  );
}
