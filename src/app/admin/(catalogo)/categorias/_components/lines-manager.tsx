"use client";

import Link from "next/link";
import { Layers, Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { putApiCategoriesIdLinesOrder } from "@/api/stetsom";
import type { I18nString } from "@/api/stetsom/model";
import {
  AdminRowAction,
  AdminRowActions,
} from "@/app/admin/_components/crud/admin-row-actions";
import { SortableList } from "@/app/admin/_components/crud/sortable-list";
import { useAdminToast } from "@/hooks/use-admin-toast";

export interface DisplayLine {
  line_id: string;
  name: I18nString;
  slug: I18nString;
  order: number;
}

interface LinesManagerProps {
  categoryId: string;
  lines: DisplayLine[];
  onChanged: () => Promise<unknown> | void;
}

export function LinesManager({
  categoryId,
  lines,
  onChanged,
}: LinesManagerProps) {
  const toast = useAdminToast();
  const reorderMutation = useMutation({
    mutationFn: (ordered: DisplayLine[]) =>
      putApiCategoriesIdLinesOrder(categoryId, {
        line_ids: ordered.map((line) => line.line_id),
      }),
    onSuccess: onChanged,
    onError: (error) =>
      toast.apiError(error, "Não foi possível reordenar as linhas"),
  });

  const orderedLines = [...lines].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          A ordem define a apresentação no catálogo público.
        </p>
        <Link
          href={`/admin/linhas/novo?category=${categoryId}`}
          className="inline-flex min-h-8 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          <Plus className="size-4" />
          Nova linha
        </Link>
      </div>

      {orderedLines.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-border py-8 text-center">
          <Layers className="size-6 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            Nenhuma linha cadastrada nesta categoria.
          </p>
        </div>
      ) : (
        <SortableList
          items={orderedLines}
          getId={(line) => line.line_id}
          disabled={reorderMutation.isPending}
          onReorder={(next) => reorderMutation.mutate(next)}
          renderItem={(line, handle) => (
            <div className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2.5">
              {handle}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{line.name.pt}</p>
                <p className="truncate text-xs text-muted-foreground">
                  /{line.slug.pt}
                </p>
              </div>
              <AdminRowActions>
                <AdminRowAction
                  href={`/admin/linhas/${line.line_id}?category=${categoryId}`}
                >
                  Editar
                </AdminRowAction>
              </AdminRowActions>
            </div>
          )}
        />
      )}
    </div>
  );
}
