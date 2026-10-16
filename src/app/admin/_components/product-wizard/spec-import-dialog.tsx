"use client";

import { postApiSpecSheetsImport } from "@/api/stetsom";
import type { SpecWorkbookPreview } from "@/api/stetsom/model";
import {
  downloadTemplateSpecSheet,
  specSheetFilename,
} from "@/app/admin/_components/spec-sheets/download-spec-sheet";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { cn } from "@/lib/utils";
import { Download, FileUp } from "lucide-react";
import { useRef, useState } from "react";
import type { WizardVariation } from "./wizard-store";

interface SpecImportDialogProps {
  /** Validates the sheet against this template when the product has one. */
  templateId: string;
  templateName?: string;
  productName: string;
  variations: WizardVariation[];
  onApply: (variations: WizardVariation[]) => void;
  onClose: () => void;
}

const SHEET_STATUS_LABEL = {
  ready: "Pronta",
  ignored: "Ignorada",
  invalid: "Com erros",
} as const;

function normalizeName(value: string) {
  return value.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/**
 * Turns the parsed workbook into editor variations. A sheet whose name matches
 * an existing variation keeps that variation's id, so saving updates it in
 * place; highlights survive for single-line attributes that were highlighted.
 */
function toVariations(
  preview: SpecWorkbookPreview,
  current: WizardVariation[],
): WizardVariation[] {
  const highlighted = new Set(
    current.flatMap((v) =>
      v.specs.filter((s) => s.highlighted).map((s) => s.attribute_id),
    ),
  );
  const byName = new Map(current.map((v) => [normalizeName(v.label), v]));

  return preview.variants.map((variant, order) => {
    const lineCount = new Map<string, number>();
    for (const line of variant.attributes) {
      lineCount.set(
        line.attribute_id,
        (lineCount.get(line.attribute_id) ?? 0) + 1,
      );
    }
    const existing = byName.get(normalizeName(variant.name));
    return {
      id: existing?.id ?? `variation-${crypto.randomUUID()}`,
      label: variant.name,
      order,
      specs: variant.attributes.map((line, index) => ({
        id: `spec-${crypto.randomUUID()}`,
        attribute_id: line.attribute_id,
        attribute_name: { pt: line.attribute_name },
        group_id: line.group_id,
        value: line.value,
        description: line.description ?? undefined,
        order: index,
        highlighted:
          highlighted.has(line.attribute_id) &&
          line.attribute_type === "TEXT" &&
          lineCount.get(line.attribute_id) === 1,
      })),
    };
  });
}

export function SpecImportDialog({
  templateId,
  templateName,
  productName,
  variations,
  onApply,
  onClose,
}: SpecImportDialogProps) {
  const toast = useAdminToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState<SpecWorkbookPreview | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setFileName(file.name);
    setPreview(null);
    setBusy(true);
    try {
      setPreview(
        await postApiSpecSheetsImport({
          file,
          template_id: templateId || undefined,
        }),
      );
    } catch (error) {
      toast.apiError(error, "Não foi possível ler a planilha");
    } finally {
      setBusy(false);
    }
  }

  async function handleDownload() {
    setBusy(true);
    try {
      await downloadTemplateSpecSheet(templateId, {
        variantNames: variations.map((v) => v.label),
        filename: specSheetFilename(productName || templateName || "produto"),
      });
    } catch (error) {
      toast.apiError(error, "Não foi possível gerar a planilha");
    } finally {
      setBusy(false);
    }
  }

  const canApply =
    !!preview && preview.errors.length === 0 && preview.variants.length > 0;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importar especificações por planilha</DialogTitle>
        </DialogHeader>

        <div className="min-h-0 space-y-4 overflow-y-auto pr-1">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              <FileUp className="size-4" />
              {fileName || "Selecionar arquivo XLSX"}
            </Button>
            {templateId && (
              <Button
                type="button"
                variant="ghost"
                disabled={busy}
                onClick={handleDownload}
              >
                <Download className="size-4" />
                Baixar planilha do template
              </Button>
            )}
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              hidden
              onChange={handleFile}
            />
            <p className="basis-full text-xs text-muted-foreground">
              Um arquivo por produto, uma aba por variação. Colunas: group_id,
              group, attribute_id, attribute, title, value. Repita o atributo,
              uma linha por entrada, para montar uma matriz.
              {templateId
                ? " As linhas são conferidas com o template do produto."
                : ""}
            </p>
          </div>

          {busy && !preview && (
            <p className="text-sm text-muted-foreground">Lendo planilha…</p>
          )}

          {preview && (
            <div className="space-y-3">
              <div className="space-y-1.5 rounded-md border border-border p-3">
                <p className="text-sm font-medium">Abas</p>
                {preview.sheets.map((sheet) => (
                  <div
                    key={sheet.name}
                    className="flex flex-wrap items-center gap-2 text-sm"
                  >
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-2xs font-semibold uppercase",
                        sheet.status === "ready" &&
                          "bg-emerald-100 text-emerald-800",
                        sheet.status === "ignored" &&
                          "bg-muted text-muted-foreground",
                        sheet.status === "invalid" && "bg-red-100 text-red-800",
                      )}
                    >
                      {SHEET_STATUS_LABEL[sheet.status]}
                    </span>
                    <span className="font-medium">{sheet.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {sheet.reason ??
                        `${sheet.lines} linha(s)${
                          sheet.variant_name &&
                          sheet.variant_name !== sheet.name
                            ? ` · variação "${sheet.variant_name}"`
                            : ""
                        }`}
                    </span>
                  </div>
                ))}
              </div>

              {preview.errors.length > 0 && (
                <div className="space-y-1 rounded-md border border-destructive/40 bg-destructive/5 p-3">
                  <p className="text-sm font-medium text-destructive">
                    Corrija a planilha e envie de novo
                  </p>
                  <ul className="list-disc space-y-0.5 pl-5 text-xs text-destructive">
                    {preview.errors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {preview.warnings.length > 0 && (
                <ul className="list-disc space-y-0.5 pl-5 text-xs text-amber-700">
                  {preview.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              )}

              {canApply && (
                <p className="text-xs text-muted-foreground">
                  Ao aplicar, as variações e especificações atuais são
                  substituídas pelas da planilha. Nada é salvo até você salvar o
                  produto.
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={!canApply}
            onClick={() => {
              if (!preview) return;
              onApply(toVariations(preview, variations));
              toast.success(
                "Planilha aplicada",
                "Revise as especificações e salve o produto.",
              );
              onClose();
            }}
          >
            Aplicar {preview?.variants.length ?? 0} variação(ões)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
