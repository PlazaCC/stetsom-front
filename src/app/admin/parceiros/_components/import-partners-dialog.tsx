"use client";

import {
  postApiPartnerLocationsImport,
  type PartnerLocationType,
  type PostApiPartnerLocationsImport200,
} from "@/api/stetsom";
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
import { AlertTriangle, CheckCircle2, FileUp, MapPinOff } from "lucide-react";
import { useRef, useState } from "react";

/** Columns the API accepts, shown so the operator can shape the sheet. */
const EXPECTED_COLUMNS =
  "Nome, Endereço, Cidade, UF, CEP, Telefone, Telefone2, E-mail, Site, Região, Especialidade, Latitude, Longitude";

interface ImportPartnersDialogProps {
  type: PartnerLocationType;
  noun: string;
  onClose: () => void;
  /** Called after a committed import so the list refetches. */
  onImported: () => void;
}

/**
 * Two-step CSV import: the file is validated server-side first (`dry_run`) and the
 * report shown, so the operator commits only after seeing what will happen.
 */
export function ImportPartnersDialog({
  type,
  noun,
  onClose,
  onImported,
}: ImportPartnersDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useAdminToast();

  const [fileName, setFileName] = useState("");
  const [csv, setCsv] = useState("");
  const [report, setReport] = useState<PostApiPartnerLocationsImport200 | null>(
    null,
  );
  const [busy, setBusy] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const text = await file.text();
    setFileName(file.name);
    setCsv(text);
    setReport(null);
    await runImport(text, true);
  }

  async function runImport(text: string, dryRun: boolean) {
    setBusy(true);
    try {
      const result = await postApiPartnerLocationsImport({
        csv: text,
        type,
        dry_run: dryRun,
      });
      setReport(result);
      if (!dryRun) {
        toast.success(
          `${result.created} ${result.created === 1 ? "registro importado" : "registros importados"}`,
        );
        onImported();
        onClose();
      }
    } catch (err) {
      toast.apiError(err, "Não foi possível processar a planilha");
    } finally {
      setBusy(false);
    }
  }

  const canCommit = Boolean(report && report.valid > 0 && !busy);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Importar {noun}s por planilha</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              <FileUp className="size-4" />
              {fileName || "Selecionar arquivo CSV"}
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              hidden
              onChange={handleFile}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Colunas reconhecidas: {EXPECTED_COLUMNS}. Nome, endereço, cidade,
              UF e CEP são obrigatórios.
            </p>
          </div>

          {busy && !report && (
            <p className="text-sm text-muted-foreground">Validando planilha…</p>
          )}

          {report && (
            <div className="space-y-3 rounded-md border border-border p-3">
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                <span className="text-muted-foreground">
                  Linhas lidas: <strong>{report.total}</strong>
                </span>
                <span className="text-muted-foreground">
                  A importar: <strong>{report.valid}</strong>
                </span>
              </div>

              {report.valid > 0 && (
                <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  Nada foi gravado ainda. Confirme para importar.
                </p>
              )}

              {report.skipped.length > 0 && (
                <ReportGroup
                  icon={<AlertTriangle className="size-3.5 shrink-0" />}
                  title={`${report.skipped.length} já cadastrado(s) — serão ignorados`}
                >
                  {report.skipped.map((s) => (
                    <li key={`${s.line}-${s.name}`}>
                      linha {s.line}: {s.name}
                    </li>
                  ))}
                </ReportGroup>
              )}

              {report.withoutCoordinates.length > 0 && (
                <ReportGroup
                  icon={<MapPinOff className="size-3.5 shrink-0" />}
                  title={`${report.withoutCoordinates.length} sem coordenadas — não aparecerão no mapa`}
                >
                  {report.withoutCoordinates.map((s) => (
                    <li key={`${s.line}-${s.name}`}>
                      linha {s.line}: {s.name}
                    </li>
                  ))}
                </ReportGroup>
              )}

              {report.errors.length > 0 && (
                <ReportGroup
                  destructive
                  icon={<AlertTriangle className="size-3.5 shrink-0" />}
                  title={`${report.errors.length} linha(s) com erro — serão ignoradas`}
                >
                  {report.errors.map((e, i) => (
                    <li key={`${e.line}-${e.field}-${i}`}>
                      linha {e.line}
                      {e.field ? ` (${e.field})` : ""}: {e.reason}
                    </li>
                  ))}
                </ReportGroup>
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
            disabled={!canCommit}
            onClick={() => void runImport(csv, false)}
          >
            {busy && report
              ? "Importando…"
              : `Importar ${report?.valid ?? 0} registro(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReportGroup({
  icon,
  title,
  destructive,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  destructive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("text-xs", destructive && "text-destructive")}>
      <p
        className={cn(
          "flex items-center gap-1.5 font-medium",
          !destructive && "text-foreground",
        )}
      >
        {icon}
        {title}
      </p>
      <ul className="mt-1 max-h-32 overflow-y-auto pl-5 text-muted-foreground">
        {children}
      </ul>
    </div>
  );
}
