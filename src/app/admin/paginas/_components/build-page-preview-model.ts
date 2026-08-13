import type {
  FaqItem,
  HeroBannerSlide,
  I18nString,
  PageBlock,
  PartnerLocation,
  PublicDepartmentItem,
  ProductCardItem,
  PublicCategory,
} from "@/api/stetsom/model";
import type { HomePageViewData } from "@/app/[locale]/(site)/_components/home-page-view";
import type { PagePreviewModel } from "./page-editor-target";
import { findSectionDef, type FieldSpec } from "./section-field-spec";

const PREVIEW_LOCALE: keyof I18nString = "pt";

function resolveFieldValue(value: unknown, field: FieldSpec): unknown {
  switch (field.kind) {
    case "i18n": {
      if (typeof value === "string") return value;
      const i18n = value as I18nString | undefined;
      return i18n?.[PREVIEW_LOCALE] ?? i18n?.pt ?? "";
    }
    case "group":
      return resolveSectionData(
        (value as Record<string, unknown>) ?? {},
        field.fields,
      );
    case "faq-items":
      return null;
    case "list": {
      const items = Array.isArray(value)
        ? (value as Record<string, unknown>[])
        : [];
      return items.map((item) => resolveSectionData(item, field.itemFields));
    }
    default:
      return value;
  }
}

function resolveSectionData(
  data: Record<string, unknown>,
  fields: FieldSpec[],
): Record<string, unknown> {
  const resolved: Record<string, unknown> = { ...data };
  for (const field of fields) {
    if (field.key in resolved) {
      resolved[field.key] = resolveFieldValue(resolved[field.key], field);
    }
  }
  return resolved;
}

function resolveBlock(
  pageId: string,
  block: PageBlock,
  publicBlock?: PageBlock,
): PageBlock {
  const def = findSectionDef(pageId, block.section_id);
  if (!def) return block;
  const adminData = (block.data as Record<string, unknown>) ?? {};
  const publicData = publicBlock
    ? ((publicBlock.data as Record<string, unknown>) ?? {})
    : {};
  const merged =
    def.kind === "auto" ? { ...publicData, ...adminData } : adminData;
  return {
    ...block,
    data: resolveSectionData(merged, def.fields),
  };
}

function buildPreviewNovelties(
  block: PageBlock | undefined,
  categories: PublicCategory[],
  availableProducts: ProductCardItem[],
): HomePageViewData["novelties"] {
  const tabs =
    block?.data && typeof block.data === "object" && "tabs" in block.data
      ? (block.data.tabs as Array<{
          category_id?: string;
          product_ids?: string[];
        }>)
      : [];
  return tabs.flatMap((tab) => {
    const category =
      tab.category_id === "novidades"
        ? { id: "novidades", name: "Novidades", slug: "novidades" }
        : categories.find((item) => item.id === tab.category_id);
    const products = Array.isArray(tab.product_ids)
      ? tab.product_ids.flatMap((id) =>
          availableProducts.filter((product) => product.id === id),
        )
      : [];
    if (tab.category_id === "novidades") {
      products.sort(
        (a, b) =>
          availableProducts.findIndex((product) => product.id === a.id) -
          availableProducts.findIndex((product) => product.id === b.id),
      );
    }
    if (!category || products.length === 0) return [];
    return [
      {
        slug: category.slug,
        name: category.name,
        spotlight: products[0]!,
        grid: products.slice(1),
      },
    ];
  });
}

export function buildPagePreviewModel(
  pageId: string,
  blocks: PageBlock[],
  banners: HeroBannerSlide[],
  serviceCenters: PartnerLocation[],
  departments: PublicDepartmentItem[],
  publicBlocks?: PageBlock[],
  faqItems?: FaqItem[],
  categories: PublicCategory[] = [],
  availableProducts: ProductCardItem[] = [],
): PagePreviewModel | null {
  const resolvedBlocks = blocks.map((b) => {
    const pb = publicBlocks?.find((p) => p.section_id === b.section_id);
    return resolveBlock(pageId, b, pb);
  });

  switch (pageId) {
    case "home":
      return {
        pageId: "home",
        data: {
          blocks: resolvedBlocks,
          banners,
          faqItems: faqItems ?? [],
          novelties: buildPreviewNovelties(
            resolvedBlocks.find((block) => block.section_id === "featured"),
            categories,
            availableProducts,
          ),
        },
      };
    case "about":
      return { pageId: "about", data: { blocks: resolvedBlocks } };
    case "support":
      return {
        pageId: "support",
        data: {
          blocks: resolvedBlocks,
          serviceCenters,
          departments,
          faqItems: faqItems ?? [],
        },
      };
    default:
      return null;
  }
}
