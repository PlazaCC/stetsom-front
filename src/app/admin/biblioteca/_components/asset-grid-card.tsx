"use client";

import type { LibraryAsset } from "@/api/stetsom/model";
import { Check, Copy, Trash2 } from "lucide-react";
import { useState } from "react";
import { AssetTypeIcon } from "./asset-type-icon";
import {
  assetAltText,
  formatBytes,
  getCurrentVersionDims,
  getCurrentVersionSize,
  getCurrentVersionUrl,
  isImageAsset,
} from "./lib";

interface AssetGridCardProps {
  asset: LibraryAsset;
  onEdit: (asset: LibraryAsset) => void;
  onDelete: (asset: LibraryAsset) => void;
}

export function AssetGridCard({ asset, onEdit, onDelete }: AssetGridCardProps) {
  const [copied, setCopied] = useState(false);
  const fileUrl = getCurrentVersionUrl(asset);
  const dims = getCurrentVersionDims(asset);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(fileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard indisponível */
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onEdit(asset)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEdit(asset);
        }
      }}
      className="group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border bg-card text-left transition-colors hover:border-primary/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      {/* Media / icon — 260×260 square */}
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-muted">
        {isImageAsset(asset) && fileUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fileUrl}
            alt={assetAltText(asset)}
            className="size-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <AssetTypeIcon
            type={asset.type}
            className="size-16 text-muted-foreground"
          />
        )}

        {/* Hover actions */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            aria-label={copied ? "URL copiada" : "Copiar URL"}
            onClick={(e) => {
              e.stopPropagation();
              void handleCopy();
            }}
            className="flex size-7 items-center justify-center rounded-md bg-background/90 text-foreground shadow-sm ring-1 ring-foreground/10 hover:bg-background"
          >
            {copied ? (
              <Check className="size-3.5 text-green-600" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </button>
          <button
            type="button"
            aria-label="Excluir"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(asset);
            }}
            className="flex size-7 items-center justify-center rounded-md bg-background/90 text-destructive shadow-sm ring-1 ring-foreground/10 hover:bg-background"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Caption */}
      <div className="min-w-0 border-t px-3 py-2">
        <p className="truncate text-sm font-medium text-foreground">
          {asset.filename}
        </p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {formatBytes(getCurrentVersionSize(asset))}
          {dims ? ` · ${dims}` : ""}
          {asset.versions.length > 1 ? ` · v${asset.versions.length}` : ""}
        </p>
      </div>
    </div>
  );
}
