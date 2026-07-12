"use client";

import type { AssetVersion, LibraryAsset } from "@/api/stetsom/model";
import { Button } from "@/components/ui/button";
import { useLibraryUpload } from "@/hooks/use-upload";
import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { formatBytes, formatDate } from "./lib";

interface AssetVersionsTabProps {
  asset: LibraryAsset;
  /** Called after a new version is registered so the parent can refresh. */
  onUploaded: () => void;
}

/**
 * Read-only version history plus a "new version" uploader. There is no API to
 * promote an older version, so the list only marks which one is current.
 */
export function AssetVersionsTab({ asset, onUploaded }: AssetVersionsTabProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const { uploadVersion } = useLibraryUpload();

  // Newest first, keeping the original 1-based version number for the label.
  const ordered = asset.versions
    .map((version, index) => ({ version, number: index + 1 }))
    .reverse();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const ok = await uploadVersion(asset.id, file);
      if (ok) onUploaded();
    } catch {
      // Error toast is handled by useUploadVersion
    } finally {
      setBusy(false);
    }
  }

  function isCurrent(version: AssetVersion) {
    return version.version_id === asset.current_version_id;
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-2">
        {ordered.map(({ version, number }) => (
          <li
            key={version.version_id}
            className={cn(
              "flex items-center justify-between gap-3 rounded-lg border px-3 py-2",
              isCurrent(version) && "border-primary/40 bg-primary/5",
            )}
          >
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                v{number}
                {isCurrent(version) && (
                  <span className="rounded bg-primary px-1.5 py-0.5 text-2xs font-semibold text-primary-foreground">
                    Atual
                  </span>
                )}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatDate(version.created_at)} ·{" "}
                {formatBytes(version.size_bytes)}
                {version.width && version.height
                  ? ` · ${version.width}×${version.height}`
                  : ""}
              </p>
            </div>
            <a
              href={version.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-xs font-medium text-primary hover:underline"
            >
              Abrir
            </a>
          </li>
        ))}
      </ul>

      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          <UploadCloud />
          {busy ? "Enviando nova versão…" : "Enviar nova versão"}
        </Button>
        <input ref={inputRef} type="file" hidden onChange={handleFile} />
      </div>
    </div>
  );
}
