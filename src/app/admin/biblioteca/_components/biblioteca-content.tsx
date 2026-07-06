"use client";

import {
  deleteApiLibraryId,
  getGetApiLibraryQueryKey,
  useGetApiLibrary,
} from "@/api/stetsom";
import type { LibraryAsset } from "@/api/stetsom/model";
import { AdminConfirmDialog } from "@/app/admin/_components/crud/admin-confirm-dialog";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import { AdminPagination } from "@/app/admin/_components/crud/admin-pagination";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { useLibraryUpload } from "@/hooks/use-upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AssetGrid } from "./asset-grid";
import { AssetTable } from "./asset-table";
import { EditAssetDialog } from "./edit-asset-dialog";
import { LibraryContentHeader } from "./library-content-header";
import { LibraryDropzone } from "./library-dropzone";
import { PAGE_SIZE, UPLOAD_CONFIG, type Tab, type ViewMode } from "./lib";

export type { Tab };

interface BibliotecaContentProps {
  activeTab: Tab;
}

/**
 * Asset-manager layout: a fixed content header (search + view switch + upload)
 * over a single scroll area holding the grid/table. The whole area is a
 * dropzone; in-flight uploads render as skeleton cards inside the grid.
 */
export function BibliotecaContent({ activeTab }: BibliotecaContentProps) {
  const config = UPLOAD_CONFIG[activeTab];
  const queryClient = useQueryClient();
  const toast = useAdminToast();

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [editTarget, setEditTarget] = useState<LibraryAsset>();
  const [deleteTarget, setDeleteTarget] = useState<LibraryAsset>();

  const { data, isError, isLoading } = useGetApiLibrary({
    type: config.libraryType,
    q: query.trim() || undefined,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });

  const { upload, entries, isUploading, clearDone } = useLibraryUpload();

  // Pin the tab's asset type on upload — the backend infers type from MIME, and
  // MANUAL / CATALOG / CERTIFICATE all share `application/pdf`.
  const uploadTyped = (files: File[]) => upload(files, config.libraryType);

  // Drop completed uploads shortly after the real asset is fetched into the grid.
  useEffect(() => {
    if (entries.some((e) => e.status === "done")) {
      const timer = setTimeout(clearDone, 400);
      return () => clearTimeout(timer);
    }
  }, [entries, clearDone]);

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
            accept={config.accept}
            uploadLabel={config.uploadLabel}
            searchPlaceholder={config.searchPlaceholder}
            onUpload={uploadTyped}
            disabled={isUploading}
          />
        }
        contentClassName="px-5 py-5"
      >
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
            emptyLabel={config.emptyLabel}
            onEdit={setEditTarget}
            onDelete={setDeleteTarget}
          />
        ) : (
          <AssetTable
            assets={assets}
            emptyLabel={config.emptyLabel}
            onEdit={setEditTarget}
            onDelete={setDeleteTarget}
          />
        )}

        {!isError && !isLoading && (
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
