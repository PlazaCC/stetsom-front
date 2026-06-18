import type { DraftBlock } from "@/app/admin/_components/crud/block-builder";
import type {
  CmsProductDetailPayload,
  I18nString,
  LibraryAssetType,
  LocaleInput,
  PostApiProductsBody,
  ProductStatus,
} from "@/api/stetsom/model";
import { slugify } from "@/lib/utils/slugify";

export type WizardLocale = "pt" | "en" | "es";

export type WizardStep = 1 | 2 | 3 | 4 | 5;

export type WizardMode = "create" | "edit";

/** A product gallery image — either persisted (`image_id`) or pending upload (`file`). */
export interface WizardImage {
  id: string;
  image_id?: string;
  file?: File;
  preview_url: string;
  order: number;
}

export interface WizardSpec {
  id: string;
  attribute_id: string;
  attribute_name?: I18nString;
  value: I18nString;
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

  name: I18nString;
  slug: I18nString;
  slugTouched: boolean;
  description: I18nString;
  category_id: string;
  line_id: string;
  template_id: string;
  is_discontinued: boolean;
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
    | "name"
    | "slug"
    | "description"
    | "category_id"
    | "line_id"
    | "template_id"
    | "is_discontinued"
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
  | { type: "apply_template"; specs: WizardSpec[] }
  | { type: "set_blocks"; blocks: DraftBlock[] }
  | { type: "add_file"; file: WizardFile }
  | { type: "remove_file"; id: string }
  | { type: "toggle_file_active"; id: string }
  | { type: "mark_saved"; productId: string; status: ProductStatus };

const DEFAULT_VARIATION_ID = "variation-default";

function reindexSpecs(specs: WizardSpec[]): WizardSpec[] {
  return specs.map((s, i) => ({ ...s, order: i }));
}

export function newSpec(order: number): WizardSpec {
  return {
    id: `spec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    attribute_id: "",
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
    id: `variation-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    label: `${order} Ohm`,
    order,
    specs: baseSpecs.map((spec, index) => ({
      id: `spec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${index}`,
      attribute_id: spec.attribute_id,
      attribute_name: spec.attribute_name,
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
          value: a.value ?? { pt: "" },
          order: a.order,
          highlighted: a.highlighted,
        })),
    }));
}

function hydrateImages(detail?: CmsProductDetailPayload): WizardImage[] {
  if (!detail) return [];
  return [...detail.product.images]
    .sort((a, b) => a.order - b.order)
    .map((img) => ({
      id: img.image_id,
      image_id: img.image_id,
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

    name: p?.name ?? { pt: "" },
    slug: p?.slug ?? { pt: "" },
    slugTouched: !!p?.slug?.pt,
    description: p?.description ?? { pt: "" },
    category_id: p?.category_id ?? "",
    line_id: p?.line_id ?? "",
    template_id: p?.template_id ?? "",
    is_discontinued: p?.is_discontinued ?? false,
    is_featured: p?.is_featured ?? false,
    is_spotlight: p?.is_spotlight ?? false,
    available_locales: (p?.available_locales as WizardLocale[]) ?? ["pt"],
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
        next.slug = { pt: slugify(action.patch.name?.pt ?? "") };
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
      return {
        ...state,
        isDirty: true,
        variations: state.variations.map((v) => {
          if (v.id !== state.activeVariationId) return v;
          const existingIds = new Set(
            v.specs.map((s) => s.attribute_id).filter(Boolean),
          );
          const missing = action.specs.filter(
            (s) => !existingIds.has(s.attribute_id),
          );
          if (missing.length === 0) return v;
          const merged = reindexSpecs([
            ...v.specs,
            ...missing.map((s, i) => ({
              ...s,
              id: `spec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              order: v.specs.length + i,
              value: { pt: "" },
              highlighted: false,
            })),
          ]);
          return { ...v, specs: merged };
        }),
      };

    case "set_blocks":
      return { ...state, blocks: action.blocks, isDirty: true };

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

/** Registered locales = pt plus any locale with content in name or description. */
export function deriveLocales(state: WizardState): LocaleInput[] {
  const set = new Set<WizardLocale>(["pt"]);
  for (const loc of ["en", "es"] as const) {
    if (state.name[loc] || state.description[loc]) set.add(loc);
  }
  return [...set];
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
    name: state.name,
    slug: state.slug.pt ? state.slug : { pt: slugify(state.name.pt) },
    description: state.description.pt ? state.description : undefined,
    category_id: state.category_id,
    line_id: state.line_id || null,
    template_id: state.template_id || null,
    status,
    is_discontinued: state.is_discontinued,
    is_featured: state.is_featured,
    is_spotlight: state.is_spotlight,
    launch_date: launchISO,
    highlight_attributes: [...highlightIds],
    available_locales: deriveLocales(state),
    variants: state.variations.map((v) => ({
      variant_id: v.id.startsWith("variation-") ? undefined : v.id,
      name: v.label,
      order: v.order,
      attributes: v.specs
        .filter((s) => s.attribute_id)
        .map((s) => ({
          attribute_id: s.attribute_id,
          value: s.value,
          order: s.order,
          highlighted: s.highlighted,
        })),
    })),
  };
}
