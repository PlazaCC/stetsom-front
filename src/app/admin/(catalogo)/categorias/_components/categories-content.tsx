"use client";

import {
  deleteApiCategoriesId,
  getGetApiCategoriesIdQueryKey,
  getGetApiCategoriesQueryKey,
  patchApiCategoriesId,
  postApiCategories,
  useGetApiCategories,
  useGetApiCategoriesId,
  useGetApiTemplates,
} from "@/api/stetsom";
import type {
  Category,
  I18nString,
  PatchApiCategoriesIdBody,
  PostApiCategoriesBody,
  PublicCategory,
} from "@/api/stetsom/model";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import { EditorFooter } from "@/app/admin/_components/crud/editor-footer";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { LibraryAssetPicker } from "@/app/admin/_components/crud/library-asset-picker";
import type { LibraryAssetRef } from "@/app/admin/_components/crud/library-asset-ref";
import { SortableList } from "@/app/admin/_components/crud/sortable-list";
import {
  type DisplayLine,
  LinesManager,
} from "@/app/admin/(catalogo)/categorias/_components/lines-manager";
import { CategoryTemplatesSection } from "@/app/admin/(catalogo)/categorias/_components/category-templates-section";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { cn } from "@/lib/utils";
import { slugify } from "@/lib/utils/slugify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImageIcon, Plus } from "lucide-react";
import { useMemo, useState } from "react";

const NEW_ID = "__new__";

/** The category icon is a Library asset — flows through the shared
 *  `{ library_id?, file_url? }` shape used by every `LibraryAssetPicker`. */
type CategoryIconAsset = LibraryAssetRef;

type Draft = {
  id: string | null;
  name: I18nString;
  slug: I18nString;
  icon: CategoryIconAsset | null;
};

/** User edits applied on top of the server-derived base draft. A key's
 *  absence means "untouched, follow the base"; `icon: null` is a real,
 *  explicit "removed" value, so this must stay a sparse patch, not a
 *  full copy of `Draft`. */
type DraftEdits = Partial<Pick<Draft, "name" | "slug" | "icon">>;

function emptyDraft(): Draft {
  return { id: null, name: { pt: "" }, slug: { pt: "" }, icon: null };
}

/** Builds the base draft strictly from the full multi-locale resource — never
 *  from the list's single-locale item — so en/es content is never dropped.
 *  `listItem.icon_url` (already resolved) is used just to skip the picker's
 *  own on-demand asset resolve when we already have it in hand. */
function draftFromCategory(
  category: Category,
  listItem?: PublicCategory,
): Draft {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    icon: category.icon_library_id
      ? {
          library_id: category.icon_library_id,
          file_url: listItem?.icon_url ?? undefined,
        }
      : null,
  };
}

interface CategoriesContentProps {
  /** Seeds the initial selection — used to deep-link back from a template
   *  create/edit/delete flow (`?category=...`). */
  initialSelectedId?: string;
}

