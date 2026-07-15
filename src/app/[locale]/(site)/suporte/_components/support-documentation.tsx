import { Container } from "@/components/ui/container";
import { PublicEmptyState } from "@/components/ui/public-empty-state";
import { SectionLabel } from "@/components/ui/section-label";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Download, FileDown, FileText, Search } from "lucide-react";
import { useTranslations } from "next-intl";

type DocCategory = { id: string; title: string; label: string; slug: string };
type DocFile = {
  id: string;
  name?: string;
  file_url: string;
  type: string;
  version: number;
  fileSize?: string;
  category_slug?: string;
};

interface SupportDocumentationProps {
  categories: DocCategory[];
  files: DocFile[];
}

export function SupportDocumentation({
  categories,
  files,
}: Readonly<SupportDocumentationProps>) {
  const t = useTranslations("Support.documentation");

  function getFileTypeName(type: string) {
    if (type === "MANUAL") return t("typeManual");
    if (type === "CERTIFICATE") return t("typeCertificate");
    if (type === "CATALOG") return t("typeCatalog");
    if (type === "IMAGE") return t("typeImage");
    return type;
  }

  function getFilePrefix(type: string) {
    if (type === "MANUAL") return t("fileManualPrefix");
    if (type === "CERTIFICATE") return t("fileCertificatePrefix");
    if (type === "CATALOG") return t("fileCatalogPrefix");
    if (type === "IMAGE") return t("fileImagePrefix");
    return "";
  }

  return (
    <section className="w-full bg-off-white py-12">
      <Container>
        <SectionLabel label={t("label")} title={t("title")} />
        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Sidebar de categorias */}
          {categories.length > 0 && (
            <div className="flex shrink-0 flex-col gap-1 lg:w-64">
              <div className="mb-2 flex h-10 items-center gap-2 border border-border bg-white px-3">
                <Search size={14} className="shrink-0 text-icon-muted" />
                <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  className="flex-1 border-none bg-transparent text-sm outline-none placeholder:text-icon-muted"
                />
              </div>
              {categories.map((cat, index) => (
                <button
                  key={cat.id}
                  className={cn(
                    "flex items-center px-4 py-2.5 text-left font-sans text-sm transition-colors",
                    index === 0
                      ? "border-l-2 border-brand bg-white font-medium text-brand-dark"
                      : "border-l-2 border-transparent text-text-subtle hover:border-border hover:text-brand-dark",
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Lista de arquivos */}
          <div className="flex flex-1 flex-col gap-3">
            {files.length === 0 && (
              <PublicEmptyState
                icon={FileDown}
                title={t("emptyTitle")}
                description={t("emptyDescription")}
                className="min-h-72 bg-transparent"
              />
            )}
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between border border-border bg-white px-5 py-4 transition-colors hover:border-brand"
              >
                <div className="flex items-center gap-4">
                  <FileText size={20} className="shrink-0 text-brand" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-sans text-sm font-medium text-foreground">
                        {file.name ??
                          `${getFilePrefix(file.type)} — ${t("fileDocVersion", { version: file.version })}`}
                      </p>
                      <span className="rounded bg-muted px-1.5 py-0.5 font-sans text-2xs font-bold tracking-wide text-muted-foreground uppercase">
                        V{file.version}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-text-subtle">
                      {getFileTypeName(file.type)}
                      {file.fileSize && ` • PDF • ${file.fileSize}`}
                    </p>
                  </div>
                </div>
                <Link
                  href={file.file_url}
                  className="inline-flex shrink-0 items-center gap-1.5 font-sans text-2xs font-bold tracking-[0.6px] text-brand uppercase transition-colors hover:text-brand/80"
                >
                  <Download size={14} />
                  {t("downloadLabel")}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
