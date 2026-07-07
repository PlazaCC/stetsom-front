"use client";

import { AdminFileUpload } from "@/app/admin/_components/crud/admin-file-upload";
import type { LibraryAssetType } from "@/api/stetsom/model";
import { FileText, Loader2, X, type LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useLibraryUpload } from "@/hooks/use-upload";
import { currentAssetUrl } from "@/app/admin/_components/crud/library-asset-ref";
import type { WizardFile } from "./wizard-store";

interface FileDropzoneProps {
  type: LibraryAssetType;
  icon: LucideIcon;
  files: WizardFile[];
  accept?: string;
  onAdd: (file: WizardFile) => void;
  onRemove: (id: string) => void;
}

/** A drag-and-drop zone that uploads each file under an explicit library type. */
export function FileDropzone({
  type,
  icon,
  files,
  accept = ".pdf",
  onAdd,
  onRemove,
}: FileDropzoneProps) {
  const { upload, entries, isUploading } = useLibraryUpload();
  const notified = useRef(new Set<string>());

  // Surface each finished upload as a WizardFile exactly once, regardless of
  // how many times this effect re-runs while other entries are still in flight.
  useEffect(() => {
    for (const entry of entries) {
      if (
        entry.status === "done" &&
        entry.asset &&
        !notified.current.has(entry.id)
      ) {
        notified.current.add(entry.id);
        const asset = entry.asset;
        onAdd({
          id: `file-${asset.id}`,
          library_id: asset.id,
          file_url: currentAssetUrl(asset),
          filename: asset.filename,
          type,
          is_active: true,
        });
      }
    }
  }, [entries, type, onAdd]);

  function handleUpload(incoming: File[]) {
    void upload(incoming, type);
  }

  const pending = entries.filter((e) => e.status !== "done");

  return (
    <div className="space-y-3">
      <AdminFileUpload
        icon={icon}
        accept={accept}
        multiple
        clearOnUpload
        disabled={isUploading}
        label="Drag & drop files or Browse"
        description="Arraste aqui para adicionar um ou mais arquivos"
        onUpload={handleUpload}
      />

      {pending.map((e) => (
        <div
          key={e.id}
          className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm"
        >
          <span className="truncate text-foreground">{e.fileName}</span>
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            {e.status === "error" ? (
              e.error
            ) : (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Enviando…
              </>
            )}
          </span>
        </div>
      ))}

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-sm text-foreground">
                  {file.filename ?? file.file_url.split("/").pop()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onRemove(file.id)}
                className="flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground hover:text-destructive"
              >
                <X className="size-3.5" />
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
