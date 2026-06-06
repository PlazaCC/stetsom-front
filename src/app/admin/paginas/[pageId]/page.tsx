"use client";

import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import { AdminSectionTemplateCard } from "@/app/admin/_components/crud/admin-section-template-card";
import { useGetApiPagesSlugCms } from "@/api/stetsom";
import { FileText, ExternalLink } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { PAGE_LABELS, PAGE_PUBLIC_HREFS } from "../_components/page-constants";

interface PageParams {
  pageId: string;
}

export default function AdminPageSectionsPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { pageId } = use(params);
  const { data: page, isLoading } = useGetApiPagesSlugCms(pageId);

  const blocks = page?.blocks ?? [];
  const label = page?.title?.pt ?? PAGE_LABELS[pageId] ?? pageId;
  const publicHref = PAGE_PUBLIC_HREFS[pageId] ?? `/${pageId}`;

  return (
    <AdminListPage
      title={label}
      icon={FileText}
      toolbar={
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground">
            Edite as seções desta página. Alterações ficam visíveis no site
            imediatamente.
          </p>
          <a
            href={publicHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="size-3" />
            Ver no site
          </a>
        </div>
      }
    >
      <div className="mb-2">
        <Link
          href="/admin/paginas"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ← Todas as páginas
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-[12px] bg-muted"
            />
          ))}
        </div>
      ) : blocks.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma seção encontrada para esta página.
        </p>
      ) : (
        <div className="space-y-3">
          {blocks
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((block) => (
              <AdminSectionTemplateCard
                key={block.block_id}
                section={{
                  id: block.block_id,
                  type: block.type,
                  name: block.type,
                  order: block.order,
                  updated_at: page?.updated_at,
                  is_editable: true,
                }}
                editHref={`/admin/paginas/${pageId}/${block.block_id}`}
              />
            ))}
        </div>
      )}
    </AdminListPage>
  );
}
