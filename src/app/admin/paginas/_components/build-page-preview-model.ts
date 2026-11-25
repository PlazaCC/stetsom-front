import type {
  FaqItem,
  HeroBannerSlide,
  I18nString,
  PageBlock,
  GetApiPartnerLocations200Item,
  PublicDepartmentItem,
  ProductCardItem,
  PublicCategory,
} from "@/api/stetsom/model";
import type { PublicWarrantyFloatConfig } from "@/api/stetsom/model/publicWarrantyFloatConfig";
import type { HomePageViewData } from "@/app/[locale]/(site)/_components/home-page-view";
import type { FeaturedTabDraft } from "./featured-tabs-validation";
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
  categoryProducts: Record<string, ProductCardItem[]>,
  coverUrls: Record<string, string>,
  selectedProducts: Array<ProductCardItem & { category_id: string }>,
): HomePageViewData["novelties"] {
  const saved = Array.isArray(block?.data?.tabs)
    ? (block.data.tabs as FeaturedTabDraft[])
    : [];
  const tabs: FeaturedTabDraft[] = [
    ...(!saved.some((tab) => tab.category_id === "novidades")
      ? [
          {
            category_id: "novidades",
            mode: "recent" as const,
            hidden: block?.data?.show_novelties_tab !== true,
            product_ids: [],
          },
        ]
      : []),
    ...saved,
    ...categories
      .filter(
        (category) => !saved.some((tab) => tab.category_id === category.id),
      )
      .map((category) => ({
        category_id: category.id,
        mode: "recent" as const,
        product_ids: [],
      })),
  ];
  const configuredTabs = tabs.flatMap((tab) => {
    const isNovelties = tab.category_id === "novidades";
    const category = isNovelties
      ? { id: "novidades", name: "Novidades", slug: "novidades" }
      : categories.find((item) => item.id === tab.category_id);
    if (!category || tab.hidden) return [];
    const candidates = isNovelties
      ? availableProducts
      : (categoryProducts[category.id] ?? []);
    const products =
      tab.mode === "recent"
        ? candidates.slice(0, 5)
        : tab.product_ids.flatMap((id) => {
            const product =
              selectedProducts.find(
                (item) =>
                  item.id === id &&
                  (isNovelties || item.category_id === category.id),
              ) ?? candidates.find((item) => item.id === id);
            if (!product) return [];
            const coverId = tab.covers?.find(
              (cover) => cover.product_id === id,
            )?.cover_library_id;
            return [
              {
                ...product,
                highlight_url:
                  (coverId && coverUrls[coverId]) || product.highlight_url,
              },
            ];
          });
    if (!products.length) return [];
    return [
      {
        slug: category.slug,
        name: category.name,
        spotlight: products[0]!,
        grid: products.slice(1),
      },
    ];
  });
  return configuredTabs;
}

export function buildPagePreviewModel(
  pageId: string,
  blocks: PageBlock[],
  banners: HeroBannerSlide[],
  serviceCenters: GetApiPartnerLocations200Item[],
  departments: PublicDepartmentItem[],
  publicBlocks?: PageBlock[],
  faqItems?: FaqItem[],
  categories: PublicCategory[] = [],
  availableProducts: ProductCardItem[] = [],
  warrantyFloat?: PublicWarrantyFloatConfig,
  categoryProducts: Record<string, ProductCardItem[]> = {},
  coverUrls: Record<string, string> = {},
  selectedProducts: Array<ProductCardItem & { category_id: string }> = [],
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
            categoryProducts,
            coverUrls,
            selectedProducts,
          ),
          warrantyFloat,
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
          warrantyHref: warrantyFloat?.href,
          downloadCategories: [],
          downloads: [],
          downloadsPage: 1,
          downloadsTotal: 0,
          downloadsTotalPages: 0,
          downloadsQuery: "",
        },
      };
    default:
      return null;
  }
}
