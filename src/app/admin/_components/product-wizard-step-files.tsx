"use client";

import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import { LibraryAssetPicker } from "@/app/admin/_components/crud/library-asset-picker";
import type { WizardProductFile } from "@/app/admin/_components/product-wizard-types";
import { FileText, X } from "lucide-react";

interface ProductWizardStepFilesProps {
  files: WizardProductFile[];
  onAdd?: (file: { library_id: string; file_url: string }) => void;
  onRemove?: (id: string) => void;
}

const TYPE_LABELS: Record<string, string> = {
  MANUAL: "Manual",
  CATALOG: "Catálogo",
  CERTIFICATE: "Certificado",
  PDF: "PDF",
  OTHER: "Outro",
};

export function ProductWizardStepFiles({
  files,
  onAdd,
  onRemove,
}: ProductWizardStepFilesProps) {
  return (
    <div className="space-y-6">
      <AdminFormSection
        title="Manuais e documentos"
        description="Vincule manuais, catálogos e certificados a partir da biblioteca ou faça upload."
      >
        <LibraryAssetPicker
          type="MANUAL"
          variant="file"
          accept=".pdf"
          value={null}
          onChange={(a) => {
            if (a) onAdd?.({ library_id: a.library_id, file_url: a.file_url });
          }}
        />

        {files.length > 0 && (
          <ul className="mt-3 space-y-2">
            {files.map((file) => (
              <li
                key={file.id}
                className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {file.name ?? file.file_url.split("/").pop()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {TYPE_LABELS[file.type] ?? file.type} ·{" "}
                      {file.is_active ? "Ativo" : "Inativo"}
                    </p>
                  </div>
                </div>
                {onRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(file.id)}
                    className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-3.5" />
                    Remover
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </AdminFormSection>
    </div>
  );
}
