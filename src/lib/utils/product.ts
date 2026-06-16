type TextBlockData = { title?: string; content?: string; align?: string };
type ImageBlockData = { images?: string[]; caption?: string };
type GalleryBlockData = { images: string[] };

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

export function toImageBlockData(
  data: Record<string, unknown>,
): ImageBlockData {
  return {
    images: isStringArray(data.images) ? data.images : undefined,
    caption: typeof data.caption === "string" ? data.caption : undefined,
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

export function resolveTextAlignClass(align: string | undefined): string {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
}

export function formatSpecKey(key: string): string {
  return key.replace(/_/g, " ");
}
