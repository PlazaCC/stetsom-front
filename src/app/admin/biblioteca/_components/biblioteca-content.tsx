"use client";

import {
  deleteApiLibraryId,
  getGetApiLibraryQueryKey,
  useGetApiLibrary,
} from "@/api/stetsom";
import { LibraryAssetType, type LibraryAsset } from "@/api/stetsom/model";
import { AdminConfirmDialog } from "@/app/admin/_components/crud/admin-confirm-dialog";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import { AdminPagination } from "@/app/admin/_components/crud/admin-pagination";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { useLibraryUpload } from "@/hooks/use-upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Filter, Tags, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AssetGrid } from "./asset-grid";
import { AssetTable } from "./asset-table";
import { EditAssetDialog } from "./edit-asset-dialog";
import { LibraryUploadDialog } from "./library-upload-dialog";
import { LibraryContentHeader } from "./library-content-header";
import { LibraryDropzone } from "./library-dropzone";
import { PAGE_SIZE, UPLOAD_CONFIG, type Tab, type ViewMode } from "./lib";

export type { Tab };

interface BibliotecaContentProps {
  activeTab?: Tab;
}

const ALL_TYPES = Object.values(LibraryAssetType);
const TYPE_LABELS: Record<LibraryAssetType, string> = {
  IMAGE: "Fotos",
  VIDEO: "Vídeos",
  MODEL3D: "Arquivos 3D",
  PDF: "PDFs sem categoria",
  MANUAL: "Manuais",
  CATALOG: "Catálogos",
  CERTIFICATE: "Certificados",
  IMAGE_PACK: "Packs de imagem",
  CATEGORY_ICON: "Ícones de categoria",
  CDS_AND_PHOTOS: "CDs e fotos",
  WALLPAPERS_AND_BANNERS: "Wallpapers e banners",
  LOGOS: "Logos",
  OTHER: "Outros",
};
const ALL_CONFIG = {
  accept: "*/*",
  uploadLabel: "Enviar conteúdo",
  emptyLabel: "Nenhum arquivo encontrado.",
  emptyDescription: "Envie um arquivo ou ajuste os filtros.",
  emptyIcon: Upload,
  searchPlaceholder: "Buscar por nome",
  libraryType: undefined,
  canUpload: true,
} as const;

/**
 * Asset-manager layout: a fixed content header (search + view switch + upload)
 * over a single scroll area holding the grid/table. The whole area is a
 * dropzone; in-flight uploads render as skeleton cards inside the grid.
 */
