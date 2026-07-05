import type { LibraryAsset } from "@/api/stetsom/model";
import { LibraryAssetType } from "@/api/stetsom/model";

export type Tab = "photos" | "manuals" | "3d-models";
export type ViewMode = "grid" | "table";

/** Items per page. Numbered pagination lives at the bottom of the scroll area. */
export const PAGE_SIZE = 24;

export interface TabConfig {
  accept: string;
  uploadLabel: string;
  emptyLabel: string;
  searchPlaceholder: string;
  libraryType: LibraryAssetType;
}

export const UPLOAD_CONFIG: Record<Tab, TabConfig> = {
  photos: {
    accept: "image/jpeg,image/png,image/webp,image/gif,image/svg+xml",
    uploadLabel: "Enviar imagens",
    emptyLabel: "Nenhuma foto encontrada.",
    searchPlaceholder: "Buscar por nome",
    libraryType: LibraryAssetType.IMAGE,
  },
  manuals: {
    accept: "application/pdf",
    uploadLabel: "Enviar PDFs",
    emptyLabel: "Nenhum manual encontrado.",
    searchPlaceholder: "Buscar por nome",
    libraryType: LibraryAssetType.PDF,
  },
  "3d-models": {
    accept: "model/gltf-binary,model/gltf+json,.glb,.gltf",
    uploadLabel: "Enviar modelos 3D",
    emptyLabel: "Nenhum modelo 3D encontrado.",
    searchPlaceholder: "Buscar por nome",
    libraryType: LibraryAssetType.MODEL3D,
  },
};

// ── Version helpers ──────────────────────────────────────────────────────────

export function getCurrentVersion(asset: LibraryAsset) {
  return (
    asset.versions.find((v) => v.version_id === asset.current_version_id) ??
    asset.versions[0]
  );
}

export function getCurrentVersionUrl(asset: LibraryAsset): string {
  return getCurrentVersion(asset)?.file_url ?? "";
}

export function getCurrentVersionSize(asset: LibraryAsset): number {
  return getCurrentVersion(asset)?.size_bytes ?? 0;
}

export function getCurrentVersionDims(asset: LibraryAsset): string | null {
  const v = getCurrentVersion(asset);
  return v?.width && v?.height ? `${v.width}×${v.height}` : null;
}

// ── Formatting ───────────────────────────────────────────────────────────────

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("pt-BR");
}

export function assetAltText(asset: LibraryAsset): string {
  return asset.alt?.pt ?? asset.alt?.en ?? asset.filename;
}

// ── Type helpers ─────────────────────────────────────────────────────────────

export function isImageAsset(asset: LibraryAsset): boolean {
  return asset.type === LibraryAssetType.IMAGE;
}
