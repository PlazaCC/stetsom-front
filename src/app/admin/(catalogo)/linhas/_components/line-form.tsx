"use client";

import {
  deleteApiCategoriesIdLinesLineId,
  getGetApiCategoriesAdminQueryKey,
  patchApiCategoriesIdLinesLineId,
  postApiCategoriesIdLines,
  useGetApiCategoriesAdmin,
  useGetApiProductsAdminId,
} from "@/api/stetsom";
import type { Category, I18nString, Line } from "@/api/stetsom/model";
import { SetRouteLabel } from "@/app/admin/_components/admin-route-meta";
import { AdminProductPicker } from "@/app/admin/_components/crud/admin-product-picker";
import {
  AdminFormSection,
  AdminFormSectionContent,
} from "@/app/admin/_components/crud/admin-form-section";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import { EditorFooter } from "@/app/admin/_components/crud/editor-footer";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { RelatedProductsTable } from "@/app/admin/_components/crud/related-products-table";
import { AdminLabel } from "@/app/admin/_components/crud/admin-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { cn } from "@/lib/utils";
import { slugify } from "@/lib/utils/slugify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, ImageIcon, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toApiError } from "@/api/stetsom/orval-client";

interface LineFormProps {
  lineId?: string;
  initialCategoryId?: string;
}

interface LineDraft {
  name: I18nString;
  slug: I18nString;
  categoryId: string;
  order: number;
  coverProductId: string;
  coverImageId: string;
}

const EMPTY_DRAFT: LineDraft = {
  name: { pt: "" },
  slug: { pt: "" },
  categoryId: "",
  order: 0,
  coverProductId: "",
  coverImageId: "",
};

