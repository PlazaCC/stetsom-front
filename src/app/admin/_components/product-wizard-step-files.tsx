"use client";

import { AdminFileUpload } from "@/app/admin/_components/crud/admin-file-upload";
import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import type { WizardProductFile } from "@/app/admin/_components/product-wizard-types";
import { FileText, Shield, X } from "lucide-react";

interface ProductWizardStepFilesProps {
  files: WizardProductFile[];
  onRemove: (id: string) => void;
}

function fileTypeLabel(type: WizardProductFile["type"]): string {
  const labels: Record<WizardProductFile["type"], string> = {
    MANUAL: "Manual",
    CATALOG: "Catálogo",
    CERTIFICATE: "Certificado",
    IMAGE: "Imagem",
    PDF: "PDF",
    VIDEO: "Vídeo",
    MODEL3D: "Modelo 3D",
    IMAGE_PACK: "Pack de imagens",
    CATEGORY_ICON: "Ícone de categoria",
    OTHER: "Outro",
  };
  return labels[type];
}

export function ProductWizardStepFiles({
  files,
  onRemove,
}: ProductWizardStepFilesProps) {
  const certificates = files.filter((f) => f.type === "CERTIFICATE");
  const manuals = files.filter((f) => f.type !== "CERTIFICATE");

  return (
    <div className="space-y-6">
      <AdminFormSection
        title="Certificados"
        description="Faça upload de certificações, laudos e documentos oficiais do produto."
      >
        <AdminFileUpload
          multiple
          accept=".pdf"
          label="Clique ou arraste certificados (PDF)"
          description="Apenas arquivos PDF"
          icon={Shield}
        />

        {certificates.length > 0 && (
          <ul className="mt-3 space-y-2">
            {certificates.map((file) => (
              <FileRow key={file.id} file={file} onRemove={onRemove} />
            ))}
          </ul>
        )}
      </AdminFormSection>

      <AdminFormSection
        title="Manuais e catálogos"
        description="Adicione manuais de instalação, guias e catálogos do produto."
      >
        <AdminFileUpload
          multiple
          accept=".pdf,image/*"
          label="Clique ou arraste manuais e catálogos"
          description="PDF ou imagens"
          icon={FileText}
        />

        {manuals.length > 0 && (
          <ul className="mt-3 space-y-2">
            {manuals.map((file) => (
              <FileRow key={file.id} file={file} onRemove={onRemove} />
            ))}
          </ul>
        )}
      </AdminFormSection>
    </div>
  );
}

function FileRow({
  file,
  onRemove,
}: {
  file: WizardProductFile;
  onRemove: (id: string) => void;
}) {
  return (
    <li className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2">
      <div>
        <p className="text-sm font-medium text-foreground">
          {file.name ?? file.file_url.split("/").pop()}
        </p>
        <p className="text-xs text-muted-foreground">
          {fileTypeLabel(file.type)} · v{file.version} ·{" "}
          {file.is_active ? "Ativo" : "Inativo"}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onRemove(file.id)}
        className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-destructive"
      >
        <X className="size-3.5" />
        Remover
      </button>
    </li>
  );
}
