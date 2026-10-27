"use client";

import {
  postApiPartnerLocationsImportWorkbookDiscover,
  postApiPartnerLocationsImportWorkbook,
  type PartnerLocationType,
  type PostApiPartnerLocationsImportWorkbookDiscover200,
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
  MapPin,
} from "lucide-react";
import { useRef, useState } from "react";

const EXPECTED_COLUMNS =
  "Nome Fantasia, Fone, Cidade, Estado/Província, País, Código postal, Endereço, Número, E-mail, Site, Especialidade";

type WorkbookReport = PostApiPartnerLocationsImportWorkbook200;
type ImportReport = WorkbookReport["report"];
type WorkbookDiscovery = PostApiPartnerLocationsImportWorkbookDiscover200;
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
  const importInFlightRef = useRef(false);
  const toast = useAdminToast();
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [workbookReport, setWorkbookReport] = useState<WorkbookReport | null>(
    null,
  );
  const [discovery, setDiscovery] = useState<WorkbookDiscovery | null>(null);
  const [importReport, setImportReport] = useState<ImportReport | null>(null);
  const [phase, setPhase] = useState<"setup" | "result">("setup");
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
    setWorkbookReport(null);
    setDiscovery(null);
    setImportReport(null);
    setSelections({});
    setPhase("setup");

    if (!selected.name.toLowerCase().endsWith(".xlsx")) {
      toast.error("Selecione um arquivo XLSX para importar parceiros");
      setFile(null);
      setFileName("");
      return;
    }
    await inspectWorkbook(selected);
  }

  async function inspectWorkbook(selectedFile: File) {
    setBusy(true);
    try {
      const result = await postApiPartnerLocationsImportWorkbookDiscover({
        file: selectedFile,
      });
      setDiscovery(result);
      setSelections(
        Object.fromEntries(
          result.sheets
            .filter((sheet) => sheet.status === "ready")
            .map((sheet) => [sheet.name, sheet.suggestedType ?? type] as const),
        ),
      );
    } catch (err) {
      toast.apiError(err, "Não foi possível processar o arquivo XLSX");
    } finally {
      setBusy(false);
    }
  }

  async function importWorkbook() {
    if (!file || importInFlightRef.current) return;
    importInFlightRef.current = true;
    setBusy(true);
    try {
      const result = await postApiPartnerLocationsImportWorkbook({
        file,
        selections: JSON.stringify(selections),
      });
      setWorkbookReport(result);
      setImportReport(result.report);
      setPhase("result");
      onImported();
      if (result.report.created > 0) {
        toast.success(
          `${result.report.created} ${result.report.created === 1 ? "registro importado" : "registros importados"}`,
        );
      }
    } catch (err) {
      toast.apiError(err, "Não foi possível importar o arquivo XLSX");
    } finally {
      importInFlightRef.current = false;
      setBusy(false);
    }
  }

  function downloadCorrections() {
    if (!file || !workbookReport || !importReport) return;
    const errorLinesBySheet = new Map<string, Set<number>>();
    for (const error of importReport.errors) {
      if (!error.sheet || error.line <= 0) continue;
      const lines = errorLinesBySheet.get(error.sheet) ?? new Set<number>();
      lines.add(error.line);
      errorLinesBySheet.set(error.sheet, lines);
    }
    if (errorLinesBySheet.size === 0) return;

    void file
      .arrayBuffer()
      .then((buffer) => import("@e965/xlsx").then((XLSX) => ({ XLSX, buffer })))
      .then(({ XLSX, buffer }) => {
        const workbook = XLSX.read(buffer, { cellStyles: true, cellNF: true });
        const metadata = new Map(
          workbookReport.sheets.map((sheet) => [sheet.name, sheet]),
        );

        for (const name of workbook.SheetNames) {
          const source = workbook.Sheets[name];
          const sheet = metadata.get(name);
          const errorLines = errorLinesBySheet.get(name) ?? new Set<number>();
          const headerRow = sheet?.headerRow;
          if (!source || !headerRow) continue;
          const range = source["!ref"]
            ? XLSX.utils.decode_range(source["!ref"])
            : null;
          if (!range) continue;
          const filtered: typeof source = {
            "!ref": XLSX.utils.encode_range({
              s: range.s,
              e: { c: range.e.c, r: headerRow - 1 + errorLines.size },
            }),
          };
          for (const [key, value] of Object.entries(source)) {
            if (key.startsWith("!")) continue;
            const address = XLSX.utils.decode_cell(key);
            if (address.r < headerRow) filtered[key] = value;
          }
          const originalRows = [...errorLines].sort((a, b) => a - b);
          originalRows.forEach((line, index) => {
            for (let column = range.s.c; column <= range.e.c; column += 1) {
              const from = XLSX.utils.encode_cell({ c: column, r: line - 1 });
              const to = XLSX.utils.encode_cell({
                c: column,
                r: headerRow + index,
              });
              if (source[from]) filtered[to] = source[from];
            }
          });
          filtered["!cols"] = source["!cols"];
          filtered["!rows"] = source["!rows"];
          filtered["!merges"] = source["!merges"]?.filter(
            (merge) => merge.e.r < headerRow,
          );
          workbook.Sheets[name] = filtered;
        }
        XLSX.writeFile(workbook, "correcoes-parceiros.xlsx");
      })
      .catch(() => {
        toast.error("Não foi possível gerar a planilha de correções");
      });
  }

  const selectedSheetCount = Object.keys(selections).length;
  const canCommit = Boolean(file && !busy && selectedSheetCount > 0);

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
              {fileName || "Selecionar arquivo XLSX"}
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
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              hidden
              onChange={handleFile}
            />
            <p className="basis-full text-xs text-muted-foreground">
              Selecione as abas e informe o tipo de parceiro antes de importar.
              Colunas do modelo: {EXPECTED_COLUMNS}. Latitude e longitude não
              fazem parte do formato oficial.
            </p>
          </div>

          {busy && !importReport && (
            <p className="text-sm text-muted-foreground">Lendo planilha…</p>
          )}

          {phase === "setup" && discovery && (
            <div className="space-y-3 rounded-md border border-border p-3">
              <p className="text-sm font-medium">Abas encontradas</p>
              <div className="space-y-2">
                {discovery.sheets.map((sheet) => (
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
                          ? `${sheet.rowCount} linha(s)`
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

          {phase === "result" && importReport && (
            <ImportReportView report={importReport} />
          )}

          {phase === "result" &&
            importReport &&
            importReport.errors.length > 0 && (
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
          {phase === "result" ? (
            <Button type="button" onClick={onClose}>
              Concluir
            </Button>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                type="button"
                disabled={!canCommit}
                onClick={() => void importWorkbook()}
              >
                {busy
                  ? "Importando…"
                  : `Importar ${selectedSheetCount} ${selectedSheetCount === 1 ? "aba selecionada" : "abas selecionadas"}`}
              </Button>
            </>
          )}
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
          Importados: <strong>{report.created}</strong>
        </span>
        <span className="text-muted-foreground">
          Avisos: <strong>{report.warnings.length}</strong>
        </span>
        <span className="text-muted-foreground">
          Erros: <strong>{report.errors.length}</strong>
        </span>
      </div>

      {report.created > 0 && (
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
          Registros válidos foram importados com sucesso.
        </p>
      )}

      {report.skipped.length > 0 && (
        <ReportGroup
          icon={<AlertTriangle className="size-3.5 shrink-0" />}
          title={`${report.skipped.length} duplicado(s) — ignorados`}
          items={report.skipped.map(
            (item) =>
              `${item.sheet ? `${item.sheet}, ` : ""}linha ${item.line}: ${item.name}`,
          )}
        />
      )}

      {report.queuedForGeocoding.length > 0 && (
        <ReportGroup
          icon={<MapPin className="size-3.5 shrink-0" />}
          title={`${report.queuedForGeocoding.length} endereço(s) na fila de geocodificação`}
          items={report.queuedForGeocoding.map(
            (item) =>
              `${item.sheet ? `${item.sheet}, ` : ""}linha ${item.line}: ${item.name}`,
          )}
        />
      )}

      {report.warnings.length > 0 && (
        <ReportGroup
          icon={<AlertTriangle className="size-3.5 shrink-0" />}
          title={`${report.warnings.length} aviso(s)`}
          items={report.warnings.map(formatIssue)}
        />
      )}

      {report.errors.length > 0 && (
        <ReportGroup
          destructive
          icon={<AlertTriangle className="size-3.5 shrink-0" />}
          title={`${report.errors.length} erro(s) — linhas não foram importadas`}
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
