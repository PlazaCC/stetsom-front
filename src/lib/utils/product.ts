type TextBlockData = { title?: string; content?: string; align?: string };
type ImageBlockData = {
  images?: string[];
  caption?: string;
  layout?: "full" | "side";
};
type GalleryBlockData = { images: string[] };
type Model3dBlockData = {
  url?: string;
  backgroundColor?: string;
  backgroundImage?: string;
};

/**
 * Universal per-block styling, shared by every block type and edited in the CMS
 * "Estilização" tab. Stored under the reserved `data.style` key so it never
 * collides with a block's own content fields.
 */
export type BlockStyle = {
  /** Drop the horizontal page gutter so content spans edge to edge. */
  fullWidth?: boolean;
  backgroundColor?: string;
  /** Resolved public URL of the background image. */
  backgroundImageUrl?: string;
  /**
   * Optional author-supplied id. Overrides the auto id (block_id) on the root
   * `<article>` and as the CSS scope key. The auto id is never removed.
   */
  customId?: string;
  /**
   * Author-supplied CSS targeting the block's BEM classes (e.g.
   * `.blockText__paragraph { ... }`). Scoped to this block instance on render.
   */
  customCss?: string;
};

/**
 * BEM classes baked into each block's HTML structure. Authors target these in
 * the "Estilização" CSS field. Keep in sync with the block components under
 * `produtos/[slug]/_components/blocks/`.
 */
export const BLOCK_BEM_CLASSES: Record<
  string,
  { base: string; elements: string[] }
> = {
  TEXT: {
    base: "blockText",
    elements: ["blockText__title", "blockText__paragraph"],
  },
  IMAGE: {
    base: "blockImage",
    elements: [
      "blockImage__title",
      "blockImage__description",
      "blockImage__content",
      "blockImage__item",
      "blockImage__image",
      "blockImage__caption",
    ],
  },
  VIDEO: {
    base: "blockVideo",
    elements: [
      "blockVideo__label",
      "blockVideo__title",
      "blockVideo__description",
      "blockVideo__embed",
      "blockVideo__link",
    ],
  },
  HTML: { base: "blockHtml", elements: [] },
  MODEL3D: { base: "blockModel3d", elements: [] },
  GALLERY: {
    base: "blockGallery",
    elements: [
      "blockGallery__title",
      "blockGallery__description",
      "blockGallery__grid",
      "blockGallery__item",
      "blockGallery__image",
    ],
  },
};

function isStringArray(v: unknown): v is string[] {
  return (
    Array.isArray(v) && v.every((i) => typeof i === "string" && i.length > 0)
  );
}

export function toTextBlockData(data: Record<string, unknown>): TextBlockData {
  return {
    title: typeof data.title === "string" ? data.title : undefined,
    content: typeof data.content === "string" ? data.content : undefined,
    align: typeof data.align === "string" ? data.align : undefined,
  };
}

/**
 * Optional title + description shared by TEXT, IMAGE, VIDEO and GALLERY blocks.
 */
export function toBlockHeading(data: Record<string, unknown>): {
  title?: string;
  description?: string;
} {
  const str = (v: unknown): string | undefined =>
    typeof v === "string" && v.length > 0 ? v : undefined;
  return { title: str(data.title), description: str(data.description) };
}

export function toImageBlockData(
  data: Record<string, unknown>,
): ImageBlockData {
  return {
    images: isStringArray(data.images) ? data.images : undefined,
    caption: typeof data.caption === "string" ? data.caption : undefined,
    layout: data.layout === "side" ? "side" : "full",
  };
}

/**
 * GALLERY block images. The CMS block-builder stores each image as
 * `{ library_id, file_url? }`; the public API may already resolve them to plain
 * URL strings. Accept both shapes and return the non-empty URLs.
 */
export function toGalleryBlockData(
  data: Record<string, unknown>,
): GalleryBlockData {
  const raw = Array.isArray(data.images) ? data.images : [];
  const images = raw
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && "file_url" in item) {
        const url = (item as { file_url?: unknown }).file_url;
        return typeof url === "string" ? url : "";
      }
      return "";
    })
    .filter((url) => url.length > 0);
  return { images };
}

/**
 * MODEL3D block data. The CMS block-builder stores `{ modelFile, file_url,
 * backgroundColor, backgroundImage, backgroundImageUrl }`; the public API
 * resolves asset references to plain URLs. Read the GLB URL plus the optional
 * background color and background image URL.
 */
