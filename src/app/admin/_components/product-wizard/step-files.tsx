"use client";

import {
  AdminFormSection,
  AdminFormSectionContent,
  AdminFormSectionTitle,
} from "@/app/admin/_components/crud/admin-form-section";
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
    <AdminFormSection>
      <AdminFormSectionTitle title="Certificados" />

      <AdminFormSectionContent>
        <FileDropzone
          type="CERTIFICATE"
          icon={FileText}
          files={certificates}
          onAdd={(file) => dispatch({ type: "add_file", file })}
          onRemove={(id) => dispatch({ type: "remove_file", id })}
        />
      </AdminFormSectionContent>

      <AdminFormSectionTitle className="border-t" title="Manuais" />
      <AdminFormSectionContent>
        <FileDropzone
          type="MANUAL"
          icon={BookOpen}
          files={manuals}
          onAdd={(file) => dispatch({ type: "add_file", file })}
          onRemove={(id) => dispatch({ type: "remove_file", id })}
        />
      </AdminFormSectionContent>

      {/* TO-DO: Download de materiais */}
      <AdminFormSectionTitle className="border-t" title="Downloads" />
      <AdminFormSectionContent>
        <FileDropzone
          type="MANUAL"
          icon={BookOpen}
          files={manuals}
          onAdd={(file) => dispatch({ type: "add_file", file })}
          onRemove={(id) => dispatch({ type: "remove_file", id })}
        />
      </AdminFormSectionContent>
    </AdminFormSection>
  );
}
