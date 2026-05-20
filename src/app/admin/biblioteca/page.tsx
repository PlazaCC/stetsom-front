"use client";

import { AdminFileUpload } from "@/app/admin/_components/crud/admin-file-upload";
import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import { AdminPagination } from "@/app/admin/_components/crud/admin-pagination";
import { AdminSearchInput } from "@/app/admin/_components/crud/admin-search-input";
import type { LibraryAsset, LibraryAssetType } from "@/lib/api/contracts";
import { MOCK_CMS_LIBRARY_ASSETS } from "@/lib/mock/admin-cms";
import { Archive, Check, FileText, Film, Image } from "lucide-react";
import { useMemo, useState } from "react";

const PAGE_SIZE = 6;

const TYPE_ICONS: Record<LibraryAssetType, React.ElementType> = {
  IMAGE: Image,
  PDF: FileText,
  VIDEO: Film,
  OTHER: Archive,
};

const TYPE_LABELS: Record<LibraryAssetType, string> = {
  IMAGE: "Imagem",
  PDF: "PDF",
  VIDEO: "Vídeo",
  OTHER: "Outro",
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function AssetCard({ asset }: { asset: LibraryAsset }) {
  const Icon = TYPE_ICONS[asset.type];
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(asset.file_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard not available */
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-[16px] border border-border bg-card p-4">
      <div className="flex h-32 items-center justify-center rounded-md bg-muted">
        {asset.type === "IMAGE" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset.file_url}
            alt={asset.alt ?? asset.name}
            className="h-full w-full rounded-md object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <Icon className="size-10 text-muted-foreground" />
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {asset.name}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {TYPE_LABELS[asset.type]} · {formatBytes(asset.size_bytes)}
        </p>
      </div>
      <div className="flex gap-2">
        <a
          href={asset.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-md border border-border py-1.5 text-center text-xs font-medium text-foreground hover:bg-muted"
        >
          Abrir
        </a>
        <button
          onClick={handleCopy}
          className="flex flex-1 items-center justify-center gap-1 rounded-md border border-border py-1.5 text-xs font-medium text-foreground hover:bg-muted"
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
  );
}

export default function AdminBibliotecaPage() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<LibraryAssetType | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_CMS_LIBRARY_ASSETS.filter((asset) => {
      const matchesSearch = !q || asset.name.toLowerCase().includes(q);
      const matchesType = typeFilter === "ALL" || asset.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [query, typeFilter]);

  const paginatedAssets = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  function handleFilter(type: LibraryAssetType | "ALL") {
    setTypeFilter(type);
    setPage(1);
  }

  function handleSearch(q: string) {
    setQuery(q);
    setPage(1);
  }

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
          <select
            value={typeFilter}
            onChange={(e) =>
              handleFilter(e.target.value as LibraryAssetType | "ALL")
            }
            className="h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="ALL">Todos os tipos</option>
            <option value="IMAGE">Imagens</option>
            <option value="PDF">PDFs</option>
            <option value="VIDEO">Vídeos</option>
            <option value="OTHER">Outros</option>
          </select>
          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "arquivo" : "arquivos"}
          </span>
        </div>
      }
    >
      <AdminFormSection title="Fazer upload">
        <AdminFileUpload
          multiple
          accept="image/*,.pdf,video/*"
          label="Clique ou arraste arquivos para a biblioteca"
          description="Imagens, PDFs e vídeos são aceitos"
        />
      </AdminFormSection>

      {paginatedAssets.length === 0 ? (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-12">
          <p className="text-sm text-muted-foreground">
            Nenhum arquivo encontrado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {paginatedAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
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
