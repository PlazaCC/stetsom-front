import type { DraftBlock } from "@/app/admin/_components/crud/block-manager";
import type {
  CmsProductDetailPayload,
  I18nString,
  LibraryAssetType,
  LocaleInput,
  PostApiProductsBody,
  ProductStatus,
  Template,
} from "@/api/stetsom/model";
import { decodeHtmlEntities } from "@/lib/utils/plain-text";
import { reindexByOrder } from "@/lib/utils/reindex";
import { slugify } from "@/lib/utils/slugify";

export type WizardLocale = "pt" | "en" | "es";

export type WizardStep = 1 | 2 | 3 | 4 | 5;

export type WizardMode = "create" | "edit";

/**
 * A product gallery image, always backed by a library asset (`library_id`).
 * `image_id` is set once the link is persisted on the product; new picks carry
 * only the `library_id` until saved.
 */
export interface WizardImage {
  id: string;
  image_id?: string;
  library_id: string;
  preview_url: string;
  order: number;
}

export interface WizardSpec {
  id: string;
  attribute_id: string;
  attribute_name?: I18nString;
  /**
   * Attribute group the line renders under. Required to save; empty only on
   * lines stored before groups existed, until the editor assigns one.
   */
  group_id: string;
  /** Main text of the line — e.g. "1 x 3500W". Required. */
  value: I18nString;
  /** Optional condition shown beneath the value — e.g. "1 OHM". */
  description?: I18nString;
  order: number;
  highlighted: boolean;
}

export interface WizardVariation {
  id: string;
  label: string;
  order: number;
  specs: WizardSpec[];
}

/** A product file linked from the library. `type` groups it into the Certificados / Manuais sections. */
export interface WizardFile {
  id: string;
  file_id?: string;
  library_id: string;
  file_url: string;
  filename?: string;
  type: LibraryAssetType;
  is_active: boolean;
}

export interface WizardState {
  step: WizardStep;
  mode: WizardMode;
  productId: string | null;

  /** Manufacturer stock-keeping unit. Empty string when unset. */
  sku: string;
  name: I18nString;
  slug: string;
  slugTouched: boolean;
  description: I18nString;
  category_id: string;
  line_id: string;
  template_id: string;
  /** iOS App Store link for this product. Empty string when unset. */
  app_store_url: string;
  /** Android Play Store link for this product. Empty string when unset. */
  play_store_url: string;
  is_discontinued: boolean;
  is_export: boolean;
  /** No UI in the wizard. Preserved across edits, default false on create. */
  is_featured: boolean;
  is_spotlight: boolean;
  available_locales: WizardLocale[];
  status: ProductStatus;
  launch_date: string;
  launch_time: string;

  images: WizardImage[];
  variations: WizardVariation[];
  activeVariationId: string;
  blocks: DraftBlock[];
  files: WizardFile[];

  initialImageIds: string[];
  initialBlockIds: string[];
  initialFileIds: string[];

  isDirty: boolean;
}

/** Scalar fields editable through `patch_info`. */
export type WizardInfoPatch = Partial<
  Pick<
    WizardState,
    | "sku"
    | "name"
    | "slug"
    | "description"
    | "category_id"
    | "line_id"
    | "template_id"
    | "app_store_url"
    | "play_store_url"
    | "is_discontinued"
    | "is_export"
    | "is_featured"
    | "is_spotlight"
    | "available_locales"
    | "status"
    | "launch_date"
    | "launch_time"
  >
>;

export type WizardAction =
  | { type: "go_to_step"; step: WizardStep }
  | { type: "patch_info"; patch: WizardInfoPatch }
  | { type: "set_images"; images: WizardImage[] }
  | { type: "set_variations"; variations: WizardVariation[] }
  | { type: "set_active_variation"; id: string }
  | { type: "apply_template"; templateId: string; specs: WizardSpec[] }
  | { type: "set_blocks"; blocks: DraftBlock[] }
  | { type: "insert_block"; block: DraftBlock; index: number }
  | { type: "add_file"; file: WizardFile }
  | { type: "remove_file"; id: string }
  | { type: "toggle_file_active"; id: string }
  | { type: "mark_saved"; productId: string; status: ProductStatus };

const DEFAULT_VARIATION_ID = "variation-default";

export function newSpec(order: number, group_id = ""): WizardSpec {
  return {
    id: `spec-${crypto.randomUUID()}`,
    attribute_id: "",
    group_id,
    value: { pt: "" },
    order,
    highlighted: false,
  };
}

