"use client";

import type { LibraryAsset } from "@/api/stetsom/model";
import type { UploadEntry } from "@/hooks/use-upload";
import { AssetGridCard } from "./asset-grid-card";
import { UploadSkeletonCard } from "./upload-skeleton-card";

interface AssetGridProps {
  assets: LibraryAsset[];
  /** In-flight or failed uploads rendered as skeletons ahead of the assets. */
  uploads: UploadEntry[];
  emptyLabel: string;
  onEdit: (asset: LibraryAsset) => void;
  onDelete: (asset: LibraryAsset) => void;
}

export function AssetGrid({
  assets,
  uploads,
  emptyLabel,
  onEdit,
  onDelete,
}: AssetGridProps) {
  const pending = uploads.filter((e) => e.status !== "done");

  if (pending.length === 0 && assets.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed py-16">
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,240px))] justify-center gap-4">
      {pending.map((entry) => (
        <UploadSkeletonCard key={entry.id} entry={entry} />
      ))}
      {assets.map((asset) => (
        <AssetGridCard
          key={asset.id}
          asset={asset}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
