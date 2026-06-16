"use client";

import { useGetApiLibrary } from "@/api/stetsom";
import type {
  GetApiLibraryType,
  I18nString,
  LibraryAsset,
} from "@/api/stetsom/model";
import { useLibraryUpload } from "@/hooks/use-upload";
import { cn } from "@/lib/utils";
import { FileText, ImageIcon, Trash2, Upload, X } from "lucide-react";
import { useState } from "react";
import { AdminFileUpload } from "./admin-file-upload";
import { AdminLabel } from "./admin-input";
import { AdminSearchInput } from "./admin-search-input";

export interface PickedAsset {
  library_id: string;
  file_url: string;
  alt?: I18nString;
}

interface LibraryAssetPickerProps {
  label?: string;
  /** Currently selected asset (preview only needs the URL). */
  value?: { library_id?: string; file_url?: string } | null;
  onChange: (asset: PickedAsset | null) => void;
  /** Library type filter + presign scope hint. */
  type?: GetApiLibraryType;
  /** "image" shows a thumbnail; "file" shows a filename row. */
  variant?: "image" | "file";
  accept?: string;
  className?: string;
}

function currentUrl(asset: LibraryAsset): string {
  const v =
    asset.versions.find((x) => x.version_id === asset.current_version_id) ??
    asset.versions[0];
  return v?.file_url ?? "";
}

export function LibraryAssetPicker({
  label,
  value,
  onChange,
  type = "IMAGE",
  variant = "image",
  accept = "image/*",
  className,
}: LibraryAssetPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      {label && <AdminLabel>{label}</AdminLabel>}

      {value?.file_url ? (
        <div className="flex items-center gap-3 rounded-md border border-border bg-card p-2">
          {variant === "image" ? (
            <div className="relative size-16 shrink-0 overflow-hidden rounded bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value.file_url}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <FileText className="size-6 shrink-0 text-muted-foreground" />
          )}
          <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
            {value.file_url.split("/").pop()}
          </span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded border border-border px-2 py-1 text-xs font-medium hover:bg-muted"
          >
            Trocar
          </button>
          <button
            type="button"
            aria-label="Remover"
            onClick={() => onChange(null)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border bg-card py-6 text-sm text-muted-foreground hover:border-primary hover:text-foreground"
        >
          {variant === "image" ? (
            <ImageIcon className="size-5" />
          ) : (
            <Upload className="size-5" />
          )}
          Selecionar {variant === "image" ? "imagem" : "arquivo"}
        </button>
      )}

      {open && (
        <PickerModal
          type={type}
          accept={accept}
          onClose={() => setOpen(false)}
          onPick={(asset) => {
            onChange(asset);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

function PickerModal({
  type,
  accept,
  onClose,
  onPick,
}: {
  type: GetApiLibraryType;
  accept: string;
  onClose: () => void;
  onPick: (asset: PickedAsset) => void;
}) {
  const [tab, setTab] = useState<"library" | "upload">("library");
  const [q, setQ] = useState("");
  const { data, isLoading } = useGetApiLibrary({ type, q: q || undefined });
  const upload = useLibraryUpload();

  const assets = data?.items ?? [];

  function pickAsset(asset: LibraryAsset) {
    onPick({
      library_id: asset.id,
      file_url: currentUrl(asset),
      alt: asset.alt,
    });
  }

  // After a successful upload, surface the newly created asset for one-click pick.
  const uploaded = upload.entries
    .filter((e) => e.status === "done" && e.asset)
    .map((e) => e.asset as LibraryAsset);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cms-overlay p-4">
      <div className="flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-[16px] border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setTab("library")}
              className={cn(
                "rounded px-3 py-1.5 text-sm font-medium",
                tab === "library"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Biblioteca
            </button>
            <button
              type="button"
              onClick={() => setTab("upload")}
              className={cn(
                "rounded px-3 py-1.5 text-sm font-medium",
                tab === "upload"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Enviar novo
            </button>
          </div>
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === "library" ? (
            <>
              <AdminSearchInput
                value={q}
                onChange={setQ}
                placeholder="Buscar na biblioteca"
                className="mb-4 max-w-72"
              />
              {isLoading ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Carregando…
                </p>
              ) : assets.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Nenhum asset encontrado.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {assets.map((asset) => (
                    <AssetThumb
                      key={asset.id}
                      asset={asset}
                      onClick={() => pickAsset(asset)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <AdminFileUpload
                accept={accept}
                multiple={false}
                clearOnUpload
                onUpload={(files) => void upload.upload(files)}
              />
              {upload.entries.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
                >
                  <span className="truncate">{e.fileName}</span>
                  <span className="text-xs text-muted-foreground">
                    {e.status === "error" ? e.error : `${e.progress}%`}
                  </span>
                </div>
              ))}
              {uploaded.length > 0 && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {uploaded.map((asset) => (
                    <AssetThumb
                      key={asset.id}
                      asset={asset}
                      onClick={() => pickAsset(asset)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AssetThumb({
  asset,
  onClick,
}: {
  asset: LibraryAsset;
  onClick: () => void;
}) {
  const url = currentUrl(asset);
  const isImage = asset.type === "IMAGE" || asset.type === "CATEGORY_ICON";
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col gap-1 rounded-md border border-border p-1.5 text-left hover:border-primary"
    >
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded bg-muted">
        {isImage && url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="h-full w-full object-cover" />
        ) : (
          <FileText className="size-6 text-muted-foreground" />
        )}
      </div>
      <span className="truncate text-2xs text-muted-foreground">
        {asset.filename}
      </span>
    </button>
  );
}
