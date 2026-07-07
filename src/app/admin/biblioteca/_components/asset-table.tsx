"use client";

import type { LibraryAsset } from "@/api/stetsom/model";
import { AdminEmptyState } from "@/app/admin/_components/crud/admin-empty-state";
import { AssetTypeIcon } from "./asset-type-icon";
import {
  assetAltText,
  formatBytes,
  formatDate,
  getCurrentVersionSize,
  getCurrentVersionUrl,
  isImageAsset,
} from "./lib";

interface AssetTableProps {
  assets: LibraryAsset[];
  emptyLabel: string;
  onEdit: (asset: LibraryAsset) => void;
  onDelete: (asset: LibraryAsset) => void;
}

function AssetThumb({ asset }: { asset: LibraryAsset }) {
  const url = getCurrentVersionUrl(asset);
  if (isImageAsset(asset) && url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={assetAltText(asset)}
        className="size-9 shrink-0 rounded-md object-cover"
      />
    );
  }
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
      <AssetTypeIcon type={asset.type} className="size-4" />
    </span>
  );
}

export function AssetTable({
  assets,
  emptyLabel,
  onEdit,
  onDelete,
}: AssetTableProps) {
  if (assets.length === 0) {
    return (
      <div className="overflow-hidden rounded-card border border-border bg-card shadow-cms-card">
        <AdminEmptyState
          title={emptyLabel}
          description="Faça upload de arquivos usando o botão na parte superior."
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-border bg-card shadow-cms-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left text-xs font-medium text-muted-foreground">
            <th className="px-4 py-3">Nome</th>
            <th className="px-4 py-3">Versões</th>
            <th className="px-4 py-3">Tamanho</th>
            <th className="px-4 py-3">Enviado em</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {assets.map((asset) => (
            <tr key={asset.id} className="hover:bg-muted/30">
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onEdit(asset)}
                  className="flex items-center gap-3 text-left"
                >
                  <AssetThumb asset={asset} />
                  <span className="font-medium text-foreground hover:underline">
                    {asset.filename}
                  </span>
                </button>
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
              <td className="px-4 py-3">
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
        </tbody>
      </table>
    </div>
  );
}
