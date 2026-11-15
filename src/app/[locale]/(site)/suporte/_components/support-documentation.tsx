import { Container } from "@/components/ui/container";
import { PublicEmptyState } from "@/components/ui/public-empty-state";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/utils";
import { Download, FileDown, FileText, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { type SubmitEvent, useState } from "react";

type DocCategory = { category: string; count: number };
type DocFile = {
  asset_id: string;
  filename: string;
  file_url: string;
  type: string;
  size_bytes: number;
  product: { name: string; sku: string | null };
};

const CATEGORY_LABEL_KEYS = {
  MANUAL: "category.manual",
  CATALOG: "category.catalog",
  CERTIFICATE: "category.certificate",
  IMAGE: "category.image",
  CDS_AND_PHOTOS: "category.cdsAndPhotos",
  WALLPAPERS_AND_BANNERS: "category.wallpapersAndBanners",
  LOGOS: "category.logos",
} as const;

interface SupportDocumentationProps {
  header?: { label?: string; title?: string; description?: string };
  categories: DocCategory[];
  files: DocFile[];
  currentPage: number;
  total: number;
  totalPages: number;
  activeCategory?: string;
  searchQuery: string;
}

export function SupportDocumentation({
  header,
  categories,
  files,
  currentPage,
  total,
  totalPages,
  activeCategory,
  searchQuery,
}: Readonly<SupportDocumentationProps>) {
  const t = useTranslations("Support.documentation");
  const router = useRouter();
  const [query, setQuery] = useState(searchQuery);

  function navigate(next: { page?: number; category?: string; q?: string }) {
    const params = new URLSearchParams();
    if (next.page && next.page > 1) params.set("page", String(next.page));
    if (next.category) params.set("category", next.category);
    if (next.q?.trim()) params.set("q", next.q.trim());
    router.push(
      {
        pathname: "/suporte",
        query: Object.fromEntries(params.entries()),
      },
      { scroll: false },
    );
  }

  function submitSearch(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate({ category: activeCategory, q: query, page: 1 });
  }
  function getFileTypeName(type: string) {
    const key = CATEGORY_LABEL_KEYS[type as keyof typeof CATEGORY_LABEL_KEYS];
    return key ? t(key) : type;
  }

  return (
    <section
      id="documentation"
      className="w-full scroll-mt-header bg-off-white py-12"
    >
      <Container>
        <SectionLabel
          label={header?.label || t("label")}
          title={header?.title || t("title")}
        />
        {header?.description && (
          <p className="mt-2 text-sm text-text-subtle">{header.description}</p>
        )}
        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Categorias */}
          {categories.length > 0 && (
            <div className="flex shrink-0 gap-1 overflow-x-auto pb-1 lg:w-32 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0">
              <button
                type="button"
                onClick={() => navigate({ q: searchQuery, page: 1 })}
                className={cn(
                  "min-w-max px-3 py-2.5 text-left font-sans text-xs leading-5 transition-colors lg:w-full",
                  !activeCategory
                    ? "border-l-2 border-brand bg-[#ededed] font-medium text-brand-dark"
                    : "border-l-2 border-transparent text-text-subtle hover:text-brand-dark",
                )}
              >
                {t("allCategories")}
              </button>
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.category}
                  onClick={() =>
                    navigate({
                      category: cat.category,
                      q: searchQuery,
                      page: 1,
                    })
                  }
                  className={cn(
                    "min-w-max px-3 py-2.5 text-left font-sans text-xs leading-5 transition-colors lg:w-full",
                    activeCategory === cat.category
                      ? "border-l-2 border-brand bg-[#ededed] font-medium text-brand-dark"
                      : "border-l-2 border-transparent text-text-subtle hover:text-brand-dark",
                  )}
                >
                  {getFileTypeName(cat.category)}
                </button>
              ))}
            </div>
          )}

          {/* Busca e lista de arquivos */}
          <div className="flex min-w-0 flex-1 flex-col">
            <form
              onSubmit={submitSearch}
              className="mb-5 flex h-10 items-center gap-2 border border-border bg-white px-3 focus-within:border-brand"
            >
              <Search size={16} className="shrink-0 text-icon-muted" />
              <input
                type="search"
                placeholder={t("searchPlaceholder")}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 border-none bg-transparent text-sm outline-none placeholder:text-icon-muted"
              />
            </form>
            {files.length === 0 && (
              <PublicEmptyState
                icon={FileDown}
                title={t("emptyTitle")}
                description={t("emptyDescription")}
                className="min-h-72 bg-transparent"
              />
            )}
            {files.length > 0 && (
              <div className="max-h-[420px] [scrollbar-width:thin] [scrollbar-color:var(--color-border)_transparent] overflow-y-auto border-y border-border pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border">
                {files.map((file) => (
                  <div
                    key={`${file.asset_id}:${file.product.sku ?? file.product.name}`}
                    className="flex min-h-16 items-center justify-between border-b border-border bg-white px-4 py-3 transition-colors last:border-b-0 hover:bg-muted/40"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded bg-muted text-icon-muted">
                        <FileText size={22} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-sans text-sm font-medium text-foreground">
                          {file.filename}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-sans text-xs text-text-subtle">
                          <span className="rounded bg-muted px-1.5 py-0.5 text-2xs font-bold tracking-wide uppercase">
                            {file.product.name}
                          </span>
                          <span>{getFileTypeName(file.type)}</span>
                          {file.product.sku && (
                            <span>• {file.product.sku}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <a
                      href={file.file_url}
                      download={file.filename}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${t("downloadLabel")} ${file.filename}`}
                      className="ml-4 inline-flex shrink-0 items-center gap-1.5 font-sans text-2xs font-bold tracking-[0.6px] text-brand uppercase transition-colors hover:text-brand/80"
                    >
                      <Download size={14} />
                      {t("downloadLabel")}
                    </a>
                  </div>
                ))}
              </div>
            )}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() =>
                    navigate({
                      page: currentPage - 1,
                      category: activeCategory,
                      q: searchQuery,
                    })
                  }
                  className="h-10 border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-brand disabled:opacity-40 disabled:hover:text-muted-foreground"
                >
                  {t("paginationPrevious")}
                </button>
                <span className="font-sans text-sm text-muted-foreground">
                  {t("paginationInfo", {
                    page: currentPage,
                    total: totalPages,
                    count: total,
                  })}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() =>
                    navigate({
                      page: currentPage + 1,
                      category: activeCategory,
                      q: searchQuery,
                    })
                  }
                  className="h-10 border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-brand disabled:opacity-40 disabled:hover:text-muted-foreground"
                >
                  {t("paginationNext")}
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