export function newVariation(
  order: number,
  baseSpecs: WizardSpec[] = [],
): WizardVariation {
  return {
    id: `variation-${crypto.randomUUID()}`,
    label: `${order} Ohm`,
    order,
    specs: baseSpecs.map((spec, index) => ({
      id: `spec-${crypto.randomUUID()}`,
      attribute_id: spec.attribute_id,
      attribute_name: spec.attribute_name,
      group_id: spec.group_id,
      value: { pt: "" },
      order: index,
      highlighted: spec.highlighted,
    })),
  };
}

function hydrateVariations(
  detail?: CmsProductDetailPayload,
): WizardVariation[] {
  if (!detail || detail.product.variants.length === 0) {
    return [{ id: DEFAULT_VARIATION_ID, label: "1 Ohm", order: 0, specs: [] }];
  }
  return [...detail.product.variants]
    .sort((a, b) => a.order - b.order)
    .map((v) => ({
      id: v.variant_id,
      label: v.name,
      order: v.order,
      specs: v.attributes
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((a, i) => ({
          id: `attr-${v.variant_id}-${a.attribute_id}-${i}`,
          attribute_id: a.attribute_id,
          attribute_name: a.attribute_name,
          group_id: a.group_id ?? "",
          value: a.value ?? { pt: "" },
          description: a.description ?? undefined,
          order: a.order,
          highlighted: a.highlighted,
        })),
    }));
}

/**
 * Lays a variation's lines out as the template does. `templateSpecs` holds one
 * empty line per template attribute, in template order, each with its group.
 * Lines of attributes outside the template keep their place after the rest.
 */
function mergeTemplateSpecs(
  specs: WizardSpec[],
  templateSpecs: WizardSpec[],
): WizardSpec[] {
  const rank = new Map(templateSpecs.map((s, i) => [s.attribute_id, i]));
  const groupOf = new Map(
    templateSpecs.map((s) => [s.attribute_id, s.group_id]),
  );
  const present = new Set(specs.map((s) => s.attribute_id));

  const merged = [
    ...[...specs]
      .sort((a, b) => a.order - b.order)
      .map((s) => ({
        ...s,
        group_id: groupOf.get(s.attribute_id) ?? s.group_id,
      })),
    ...templateSpecs
      .filter((s) => !present.has(s.attribute_id))
      .map((s) => ({
        ...s,
        id: `spec-${crypto.randomUUID()}`,
        value: { pt: "" },
        description: undefined,
        highlighted: false,
      })),
  ];
  const outside = templateSpecs.length;
  return reindexByOrder(
    merged
      .map((s, index) => ({ s, index }))
      .sort(
        (a, b) =>
          (rank.get(a.s.attribute_id) ?? outside) -
            (rank.get(b.s.attribute_id) ?? outside) || a.index - b.index,
      )
      .map(({ s }) => s),
  );
}

function hydrateImages(detail?: CmsProductDetailPayload): WizardImage[] {
  if (!detail) return [];
  return [...detail.product.images]
    .sort((a, b) => a.order - b.order)
    .map((img) => ({
      id: img.image_id,
      image_id: img.image_id,
      library_id: img.library_id,
      preview_url: img.image_url ?? "",
      order: img.order,
    }));
}

function hydrateBlocks(detail?: CmsProductDetailPayload): DraftBlock[] {
  if (!detail) return [];
  return detail.product.page_blocks
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((b) => ({
      id: b.block_id,
      type: b.type,
      data: (b.data ?? {}) as Record<string, unknown>,
      order: b.order,
    }));
}

function hydrateFiles(detail?: CmsProductDetailPayload): WizardFile[] {
  if (!detail) return [];
  return (detail.product.files ?? []).map((f) => ({
    id: f.file_id,
    file_id: f.file_id,
    library_id: f.library_id,
    file_url: f.file_url ?? "",
    filename: f.filename ?? undefined,
    type: (f.type as LibraryAssetType) ?? "OTHER",
    is_active: f.is_active,
  }));
}

/**
 * Locales the switches start on.
 *
 * Products saved before publishing became explicit may carry an empty
 * `available_locales` — which the API reads as "visible in every locale". For
 * those, fall back to whichever locales actually have a name, so opening and
 * saving a product never silently unpublishes a language.
 */
function initialLocales(
  product?: CmsProductDetailPayload["product"],
): WizardLocale[] {
  const stored = (product?.available_locales as WizardLocale[]) ?? [];
  if (stored.length > 0) return stored;

  const derived: WizardLocale[] = ["pt"];
  for (const locale of ["en", "es"] as const) {
    if (product?.name?.[locale]?.trim()) derived.push(locale);
  }
  return derived;
}

