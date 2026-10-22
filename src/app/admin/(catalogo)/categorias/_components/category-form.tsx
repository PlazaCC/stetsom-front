"use client";

import {
  deleteApiCategoriesId,
  getGetApiCategoriesAdminQueryKey,
  getGetApiCategoriesIdQueryKey,
  patchApiCategoriesId,
  postApiCategories,
  useGetApiCategoriesAdmin,
  useGetApiCategoriesId,
} from "@/api/stetsom";
import type { Category, I18nString } from "@/api/stetsom/model";
import { SetRouteLabel } from "@/app/admin/_components/admin-route-meta";
import {
  AdminFormSection,
  AdminFormSectionContent,
} from "@/app/admin/_components/crud/admin-form-section";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import { EditorFooter } from "@/app/admin/_components/crud/editor-footer";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { LibraryAssetPicker } from "@/app/admin/_components/crud/library-asset-picker";
import type { LibraryAssetRef } from "@/app/admin/_components/crud/library-asset-ref";
import { CategoryTemplatesSection } from "./category-templates-section";
import { LinesManager, type DisplayLine } from "./lines-manager";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { slugify } from "@/lib/utils/slugify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toApiError } from "@/api/stetsom/orval-client";

interface CategoryFormProps {
  categoryId?: string;
}

interface CategoryDraft {
  name: I18nString;
  slug: I18nString;
  icon: LibraryAssetRef | null;
  allProductsCover: LibraryAssetRef | null;
}

const EMPTY_DRAFT: CategoryDraft = {
  name: { pt: "" },
  slug: { pt: "" },
  icon: null,
  allProductsCover: null,
};

