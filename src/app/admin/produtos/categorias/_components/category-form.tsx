"use client";

import { AdminDeleteAction } from "@/app/admin/_components/crud/admin-delete-action";
import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import {
  AdminInput,
  AdminLabel,
} from "@/app/admin/_components/crud/admin-input";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { LibraryAssetPicker } from "@/app/admin/_components/crud/library-asset-picker";
import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import { AdminPanel } from "@/app/admin/_components/admin-panel";
import { CategoryTemplatesSection } from "@/app/admin/produtos/categorias/_components/category-templates-section";
import {
  type DisplayLine,
  LinesManager,
} from "@/app/admin/produtos/categorias/_components/lines-manager";
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
import { Tags } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LIST_HREF = "/admin/produtos/categorias";

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
    onError: () => toast.error("Não foi possível criar a categoria"),
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
    onError: () => toast.error("Não foi possível salvar a categoria"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApiCategoriesId(id),
    onSuccess: () => {
      invalidate();
      toast.deleted(name.pt);
      router.push(LIST_HREF);
    },
    onError: () => toast.error("Não foi possível excluir a categoria"),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
    <div className="flex flex-col gap-5">
      <AdminPanel className="flex items-center justify-between p-5">
        <AdminPageHeader
          title={isEdit ? "Editar categoria" : "Nova categoria"}
          icon={Tags}
        />
        <div className="flex items-center gap-3">
          {isEdit && categoryId && (
            <AdminDeleteAction
              label="Excluir categoria"
              confirmTitle={`Excluir "${name.pt}"?`}
              confirmDescription="A categoria será removida permanentemente. Esta ação não pode ser desfeita."
              onConfirm={() => deleteMutation.mutate(categoryId)}
              isLoading={deleteMutation.isPending}
            />
          )}
          <Link
            href={LIST_HREF}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            ← Voltar
          </Link>
        </div>
      </AdminPanel>

      <AdminFormSection
        title="Dados da categoria"
        description="Categorias organizam o catálogo e suas linhas internas."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <I18nInput label="Nome" required value={name} onChange={setName} />
          <I18nInput label="Slug" value={slug} onChange={setSlug} />
          <div>
            <AdminLabel>Ordem</AdminLabel>
            <AdminInput
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

          <div className="flex gap-3 pt-2">
            <Link
              href={LIST_HREF}
              className="flex-1 rounded-md border border-border py-2 text-center text-sm font-medium text-foreground hover:bg-muted"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-md bg-foreground py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80 disabled:opacity-60"
            >
              {isPending ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </AdminFormSection>
    </div>
  );
}
