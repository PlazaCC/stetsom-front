import type { LibraryAsset } from "@/api/stetsom/model";
import { LibraryAssetType } from "@/api/stetsom/model";
import {
  BadgeCheck,
  Box,
  FileArchive,
  FileText,
  Images,
  LibraryBig,
  Shapes,
  Video,
  type LucideIcon,
} from "lucide-react";

export type Tab =
  | "photos"
  | "videos"
  | "3d-models"
  | "manuals"
  | "catalogs"
  | "certificates"
  | "image-packs"
  | "category-icons";
export type ViewMode = "grid" | "table";

/** Items per page. Numbered pagination lives at the bottom of the scroll area. */
export const PAGE_SIZE = 24;

export interface TabConfig {
  accept: string;
  uploadLabel: string;
  emptyLabel: string;
  emptyDescription: string;
  emptyIcon: LucideIcon;
  searchPlaceholder: string;
  libraryType: LibraryAssetType;
}

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/svg+xml";
const PDF_ACCEPT = "application/pdf";

export const UPLOAD_CONFIG: Record<Tab, TabConfig> = {
  photos: {
    accept: IMAGE_ACCEPT,
    uploadLabel: "Enviar imagens",
    emptyLabel: "Nenhuma foto encontrada.",
    emptyDescription: "Envie fotos para reutilizá-las em produtos e páginas.",
    emptyIcon: Images,
    searchPlaceholder: "Buscar por nome",
    libraryType: LibraryAssetType.IMAGE,
  },
  videos: {
    accept: "video/mp4,video/webm",
    uploadLabel: "Enviar vídeos",
    emptyLabel: "Nenhum vídeo encontrado.",
    emptyDescription: "Envie vídeos para enriquecer produtos e páginas.",
    emptyIcon: Video,
    searchPlaceholder: "Buscar por nome",
    libraryType: LibraryAssetType.VIDEO,
  },
  "3d-models": {
    accept: "model/gltf-binary,model/gltf+json,.glb,.gltf",
    uploadLabel: "Enviar modelos 3D",
    emptyLabel: "Nenhum modelo 3D encontrado.",
    emptyDescription:
      "Envie modelos 3D para apresentar os produtos em detalhes.",
    emptyIcon: Box,
    searchPlaceholder: "Buscar por nome",
    libraryType: LibraryAssetType.MODEL3D,
  },
  manuals: {
    accept: PDF_ACCEPT,
    uploadLabel: "Enviar manuais",
    emptyLabel: "Nenhum manual encontrado.",
    emptyDescription: "Envie manuais para disponibilizá-los aos clientes.",
    emptyIcon: FileText,
    searchPlaceholder: "Buscar por nome",
    libraryType: LibraryAssetType.MANUAL,
  },
  catalogs: {
    accept: PDF_ACCEPT,
    uploadLabel: "Enviar catálogos",
    emptyLabel: "Nenhum catálogo encontrado.",
    emptyDescription: "Envie catálogos para centralizar os materiais da marca.",
    emptyIcon: LibraryBig,
    searchPlaceholder: "Buscar por nome",
    libraryType: LibraryAssetType.CATALOG,
  },
  certificates: {
    accept: PDF_ACCEPT,
    uploadLabel: "Enviar certificados",
    emptyLabel: "Nenhum certificado encontrado.",
    emptyDescription:
      "Envie certificados para manter a documentação acessível.",
    emptyIcon: BadgeCheck,
    searchPlaceholder: "Buscar por nome",
    libraryType: LibraryAssetType.CERTIFICATE,
  },
  "image-packs": {
    accept: "application/zip,application/x-zip-compressed,.zip",
    uploadLabel: "Enviar packs",
    emptyLabel: "Nenhum pack de imagens encontrado.",
    emptyDescription:
      "Envie packs para reunir imagens relacionadas em um arquivo.",
    emptyIcon: FileArchive,
    searchPlaceholder: "Buscar por nome",
    libraryType: LibraryAssetType.IMAGE_PACK,
  },
  "category-icons": {
    accept: "image/svg+xml,image/png,image/webp",
    uploadLabel: "Enviar ícones",
    emptyLabel: "Nenhum ícone de categoria encontrado.",
    emptyDescription:
      "Envie ícones para identificar as categorias do catálogo.",
    emptyIcon: Shapes,
    searchPlaceholder: "Buscar por nome",
    libraryType: LibraryAssetType.CATEGORY_ICON,
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
  return (
    asset.type === LibraryAssetType.IMAGE ||
    asset.type === LibraryAssetType.CATEGORY_ICON
  );
}
