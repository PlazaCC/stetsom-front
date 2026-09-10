"use client";

import {
  postApiPartnerLocationsImportWorkbook,
  postApiPartnerLocationsImport,
  type PartnerLocationType,
  type PostApiPartnerLocationsImport200,
} from "@/api/stetsom";
import type { PostApiPartnerLocationsImportWorkbook200 } from "@/api/stetsom/model/postApiPartnerLocationsImportWorkbook200";
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
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileUp,
  MapPinOff,
} from "lucide-react";
import { useRef, useState } from "react";

const EXPECTED_COLUMNS =
  "Nome Fantasia, Fone, Cidade, UF, CEP, Endereço, Número, E-mail, Site, Região, Especialidade, Latitude, Longitude";

const CORRECTION_COLUMNS = [
  ["Nome Fantasia", "name"],
  ["Fone", "phone"],
  ["Cidade", "city"],
  ["UF", "state"],
  ["CEP", "zip"],
  ["Endereço", "address"],
  ["Número", "number"],
  ["E-mail", "email"],
  ["Site", "website"],
  ["Região", "region"],
  ["Especialidade", "specialty"],
  ["Latitude", "lat"],
  ["Longitude", "lng"],
] as const;

type WorkbookReport = PostApiPartnerLocationsImportWorkbook200;
type CsvReport = PostApiPartnerLocationsImport200;
type ImportReport = WorkbookReport["report"] | CsvReport;
const MAX_RENDERED_REPORT_ITEMS = 100;

interface ImportPartnersDialogProps {
  type: PartnerLocationType;
  noun: string;
  onClose: () => void;
  onImported: () => void;
}

