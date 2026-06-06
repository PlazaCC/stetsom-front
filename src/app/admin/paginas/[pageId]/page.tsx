"use client";

import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import { SortableList } from "@/app/admin/_components/crud/sortable-list";
import {
  PAGE_SECTION_CATALOG,
  findSectionTemplate,
} from "@/app/admin/paginas/_components/page-section-catalog";
import {
  deleteApiPagesSlugBlocksBlockId,
  getGetApiPagesSlugCmsQueryKey,
  patchApiPagesSlugBlocksBlockId,
  postApiPagesSlugBlocks,
  useGetApiPagesSlugCms,
} from "@/api/stetsom";
import type { PageBlock } from "@/api/stetsom/model";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ExternalLink,
  FileText,
  LayoutTemplate,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
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
  const queryClient = useQueryClient();
  const { data: page, isLoading } = useGetApiPagesSlugCms(pageId);

  // Optimistic local ordering; reset to query data after add/remove.
  const [localBlocks, setLocalBlocks] = useState<PageBlock[] | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const blocks =
    localBlocks ??
    (page?.blocks ?? []).slice().sort((a, b) => a.order - b.order);

  const label = page?.title?.pt ?? PAGE_LABELS[pageId] ?? pageId;
  const publicHref = PAGE_PUBLIC_HREFS[pageId] ?? `/${pageId}`;

  function invalidate() {
    setLocalBlocks(null);
    queryClient.invalidateQueries({
      queryKey: getGetApiPagesSlugCmsQueryKey(pageId),
    });
  }

  const reorderMutation = useMutation({
    mutationFn: (ordered: PageBlock[]) =>
      Promise.all(
        ordered.map((b, i) =>
          patchApiPagesSlugBlocksBlockId(pageId, b.block_id, { order: i }),
        ),
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: getGetApiPagesSlugCmsQueryKey(pageId),
      }),
  });

  const addMutation = useMutation({
    mutationFn: (section_id: string) => {
      const tpl = findSectionTemplate(section_id);
      return postApiPagesSlugBlocks(pageId, {
        section_id,
        type: tpl?.type ?? "TEXT",
        order: blocks.length,
      });
    },
    onSuccess: () => {
      setAddOpen(false);
      invalidate();
    },
  });

  const removeMutation = useMutation({
    mutationFn: (blockId: string) =>
      deleteApiPagesSlugBlocksBlockId(pageId, blockId),
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
      action={
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80"
        >
          <Plus className="size-4" />
          Adicionar seção
        </button>
      }
      toolbar={
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground">
            Arraste para reordenar as seções. As alterações ficam visíveis no
            site imediatamente.
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
          Nenhuma seção. Clique em “Adicionar seção”.
        </p>
      ) : (
        <SortableList
          items={blocks}
          getId={(b) => b.block_id}
          onReorder={handleReorder}
          renderItem={(block, handle) => {
            const tpl = findSectionTemplate(block.section_id);
            const Icon = tpl?.icon ?? LayoutTemplate;
            return (
              <div className="flex items-center gap-3 rounded-[12px] border border-border bg-card px-4 py-3">
                {handle}
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {tpl?.label ?? block.section_id}
                  </p>
                  <p className="text-xs text-muted-foreground">{block.type}</p>
                </div>
                {tpl?.reference ? (
                  <span className="shrink-0 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
                    Automático
                  </span>
                ) : (
                  <Link
                    href={`/admin/paginas/${pageId}/${block.block_id}`}
                    className="shrink-0 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Editar
                  </Link>
                )}
                <button
                  type="button"
                  aria-label="Remover seção"
                  onClick={() => removeMutation.mutate(block.block_id)}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            );
          }}
        />
      )}

      {addOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-cms-overlay p-4"
          onClick={() => setAddOpen(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-[16px] border border-border bg-card shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold text-foreground">
                Adicionar seção
              </h3>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setAddOpen(false)}
                className="rounded p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="max-h-96 divide-y divide-border overflow-y-auto">
              {PAGE_SECTION_CATALOG.map((tpl) => {
                const Icon = tpl.icon;
                return (
                  <button
                    key={tpl.section_id}
                    type="button"
                    disabled={addMutation.isPending}
                    onClick={() => addMutation.mutate(tpl.section_id)}
                    className="flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-muted disabled:opacity-50"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {tpl.label}
                        {tpl.reference && (
                          <span className="ml-2 text-2xs text-muted-foreground">
                            (automático)
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tpl.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </AdminListPage>
  );
}