export function CategoriesContent({
  initialSelectedId,
}: Readonly<CategoriesContentProps>) {
  const queryClient = useQueryClient();
  const toast = useAdminToast();
  const listQuery = useGetApiCategories();
  const { data: templates = [] } = useGetApiTemplates();
  const categories = useMemo(
    () => (listQuery.data ?? []).slice().sort((a, b) => a.order - b.order),
    [listQuery.data],
  );
  const [localCategories, setLocalCategories] = useState<
    PublicCategory[] | null
  >(null);
  const displayCategories = localCategories ?? categories;

  const [selectedId, setSelectedId] = useState<string | null>(
    initialSelectedId ?? null,
  );
  const [edits, setEdits] = useState<DraftEdits>({});

  const isNew = selectedId === NEW_ID;
  const { data: full } = useGetApiCategoriesId(selectedId ?? "", {
    query: { enabled: !!selectedId && !isNew },
  });

  // The base draft is derived straight from query data every render — no
  // effect needed. It only becomes non-null once the full multi-locale
  // resource resolves for the current selection (never from the list's
  // single-locale item), so en/es content is never silently dropped.
  const baseDraft: Draft | null = isNew
    ? emptyDraft()
    : selectedId && full && full.id === selectedId
      ? draftFromCategory(
          full,
          categories.find((c) => c.id === full.id),
        )
      : null;
  const draft: Draft | null = baseDraft ? { ...baseDraft, ...edits } : null;
  const isLoadingDraft = !!selectedId && !isNew && !baseDraft;

  function invalidate() {
    const tasks = [
      queryClient.invalidateQueries({
        queryKey: getGetApiCategoriesQueryKey(),
      }),
    ];
    // The list and the single-category detail are separate queries — a lines
    // add/remove/reorder only patches the category, so the currently open
    // detail must be invalidated too or `full.lines` goes stale.
    if (selectedId && selectedId !== NEW_ID) {
      tasks.push(
        queryClient.invalidateQueries({
          queryKey: getGetApiCategoriesIdQueryKey(selectedId),
        }),
      );
    }
    return Promise.all(tasks);
  }

  function selectCategory(category: PublicCategory) {
    setSelectedId(category.id);
    setEdits({});
  }

  function startNew() {
    setSelectedId(NEW_ID);
    setEdits({});
  }

  function templateCount(categoryId: string): number {
    return templates.filter((t) => t.category_id === categoryId).length;
  }

  const createMutation = useMutation({
    mutationFn: (body: PostApiCategoriesBody) => postApiCategories(body),
    onSuccess: async (created) => {
      await invalidate();
      toast.success("Categoria criada");
      // Selecting the new id triggers its detail fetch; clearing edits now is
      // safe because the saved fields already match what was just submitted,
      // so the base draft will converge to the same values once it resolves.
      setSelectedId(created.id);
      setEdits({});
    },
    onError: (e) => toast.apiError(e, "Não foi possível criar a categoria"),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: PatchApiCategoriesIdBody;
    }) => patchApiCategoriesId(id, body),
    onSuccess: async () => {
      await invalidate();
      toast.success("Categoria salva");
    },
    onError: (e) => toast.apiError(e, "Não foi possível salvar a categoria"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApiCategoriesId(id),
    onSuccess: async () => {
      const name = draft?.name.pt ?? "";
      // Only invalidate the list — the deleted category's detail query must
      // NOT be invalidated here: it's still an active observer at this point
      // (the selection clears on the next render), so invalidating it would
      // trigger an immediate refetch of a resource that no longer exists.
      await queryClient.invalidateQueries({
        queryKey: getGetApiCategoriesQueryKey(),
      });
      toast.deleted(name);
      setSelectedId(null);
      setEdits({});
    },
    onError: (e) => toast.apiError(e, "Não foi possível excluir a categoria"),
  });

  const reorderMutation = useMutation({
    mutationFn: (ordered: PublicCategory[]) => {
      const changed = ordered.filter((c, i) => c.order !== i);
      return Promise.all(
        changed.map((c) =>
          patchApiCategoriesId(c.id, { order: ordered.indexOf(c) }),
        ),
      );
    },
    onError: () => {
      setLocalCategories(null);
      invalidate();
    },
    onSuccess: () => invalidate(),
  });

  function handleReorder(ordered: PublicCategory[]) {
    setLocalCategories(ordered);
    reorderMutation.mutate(ordered);
  }

  function handleSave() {
    if (!draft) return;
    const body = {
      name: draft.name,
      slug: draft.slug.pt ? draft.slug : { pt: slugify(draft.name.pt) },
      icon_library_id: draft.icon?.library_id,
    };
    if (draft.id) {
      updateMutation.mutate({ id: draft.id, body });
    } else {
      createMutation.mutate({ ...body, order: categories.length });
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const lines: DisplayLine[] = full
    ? full.lines.map((l) => ({
        line_id: l.line_id,
        name: l.name.pt,
        order: l.order,
      }))
    : [];

  return (
    <AdminPageLayout
      footer={
        draft ? (
          <EditorFooter
            onBack={() => {
              setSelectedId(null);
              setEdits({});
            }}
            deleteAction={
              draft.id
                ? {
                    label: "Excluir categoria",
                    confirmTitle: `Excluir "${draft.name.pt}"?`,
                    confirmDescription:
                      "A categoria será removida permanentemente. Esta ação não pode ser desfeita.",
                    onConfirm: () => deleteMutation.mutate(draft.id!),
                    isLoading: deleteMutation.isPending,
                  }
                : undefined
            }
            onPrimary={handleSave}
            primaryLabel={isSaving ? "Salvando..." : "Salvar"}
            isPrimaryLoading={isSaving}
          />
        ) : undefined
      }
    >
      <div className="flex flex-col gap-5 xl:flex-row">
        {/* List */}
        <aside className="flex w-full flex-col overflow-hidden rounded-card border border-border bg-card xl:w-80 xl:shrink-0">
          <div className="flex items-center justify-between border-b border-border px-6 py-2.5">
            <h2 className="text-sm font-semibold text-foreground">
              Categorias
            </h2>
            <button
              type="button"
              onClick={startNew}
              className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-80"
            >
              <Plus className="size-3.5" />
              Nova
            </button>
          </div>

          <div className="flex-1 overflow-auto p-3">
            {listQuery.isLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="size-5 animate-spin rounded-full border-2 border-border border-t-primary" />
              </div>
            ) : displayCategories.length === 0 && selectedId !== NEW_ID ? (
              <p className="rounded-md border border-dashed border-border px-3 py-8 text-center text-xs text-muted-foreground">
                Nenhuma categoria cadastrada.
              </p>
            ) : (
              <SortableList
                items={displayCategories}
                getId={(c) => c.id}
                onReorder={handleReorder}
                renderItem={(category, handle) => (
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded-md border px-2 py-2",
                      selectedId === category.id
                        ? "border-primary bg-muted"
                        : "border-border",
                    )}
                  >
                    {handle}
                    {category.icon_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={category.icon_url}
                        alt=""
                        loading="lazy"
                        className="size-8 shrink-0 rounded object-cover"
                      />
                    ) : (
                      <div className="flex size-8 shrink-0 items-center justify-center rounded bg-muted">
                        <ImageIcon className="size-4 text-muted-foreground/50" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => selectCategory(category)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <span className="block truncate text-sm font-medium text-foreground">
                        {category.name}
                      </span>
                      <span className="block truncate text-2xs text-muted-foreground">
                        {templateCount(category.id)} templates ·{" "}
                        {category.lines.length} linhas
                      </span>
                    </button>
                  </div>
                )}
              />
            )}
          </div>
        </aside>

        {/* Editor */}
        <div className="min-w-0 flex-1">
          {isLoadingDraft ? (
            <div className="flex items-center justify-center rounded-card border border-border bg-card py-20">
              <div className="size-5 animate-spin rounded-full border-2 border-border border-t-primary" />
            </div>
          ) : !draft ? (
            <div className="flex items-center justify-center rounded-card border border-dashed border-border py-20 text-sm text-muted-foreground">
              Selecione uma categoria ou crie uma nova.
            </div>
          ) : (
            <div className="space-y-4 rounded-card border border-border bg-card p-5">
              <I18nInput
                label="Nome"
                required
                value={draft.name}
                onChange={(name) => setEdits((prev) => ({ ...prev, name }))}
              />
              <I18nInput
                label="Slug"
                value={draft.slug}
                onChange={(slug) => setEdits((prev) => ({ ...prev, slug }))}
              />
              <LibraryAssetPicker
                label="Ícone"
                type="CATEGORY_ICON"
                variant="image"
                value={draft.icon}
                onChange={(icon) => setEdits((prev) => ({ ...prev, icon }))}
              />

              {draft.id && (
                <>
                  <LinesManager
                    categoryId={draft.id}
                    lines={lines}
                    onChanged={invalidate}
                  />
                  <CategoryTemplatesSection categoryId={draft.id} />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
}