export function toModel3dBlockData(
  data: Record<string, unknown>,
): Model3dBlockData {
  const str = (v: unknown): string | undefined =>
    typeof v === "string" && v.length > 0 ? v : undefined;
  return {
    url: str(data.file_url),
    backgroundColor: str(data.backgroundColor),
    backgroundImage: str(data.backgroundImageUrl),
  };
}

/**
 * Build a YouTube embed URL from any common YouTube link shape (watch, youtu.be,
 * embed, shorts, /v/). Returns `null` when the input isn't a recognizable
 * YouTube URL.
 */
export function getYouTubeEmbedUrl(
  url: string | undefined | null,
): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

/**
 * Extract the universal block styling from `data.style`. Tolerates a missing or
 * malformed `style` key and returns only the non-empty values.
 */
export function toBlockStyle(data: Record<string, unknown>): BlockStyle {
  const style =
    data.style && typeof data.style === "object"
      ? (data.style as Record<string, unknown>)
      : {};
  const str = (v: unknown): string | undefined =>
    typeof v === "string" && v.length > 0 ? v : undefined;
  return {
    fullWidth: style.fullWidth === true,
    backgroundColor: str(style.backgroundColor),
    backgroundImageUrl: str(style.backgroundImageUrl),
    customId: str(style.customId),
    customCss: str(style.customCss),
  };
}

function escapeCssAttrValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/**
 * Prefix every selector in `css` with `scopePrefix`, walking brace depth so
 * nested `@media`/`@supports`/`@container` rules are scoped recursively.
 * `@keyframes`, `@font-face` and other at-rules pass through unchanged.
 */
function prefixSelectors(css: string, scopePrefix: string): string {
  const out: string[] = [];
  const n = css.length;
  let i = 0;

  while (i < n) {
    const preludeStart = i;
    while (i < n && css[i] !== "{" && css[i] !== "}") i++;
    const prelude = css.slice(preludeStart, i).trim();

    if (css[i] !== "{") {
      i++; // skip a stray '}' or reach the end
      continue;
    }

    const bodyStart = i + 1;
    let depth = 1;
    i = bodyStart;
    while (i < n && depth > 0) {
      if (css[i] === "{") depth++;
      else if (css[i] === "}" && --depth === 0) break;
      i++;
    }
    const body = css.slice(bodyStart, i);
    i++; // skip the closing '}'

    if (!prelude) continue;

    if (prelude.startsWith("@")) {
      const lower = prelude.toLowerCase();
      if (
        lower.startsWith("@media") ||
        lower.startsWith("@supports") ||
        lower.startsWith("@container")
      ) {
        out.push(`${prelude} {\n${prefixSelectors(body, scopePrefix)}\n}`);
      } else {
        out.push(`${prelude} {${body}}`);
      }
      continue;
    }

    const scopedSelector = prelude
      .split(",")
      .map((s) => `${scopePrefix} ${s.trim()}`)
      .join(", ");
    out.push(`${scopedSelector} {${body}}`);
  }

  return out.join("\n");
}

/**
 * Scope author-written CSS to a single block instance. Each selector is
 * prefixed with `[data-block-scope="<scope>"]` so a rule like
 * `.blockText__paragraph { ... }` only affects this block. Returns an empty
 * string when there is nothing to scope.
 */
/**
 * Strips constructs that let author-written CSS reach outside its own
 * declarations: `@import` (loads an external stylesheet) and `javascript:`/
 * `expression(...)` values (legacy CSS→script injection vectors).
 */
function sanitizeBlockCss(css: string): string {
  return css
    .replace(/@import\s+[^;]+;/gi, "")
    .replace(/expression\s*\([^)]*\)/gi, "")
    .replace(/url\s*\(\s*['"]?\s*javascript:[^)]*\)/gi, "");
}

export function scopeBlockCss(css: string | undefined, scope: string): string {
  if (!css || !css.trim()) return "";
  const prefix = `[data-block-scope="${escapeCssAttrValue(scope)}"]`;
  return prefixSelectors(sanitizeBlockCss(css), prefix);
}

export function resolveTextAlignClass(align: string | undefined): string {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
}

export function formatSpecKey(key: string): string {
  return key.replace(/_/g, " ");
}
