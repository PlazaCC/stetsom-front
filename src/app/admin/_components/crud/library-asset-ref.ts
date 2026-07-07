import type { I18nString, LibraryAsset } from "@/api/stetsom/model";

/** Result of picking an existing asset or finishing an upload in `LibraryAssetPicker`. */
export type LibraryPickedAsset = {
  library_id: string;
  file_url: string;
  alt?: I18nString;
};

/** Loosely-known asset reference — a consumer may only have the id, only the
 *  url, both, or neither (e.g. before the picker resolves a seeded id). */
export type LibraryAssetRef = {
  library_id?: string;
  file_url?: string;
};

/** For persisted schemas with no `library_id` sibling field at all. */
export type LibraryUrlOnlyRef = Pick<LibraryAssetRef, "file_url">;

/** Resolves the asset's current version URL, falling back to the first
 *  version if `current_version_id` doesn't match (e.g. it was deleted). */
export function currentAssetUrl(asset: LibraryAsset): string {
  const v =
    asset.versions.find((x) => x.version_id === asset.current_version_id) ??
    asset.versions[0];
  return v?.file_url ?? "";
}

function strField(data: Record<string, unknown>, key: string): string {
  const v = data[key];
  return typeof v === "string" ? v : "";
}

/** Reads a `{ library_id, file_url }` pair off a dynamic block/section data bag. */
export function readLibraryAssetRef(
  data: Record<string, unknown>,
  keys: { libraryIdKey: string; fileUrlKey: string },
): LibraryAssetRef {
  return {
    library_id: strField(data, keys.libraryIdKey),
    file_url: strField(data, keys.fileUrlKey),
  };
}

/** Writes a picked asset (or its removal) back onto the data bag under the
 *  given key pair, preserving every other field. */
export function writeLibraryAssetRef(
  data: Record<string, unknown>,
  keys: { libraryIdKey: string; fileUrlKey: string },
  asset: LibraryPickedAsset | null,
): Record<string, unknown> {
  return {
    ...data,
    [keys.libraryIdKey]: asset?.library_id ?? "",
    [keys.fileUrlKey]: asset?.file_url ?? "",
  };
}
