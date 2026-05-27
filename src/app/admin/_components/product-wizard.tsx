"use client";

import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import { AdminPanel } from "@/app/admin/_components/admin-panel";
import type { DraftBlock } from "@/app/admin/_components/crud/admin-block-builder";
import { AdminBlockBuilder } from "@/app/admin/_components/crud/admin-block-builder";
import { AdminDeleteAction } from "@/app/admin/_components/crud/admin-delete-action";
import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import { AdminSaveBar } from "@/app/admin/_components/crud/admin-save-bar";
import type { AdminStep } from "@/app/admin/_components/crud/admin-step-indicator";
import { AdminWizardPage } from "@/app/admin/_components/crud/admin-wizard-page";
import { ProductWizardStepFiles } from "@/app/admin/_components/product-wizard-step-files";
import { ProductWizardStepPublish } from "@/app/admin/_components/product-wizard-step-publish";
import { ProductWizardStepSpecs } from "@/app/admin/_components/product-wizard-step-specs";
import { ProductWizardStepSuccess } from "@/app/admin/_components/product-wizard-step-success";
import type { ProductInfo } from "@/app/admin/_components/product-wizard-step1";
import { ProductWizardStep1 } from "@/app/admin/_components/product-wizard-step1";
import type {
  CmsProductDetailPayload,
  CmsProductMutationResult,
  CreateCmsProductInput,
  ProductStatus,
  ProductVariation,
} from "@/lib/api/contracts";
import {
  useCatalogCategories,
  useCatalogSubcategories,
} from "@/hooks/use-catalog";
import { useCmsProductMutations } from "@/hooks/use-cms-product-mutations";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductWizardProps {
  initial?: CmsProductDetailPayload;
  mode: "create" | "edit";
}

type Step = 1 | 2 | 3 | 4;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildInitialInfo(detail?: CmsProductDetailPayload): ProductInfo {
  if (!detail) {
    return {
      name: "",
      slug: "",
      category_id: "",
      subcategory_id: "",
      status: "ACTIVE",
      badge: "",
      description: "",
      cover_image_url: "",
      additional_images: [],
      video_url: "",
      launch_date: new Date().toISOString().split("T")[0],
      launch_time: "00:00",
    };
  }

  return {
    name: detail.product.name,
    slug: detail.product.slug,
    category_id: detail.product.category_id,
    subcategory_id: detail.product.subcategory_id ?? "",
    status: detail.product.status,
    badge: detail.product.badge ?? "",
    description: detail.product.description,
    cover_image_url: detail.product.thumbnail_url,
    additional_images: [],
    video_url: detail.product.video_url ?? "",
    launch_date: detail.product.launch_date.split("T")[0],
    launch_time: "00:00",
  };
}

function buildInitialVariations(
  detail?: CmsProductDetailPayload,
): ProductVariation[] {
  if (!detail) {
    return [{ id: "variation-default", label: "1 Ohm", order: 1, specs: [] }];
  }

  const variations = [...detail.product.variations].sort(
    (a, b) => a.order - b.order,
  );

  return variations.length > 0
    ? variations
    : [{ id: "variation-default", label: "Padrão", order: 1, specs: [] }];
}

function buildInitialHighlights(detail?: CmsProductDetailPayload): string[] {
  return detail?.product.highlight_attributes ?? [];
}

function buildInitialBlocks(detail?: CmsProductDetailPayload): DraftBlock[] {
  if (!detail) return [];
  return detail.blocks.map((b) => {
    if (b.type === "IMAGE") {
      const d = b.data as Record<string, unknown>;
      const images = Array.isArray(d.images) ? (d.images as string[]) : [];
      return {
        id: b.id,
        type: "IMAGE" as const,
        data: {
          images: images[0] ?? "",
          caption: typeof d.caption === "string" ? d.caption : "",
          layout: typeof d.layout === "string" ? d.layout : "default",
        },
        order: b.order,
      };
    }
    return {
      id: b.id,
      type: b.type as "TEXT" | "VIDEO",
      data: b.data as Record<string, unknown>,
      order: b.order,
    };
  });
}

function resolveStatus(
  info: ProductInfo,
  blocks: DraftBlock[],
  desiredStatus: ProductStatus,
): ProductStatus {
  const hasRequired =
    !!info.name &&
    !!info.category_id &&
    !!info.cover_image_url &&
    blocks.length > 0;
  return hasRequired ? desiredStatus : "DRAFT";
}

function buildPayload(
  info: ProductInfo,
  variations: ProductVariation[],
  blocks: DraftBlock[],
  highlightAttributes: string[],
  status: ProductStatus,
): CreateCmsProductInput {
  return {
    name: info.name,
    slug: info.slug,
    category_id: info.category_id,
    subcategory_id: info.subcategory_id || undefined,
    status,
    badge: info.badge || null,
    description: info.description,
    thumbnail_url: info.cover_image_url,
    video_url: info.video_url || null,
    launch_date: info.launch_date,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    variations: variations.map(({ id: _id, ...rest }) => rest),
    highlight_attributes: highlightAttributes,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    blocks: blocks.map(({ id: _id, ...rest }) => rest) as any,
  };
}

