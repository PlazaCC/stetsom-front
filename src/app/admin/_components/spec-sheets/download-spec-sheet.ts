import { orvalClient } from "@/api/stetsom/orval-client";

/**
 * Downloads the fill-in spec workbook of a template — one sheet per variant
 * name, with the template's groups and attributes pre-filled by id.
 *
 * Goes through the regular BFF client with a blob response; the generated
 * `getApiSpecSheetsTemplatesId` would parse the binary body as JSON.
 */
export async function downloadTemplateSpecSheet(
  templateId: string,
  options: { variantNames?: string[]; filename: string },
) {
  const variants = options.variantNames
    ?.map((name) => name.trim())
    .filter(Boolean)
    .join(",");
  const blob = await orvalClient<Blob>({
    url: `/api/spec-sheets/templates/${templateId}`,
    method: "GET",
    params: variants ? { variants } : undefined,
    responseType: "blob",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = options.filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/**
 * Downloads the spec workbook of a product with its saved values filled in —
 * one sheet per variant, the same layout the template download and the import
 * use, so the file can be edited and re-imported. Reflects the last saved
 * state, not unsaved wizard edits.
 *
 * Blob response for the same reason as the template download: the generated
 * `getApiSpecSheetsProductsId` would parse the binary body as JSON.
 */
export async function downloadProductSpecSheet(
  productId: string,
  options: { variantNames?: string[]; filename: string },
) {
  const variants = options.variantNames
    ?.map((name) => name.trim())
    .filter(Boolean)
    .join(",");
  const blob = await orvalClient<Blob>({
    url: `/api/spec-sheets/products/${productId}`,
    method: "GET",
    params: variants ? { variants } : undefined,
    responseType: "blob",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = options.filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/** File-safe slug for the downloaded workbook name. */
export function specSheetFilename(name: string): string {
  const slug = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return `especificacoes-${slug || "produto"}.xlsx`;
}
