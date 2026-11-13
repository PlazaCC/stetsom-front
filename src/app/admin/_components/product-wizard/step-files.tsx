"use client";

import { cn } from "@/lib/utils";
import { BookOpen, FileArchive, FileText } from "lucide-react";
import { FileDropzone } from "./file-dropzone";
import type { WizardAction, WizardState } from "./wizard-store";
import type { EditorTarget } from "./editor-target";
import { useEffect } from "react";

interface StepFilesProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  compact?: boolean;
  selection?: EditorTarget;
}

export function StepFiles({
  state,
  dispatch,
  compact = false,
  selection,
}: StepFilesProps) {
  useEffect(() => {
    if (selection?.kind !== "files" || !selection.fileType) return;
    window.setTimeout(() => {
      const element = document.querySelector<HTMLElement>(
        `[data-editor-file-type="${selection.fileType}"]`,
      );
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  }, [selection]);
  const certificates = state.files.filter((f) => f.type === "CERTIFICATE");
  const manuals = state.files.filter((f) => f.type === "MANUAL");
  const imagePacks = state.files.filter((f) => f.type === "IMAGE_PACK");
  // Legacy links to `PDF` assets match no section above; list them so they
  // can at least be seen and removed.
  const unsorted = state.files.filter((f) => f.type === "PDF");

  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        !compact && "lg:grid lg:grid-cols-2 lg:items-start",
      )}
    >
      <section
        className="flex flex-col gap-3"
        data-editor-file-type="CERTIFICATE"
      >
        <p className="text-sm font-semibold text-foreground">Certificados</p>
        <FileDropzone
          type="CERTIFICATE"
          icon={FileText}
          files={certificates}
          onAdd={(file) => dispatch({ type: "add_file", file })}
          onRemove={(id) => dispatch({ type: "remove_file", id })}
        />
      </section>

      <section className="flex flex-col gap-3" data-editor-file-type="MANUAL">
        <p className="text-sm font-semibold text-foreground">Manuais</p>
        <FileDropzone
          type="MANUAL"
          icon={BookOpen}
          files={manuals}
          onAdd={(file) => dispatch({ type: "add_file", file })}
          onRemove={(id) => dispatch({ type: "remove_file", id })}
        />
      </section>

      <section
        className="flex flex-col gap-3"
        data-editor-file-type="IMAGE_PACK"
      >
        <p className="text-sm font-semibold text-foreground">
          Imagens para download
        </p>
        <FileDropzone
          type="IMAGE_PACK"
          icon={FileArchive}
          accept=".zip"
          multiple={false}
          files={imagePacks}
          onAdd={(file) => dispatch({ type: "add_file", file })}
          onRemove={(id) => dispatch({ type: "remove_file", id })}
        />
      </section>

      {unsorted.length > 0 && (
        <section className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-foreground">
            PDFs sem categoria
          </p>
          <p className="text-xs text-muted-foreground">
            Arquivos vindos do site antigo. Classifique-os em Biblioteca → PDFs
            sem categoria para que apareçam como manual ou certificado no site.
          </p>
          <ul className="space-y-2">
            {unsorted.map((file) => (
              <li
                key={file.id}
                className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2"
              >
                <span className="truncate text-sm text-foreground">
                  {file.filename ?? file.file_url.split("/").pop()}
                </span>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "remove_file", id: file.id })}
                  className="shrink-0 text-xs font-medium text-muted-foreground hover:text-destructive"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