function decodeI18n(value: I18nString): I18nString {
  return {
    pt: decodeHtmlEntities(value.pt),
    ...(value.en !== undefined && { en: decodeHtmlEntities(value.en) }),
    ...(value.es !== undefined && { es: decodeHtmlEntities(value.es) }),
  };
}

export function initWizardState(
  mode: WizardMode,
  detail?: CmsProductDetailPayload,
): WizardState {
  const variations = hydrateVariations(detail);
  const p = detail?.product;

  return {
    step: 1,
    mode,
    productId: p?.id ?? null,

    sku: p?.sku ?? "",
    name: p?.name ?? { pt: "" },
    slug: p?.slug ?? "",
    slugTouched: Boolean(p?.slug),
    // The API stores the description sanitized (`&` → `&amp;`); the textarea
    // edits it as plain text, so it gets the characters back.
    description: p?.description ? decodeI18n(p.description) : { pt: "" },
    category_id: p?.category_id ?? "",
    line_id: p?.line_id ?? "",
    template_id: p?.template_id ?? "",
    app_store_url: p?.app_store_url ?? "",
    play_store_url: p?.play_store_url ?? "",
    is_discontinued: p?.is_discontinued ?? false,
    is_export: p?.is_export ?? false,
    is_featured: p?.is_featured ?? false,
    is_spotlight: p?.is_spotlight ?? false,
    available_locales: initialLocales(p),
    status: p?.status ?? "DRAFT",
    launch_date: p?.launch_date?.split("T")[0] ?? "",
    launch_time: p?.launch_date?.includes("T")
      ? (p.launch_date.split("T")[1]?.slice(0, 5) ?? "")
      : "",

    images: hydrateImages(detail),
    variations,
    activeVariationId: variations[0]!.id,
    blocks: hydrateBlocks(detail),
    files: hydrateFiles(detail),

    initialImageIds: (p?.images ?? []).map((i) => i.image_id),
    initialBlockIds: (p?.page_blocks ?? []).map((b) => b.block_id),
    initialFileIds: (p?.files ?? []).map((f) => f.file_id),

    isDirty: mode === "edit",
  };
}

export function wizardReducer(
  state: WizardState,
  action: WizardAction,
): WizardState {
  switch (action.type) {
    case "go_to_step":
      return { ...state, step: action.step };

    case "patch_info": {
      const next: WizardState = { ...state, ...action.patch, isDirty: true };
      if (
        "name" in action.patch &&
        !state.slugTouched &&
        state.mode === "create"
      ) {
        next.slug = slugify(action.patch.name?.pt ?? "");
      }
      if ("slug" in action.patch) {
        next.slugTouched = true;
      }
      if (
        "category_id" in action.patch &&
        action.patch.category_id !== state.category_id
      ) {
        next.line_id = "";
        next.template_id = "";
      }
      return next;
    }

    case "set_images":
      return { ...state, images: action.images, isDirty: true };

    case "set_variations":
      return { ...state, variations: action.variations, isDirty: true };

    case "set_active_variation":
      return { ...state, activeVariationId: action.id };

    case "apply_template":
      // The template defines the table for every variation, so it is merged
      // into all of them: values already typed are kept, missing attributes
      // are added empty, and lines take the template's group and order.
      return {
        ...state,
        isDirty: true,
        template_id: action.templateId,
        variations: state.variations.map((v) => ({
          ...v,
          specs: mergeTemplateSpecs(v.specs, action.specs),
        })),
      };

    case "set_blocks":
      return { ...state, blocks: action.blocks, isDirty: true };

    case "insert_block": {
      const index = Math.max(0, Math.min(action.index, state.blocks.length));
      const next = [...state.blocks];
      next.splice(index, 0, action.block);
      return {
        ...state,
        blocks: next.map((b, i) => ({ ...b, order: i })),
        isDirty: true,
      };
    }

    case "add_file":
      return { ...state, files: [...state.files, action.file], isDirty: true };

    case "remove_file":
      return {
        ...state,
        files: state.files.filter((f) => f.id !== action.id),
        isDirty: true,
      };

    case "toggle_file_active":
      return {
        ...state,
        files: state.files.map((f) =>
          f.id === action.id ? { ...f, is_active: !f.is_active } : f,
        ),
        isDirty: true,
      };

    case "mark_saved":
      return {
        ...state,
        productId: action.productId,
        status: action.status,
        isDirty: false,
      };

    default:
      return state;
  }
}

