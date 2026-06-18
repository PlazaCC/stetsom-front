"use client";

import Link from "next/link";
import { AdminFileUpload } from "@/app/admin/_components/crud/admin-file-upload";
import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import { AdminPagination } from "@/app/admin/_components/crud/admin-pagination";
import { AdminSearchInput } from "@/app/admin/_components/crud/admin-search-input";
import { UploadProgressList } from "@/components/upload-progress-list";
import { AdminConfirmDialog } from "@/app/admin/_components/crud/admin-confirm-dialog";
import { AdminFormSection as AdminCard } from "@/app/admin/_components/crud/admin-form-section";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import {
  AdminInput,
  AdminLabel,
} from "@/app/admin/_components/crud/admin-input";
import {
  deleteApiLibraryId,
  getGetApiLibraryQueryKey,
  patchApiLibraryId,
  useGetApiLibrary,
} from "@/api/stetsom";
import type { I18nString, LibraryAsset } from "@/api/stetsom/model";
import { LibraryAssetType } from "@/api/stetsom/model";
import { useLibraryUpload } from "@/hooks/use-upload";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Archive,
  Check,
  FileText,
  Image,
  Pencil,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { useRef, useState } from "react";

const PAGE_SIZE = 12;

type Tab = "photos" | "manuals" | "3d-models";

const TABS: { id: Tab; label: string }[] = [
  { id: "photos", label: "Fotos" },
  { id: "manuals", label: "Manuais" },
  { id: "3d-models", label: "Arquivos 3D" },
];

// ── Utilidades ─────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function getCurrentVersionUrl(asset: LibraryAsset): string {
  const version = asset.versions.find(
    (v) => v.version_id === asset.current_version_id,
  );
  return version?.file_url ?? asset.versions[0]?.file_url ?? "";
}

function getCurrentVersion(asset: LibraryAsset) {
  return (
    asset.versions.find((v) => v.version_id === asset.current_version_id) ??
    asset.versions[0]
  );
}

function getCurrentVersionSize(asset: LibraryAsset): number {
  return getCurrentVersion(asset)?.size_bytes ?? 0;
}

function getCurrentVersionDims(asset: LibraryAsset): string | null {
  const v = getCurrentVersion(asset);
  return v?.width && v?.height ? `${v.width}×${v.height}` : null;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("pt-BR");
}

function assetAltText(asset: LibraryAsset): string {
  return asset.alt?.pt ?? asset.alt?.en ?? asset.filename;
}

// ── Cards de foto ──────────────────────────────────────────────────────────────