export function LineForm({ lineId, initialCategoryId }: LineFormProps) {
  const router = useRouter();
  const toast = useAdminToast();
  const queryClient = useQueryClient();
  const isCreating = !lineId;
  const categoriesQuery = useGetApiCategoriesAdmin();
  const [draft, setDraft] = useState<LineDraft>({
    ...EMPTY_DRAFT,
    categoryId: initialCategoryId ?? "",
  });
  const [coverDirty, setCoverDirty] = useState(false);
  const hydratedLineId = useRef<string | null>(null);

  const source = useMemo(
    () => findLineSource(categoriesQuery.data, lineId),
    [categoriesQuery.data, lineId],
  );

  useEffect(() => {
    if (!source || hydratedLineId.current === lineId) return;
    hydratedLineId.current = lineId ?? null;
    const timer = window.setTimeout(
      () => setDraft(lineToDraft(source.line, source.categoryId)),
      0,
    );
    return () => window.clearTimeout(timer);
  }, [lineId, source]);

  useEffect(() => {
    if (!source || !lineId || coverDirty) return;
    const timer = window.setTimeout(
      () =>
        setDraft((current) => ({
          ...current,
          coverProductId: source.line.cover_source?.product_id ?? "",
          coverImageId: source.line.cover_source?.image_id ?? "",
        })),
      0,
    );
    return () => window.clearTimeout(timer);
  }, [coverDirty, lineId, source]);

  const coverProductQuery = useGetApiProductsAdminId(draft.coverProductId, {
    query: { enabled: Boolean(draft.coverProductId) },
  });
  const coverImages = coverProductQuery.data?.product.images ?? [];
  const selectedCategory = (categoriesQuery.data ?? []).find(
    (category) => category.id === (source?.categoryId ?? draft.categoryId),
  );

  const saveMutation = useMutation({
    mutationFn: () => {
      if (!draft.categoryId) throw new Error("Selecione uma categoria");
      const body = {
        name: draft.name,
        slug: draft.slug.pt ? draft.slug : { pt: slugify(draft.name.pt) },
        order: isCreating
          ? (selectedCategory?.lines.length ?? draft.order)
          : draft.order,
        ...(isCreating
          ? {}
          : {
              cover_source: draft.coverProductId
                ? {
                    product_id: draft.coverProductId,
                    image_id: draft.coverImageId || null,
                  }
                : null,
            }),
      };
      return lineId && source
        ? patchApiCategoriesIdLinesLineId(source.categoryId, lineId, body)
        : postApiCategoriesIdLines(draft.categoryId, body);
    },
    onSuccess: async (saved) => {
      setCoverDirty(false);
      await queryClient.invalidateQueries({
        queryKey: getGetApiCategoriesAdminQueryKey(),
      });
      toast.success(isCreating ? "Linha criada" : "Linha salva");
      if (isCreating) {
        const createdLine = saved.lines.at(-1);
        router.replace(
          createdLine
            ? `/admin/linhas/${createdLine.line_id}?category=${draft.categoryId}`
            : "/admin/linhas",
        );
      }
    },
    onError: (error) =>
      toast.apiError(error, "Não foi possível salvar a linha"),
  });

  const deleteMutation = useMutation({
    mutationFn: () =>
      deleteApiCategoriesIdLinesLineId(source!.categoryId, lineId!),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getGetApiCategoriesAdminQueryKey(),
      });
      toast.deleted(source?.line.name.pt ?? "Linha");
      router.replace("/admin/linhas");
    },
    onError: (error) =>
      toast.apiError(error, "Não foi possível excluir a linha"),
  });

  if (categoriesQuery.isError) {
    const error = toApiError(categoriesQuery.error);
    return <LoadErrorState status={error.status} />;
  }
  if (lineId && categoriesQuery.isLoading) return <LoadingState />;
  if (lineId && !source)
    return <NotFoundState message="Linha não encontrada." />;

  const canSave = Boolean(draft.name.pt.trim() && draft.categoryId);
  return (
    <>
      <SetRouteLabel label={isCreating ? undefined : source?.line.name.pt} />
      <AdminPageLayout
        footer={
          <EditorFooter
            onBack={() => router.push("/admin/linhas")}
            onPrimary={() => saveMutation.mutate()}
            primaryLabel={
              saveMutation.isPending
                ? "Salvando..."
                : isCreating
                  ? "Criar linha"
                  : "Salvar alterações"
            }
            isPrimaryLoading={saveMutation.isPending}
            isPrimaryDisabled={!canSave}
            deleteAction={
              !isCreating && source
                ? {
                    label: "Excluir linha",
                    confirmTitle: `Excluir "${source.line.name.pt}"?`,
                    confirmDescription:
                      "A linha só pode ser excluída quando não houver Produtos vinculados.",
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
            title="Identidade da linha"
            description="Dados usados para nomear e localizar a linha no catálogo."
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
                  placeholder="vulcan"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <AdminLabel>Categoria *</AdminLabel>
                  <Select
                    value={draft.categoryId}
                    onValueChange={(categoryId) =>
                      setDraft((current) => ({
                        ...current,
                        categoryId: categoryId ?? "",
                        order:
                          (categoriesQuery.data ?? []).find(
                            (category) => category.id === categoryId,
                          )?.lines.length ?? 0,
                      }))
                    }
                    disabled={Boolean(lineId)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma categoria">
                        {selectedCategory?.name.pt ?? "Selecione uma categoria"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {(categoriesQuery.data ?? []).map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name.pt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <AdminLabel>Ordem</AdminLabel>
                  <input
                    type="number"
                    min={0}
                    value={draft.order}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        order: Math.max(0, Number(event.target.value) || 0),
                      }))
                    }
                    className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                  />
                </div>
              </div>
            </AdminFormSectionContent>
          </AdminFormSection>

          {!isCreating && source && (
            <AdminFormSection
              raw
              title="Imagem do card da linha"
              description="Escolha uma imagem de um Produto desta Linha ou use o fallback automático."
            >
              <AdminFormSectionContent>
                <div className="grid gap-5 lg:grid-cols-2">
                  <div>
                    <AdminLabel>Produto de referência</AdminLabel>
                    <AdminProductPicker
                      value={draft.coverProductId}
                      onChange={(coverProductId) => {
                        setCoverDirty(true);
                        setDraft((current) => ({
                          ...current,
                          coverProductId,
                          coverImageId: "",
                        }));
                      }}
                      categoryId={source.categoryId}
                      lineId={lineId}
                    />
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      Sem Produto selecionado, a API usa o Produto publicado
                      mais recente da Linha.
                    </p>
                  </div>
                  <ProductImageSelect
                    images={coverImages}
                    value={draft.coverImageId}
                    onChange={(coverImageId) => {
                      setCoverDirty(true);
                      setDraft((current) => ({ ...current, coverImageId }));
                    }}
                    disabled={!draft.coverProductId}
                    loading={coverProductQuery.isLoading}
                  />
                </div>
              </AdminFormSectionContent>
            </AdminFormSection>
          )}

          {!isCreating && source && (
            <AdminFormSection
              raw
              title="Produtos vinculados"
              description={`Produtos da categoria ${selectedCategory?.name.pt ?? ""} e desta Linha.`}
            >
              <AdminFormSectionContent>
                <RelatedProductsTable
                  categoryId={source.categoryId}
                  lineId={lineId}
                  onProductUnlinked={(productId) => {
                    if (draft.coverProductId !== productId) return;
                    setCoverDirty(false);
                    setDraft((current) => ({
                      ...current,
                      coverProductId: "",
                      coverImageId: "",
                    }));
                  }}
                />
              </AdminFormSectionContent>
            </AdminFormSection>
          )}
        </div>
      </AdminPageLayout>
    </>
  );
}

function lineToDraft(line: Line, categoryId: string): LineDraft {
  return {
    name: line.name,
    slug: line.slug,
    categoryId,
    order: line.order,
    coverProductId: line.cover_source?.product_id ?? "",
    coverImageId: line.cover_source?.image_id ?? "",
  };
}

function findLineSource(categories: Category[] | undefined, lineId?: string) {
  if (!lineId) return undefined;
  for (const category of categories ?? []) {
    const line = category.lines.find((item) => item.line_id === lineId);
    if (line) return { categoryId: category.id, line };
  }
  return undefined;
}

function ProductImageSelect({
  images,
  value,
  onChange,
  disabled,
  loading,
}: {
  images: Array<{ image_id: string; image_url?: string | null; order: number }>;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  loading: boolean;
}) {
  const orderedImages = [...images].sort((a, b) => a.order - b.order);
  const primaryImage = orderedImages[0];
  const selectedImageId = value || primaryImage?.image_id;

  return (
    <div>
      <AdminLabel>Imagem do Produto</AdminLabel>
      {loading ? (
        <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 text-sm text-muted-foreground">
          <Loader2 className="mr-2 size-4 animate-spin" />
          Carregando imagens...
        </div>
      ) : disabled ? (
        <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-4 text-center text-sm text-muted-foreground">
          Selecione um Produto de referência para escolher a imagem.
        </div>
      ) : orderedImages.length === 0 ? (
        <div className="flex min-h-32 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-4 text-center text-sm text-muted-foreground">
          <ImageIcon className="mb-2 size-5" />
          Este Produto não possui imagens disponíveis.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {orderedImages.map((image, index) => {
            const isPrimary = index === 0;
            const isSelected = selectedImageId === image.image_id;
            return (
              <button
                key={image.image_id}
                type="button"
                disabled={disabled}
                onClick={() => onChange(isPrimary ? "" : image.image_id)}
                aria-label={
                  isPrimary
                    ? "Usar imagem principal"
                    : `Usar imagem ${index + 1}`
                }
                className={cn(
                  "group relative overflow-hidden rounded-lg border bg-card text-left transition hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border",
                )}
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  {image.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image.image_url}
                      alt={
                        isPrimary
                          ? "Imagem principal do Produto"
                          : `Imagem ${index + 1}`
                      }
                      className="size-full object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground">
                      <ImageIcon className="size-6" />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 px-2 py-1.5 text-xs">
                  <span className="truncate font-medium">
                    {isPrimary ? "Imagem principal" : `Imagem ${index + 1}`}
                  </span>
                  {isSelected && (
                    <Check className="size-4 shrink-0 text-primary" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
      Carregando linha...
    </div>
  );
}

function NotFoundState({ message }: { message: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
      {message}
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
  if (status === 404) return <NotFoundState message="Linha não encontrada." />;
  return (
    <div className="flex min-h-48 items-center justify-center text-sm text-destructive">
      Não foi possível carregar a linha. Tente novamente.
    </div>
  );
}