export type PublishIntent = "draft" | "publish";

/** Combine the date and time inputs into an ISO string. Empty date publishes immediately. */
export function combineLaunchDate(date: string, time: string): string | null {
  if (!date) return null;
  return new Date(`${date}T${time || "00:00"}:00`).toISOString();
}

/** Status is derived from the save action and the launch date, never selected directly. */
export function deriveStatus(
  intent: PublishIntent,
  launchISO: string | null,
): ProductStatus {
  if (intent === "draft") return "DRAFT";
  if (launchISO && new Date(launchISO).getTime() > Date.now()) {
    return "SCHEDULED";
  }
  return "PUBLISHED";
}

/**
 * Locales the product is published in. `pt` is always included — it is the
 * fallback locale and the only one the API requires.
 *
 * This used to be inferred from whichever fields happened to have content;
 * publishing is now an explicit choice made in the publish step, and the API
 * rejects a locale whose name is blank.
 */
export function publishedLocales(state: WizardState): LocaleInput[] {
  const set = new Set<WizardLocale>(["pt", ...state.available_locales]);
  return [...set];
}

export function selectProductSlug(
  state: Pick<WizardState, "slug" | "name">,
): string {
  return state.slug || slugify(state.name.pt);
}

export function buildPayload(
  state: WizardState,
  status: ProductStatus,
): PostApiProductsBody {
  const launchISO = combineLaunchDate(state.launch_date, state.launch_time);

  const highlightIds = new Set<string>();
  for (const v of state.variations) {
    for (const s of v.specs) {
      if (s.highlighted && s.attribute_id) highlightIds.add(s.attribute_id);
    }
  }

  return {
    sku: state.sku.trim() || null,
    name: state.name,
    slug: selectProductSlug(state),
    description: state.description.pt ? state.description : undefined,
    category_id: state.category_id,
    line_id: state.line_id || null,
    template_id: state.template_id || null,
    app_store_url: state.app_store_url.trim() || null,
    play_store_url: state.play_store_url.trim() || null,
    status,
    is_discontinued: state.is_discontinued,
    is_export: state.is_export,
    is_featured: state.is_featured,
    is_spotlight: state.is_spotlight,
    launch_date: launchISO,
    highlight_attributes: [...highlightIds],
    available_locales: publishedLocales(state),
    variants: state.variations.map((v) => ({
      variant_id: v.id.startsWith("variation-") ? undefined : v.id,
      name: v.label,
      order: v.order,
      attributes: v.specs
        .filter((s) => s.attribute_id)
        .map((s) => ({
          attribute_id: s.attribute_id,
          group_id: s.group_id,
          value: s.value,
          // Sent as null when blank so clearing it in the CMS actually removes
          // the line beneath the value.
          description: s.description?.pt?.trim() ? s.description : null,
          order: s.order,
          highlighted: s.highlighted,
        })),
    })),
  };
}

/** Minimal view of a template's layout: attribute_id → group_id. */
export type TemplateLayout = Map<string, string>;

export function templateLayoutOf(template?: Template): TemplateLayout | null {
  if (!template) return null;
  return new Map(
    template.groups.flatMap((group) =>
      group.attributes.map((a) => [a.attribute_id, group.group_id] as const),
    ),
  );
}

/**
 * Problems that would make the API refuse the spec lines, phrased for the
 * editor. Checked before saving so the toast names the variation and the
 * attribute instead of a generic validation error.
 */
export function findSpecIssues(
  state: WizardState,
  options: {
    attributeName: (id: string) => string;
    templateLayout: TemplateLayout | null;
    groupName: (id: string) => string;
  },
): string[] {
  const issues: string[] = [];
  for (const variation of state.variations) {
    for (const spec of variation.specs) {
      if (!spec.attribute_id) continue;
      const name = options.attributeName(spec.attribute_id);
      if (!spec.group_id) {
        issues.push(`${variation.label}: defina o grupo de "${name}".`);
        continue;
      }
      const expected = options.templateLayout?.get(spec.attribute_id);
      if (options.templateLayout && !expected) {
        issues.push(
          `${variation.label}: "${name}" não faz parte do template do produto.`,
        );
      } else if (expected && expected !== spec.group_id) {
        issues.push(
          `${variation.label}: no template, "${name}" fica em "${options.groupName(expected)}".`,
        );
      }
    }
  }
  return [...new Set(issues)];
}