export function ImportPartnersDialog({
  type,
  noun,
  onClose,
  onImported,
}: ImportPartnersDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useAdminToast();
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [csv, setCsv] = useState("");
  const [csvReport, setCsvReport] = useState<CsvReport | null>(null);
  const [workbookReport, setWorkbookReport] = useState<WorkbookReport | null>(
    null,
  );
  const [selections, setSelections] = useState<
    Record<string, PartnerLocationType>
  >({});
  const [busy, setBusy] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    e.target.value = "";
    if (!selected) return;

    setFileName(selected.name);
    setFile(selected);
    setCsvReport(null);
    setWorkbookReport(null);
    setSelections({});

    if (selected.name.toLowerCase().endsWith(".xlsx")) {
      await runWorkbook(selected, true);
      return;
    }

    const text = await selected.text();
    setCsv(text);
    await runCsv(text, true);
  }

  async function runCsv(text: string, dryRun: boolean) {
    setBusy(true);
    try {
      const result = await postApiPartnerLocationsImport({
        csv: text,
        type,
        dry_run: dryRun,
      });
      setCsvReport(result);
      if (!dryRun) finishImport(result.created);
    } catch (err) {
      toast.apiError(err, "Não foi possível processar a planilha");
    } finally {
      setBusy(false);
    }
  }

  async function runWorkbook(selectedFile: File, dryRun: boolean) {
    setBusy(true);
    try {
      const result = await postApiPartnerLocationsImportWorkbook({
        file: selectedFile,
        dry_run: String(dryRun),
        selections: dryRun ? undefined : JSON.stringify(selections),
      });
      setWorkbookReport(result);
      if (dryRun) {
        setSelections(
          Object.fromEntries(
            result.sheets
              .filter((sheet) => sheet.status === "ready")
              .map(
                (sheet) => [sheet.name, sheet.suggestedType ?? type] as const,
              ),
          ),
        );
      } else {
        finishImport(result.report.created);
      }
    } catch (err) {
      toast.apiError(err, "Não foi possível processar o arquivo XLSX");
    } finally {
      setBusy(false);
    }
  }

  function finishImport(created: number) {
    toast.success(
      `${created} ${created === 1 ? "registro importado" : "registros importados"}`,
    );
    onImported();
    onClose();
  }

  function downloadCorrections() {
    if (!workbookReport) return;
    const rowsByLocation = new Map<
      string,
      { values: string[]; details: string[]; orientations: string[] }
    >();
    const sheetsByName = new Map(
      workbookReport.sheets.map((sheet) => [sheet.name, sheet]),
    );

    for (const error of workbookReport.report.errors) {
      if (!error.sheet || !error.original) continue;
      const sheet = sheetsByName.get(error.sheet);
      const sourceRow = sheet?.rows.find((row) => row.line === error.line);
      if (!sourceRow) continue;
      const key = `${error.sheet}:${error.line}`;
      const current = rowsByLocation.get(key) ?? {
        values: CORRECTION_COLUMNS.map(
          ([, field]) => sourceRow.values[field] ?? "",
        ),
        details: [],
        orientations: [],
      };
      current.details.push(`${error.field ?? "linha"}: ${error.reason}`);
      if (error.orientation) current.orientations.push(error.orientation);
      rowsByLocation.set(key, current);
    }

    if (rowsByLocation.size === 0) return;

    const correctionRows = [
      [
        ...CORRECTION_COLUMNS.map(([label]) => label),
        "Problema encontrado",
        "Orientação para correção",
      ],
      ...Array.from(rowsByLocation.values()).map((row) => [
        ...row.values,
        row.details.join(" | "),
        row.orientations.join(" | "),
      ]),
    ];
    const reportRows = [
      ["Aba", "Linha original", "Campo", "Problema", "Orientação"],
      ...workbookReport.report.errors
        .filter((error) => error.sheet)
        .map((error) => [
          error.sheet ?? "",
          String(error.line),
          error.field ?? "",
          error.reason,
          error.orientation ?? "",
        ]),
    ];

    void import("@e965/xlsx")
      .then(({ utils, writeFile }) => {
        const workbook = utils.book_new();
        utils.book_append_sheet(
          workbook,
          utils.aoa_to_sheet(correctionRows),
          "Corrigir - Rede Nacional",
        );
        utils.book_append_sheet(
          workbook,
          utils.aoa_to_sheet(reportRows),
          "Relatório",
        );
        writeFile(workbook, "correcoes-rede-autorizada.xlsx");
      })
      .catch(() => {
        toast.error("Não foi possível gerar a planilha de correções");
      });
  }

  const report: ImportReport | null =
    workbookReport?.report ?? csvReport ?? null;
  const isWorkbook = Boolean(workbookReport);
  const selectedSheetCount = Object.keys(selections).length;
  const canCommit = Boolean(
    report &&
    report.valid > 0 &&
    !busy &&
    (!isWorkbook || selectedSheetCount > 0),
  );

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Importar {noun}s por planilha</DialogTitle>
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
              {fileName || "Selecionar arquivo XLSX ou CSV"}
            </Button>
            <a
              href="/templates/rede-autorizada-nacional.xlsx"
              download
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-2 text-sm font-medium text-primary hover:bg-muted"
            >
              <Download className="size-4" />
              Baixar modelo
            </a>
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
              hidden
              onChange={handleFile}
            />
            <p className="basis-full text-xs text-muted-foreground">
              XLSX aceita múltiplas abas. CSV continua disponível. Colunas do
              modelo: {EXPECTED_COLUMNS}.
            </p>
          </div>

          {busy && !report && (
            <p className="text-sm text-muted-foreground">Validando planilha…</p>
          )}

          {workbookReport && (
            <div className="space-y-3 rounded-md border border-border p-3">
              <p className="text-sm font-medium">Abas encontradas</p>
              <div className="space-y-2">
                {workbookReport.sheets.map((sheet) => (
                  <div
                    key={sheet.name}
                    className="rounded-md border border-border p-3"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      {sheet.status === "ready" && (
                        <input
                          type="checkbox"
                          checked={Boolean(selections[sheet.name])}
                          onChange={(event) => {
                            setSelections((current) => {
                              const next = { ...current };
                              if (event.target.checked) {
                                next[sheet.name] = sheet.suggestedType ?? type;
                              } else {
                                delete next[sheet.name];
                              }
                              return next;
                            });
                          }}
                          aria-label={`Selecionar aba ${sheet.name}`}
                        />
                      )}
                      <span className="font-medium">{sheet.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {sheet.status === "ready"
                          ? `${sheet.rows.length} linha(s)`
                          : sheet.status === "ignored"
                            ? "Informativa"
                            : "Não suportada"}
                      </span>
                      {sheet.status === "ready" && (
                        <select
                          value={
                            selections[sheet.name] ??
                            sheet.suggestedType ??
                            type
                          }
                          disabled={!selections[sheet.name]}
                          onChange={(event) =>
                            setSelections((current) => ({
                              ...current,
                              [sheet.name]: event.target
                                .value as PartnerLocationType,
                            }))
                          }
                          className="ml-auto h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground"
                          aria-label={`Tipo da aba ${sheet.name}`}
                        >
                          <option value="SERVICE_CENTER">
                            Assistência técnica
                          </option>
                          <option value="REPRESENTATIVE">Representante</option>
                        </select>
                      )}
                    </div>
                    {sheet.reason && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {sheet.reason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {report && <ImportReportView report={report} />}

          {workbookReport && workbookReport.report.errors.length > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={downloadCorrections}
            >
              <Download className="size-4" />
              Baixar planilha com erros
            </Button>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={!canCommit}
            onClick={() => {
              if (workbookReport && file) void runWorkbook(file, false);
              else void runCsv(csv, false);
            }}
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

function ImportReportView({ report }: { report: ImportReport }) {
  return (
    <div className="space-y-3 rounded-md border border-border p-3">
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <span className="text-muted-foreground">
          Linhas lidas: <strong>{report.total}</strong>
        </span>
        <span className="text-muted-foreground">
          A importar: <strong>{report.valid}</strong>
        </span>
        <span className="text-muted-foreground">
          Avisos: <strong>{report.warnings.length}</strong>
        </span>
        <span className="text-muted-foreground">
          Erros: <strong>{report.errors.length}</strong>
        </span>
      </div>

      {report.valid > 0 && (
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
          Nada foi gravado ainda. Confirme para importar os registros válidos.
        </p>
      )}

      {report.skipped.length > 0 && (
        <ReportGroup
          icon={<AlertTriangle className="size-3.5 shrink-0" />}
          title={`${report.skipped.length} duplicado(s) — serão ignorados`}
          items={report.skipped.map(
            (item) =>
              `${item.sheet ? `${item.sheet}, ` : ""}linha ${item.line}: ${item.name}`,
          )}
        />
      )}

      {report.withoutCoordinates.length > 0 && (
        <ReportGroup
          icon={<MapPinOff className="size-3.5 shrink-0" />}
          title={`${report.withoutCoordinates.length} sem coordenadas — não aparecerão no mapa`}
          items={report.withoutCoordinates.map(
            (item) =>
              `${item.sheet ? `${item.sheet}, ` : ""}linha ${item.line}: ${item.name}`,
          )}
        />
      )}

      {report.warnings.length > 0 && (
        <ReportGroup
          icon={<AlertTriangle className="size-3.5 shrink-0" />}
          title={`${report.warnings.length} aviso(s) — serão importados`}
          items={report.warnings.map(formatIssue)}
        />
      )}

      {report.errors.length > 0 && (
        <ReportGroup
          destructive
          icon={<AlertTriangle className="size-3.5 shrink-0" />}
          title={`${report.errors.length} erro(s) — linhas serão ignoradas`}
          items={report.errors.map(formatIssue)}
        />
      )}
    </div>
  );
}

function formatIssue(issue: {
  sheet?: string;
  line: number;
  field?: string;
  reason: string;
}) {
  const location = issue.line > 0 ? `linha ${issue.line}` : "arquivo";
  return `${issue.sheet ? `${issue.sheet}, ` : ""}${location}${issue.field ? ` (${issue.field})` : ""}: ${issue.reason}`;
}

function ReportGroup({
  icon,
  title,
  items,
  destructive,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  destructive?: boolean;
}) {
  const visibleItems = items.slice(0, MAX_RENDERED_REPORT_ITEMS);
  const hiddenCount = items.length - visibleItems.length;

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
      <ul className="mt-1 max-h-40 overflow-y-auto pl-5 text-muted-foreground">
        {visibleItems.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
        {hiddenCount > 0 && (
          <li>Mais {hiddenCount} item(ns) não exibido(s).</li>
        )}
      </ul>
    </div>
  );
}
