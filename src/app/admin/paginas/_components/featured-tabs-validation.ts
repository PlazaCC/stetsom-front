import type { FieldSpec } from "./section-field-spec";

export interface FeaturedTabDraft {
  category_id: string;
  product_ids: string[];
}

// Mirrors validateFeaturedTabs in stetsom-api: each tab needs a category and 1–5 products.
export function featuredTabError(tab: FeaturedTabDraft): string | null {
  if (!tab.category_id) {
    return "Selecione a categoria desta aba e adicione ao menos 1 produto, ou remova a aba.";
  }
  if (tab.product_ids.length === 0) {
    return "Adicione ao menos 1 produto publicado a esta aba, ou remova a aba.";
  }
  return null;
}

/** Whether any `featured-tabs` field in the section draft has an incomplete tab. */
export function hasInvalidFeaturedTabs(
  fields: FieldSpec[],
  data: Record<string, unknown>,
): boolean {
  return fields.some((field) => {
    if (field.kind !== "featured-tabs") return false;
    const tabs = data[field.key];
    return (
      Array.isArray(tabs) &&
      (tabs as FeaturedTabDraft[]).some((tab) => featuredTabError(tab) !== null)
    );
  });
}
