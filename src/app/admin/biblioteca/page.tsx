"use client";

import { AdminFileUpload } from "@/app/admin/_components/crud/admin-file-upload";
import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import { AdminPagination } from "@/app/admin/_components/crud/admin-pagination";
import { AdminSearchInput } from "@/app/admin/_components/crud/admin-search-input";
import { useAdminLibrary } from "@/hooks/use-admin";
import { useLibraryUpload, type UploadEntry } from "@/hooks/use-upload";
import type { LibraryAsset } from "@/lib/api/contracts";
import { cn } from "@/lib/utils";
import {
  Archive,
  Check,
  FileText,
  Image,
  Loader2,
  X,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

const PAGE_SIZE = 6;

type Tab = "photos" | "manuals" | "3d-models";

const TABS: { id: Tab; label: string }[] = [
  { id: "photos", label: "Fotos" },
  { id: "manuals", label: "Manuais" },
  { id: "3d-models", label: "Arquivos 3D" },
];

// ── Utilitários ────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

// ── Progresso de upload ────────────────────────────────────────────────────────

const STAGE_LABEL: Record<UploadEntry["status"], string> = {
  idle: "Na fila…",
  presigning: "Preparando…",
  uploading: "Enviando…",
  registering: "Registrando…",
  done: "Concluído",
  error: "Erro",
};

function UploadProgressList({
  entries,
  onClear,
}: {
  entries: UploadEntry[];
  onClear: () => void;
}) {
  if (entries.length === 0) return null;

  const allDone = entries.every(
    (e) => e.status === "done" || e.status === "error",
  );

  return (
    <div className="rounded-[16px] border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          Uploads em andamento
        </p>
        {allDone && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Limpar
          </button>
        )}
      </div>

      <ul className="space-y-2">
        {entries.map((entry) => (
          <li key={entry.id} className="flex items-center gap-3">
            {/* Ícone de status */}
            <span className="shrink-0">
              {entry.status === "done" ? (
                <Check className="size-4 text-green-500" />
              ) : entry.status === "error" ? (
                <X className="size-4 text-destructive" />
              ) : (
                <Loader2 className="size-4 animate-spin text-brand" />
              )}
            </span>

            {/* Nome e barra de progresso */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm text-foreground">
                  {entry.fileName}
                </span>
                <span
                  className={cn(
                    "shrink-0 text-xs",
                    entry.status === "done" && "text-green-500",
                    entry.status === "error" && "text-destructive",
                    !["done", "error"].includes(entry.status) &&
                      "text-muted-foreground",
                  )}
                >
                  {entry.status === "error"
                    ? entry.error
                    : STAGE_LABEL[entry.status]}
                </span>
              </div>

              {/* Barra de progresso */}
              {entry.status !== "error" && (
                <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      entry.status === "done" ? "bg-green-500" : "bg-brand",
                    )}
                    style={{ width: `${entry.progress}%` }}
                  />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Cards de foto ──────────────────────────────────────────────────────────────

function PhotoCard({ asset }: { asset: LibraryAsset }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(asset.file_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard não disponível */
    }
  }

  return (
    <div className="group relative flex flex-col gap-3 rounded-[16px] border border-border bg-card p-4">
      <div className="relative flex h-32 items-center justify-center overflow-hidden rounded-md bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset.file_url}
          alt={asset.alt ?? asset.name}
          className="h-full w-full rounded-md object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center rounded-[16px] bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-foreground shadow"
          >
            {copied ? (
              <>
                <Check className="size-3 text-green-600" />
                Copiado
              </>
            ) : (
              "Copiar URL"
            )}
          </button>
        </div>
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {asset.name}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatBytes(asset.size_bytes)}
          {asset.revision ? ` · Rev. ${asset.revision}` : ""}
        </p>
      </div>
    </div>
  );
}

// ── Tabela de arquivos ─────────────────────────────────────────────────────────

function FileTable({ assets }: { assets: LibraryAsset[] }) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Nome
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Produto
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Revisão
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Tamanho
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {assets.map((asset) => (
            <tr key={asset.id} className="hover:bg-muted/30">
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">{asset.name}</p>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {asset.product_id ?? "—"}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {asset.revision != null ? `v${asset.revision}` : "—"}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {formatBytes(asset.size_bytes)}
              </td>
              <td className="px-4 py-3 text-right">
                <a
                  href={asset.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-brand hover:underline"
                >
                  Abrir
                </a>
              </td>
            </tr>
          ))}
          {assets.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-8 text-center text-sm text-muted-foreground"
              >
                Nenhum arquivo encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Configuração por aba ───────────────────────────────────────────────────────

const UPLOAD_CONFIG: Record<
  Tab,
  {
    accept: string;
    label: string;
    description: string;
    icon: LucideIcon;
    libraryType: LibraryAsset["type"];
  }
> = {
  photos: {
    accept: "image/jpeg,image/png,image/webp,image/gif",
    label: "Clique ou arraste imagens para a biblioteca",
    description: "PNG, JPG, WebP, GIF — máx. 10 MB",
    icon: Image,
    libraryType: "IMAGE",
  },
  manuals: {
    accept: "application/pdf",
    label: "Clique ou arraste PDFs para a biblioteca",
    description: "Apenas arquivos PDF — máx. 50 MB",
    icon: FileText,
    libraryType: "PDF",
  },
  "3d-models": {
    accept: "model/gltf-binary,model/gltf+json,.glb,.gltf",
    label: "Clique ou arraste modelos 3D para a biblioteca",
    description: "GLB ou GLTF — máx. 100 MB",
    icon: Archive,
    libraryType: "MODEL3D",
  },
};

// ── Página principal ───────────────────────────────────────────────────────────

export default function AdminBibliotecaPage() {
  const [activeTab, setActiveTab] = useState<Tab>("photos");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const libraryQuery = useAdminLibrary();
  const { upload, entries, isUploading, clearFinished } = useLibraryUpload();

  const filtered = useMemo(() => {
    const allAssets = libraryQuery.data ?? [];
    const q = query.trim().toLowerCase();
    const config = UPLOAD_CONFIG[activeTab];
    return allAssets.filter((asset) => {
      const matchesSearch = !q || asset.name.toLowerCase().includes(q);
      const matchesTab = asset.type === config.libraryType;
      return matchesSearch && matchesTab;
    });
  }, [query, activeTab, libraryQuery.data]);

  const paginatedAssets = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  function handleSearch(q: string) {
    setQuery(q);
    setPage(1);
  }

  function handleTab(tab: Tab) {
    setActiveTab(tab);
    setPage(1);
    setQuery("");
  }

  const activeConfig = UPLOAD_CONFIG[activeTab];

  return (
    <AdminListPage
      title="Biblioteca"
      icon={Archive}
      toolbar={
        <div className="flex items-center gap-3">
          <AdminSearchInput
            value={query}
            onChange={handleSearch}
            placeholder="Buscar por nome"
            className="max-w-64"
          />
          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "arquivo" : "arquivos"}
          </span>
        </div>
      }
    >
      {/* Tabs */}
      <div className="flex border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTab(tab.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "border-b-2 border-brand text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Zona de upload */}
      <AdminFormSection title="Fazer upload">
        <AdminFileUpload
          multiple
          clearOnUpload
          accept={activeConfig.accept}
          label={activeConfig.label}
          description={activeConfig.description}
          icon={activeConfig.icon}
          disabled={isUploading}
          onUpload={upload}
        />
      </AdminFormSection>

      {/* Progresso de uploads em andamento */}
      <UploadProgressList entries={entries} onClear={clearFinished} />

      {/* Grid de fotos ou tabela de arquivos */}
      {activeTab === "photos" ? (
        paginatedAssets.length === 0 ? (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-12">
            <p className="text-sm text-muted-foreground">
              Nenhuma foto encontrada.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {paginatedAssets.map((asset) => (
              <PhotoCard key={asset.id} asset={asset} />
            ))}
          </div>
        )
      ) : (
        <FileTable assets={paginatedAssets} />
      )}

      {filtered.length > PAGE_SIZE && (
        <AdminPagination
          page={page}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          onPageChange={setPage}
        />
      )}
    </AdminListPage>
  );
}