export function BibliotecaContent({ activeTab }: BibliotecaContentProps) {
  const config = activeTab ? UPLOAD_CONFIG[activeTab] : ALL_CONFIG;
  const canUpload = config.canUpload ?? true;
  const queryClient = useQueryClient();
  const toast = useAdminToast();

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [types, setTypes] = useState<string[]>(
    activeTab ? [UPLOAD_CONFIG[activeTab].libraryType] : [],
  );
  const [tagFilter, setTagFilter] = useState<"all" | "tagged" | "untagged">(
    "all",
  );
  const [editTarget, setEditTarget] = useState<LibraryAsset>();
  const [deleteTarget, setDeleteTarget] = useState<LibraryAsset>();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const { data, isError, isLoading } = useGetApiLibrary({
    types: types.length > 0 ? types.join(",") : undefined,
    tagged: tagFilter === "all" ? undefined : tagFilter === "tagged",
    q: query.trim() || undefined,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });

  const { entries, isUploading, clearFinished, uploadItems } =
    useLibraryUpload();

  useEffect(() => {
    if (activeTab) return;
    const fromUrl = new URLSearchParams(window.location.search)
      .get("types")
      ?.split(",")
      .filter(Boolean);
    if (!fromUrl?.length) return;
    const timer = window.setTimeout(() => setTypes(fromUrl), 0);
    return () => window.clearTimeout(timer);
  }, [activeTab]);

  // Pin the tab's asset type on upload — the backend infers type from MIME, and
  // MANUAL / CATALOG / CERTIFICATE all share `application/pdf`.
  const uploadTyped = (files: File[]) => {
    if (!canUpload || files.length === 0) return;
    setPendingFiles(files);
    setUploadDialogOpen(true);
  };

  function handleUploadDialogChange(open: boolean) {
    setUploadDialogOpen(open);
    if (!open) {
      setPendingFiles([]);
      clearFinished();
    }
  }

  function invalidateLibrary() {
    void queryClient.invalidateQueries({
      queryKey: getGetApiLibraryQueryKey(),
    });
  }

  const deleteMutation = useMutation({
    mutationFn: (asset: LibraryAsset) => deleteApiLibraryId(asset.id),
    onSuccess: (_data, asset) => {
      invalidateLibrary();
      toast.deleted(asset.filename);
      setDeleteTarget(undefined);
    },
    onError: (e) => toast.apiError(e, "Não foi possível excluir o asset"),
  });

  const total = data?.total ?? 0;
  const assets = data?.items ?? [];

  function handleSearch(q: string) {
    setQuery(q);
    setPage(1);
  }

  function handleTypeChange(value: unknown) {
    setTypes(Array.isArray(value) ? value.map(String) : []);
    setPage(1);
  }

  function clearFilters() {
    setTypes([]);
    setTagFilter("all");
    setQuery("");
    setPage(1);
  }

  const hasFilters =
    types.length > 0 || tagFilter !== "all" || Boolean(query.trim());

  function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files ? Array.from(event.target.files) : [];
    event.target.value = "";
    if (files.length > 0) uploadTyped(files);
  }

  const hasSearch = Boolean(query.trim());
  const emptyLabel = hasSearch
    ? "Nenhum arquivo encontrado"
    : config.emptyLabel;
  const emptyDescription = hasSearch
    ? "Tente buscar por outro termo."
    : config.emptyDescription;
  const emptyAction =
    hasSearch || !canUpload ? undefined : (
      <Button
        type="button"
        size="sm"
        onClick={() => uploadInputRef.current?.click()}
        disabled={isUploading}
      >
        <Upload />
        {config.uploadLabel}
      </Button>
    );

  return (
    <LibraryDropzone
      accept={config.accept}
      onDrop={uploadTyped}
      className="flex min-h-0 flex-1 flex-col"
    >
      <AdminPageLayout
        header={
          <LibraryContentHeader
            query={query}
            onQueryChange={handleSearch}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            total={total}
            uploadLabel={config.uploadLabel}
            searchPlaceholder={config.searchPlaceholder}
            onUploadRequest={
              canUpload ? () => uploadInputRef.current?.click() : undefined
            }
            disabled={isUploading}
          />
        }
        contentClassName="px-5 py-5"
      >
        {!activeTab && (
          <section
            className="mb-5 rounded-lg border border-border bg-card p-3"
            aria-label="Filtros da biblioteca"
          >
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 pr-1 text-sm font-medium text-foreground">
                <Filter className="size-4 text-muted-foreground" />
                Filtros
              </div>
              <Select<string, true>
                multiple
                value={types}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger className="min-w-55 bg-background">
                  <SelectValue placeholder="Todas as categorias">
                    {types.length === 0
                      ? "Todas as categorias"
                      : `${types.length} ${types.length === 1 ? "categoria" : "categorias"}`}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="start">
                  {ALL_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={tagFilter}
                onValueChange={(value) => {
                  setTagFilter(value as typeof tagFilter);
                  setPage(1);
                }}
              >
                <SelectTrigger className="min-w-42 bg-background">
                  <Tags className="size-4 text-muted-foreground" />
                  <SelectValue placeholder="Tags" />
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectItem value="all">Todas as tags</SelectItem>
                  <SelectItem value="tagged">Com tags</SelectItem>
                  <SelectItem value="untagged">Sem tags</SelectItem>
                </SelectContent>
              </Select>
              {hasFilters && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={clearFilters}
                >
                  <X className="size-4" />
                  Limpar filtros
                </Button>
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Combine categorias, busca por nome ou tag e status de tags para
              encontrar arquivos rapidamente.
            </p>
          </section>
        )}
        {isError ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
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
        ) : isLoading ? (
          <div className="flex items-center justify-center rounded-lg border border-dashed py-16">
            <p className="text-sm text-muted-foreground">Carregando…</p>
          </div>
        ) : viewMode === "grid" ? (
          <AssetGrid
            assets={assets}
            uploads={entries}
            emptyLabel={emptyLabel}
            emptyDescription={emptyDescription}
            emptyIcon={config.emptyIcon}
            emptyAction={emptyAction}
            onEdit={setEditTarget}
            onDelete={setDeleteTarget}
          />
        ) : (
          <AssetTable
            assets={assets}
            emptyLabel={emptyLabel}
            emptyDescription={emptyDescription}
            emptyIcon={config.emptyIcon}
            emptyAction={emptyAction}
            onEdit={setEditTarget}
            onDelete={setDeleteTarget}
          />
        )}

        {!isError && !isLoading && total > 0 && (
          <AdminPagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={setPage}
            hideCount
            className="mt-4"
          />
        )}
      </AdminPageLayout>

      <input
        ref={uploadInputRef}
        type="file"
        accept={config.accept}
        multiple
        hidden
        onChange={handleFiles}
      />

      <LibraryUploadDialog
        key={`${uploadDialogOpen}:${pendingFiles.map((file) => `${file.name}-${file.size}-${file.lastModified}`).join(",")}`}
        open={uploadDialogOpen}
        initialFiles={pendingFiles}
        preferredType={activeTab ? config.libraryType : undefined}
        accept={config.accept}
        entries={entries}
        isUploading={isUploading}
        uploadItems={uploadItems}
        onOpenChange={handleUploadDialogChange}
      />

      {editTarget && (
        <EditAssetDialog
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
        description={`${deleteTarget?.filename ?? ""} será removido da biblioteca.`}
        confirmLabel="Excluir"
        destructive
        isPending={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget);
        }}
        onCancel={() => setDeleteTarget(undefined)}
      />
    </LibraryDropzone>
  );
}
