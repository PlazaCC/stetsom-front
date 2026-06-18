"use client";

import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import { BookOpen, FileText } from "lucide-react";
import { FileDropzone } from "./file-dropzone";
import type { WizardAction, WizardState } from "./wizard-store";

interface StepFilesProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

export function StepFiles({ state, dispatch }: StepFilesProps) {
  const certificates = state.files.filter((f) => f.type === "CERTIFICATE");
  const manuals = state.files.filter((f) => f.type === "MANUAL");

  return (
    <div className="space-y-5">
      <AdminFormSection title="Certificados">
        <FileDropzone
          type="CERTIFICATE"
          icon={FileText}
          files={certificates}
          onAdd={(file) => dispatch({ type: "add_file", file })}
          onRemove={(id) => dispatch({ type: "remove_file", id })}
        />
      </AdminFormSection>

      <AdminFormSection title="Manuais">
        <FileDropzone
          type="MANUAL"
          icon={BookOpen}
          files={manuals}
          onAdd={(file) => dispatch({ type: "add_file", file })}
          onRemove={(id) => dispatch({ type: "remove_file", id })}
        />
      </AdminFormSection>
    </div>
  );
}
