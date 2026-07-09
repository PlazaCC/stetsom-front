"use client";

import { cn } from "@/lib/utils";
import { BookOpen, FileArchive, FileText } from "lucide-react";
import { FileDropzone } from "./file-dropzone";
import type { WizardAction, WizardState } from "./wizard-store";

interface StepFilesProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  compact?: boolean;
}

export function StepFiles({
  state,
  dispatch,
  compact = false,
}: StepFilesProps) {
  const certificates = state.files.filter((f) => f.type === "CERTIFICATE");
  const manuals = state.files.filter((f) => f.type === "MANUAL");
  const imagePacks = state.files.filter((f) => f.type === "IMAGE_PACK");

  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        !compact && "lg:grid lg:grid-cols-2 lg:items-start",
      )}
    >
      <section className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-foreground">Certificados</p>
        <FileDropzone
          type="CERTIFICATE"
          icon={FileText}
          files={certificates}
          onAdd={(file) => dispatch({ type: "add_file", file })}
          onRemove={(id) => dispatch({ type: "remove_file", id })}
        />
      </section>

      <section className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-foreground">Manuais</p>
        <FileDropzone
          type="MANUAL"
          icon={BookOpen}
          files={manuals}
          onAdd={(file) => dispatch({ type: "add_file", file })}
          onRemove={(id) => dispatch({ type: "remove_file", id })}
        />
      </section>

      <section className="flex flex-col gap-3">
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
    </div>
  );
}