const STEP_LABELS: Record<Step, string> = {
  1: "Dados gerais",
  2: "Especificações técnicas",
  3: "Arquivos",
  4: "Customização",
};

export function ProductWizard({ initial, mode }: ProductWizardProps) {
  const router = useRouter();
  const mutations = useCmsProductMutations();
  const adminToast = useAdminToast();

  const [step, setStep] = useState<Step>(1);
  const [info, setInfo] = useState<ProductInfo>(buildInitialInfo(initial));
  const [variations, setVariations] = useState<ProductVariation[]>(
    buildInitialVariations(initial),
  );
  const [activeVariationId, setActiveVariationId] = useState<string>(
    buildInitialVariations(initial)[0].id,
  );
  const [highlightAttributes, setHighlightAttributes] = useState<string[]>(
    buildInitialHighlights(initial),
  );
  const [blocks, setBlocks] = useState<DraftBlock[]>(
    buildInitialBlocks(initial),
  );
  const [files, setFiles] = useState(initial?.files ?? []);

  const [productId, setProductId] = useState<string | null>(
    initial?.product.id ?? null,
  );
  const [isDirty, setIsDirty] = useState(mode === "edit");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [publishedResult, setPublishedResult] =
    useState<CmsProductMutationResult | null>(null);

  const isSaving =
    mutations.create.isPending ||
    mutations.update.isPending ||
    mutations.remove.isPending;

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const categoriesQuery = useCatalogCategories();
  const subcategoriesQuery = useCatalogSubcategories();
  const categories = categoriesQuery.data ?? [];
  const subcategories = subcategoriesQuery.data ?? [];

  const steps: AdminStep[] = [1, 2, 3, 4].map((n) => ({
    label: STEP_LABELS[n as Step],
    status: step > n ? "done" : step === n ? "active" : "pending",
  }));

  function updateInfo(key: keyof ProductInfo, value: string | string[]) {
    setInfo((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && mode === "create") {
        next.slug = slugify(value as string);
      }
      return next;
    });
    setIsDirty(true);
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setIsDirty(true);
  }

  /** Salva os dados atuais no backend. Retorna o resultado da mutation. */
  async function handleSave(
    overrideStatus?: ProductStatus,
  ): Promise<CmsProductMutationResult> {
    const status =
      overrideStatus ??
      resolveStatus(info, blocks, info.status as ProductStatus);
    const payload = buildPayload(
      info,
      variations,
      blocks,
      highlightAttributes,
      status,
    );

    let result: CmsProductMutationResult;
    if (productId) {
      result = await mutations.update.mutateAsync({
        id: productId,
        input: payload,
      });
    } else {
      result = await mutations.create.mutateAsync(payload);
      setProductId(result.id);
    }

    setLastSavedAt(new Date());
    setIsDirty(false);
    return result;
  }

  async function handleSaveDraft() {
    try {
      await handleSave("DRAFT");
      adminToast.draft(info.name || undefined);
    } catch {
      adminToast.error("Erro ao salvar rascunho");
    }
  }

  function handleNext() {
    setStep((s) => (s + 1) as Step);
  }

  function handleBack() {
    if (
      isDirty &&
      !window.confirm("Você tem alterações não salvas. Deseja sair sem salvar?")
    ) {
      return;
    }
    setStep((s) => (s - 1) as Step);
  }

  async function handlePublish() {
    try {
      const result = await handleSave(
        resolveStatus(info, blocks, info.status as ProductStatus),
      );
      if (result.status === "DRAFT") {
        adminToast.draft(info.name || undefined);
      } else {
        adminToast.success(
          mode === "create"
            ? "Produto criado com sucesso!"
            : "Produto atualizado com sucesso!",
          "As alterações já estão visíveis no catálogo.",
        );
      }
      setPublishedResult(result);
    } catch {
      adminToast.error("Erro ao publicar produto");
    }
  }

  async function handleDelete() {
    if (!productId) return;
    try {
      await mutations.remove.mutateAsync(productId);
      adminToast.deleted(info.name || undefined);
      router.push("/admin/produtos");
    } catch {
      adminToast.error("Erro ao excluir produto");
    }
  }

  const title =
    mode === "create" ? "Novo Produto" : `Editar: ${info.name || "Produto"}`;

  const category = categories.find((c) => c.id === info.category_id);
  const subcategory = subcategories.find((s) => s.id === info.subcategory_id);
  const activeVariation =
    variations.find((v) => v.id === activeVariationId) ?? variations[0];
  const activeSpecs = activeVariation?.specs ?? [];

  // Show success screen after publish
  if (publishedResult) {
    return (
      <ProductWizardStepSuccess
        result={publishedResult}
        mode={mode}
        onContinueEditing={() => setPublishedResult(null)}
      />
    );
  }

  const previewAside = (
    <div className="space-y-4">
      <AdminFormSection title="Prévia">
        <div className="overflow-hidden rounded-md border border-border bg-muted">
          {info.cover_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={info.cover_image_url}
              alt={info.name}
              className="h-36 w-full object-cover"
            />
          ) : (
            <div className="flex h-36 items-center justify-center">
              <Package className="size-10 text-muted-foreground/40" />
            </div>
          )}
        </div>
        <dl className="mt-3 space-y-2 text-xs">
          <div className="flex justify-between gap-2">
            <dt className="shrink-0 text-muted-foreground">Nome</dt>
            <dd className="truncate font-medium text-foreground">
              {info.name || "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="shrink-0 text-muted-foreground">Status</dt>
            <dd className="font-medium text-foreground">
              {info.status === "ACTIVE"
                ? "Ativo"
                : info.status === "DRAFT"
                  ? "Rascunho"
                  : "Descontinuado"}
            </dd>
          </div>
          {category && (
            <div className="flex justify-between gap-2">
              <dt className="shrink-0 text-muted-foreground">Categoria</dt>
              <dd className="truncate font-medium text-foreground">
                {category.name}
              </dd>
            </div>
          )}
          {subcategory && (
            <div className="flex justify-between gap-2">
              <dt className="shrink-0 text-muted-foreground">Linha</dt>
              <dd className="truncate font-medium text-foreground">
                {subcategory.name}
              </dd>
            </div>
          )}
          <div className="flex justify-between gap-2">
            <dt className="shrink-0 text-muted-foreground">Specs</dt>
            <dd className="font-medium text-foreground">
              {activeSpecs.length}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="shrink-0 text-muted-foreground">Blocos</dt>
            <dd className="font-medium text-foreground">{blocks.length}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="shrink-0 text-muted-foreground">Slug</dt>
            <dd className="truncate font-mono text-foreground">
              {info.slug || "—"}
            </dd>
          </div>
        </dl>
      </AdminFormSection>

      {/* Draft indicator */}
      {productId && (
        <div className="rounded-md border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          {isDirty ? "✎ Alterações não salvas" : "✓ Salvo"}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      <AdminPanel className="flex items-center justify-between p-5">
        <AdminPageHeader title={title} icon={Package} />
        <div className="flex items-center gap-3">
          {mode === "edit" && productId && (
            <AdminDeleteAction
              label="Excluir produto"
              confirmTitle={`Excluir "${info.name}"?`}
              confirmDescription="O produto será removido permanentemente. Esta ação não pode ser desfeita."
              confirmLabel="Sim, excluir"
              onConfirm={handleDelete}
              isLoading={mutations.remove.isPending}
            />
          )}
          <Link
            href="/admin/produtos"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            ← Voltar
          </Link>
        </div>
      </AdminPanel>

      <AdminWizardPage steps={steps} aside={previewAside}>
        {step === 1 && (
          <ProductWizardStep1
            info={info}
            categories={categories}
            subcategories={subcategories}
            onChange={updateInfo}
          />
        )}

        {step === 2 && (
          <ProductWizardStepSpecs
            variations={variations}
            activeVariationId={activeVariationId}
            highlightAttributes={highlightAttributes}
            onVariationsChange={setVariations}
            onActiveVariationChange={setActiveVariationId}
            onHighlightAttributesChange={setHighlightAttributes}
          />
        )}

        {step === 3 && (
          <ProductWizardStepFiles files={files} onRemove={removeFile} />
        )}

        {step === 4 && (
          <div className="space-y-6">
            <AdminFormSection
              title="Blocos de conteúdo"
              description="Adicione e organize os blocos de conteúdo da página do produto."
            >
              <AdminBlockBuilder value={blocks} onChange={setBlocks} />
            </AdminFormSection>

            <ProductWizardStepPublish
              info={info}
              specs={activeSpecs}
              categoryName={category?.name}
              subcategoryName={subcategory?.name}
              onInfoChange={(key, value) => updateInfo(key, value)}
            />
          </div>
        )}
      </AdminWizardPage>

      <AdminSaveBar
        onBack={step > 1 ? handleBack : undefined}
        onNext={step < 4 ? handleNext : undefined}
        onSaveDraft={handleSaveDraft}
        onPublish={step === 4 ? handlePublish : undefined}
        isLoading={isSaving}
        isDirty={isDirty}
        draftSavedAt={lastSavedAt}
        publishLabel={
          mode === "create" ? "Publicar produto" : "Salvar alterações"
        }
        nextLabel="Próxima etapa"
        backLabel="Anterior"
      />
    </div>
  );
}
