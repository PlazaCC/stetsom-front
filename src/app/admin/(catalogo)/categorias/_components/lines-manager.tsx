"use client";

import {
  deleteApiCategoriesIdLinesLineId,
  patchApiCategoriesIdLinesLineId,
  postApiCategoriesIdLines,
} from "@/api/stetsom";
import type { I18nString } from "@/api/stetsom/model";
import { AdminLabel } from "@/app/admin/_components/crud/admin-input";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { SortableList } from "@/app/admin/_components/crud/sortable-list";
import { slugify } from "@/lib/utils/slugify";
import { useMutation } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

export interface DisplayLine {
  line_id: string;
  name: I18nString;
  slug: I18nString;
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
  const [newSlug, setNewSlug] = useState<I18nString>({ pt: "" });
  const [editing, setEditing] = useState<DisplayLine | null>(null);
  const [localLines, setLocalLines] = useState<DisplayLine[] | null>(null);

  const sortedLines = lines.slice().sort((a, b) => a.order - b.order);
  const displayLines = localLines ?? sortedLines;

  const addMutation = useMutation({
    mutationFn: () =>
      postApiCategoriesIdLines(categoryId, {
        name: newName,
        slug: newSlug.pt ? newSlug : { pt: slugify(newName.pt) },
        order: lines.length,
      }),
    onSuccess: () => {
      setNewName({ pt: "" });
      setNewSlug({ pt: "" });
      onChanged();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (line: DisplayLine) =>
      patchApiCategoriesIdLinesLineId(categoryId, line.line_id, {
        name: line.name,
        slug: line.slug,
      }),
    onSuccess: () => {
      setEditing(null);
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
      const changed = ordered.filter((line, index) => line.order !== index);
      return Promise.all(
        changed.map((line) =>
          patchApiCategoriesIdLinesLineId(categoryId, line.line_id, {
            order: ordered.indexOf(line),
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
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-foreground">
                    {line.name.pt}
                  </span>
                  <span className="block truncate text-2xs text-muted-foreground">
                    /{line.slug.pt}
                  </span>
                </span>
                <button
                  type="button"
                  aria-label="Editar linha"
                  onClick={() => setEditing(line)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="size-3.5" />
                </button>
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

      {editing && (
        <div className="mt-3 space-y-2 rounded-md border border-border bg-card p-3">
          <div className="flex items-center justify-between">
            <AdminLabel>Editar linha</AdminLabel>
            <button
              type="button"
              aria-label="Cancelar edição"
              onClick={() => setEditing(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
          <I18nInput
            label="Nome"
            required
            value={editing.name}
            onChange={(name) =>
              setEditing((current) => (current ? { ...current, name } : null))
            }
          />
          <I18nInput
            label="Path público"
            required
            placeholder="vulcan"
            value={editing.slug}
            onChange={(slug) =>
              setEditing((current) => (current ? { ...current, slug } : null))
            }
          />
          <p className="text-xs text-muted-foreground">
            PT é obrigatório. EN e ES vazios usam o path em português.
          </p>
          <button
            type="button"
            disabled={
              !editing.name.pt || !editing.slug.pt || updateMutation.isPending
            }
            onClick={() => updateMutation.mutate(editing)}
            className="h-9 rounded-md bg-foreground px-3 text-sm font-medium text-background disabled:opacity-50"
          >
            {updateMutation.isPending ? "Salvando..." : "Salvar linha"}
          </button>
        </div>
      )}

      <div className="mt-2 space-y-2">
        <I18nInput
          value={newName}
          onChange={setNewName}
          placeholder="Nova linha"
        />
        <I18nInput
          label="Path público"
          value={newSlug}
          onChange={setNewSlug}
          placeholder="vulcan"
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
