"use client";

import { AdminLabel } from "@/app/admin/_components/crud/admin-input";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { SortableList } from "@/app/admin/_components/crud/sortable-list";
import {
  deleteApiCategoriesIdLinesLineId,
  patchApiCategoriesIdLinesLineId,
  postApiCategoriesIdLines,
} from "@/api/stetsom";
import type { I18nString } from "@/api/stetsom/model";
import { slugify } from "@/lib/utils/slugify";
import { useMutation } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export interface DisplayLine {
  line_id: string;
  name: string;
  order: number;
}

interface LinesManagerProps {
  categoryId: string;
  lines: DisplayLine[];
  onChanged: () => void;
}

export function LinesManager({
  categoryId,
  lines,
  onChanged,
}: LinesManagerProps) {
  const [newName, setNewName] = useState<I18nString>({ pt: "" });
  const [localLines, setLocalLines] = useState<DisplayLine[] | null>(null);

  const sortedLines = lines.slice().sort((a, b) => a.order - b.order);
  const displayLines = localLines ?? sortedLines;

  const addMutation = useMutation({
    mutationFn: () =>
      postApiCategoriesIdLines(categoryId, {
        name: newName,
        slug: { pt: slugify(newName.pt) },
        order: lines.length,
      }),
    onSuccess: () => {
      setNewName({ pt: "" });
      onChanged();
    },
  });

  const removeMutation = useMutation({
    mutationFn: (lineId: string) =>
      deleteApiCategoriesIdLinesLineId(categoryId, lineId),
    onSuccess: onChanged,
  });

  const reorderMutation = useMutation({
    mutationFn: (ordered: DisplayLine[]) => {
      const changed = ordered.filter((l, i) => l.order !== i);
      return Promise.all(
        changed.map((l) =>
          patchApiCategoriesIdLinesLineId(categoryId, l.line_id, {
            order: ordered.indexOf(l),
          }),
        ),
      );
    },
    onError: () => {
      setLocalLines(null);
      onChanged();
    },
    onSuccess: onChanged,
  });

  function handleReorder(ordered: DisplayLine[]) {
    setLocalLines(ordered);
    reorderMutation.mutate(ordered);
  }

  return (
    <div className="rounded-md border border-border bg-muted/30 p-3">
      <AdminLabel>Linhas</AdminLabel>
      <div className="space-y-1">
        {displayLines.length === 0 && (
          <p className="py-2 text-center text-xs text-muted-foreground">
            Nenhuma linha cadastrada
          </p>
        )}
        {displayLines.length > 0 && (
          <SortableList
            items={displayLines}
            getId={(line) => line.line_id}
            onReorder={handleReorder}
            renderItem={(line, handle) => (
              <div className="flex items-center gap-2 rounded bg-card px-2 py-1.5">
                {handle}
                <span className="flex-1 text-sm text-foreground">
                  {line.name}
                </span>
                <button
                  type="button"
                  aria-label="Remover linha"
                  onClick={() => removeMutation.mutate(line.line_id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            )}
          />
        )}
      </div>
      <div className="mt-2 flex items-end gap-2">
        <I18nInput
          className="flex-1"
          value={newName}
          onChange={setNewName}
          placeholder="Nova linha"
        />
        <button
          type="button"
          disabled={!newName.pt || addMutation.isPending}
          onClick={() => addMutation.mutate()}
          className="flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          <Plus className="size-4" />
          Adicionar
        </button>
      </div>
    </div>
  );
}
