"use client";

import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import { AdminLabel } from "@/app/admin/_components/crud/admin-input";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { Input } from "@/components/ui/input";
import { LibraryAssetPicker } from "@/app/admin/_components/crud/library-asset-picker";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import { EditorFooter } from "@/app/admin/_components/crud/editor-footer";
import { CategoryTemplatesSection } from "@/app/admin/(catalogo)/categorias/_components/category-templates-section";
import {
  type DisplayLine,
  LinesManager,
} from "@/app/admin/(catalogo)/categorias/_components/lines-manager";
import {
  deleteApiCategoriesId,
  getGetApiCategoriesQueryKey,
  patchApiCategoriesId,
  postApiCategories,
  useGetApiCategories,
  useGetApiCategoriesId,
} from "@/api/stetsom";
import type {
  I18nString,
  PatchApiCategoriesIdBody,
  PostApiCategoriesBody,
} from "@/api/stetsom/model";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { slugify } from "@/lib/utils/slugify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LIST_HREF = "/admin/categorias";

interface CategoryFormProps {
  mode: "create" | "edit";
  categoryId?: string;
}

/**
 * Loads full category data when editing, then renders the full-page form.
 * `/api/categories/:id` may fail — falls back to the list item.
 */
export function CategoryForm({ mode, categoryId }: CategoryFormProps) {
  const isEdit = mode === "edit";

  const { data: full, isLoading } = useGetApiCategoriesId(categoryId ?? "", {
    query: { enabled: isEdit && !!categoryId },
  });
  const { data: categories = [] } = useGetApiCategories();
  const fallback = categories.find((c) => c.id === categoryId);

  if (isEdit && isLoading && !fallback) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-sm text-muted-foreground">Carregando…</p>
      </div>
    );
  }

  const lines: DisplayLine[] = full
    ? full.lines.map((l) => ({
        line_id: l.line_id,
        name: l.name.pt,
        order: l.order,
      }))
    : (fallback?.lines ?? []).map((l) => ({
        line_id: l.line_id,
        name: l.name,
        order: l.order,
      }));

  return (
    <CategoryFormInner
      categoryId={categoryId}
      initialName={full?.name ?? { pt: fallback?.name ?? "" }}
      initialSlug={full?.slug ?? { pt: fallback?.slug ?? "" }}
      initialOrder={full?.order ?? fallback?.order ?? 0}
      initialIconId={full?.icon_library_id ?? fallback?.icon_library_id}
      lines={lines}
      isEdit={isEdit}
    />
  );
}

interface CategoryFormInnerProps {
  categoryId?: string;
  initialName: I18nString;
  initialSlug: I18nString;
  initialOrder: number;
  initialIconId?: string;
  lines: DisplayLine[];
  isEdit: boolean;
}

function CategoryFormInner({
  categoryId,
  initialName,
  initialSlug,
  initialOrder,
  initialIconId,
  lines,
  isEdit,
}: CategoryFormInnerProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useAdminToast();
  const [name, setName] = useState<I18nString>(initialName);
  const [slug, setSlug] = useState<I18nString>(initialSlug);
  const [order, setOrder] = useState(initialOrder);
  const [icon, setIcon] = useState<{
    library_id?: string;
    file_url?: string;
  } | null>(initialIconId ? { library_id: initialIconId } : null);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getGetApiCategoriesQueryKey() });
  }

  const createMutation = useMutation({
    mutationFn: (body: PostApiCategoriesBody) => postApiCategories(body),
    onSuccess: (created) => {
      invalidate();
      toast.success("Categoria criada");
      const newId = (created as { id?: string } | undefined)?.id;
      router.push(newId ? `${LIST_HREF}/${newId}` : LIST_HREF);
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
    onSuccess: () => {
      invalidate();
      toast.success("Categoria salva");
    },
    onError: (e) => toast.apiError(e, "Não foi possível salvar a categoria"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApiCategoriesId(id),
    onSuccess: () => {
      invalidate();
      toast.deleted(name.pt);
      router.push(LIST_HREF);
    },
    onError: (e) => toast.apiError(e, "Não foi possível excluir a categoria"),
  });

  function handleSave() {
    const body = {
      name,
      slug: slug.pt ? slug : { pt: slugify(name.pt) },
      icon_library_id: icon?.library_id,
      order,
    };
    if (categoryId) {
      updateMutation.mutate({ id: categoryId, body });
    } else {
      createMutation.mutate(body);
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminPageLayout
      footer={
        <EditorFooter
          onBack={() => router.push(LIST_HREF)}
          deleteAction={
            isEdit && categoryId
              ? {
                  label: "Excluir categoria",
                  confirmTitle: `Excluir "${name.pt}"?`,
                  confirmDescription:
                    "A categoria será removida permanentemente. Esta ação não pode ser desfeita.",
                  onConfirm: () => deleteMutation.mutate(categoryId),
                  isLoading: deleteMutation.isPending,
                }
              : undefined
          }
          onPrimary={handleSave}
          primaryLabel={isPending ? "Salvando..." : "Salvar"}
          isPrimaryLoading={isPending}
        />
      }
    >
      <AdminFormSection
        title="Dados da categoria"
        description="Categorias organizam o catálogo e suas linhas internas."
        className="h-auto flex-none overflow-visible"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-4"
        >
          <I18nInput label="Nome" required value={name} onChange={setName} />
          <I18nInput label="Slug" value={slug} onChange={setSlug} />
          <div>
            <AdminLabel>Ordem</AdminLabel>
            <Input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
            />
          </div>
          <LibraryAssetPicker
            label="Ícone"
            type="CATEGORY_ICON"
            variant="image"
            value={icon}
            onChange={(a) => setIcon(a)}
          />

          {categoryId && (
            <>
              <LinesManager
                categoryId={categoryId}
                lines={lines}
                onChanged={invalidate}
              />
              <CategoryTemplatesSection categoryId={categoryId} />
            </>
          )}
        </form>
      </AdminFormSection>
    </AdminPageLayout>
  );
}
