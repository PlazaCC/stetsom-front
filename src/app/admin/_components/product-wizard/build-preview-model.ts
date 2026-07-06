import type {
  Attribute,
  I18nString,
  ProductBlock,
  ProductFile,
  ProductImage,
  PublicVariant,
} from "@/api/stetsom/model";
import type { ProductDetailViewData } from "@/app/[locale]/(site)/produtos/[slug]/_components/product-detail-view";
import type { WizardState } from "./wizard-store";

/** Locale rendered in the live preview. The CMS edits all locales; preview shows pt. */
const PREVIEW_LOCALE = "pt" as const;

/** A category as carried by the wizard. Its name is already locale-resolved. */
export interface PreviewCategory {
  id: string;
  name: string;
}

function pick(value?: I18nString | null): string {
  return value?.[PREVIEW_LOCALE] ?? "";
}

/**
 * Project the in-memory wizard state onto the public product payload the detail
 * view renders. Image URLs stay as the wizard's local `blob:`/remote previews so
 * an unsaved product previews live, before any upload or save.
 */
export function buildPreviewModel(
  state: WizardState,
  categories: PreviewCategory[],
  attributes: Attribute[],
): ProductDetailViewData {
  const category = categories.find((c) => c.id === state.category_id);

  function resolveAttrName(
    spec: WizardState["variations"][number]["specs"][number],
  ): string | undefined {
    if (spec.attribute_name) return pick(spec.attribute_name);
    const attr = attributes.find((a) => a.id === spec.attribute_id);
    return attr ? pick(attr.name) : undefined;
  }

  const variants: PublicVariant[] = state.variations.map((v) => ({
    variant_id: v.id,
    name: v.label,
    order: v.order,
    attributes: v.specs
      .filter((s) => s.attribute_id || pick(s.value))
      .map((s) => ({
        attribute_id: s.attribute_id || s.id,
        attribute_name: resolveAttrName(s),
        value: pick(s.value),
        order: s.order,
        highlighted: s.highlighted,
      })),
  }));

  const highlightIds = new Set<string>();
  for (const v of state.variations) {
    for (const s of v.specs) {
      if (s.highlighted && s.attribute_id) highlightIds.add(s.attribute_id);
    }
  }

  const now = new Date().toISOString();

  const images: ProductImage[] = state.images.map((img, i) => ({
    image_id: img.id,
    library_id: img.image_id ?? "",
    image_url: img.preview_url,
    order: img.order ?? i,
    created_at: now,
  }));

  const page_blocks: ProductBlock[] = state.blocks.map((b) => ({
    block_id: b.id,
    type: b.type as ProductBlock["type"],
    order: b.order,
    data: b.data as ProductBlock["data"],
  }));

  const files: ProductFile[] = state.files.map((f) => ({
    file_id: f.file_id ?? f.id,
    library_id: f.library_id,
    file_url: f.file_url,
    filename: f.filename ?? null,
    type: f.type,
    is_active: f.is_active,
    created_at: now,
  }));

  return {
    product: {
      name: pick(state.name) || "Produto sem nome",
      description: pick(state.description) || null,
      images,
      variants,
      page_blocks,
      files,
      highlight_attributes: [...highlightIds],
    },
    category: {
      name: category?.name ?? "",
      slug: "",
    },
    relatedProducts: [],
  };
}