function PhotoCard({
  asset,
  onEdit,
  onDelete,
}: {
  asset: LibraryAsset;
  onEdit: (asset: LibraryAsset) => void;
  onDelete: (asset: LibraryAsset) => void;
}) {
  const [copied, setCopied] = useState(false);
  const fileUrl = getCurrentVersionUrl(asset);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(fileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard não disponível */
    }
  }

  return (
    <div className="group relative flex flex-col gap-3 rounded-[16px] border border-border bg-card p-4">
      <div className="relative flex h-32 items-center justify-center overflow-hidden rounded-md bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fileUrl}
          alt={assetAltText(asset)}
          className="h-full w-full rounded-md object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center rounded-[16px] bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-foreground shadow"
          >
            {copied ? (
              <>
                <Check className="size-3 text-green-600" />
                Copiado
              </>
            ) : (
              "Copiar URL"
            )}
          </button>
        </div>
        <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            aria-label="Editar"
            onClick={() => onEdit(asset)}
            className="flex size-7 items-center justify-center rounded-md bg-white/90 text-foreground shadow hover:bg-white"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label="Excluir"
            onClick={() => onDelete(asset)}
            className="flex size-7 items-center justify-center rounded-md bg-white/90 text-destructive shadow hover:bg-white"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {asset.filename}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatBytes(getCurrentVersionSize(asset))}
          {getCurrentVersionDims(asset)
            ? ` · ${getCurrentVersionDims(asset)}`
            : ""}
          {asset.versions.length > 1 ? ` · v${asset.versions.length}` : ""}
        </p>
        {asset.tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {asset.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded bg-muted px-1.5 py-0.5 text-2xs font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tabela de arquivos ─────────────────────────────────────────────────────────

function FileTable({
  assets,
  onEdit,
  onDelete,
}: {
  assets: LibraryAsset[];
  onEdit: (asset: LibraryAsset) => void;
  onDelete: (asset: LibraryAsset) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Nome
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Versões
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Tamanho
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Enviado em
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {assets.map((asset) => (
            <tr key={asset.id} className="hover:bg-muted/30">
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">{asset.filename}</p>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {asset.versions.length > 0 ? `v${asset.versions.length}` : "—"}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {formatBytes(getCurrentVersionSize(asset))}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {formatDate(asset.created_at)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-3">
                  <a
                    href={getCurrentVersionUrl(asset)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Abrir
                  </a>
                  <button
                    type="button"
                    onClick={() => onEdit(asset)}
                    className="text-xs font-medium text-foreground hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(asset)}
                    className="text-xs font-medium text-destructive hover:underline"
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {assets.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-8 text-center text-sm text-muted-foreground"
              >
                Nenhum arquivo encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Configuração por aba ───────────────────────────────────────────────────────

const UPLOAD_CONFIG: Record<
  Tab,
  {
    accept: string;
    label: string;
    description: string;
    icon: LucideIcon;
    libraryType: LibraryAssetType;
  }
> = {
  photos: {
    accept: "image/jpeg,image/png,image/webp,image/gif",
    label: "Clique ou arraste imagens para a biblioteca",
    description: "PNG, JPG, WebP, GIF — máx. 10 MB",
    icon: Image,
    libraryType: LibraryAssetType.IMAGE,
  },
  manuals: {
    accept: "application/pdf",
    label: "Clique ou arraste PDFs para a biblioteca",
    description: "Apenas arquivos PDF — máx. 50 MB",
    icon: FileText,
    libraryType: LibraryAssetType.PDF,
  },
  "3d-models": {
    accept: "model/gltf-binary,model/gltf+json,.glb,.gltf",
    label: "Clique ou arraste modelos 3D para a biblioteca",
    description: "GLB ou GLTF — máx. 100 MB",
    icon: Archive,
    libraryType: LibraryAssetType.MODEL3D,
  },
};

// ── Página principal ───────────────────────────────────────────────────────────

export default function AdminBibliotecaPage() {
  const [activeTab, setActiveTab] = useState<Tab>("photos");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();
  const activeConfig = UPLOAD_CONFIG[activeTab];
  // Server-side filtering + pagination (the /api/library contract supports
  // type/q/limit/offset). No client-side slicing — the API returns one page.
  const {
    data: libraryPayload,
    isError: libraryError,
    isLoading,
  } = useGetApiLibrary({
    type: activeConfig.libraryType,
    q: query.trim() || undefined,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });
  const { upload, entries, isUploading, clearFinished } = useLibraryUpload();

  const [editTarget, setEditTarget] = useState<LibraryAsset | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<LibraryAsset | undefined>();

  function invalidateLibrary() {
    queryClient.invalidateQueries({ queryKey: getGetApiLibraryQueryKey() });
  }

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApiLibraryId(id),
    onSuccess: () => {
      invalidateLibrary();
      setDeleteTarget(undefined);
    },
  });

  const total = libraryPayload?.total ?? 0;
  // The API returns one page (limit/offset). The extra slice is a no-op live and
  // only guards mock mode, where the loader ignores query params and returns all.
  const assets = (libraryPayload?.items ?? []).slice(0, PAGE_SIZE);

  if (libraryError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-4 py-4 text-center lg:px-11.75 lg:py-7.25">
        <p className="text-sm font-medium text-destructive">
          Sessão expirada ou sem permissão.
        </p>
        <Link
          href="/admin/login"
          className="text-sm text-primary underline underline-offset-4"
        >
          Fazer login novamente
        </Link>
      </div>
    );
  }

  function handleSearch(q: string) {
    setQuery(q);
    setPage(1);
  }

  function handleTab(tab: Tab) {
    setActiveTab(tab);
    setPage(1);
    setQuery("");
  }

  return (
    <AdminListPage
      className="px-4 py-4 lg:px-11.75 lg:py-7.25"
      title="Biblioteca"
      icon={Archive}
      toolbar={
        <div className="flex items-center gap-3">
          <AdminSearchInput
            value={query}
            onChange={handleSearch}
            placeholder="Buscar por nome"
            className="max-w-64"
          />
          <span className="ml-auto text-xs text-muted-foreground">
            {total} {total === 1 ? "arquivo" : "arquivos"}
          </span>
        </div>
      }
    >
      {/* Tabs */}
      <div className="flex border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTab(tab.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Zona de upload */}
      <AdminFormSection title="Fazer upload">
        <AdminFileUpload
          multiple
          clearOnUpload
          accept={activeConfig.accept}
          label={activeConfig.label}
          description={activeConfig.description}
          icon={activeConfig.icon}
          disabled={isUploading}
          onUpload={upload}
        />
      </AdminFormSection>

      {/* Progresso de uploads em andamento */}
      <UploadProgressList entries={entries} onClear={clearFinished} />

      {/* Grid de fotos ou tabela de arquivos */}
      {isLoading ? (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-12">
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      ) : activeTab === "photos" ? (
        assets.length === 0 ? (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-12">
            <p className="text-sm text-muted-foreground">
              Nenhuma foto encontrada.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {assets.map((asset) => (
              <PhotoCard
                key={asset.id}
                asset={asset}
                onEdit={setEditTarget}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )
      ) : (
        <FileTable
          assets={assets}
          onEdit={setEditTarget}
          onDelete={setDeleteTarget}
        />
      )}

      {total > PAGE_SIZE && (
        <AdminPagination
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onPageChange={setPage}
        />
      )}

      {editTarget && (
        <EditAssetModal
          asset={editTarget}
          onClose={() => setEditTarget(undefined)}
          onSaved={() => {
            invalidateLibrary();
            setEditTarget(undefined);
          }}
        />
      )}

      <AdminConfirmDialog
        open={!!deleteTarget}
        title="Excluir asset?"
        description={`${deleteTarget?.filename} será removido da biblioteca.`}
        confirmLabel="Excluir"
        destructive
        isPending={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
        onCancel={() => setDeleteTarget(undefined)}
      />
    </AdminListPage>
  );
}

function EditAssetModal({
  asset,
  onClose,
  onSaved,
}: {
  asset: LibraryAsset;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [filename, setFilename] = useState(asset.filename);
  const [alt, setAlt] = useState<I18nString>(asset.alt ?? { pt: "" });
  const [tags, setTags] = useState(asset.tags.join(", "));
  const { uploadVersion } = useLibraryUpload();
  const versionInputRef = useRef<HTMLInputElement>(null);
  const [versioning, setVersioning] = useState(false);

  async function handleVersionFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    setVersioning(true);
    const ok = await uploadVersion(asset.id, file);
    setVersioning(false);
    if (ok) onSaved();
  }

  const mutation = useMutation({
    mutationFn: () =>
      patchApiLibraryId(asset.id, {
        filename: filename.trim() || undefined,
        alt: alt.pt ? alt : undefined,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    onSuccess: onSaved,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cms-overlay p-4">
      <div className="w-full max-w-md">
        <AdminCard title="Editar asset" className="shadow-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
            className="space-y-4"
          >
            <div>
              <AdminLabel>Nome do arquivo</AdminLabel>
              <AdminInput
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                maxLength={255}
                placeholder="exemplo.png"
              />
            </div>
            <I18nInput
              label="Texto alternativo (alt)"
              value={alt}
              onChange={setAlt}
            />
            <div>
              <AdminLabel>Tags (separadas por vírgula)</AdminLabel>
              <AdminInput
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="hero, amplificador, 2024"
              />
            </div>
            <div className="rounded-md border border-border p-3">
              <p className="text-sm font-medium text-foreground">Versões</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Versão atual: v{asset.versions.length}
              </p>
              <input
                ref={versionInputRef}
                type="file"
                className="hidden"
                onChange={handleVersionFile}
              />
              <button
                type="button"
                disabled={versioning}
                onClick={() => versionInputRef.current?.click()}
                className="mt-2 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-60"
              >
                {versioning ? "Enviando nova versão..." : "Enviar nova versão"}
              </button>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-md border border-border py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 rounded-md bg-foreground py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80 disabled:opacity-60"
              >
                {mutation.isPending ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </AdminCard>
      </div>
    </div>
  );
}
