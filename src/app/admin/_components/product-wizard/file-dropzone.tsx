"use client";

import { LibraryPickerModal } from "@/app/admin/_components/crud/library-asset-picker";
import type { LibraryAssetType } from "@/api/stetsom/model";
import { FileText, X, type LucideIcon } from "lucide-react";
import { useState } from "react";
import type { WizardFile } from "./wizard-store";

interface FileDropzoneProps {
  type: LibraryAssetType;
  icon: LucideIcon;
  files: WizardFile[];
  accept?: string;
  multiple?: boolean;
  onAdd: (file: WizardFile) => void;
  onRemove: (id: string) => void;
}

/**
 * A library-backed file selector: opens the gallery wizard to browse existing
 * assets (filtered by `type`) or upload new ones, then links them to the product.
 */
export function FileDropzone({
  type,
  icon: Icon,
  files,
  accept = ".pdf",
  multiple = true,
  onAdd,
  onRemove,
}: FileDropzoneProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  // Single-file sections (e.g. IMAGE_PACK) hide the picker once one is linked.
  const canAdd = multiple || files.length === 0;

  return (
    <div className="space-y-3">
      {canAdd && (
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-card py-6 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
        >
          <Icon className="size-6" />
          <span className="font-medium">
            Selecionar da biblioteca ou enviar
          </span>
          <span className="text-xs text-muted-foreground">
            Escolha um arquivo já cadastrado ou envie um novo
          </span>
        </button>
      )}

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

      {pickerOpen && (
        <LibraryPickerModal
          type={type}
          accept={accept}
          onClose={() => setPickerOpen(false)}
          onPick={(asset) => {
            onAdd({
              id: crypto.randomUUID(),
              library_id: asset.library_id,
              file_url: asset.file_url,
              filename: asset.file_url.split("/").pop(),
              type,
              is_active: true,
            });
            setPickerOpen(false);
          }}
        />
      )}
    </div>
  );
}
