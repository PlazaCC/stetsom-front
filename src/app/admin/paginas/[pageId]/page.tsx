"use client";

import {
  getGetApiPagesSlugCmsQueryKey,
  patchApiPagesSlugBlocksBlockId,
  postApiPagesSlugBlocks,
  useGetApiPagesSlugCms,
} from "@/api/stetsom";
import type { PageBlock } from "@/api/stetsom/model";
import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import { SortableList } from "@/app/admin/_components/crud/sortable-list";
import {
  findSectionDef,
  getPageSections,
} from "@/app/admin/paginas/_components/section-field-spec";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  LayoutTemplate,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { PAGE_LABELS, PAGE_PUBLIC_HREFS } from "../_components/page-constants";

interface PageParams {
  pageId: string;
}

function isHidden(block: PageBlock): boolean {
  return Boolean((block.data as Record<string, unknown> | undefined)?.hidden);
}

export default function AdminPageSectionsPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { pageId } = use(params);
  const queryClient = useQueryClient();
  const { data: page, isLoading } = useGetApiPagesSlugCms(pageId);

  // Optimistic local ordering; reset to query data after add/toggle/error.
  const [localBlocks, setLocalBlocks] = useState<PageBlock[] | null>(null);

  const blocks =
    localBlocks ??
    (page?.blocks ?? []).slice().sort((a, b) => a.order - b.order);

  const label = page?.title?.pt ?? PAGE_LABELS[pageId] ?? pageId;
  const publicHref = PAGE_PUBLIC_HREFS[pageId] ?? `/${pageId}`;

  // Known sections not yet present on this page → can be added back.
  const presentIds = new Set(blocks.map((b) => b.section_id));
  const missingDefs = getPageSections(pageId).filter(
    (def) => !presentIds.has(def.section_id),
  );

  function invalidate() {
    setLocalBlocks(null);
    queryClient.invalidateQueries({
      queryKey: getGetApiPagesSlugCmsQueryKey(pageId),
    });
  }

  const reorderMutation = useMutation({
    mutationFn: (ordered: PageBlock[]) => {
      // Only PATCH blocks whose order actually changed.
      const changed = ordered.filter((b, i) => b.order !== i);
      return Promise.all(
        changed.map((b) =>
          patchApiPagesSlugBlocksBlockId(pageId, b.block_id, {
            order: ordered.indexOf(b),
          }),
        ),
      );
    },
    onError: invalidate, // revert optimistic order on failure
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: getGetApiPagesSlugCmsQueryKey(pageId),
      }),
  });

  const toggleMutation = useMutation({
    mutationFn: (block: PageBlock) =>
      patchApiPagesSlugBlocksBlockId(pageId, block.block_id, {
        data: {
          ...(block.data as Record<string, unknown>),
          hidden: !isHidden(block),
        },
      }),
    onSuccess: invalidate,
  });

  const addMutation = useMutation({
    mutationFn: (sectionId: string) => {
      const def = findSectionDef(pageId, sectionId);
      return postApiPagesSlugBlocks(pageId, {
        section_id: sectionId,
        type: def?.type ?? "TEXT",
        order: blocks.length,
      });
    },
    onSuccess: invalidate,
  });

  function handleReorder(ordered: PageBlock[]) {
    setLocalBlocks(ordered);
    reorderMutation.mutate(ordered);
  }

  return (
    <AdminListPage
      title={label}
      icon={FileText}
      toolbar={
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground">
            Arraste para reordenar. Use o olho para mostrar/ocultar uma seção.
            As alterações ficam visíveis no site imediatamente.
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
          Esta página ainda não tem seções.
        </p>
      ) : (
        <SortableList
          items={blocks}
          getId={(b) => b.block_id}
          onReorder={handleReorder}
          renderItem={(block, handle) => {
            const def = findSectionDef(pageId, block.section_id);
            const Icon = def?.icon ?? LayoutTemplate;
            const hidden = isHidden(block);
            return (
              <div
                className={`flex items-center gap-3 rounded-[12px] border border-border bg-card px-4 py-3 ${
                  hidden ? "opacity-60" : ""
                }`}
              >
                {handle}
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {def?.label ?? block.section_id}
                    {def?.kind === "auto" && (
                      <span className="ml-2 text-2xs font-normal text-muted-foreground">
                        (automático)
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {hidden ? "Oculta no site" : "Visível no site"}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={hidden ? "Mostrar seção" : "Ocultar seção"}
                  title={hidden ? "Mostrar no site" : "Ocultar do site"}
                  disabled={toggleMutation.isPending}
                  onClick={() => toggleMutation.mutate(block)}
                  className="shrink-0 rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
                >
                  {hidden ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
                <Link
                  href={`/admin/paginas/${pageId}/${block.block_id}`}
                  className="shrink-0 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Editar
                </Link>
              </div>
            );
          }}
        />
      )}

      {missingDefs.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Seções disponíveis
          </h2>
          <div className="space-y-2">
            {missingDefs.map((def) => {
              const Icon = def.icon;
              return (
                <button
                  key={def.section_id}
                  type="button"
                  disabled={addMutation.isPending}
                  onClick={() => addMutation.mutate(def.section_id)}
                  className="flex w-full items-center gap-3 rounded-[12px] border border-dashed border-border bg-card px-4 py-3 text-left transition-colors hover:border-brand disabled:opacity-50"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {def.label}
                    </p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-brand">
                    <Plus className="size-4" />
                    Adicionar
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </AdminListPage>
  );
}