export function CategoryForm({ categoryId }: CategoryFormProps) {
  const router = useRouter();
  const toast = useAdminToast();
  const queryClient = useQueryClient();
  const isCreating = !categoryId;
  const categoriesQuery = useGetApiCategoriesAdmin();
  const detailQuery = useGetApiCategoriesId(categoryId ?? "", {
    query: { enabled: Boolean(categoryId) },
  });
  const category = detailQuery.data;
  const [draft, setDraft] = useState<CategoryDraft>(EMPTY_DRAFT);
  const hydratedCategoryId = useRef<string | null>(null);

  useEffect(() => {
    if (!category || hydratedCategoryId.current === category.id) return;
    hydratedCategoryId.current = category.id;
    const timer = window.setTimeout(
      () => setDraft(categoryToDraft(category)),
      0,
    );
    return () => window.clearTimeout(timer);
  }, [category]);

  const lines = useMemo<DisplayLine[]>(
    () =>
      (category?.lines ?? []).map((line) => ({
        line_id: line.line_id,
        name: line.name,
        slug: line.slug,
        order: line.order,
      })),
    [category?.lines],
  );

  const invalidate = async () => {
    await queryClient.invalidateQueries({
      queryKey: getGetApiCategoriesAdminQueryKey(),
    });
    if (categoryId) {
      await queryClient.invalidateQueries({
        queryKey: getGetApiCategoriesIdQueryKey(categoryId),
      });
    }
  };

  const saveMutation = useMutation({
    mutationFn: () => {
      const body = {
        name: draft.name,
        slug: draft.slug.pt ? draft.slug : { pt: slugify(draft.name.pt) },
        icon_library_id: draft.icon?.library_id ?? null,
        all_products_cover_library_id:
          draft.allProductsCover?.library_id ?? null,
      };
      return categoryId
        ? patchApiCategoriesId(categoryId, body)
        : postApiCategories({
            ...body,
            order: categoriesQuery.data?.length ?? 0,
          });
    },
    onSuccess: async (saved) => {
      await invalidate();
      toast.success(isCreating ? "Categoria criada" : "Categoria salva");
      if (isCreating) router.replace(`/admin/categorias/${saved.id}`);
    },
    onError: (error) =>
      toast.apiError(error, "Não foi possível salvar a categoria"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteApiCategoriesId(categoryId!),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getGetApiCategoriesAdminQueryKey(),
      });
      toast.deleted(draft.name.pt);
      router.replace("/admin/categorias");
    },
    onError: (error) =>
      toast.apiError(error, "Não foi possível excluir a categoria"),
  });

  if (detailQuery.isError) {
    const error = toApiError(detailQuery.error);
    return <LoadErrorState status={error.status} />;
  }
  if (categoryId && detailQuery.isLoading) return <LoadingState />;

  const isSaving = saveMutation.isPending;
  const canSave = Boolean(draft.name.pt.trim());

  return (
    <>
      <SetRouteLabel label={isCreating ? undefined : category?.name.pt} />
      <AdminPageLayout
        footer={
          <EditorFooter
            onBack={() => router.push("/admin/categorias")}
            onPrimary={() => saveMutation.mutate()}
            primaryLabel={
              isSaving
                ? "Salvando..."
                : isCreating
                  ? "Criar categoria"
                  : "Salvar alterações"
            }
            isPrimaryLoading={isSaving}
            isPrimaryDisabled={!canSave}
            deleteAction={
              categoryId
                ? {
                    label: "Excluir categoria",
                    confirmTitle: `Excluir "${draft.name.pt}"?`,
                    confirmDescription:
                      "A categoria será removida permanentemente.",
                    confirmLabel: "Excluir",
                    onConfirm: () => deleteMutation.mutate(),
                    isLoading: deleteMutation.isPending,
                  }
                : undefined
            }
          />
        }
      >
        <div className="flex w-full flex-col gap-5">
          <AdminFormSection
            raw
            title="Identidade da categoria"
            description="Nome e endereço público exibidos no catálogo."
          >
            <AdminFormSectionContent>
              <div className="grid gap-4 lg:grid-cols-2">
                <I18nInput
                  label="Nome"
                  required
                  value={draft.name}
                  onChange={(name) =>
                    setDraft((current) => ({ ...current, name }))
                  }
                />
                <I18nInput
                  label="Path público"
                  value={draft.slug}
                  onChange={(slug) =>
                    setDraft((current) => ({ ...current, slug }))
                  }
                  placeholder="amplificadores"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                PT é obrigatório. Os demais idiomas usam PT como fallback.
              </p>
            </AdminFormSectionContent>
          </AdminFormSection>

          <AdminFormSection
            raw
            title="Assets da categoria"
            description="O ícone e a capa de Todos os produtos são assets independentes."
          >
            <AdminFormSectionContent>
              <div className="grid gap-5 lg:grid-cols-2">
                <LibraryAssetPicker
                  label="Ícone"
                  type="CATEGORY_ICON"
                  value={draft.icon}
                  onChange={(icon) =>
                    setDraft((current) => ({ ...current, icon }))
                  }
                />
                <LibraryAssetPicker
                  label="Capa de Todos os produtos"
                  type="IMAGE"
                  value={draft.allProductsCover}
                  onChange={(allProductsCover) =>
                    setDraft((current) => ({ ...current, allProductsCover }))
                  }
                />
              </div>
            </AdminFormSectionContent>
          </AdminFormSection>

          {categoryId && category && (
            <>
              <AdminFormSection
                raw
                title="Linhas da categoria"
                description="A ordem define a apresentação no catálogo público."
              >
                <AdminFormSectionContent>
                  <LinesManager
                    categoryId={categoryId}
                    lines={lines}
                    onChanged={invalidate}
                  />
                </AdminFormSectionContent>
              </AdminFormSection>
              <CategoryTemplatesSection categoryId={categoryId} />
            </>
          )}
        </div>
      </AdminPageLayout>
    </>
  );
}

function categoryToDraft(category: Category): CategoryDraft {
  return {
    name: category.name,
    slug: category.slug,
    icon: category.icon_library_id
      ? { library_id: category.icon_library_id }
      : null,
    allProductsCover: category.all_products_cover_library_id
      ? { library_id: category.all_products_cover_library_id }
      : null,
  };
}

function LoadingState() {
  return (
    <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
      Carregando categoria...
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
      Categoria não encontrada.
    </div>
  );
}

function LoadErrorState({ status }: { status: number }) {
  if (status === 401 || status === 403) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-2 text-sm">
        <p className="text-destructive">
          Sua sessão expirou ou não há permissão.
        </p>
        <Link className="text-primary underline" href="/admin/login">
          Fazer login novamente
        </Link>
      </div>
    );
  }
  if (status === 404) return <NotFoundState />;
  return (
    <div className="flex min-h-48 items-center justify-center text-sm text-destructive">
      Não foi possível carregar a categoria. Tente novamente.
    </div>
  );
}
