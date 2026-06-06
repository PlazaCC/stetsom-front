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
  WizardProductVariation,
  WizardProductFile,
} from "@/app/admin/_components/product-wizard-types";
import Image from "next/image";
import {
  useGetApiCategories,
  postApiProducts,
  patchApiProductsId,
  deleteApiProductsId,
} from "@/api/stetsom";
import type {
  PostApiProductsBody,
  CmsProductDetailPayload,
} from "@/api/stetsom/model";
import { useInlineUpload } from "@/hooks/use-inline-upload";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { useMutation } from "@tanstack/react-query";
import { Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductWizardProps {
  initial?: CmsProductDetailPayload;
  mode: "create" | "edit";
}

interface ProductMutationResult {
  id: string;
  slug: string;
  status: string;
}

type Step = 1 | 2 | 3 | 4;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
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
      status: "DRAFT",
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
    name: detail.product.name?.pt ?? "",
    slug: detail.product.slug?.pt ?? "",
    category_id: detail.product.category_id,
    subcategory_id: detail.product.line_id ?? "",
    status: detail.product.is_discontinued
      ? "DISCONTINUED"
      : detail.product.status === "DRAFT"
        ? "DRAFT"
        : "ACTIVE",
    badge: "",
    description: detail.product.description?.pt ?? "",
    cover_image_url: detail.product.images?.[0]?.image_url ?? "",
    additional_images: [],
    video_url: "",
    launch_date: detail.product.launch_date?.split("T")[0] ?? "",
    launch_time: "00:00",
  };
}

function buildInitialVariations(
  detail?: CmsProductDetailPayload,
): WizardProductVariation[] {
  if (!detail) {
    return [{ id: "variation-default", label: "1 Ohm", order: 1, specs: [] }];
  }

  const variants = [...detail.product.variants].sort(
    (a, b) => a.order - b.order,
  );

  return variants.length > 0
    ? variants.map((v) => ({
        id: v.variant_id,
        label: v.name,
        order: v.order,
        specs: v.attributes.map((a) => ({
          id: `attr-${a.attribute_id}`,
          attribute: a.attribute_name?.pt ?? "",
          value: a.value?.pt ?? "",
          order: a.order,
        })),
      }))
    : [{ id: "variation-default", label: "Padrão", order: 1, specs: [] }];
}

function buildInitialHighlights(detail?: CmsProductDetailPayload): string[] {
  return detail?.product.highlight_attributes ?? [];
}

function buildInitialBlocks(detail?: CmsProductDetailPayload): DraftBlock[] {
  if (!detail) return [];
  return detail.product.page_blocks.map((b) => {
    const d = b.data as Record<string, unknown>;
    const images = Array.isArray(d.images) ? (d.images as string[]) : [];
    return {
      id: b.block_id,
      type: b.type as DraftBlock["type"],
      data: {
        images: images[0] ?? "",
        caption: typeof d.caption === "string" ? d.caption : "",
        layout: typeof d.layout === "string" ? d.layout : "default",
      } as Record<string, unknown>,
      order: b.order,
    };
  });
}

function resolveStatus(
  info: ProductInfo,
  blocks: DraftBlock[],
  desiredStatus: string,
  hasImage: boolean,
): string {
  const hasRequired =
    !!info.name && !!info.category_id && hasImage && blocks.length > 0;
  return hasRequired ? desiredStatus : "DRAFT";
}

function buildPayload(
  info: ProductInfo,
  variations: WizardProductVariation[],
  blocks: DraftBlock[],
  highlightAttributes: string[],
  status: string,
): PostApiProductsBody {
  const launchDate = info.launch_date
    ? new Date(`${info.launch_date}T${info.launch_time}:00`).toISOString()
    : new Date().toISOString();

  return {
    name: { pt: info.name },
    slug: { pt: info.slug },
    description: info.description ? { pt: info.description } : undefined,
    category_id: info.category_id,
    line_id: info.subcategory_id || null,
    status: status === "ACTIVE" ? "PUBLISHED" : "DRAFT",
    is_discontinued: status === "DISCONTINUED",
    launch_date: launchDate,
    highlight_attributes: highlightAttributes,
    variants: variations.map((v) => ({
      variant_id: v.id.startsWith("variation-") ? undefined : v.id,
      name: v.label,
      order: v.order,
      attributes: v.specs.map((s) => ({
        attribute_id: "",
        value: { pt: s.value },
        order: s.order,
        highlighted: highlightAttributes.includes(s.attribute),
      })),
    })),
    available_locales: ["pt"],
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
  const inlineUpload = useInlineUpload();
  const adminToast = useAdminToast();

  const [step, setStep] = useState<Step>(1);
  const [info, setInfo] = useState<ProductInfo>(buildInitialInfo(initial));
  const [variations, setVariations] = useState<WizardProductVariation[]>(
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
  const [files, setFiles] = useState<WizardProductFile[]>([]);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  const [productId, setProductId] = useState<string | null>(
    initial?.product.id ?? null,
  );
  const [isDirty, setIsDirty] = useState(mode === "edit");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [publishedResult, setPublishedResult] =
    useState<ProductMutationResult | null>(null);

  const categoriesQuery = useGetApiCategories({});
  const rawCategories = categoriesQuery.data ?? [];

  const categories = rawCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    order: cat.order,
  }));

  const subcategories = rawCategories.flatMap((cat) =>
    cat.lines.map((line) => ({
      id: line.line_id,
      name: line.name,
      slug: line.slug,
      category_id: cat.id,
    })),
  );

  const createMutation = useMutation({
    mutationFn: (body: PostApiProductsBody) => postApiProducts(body),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: PostApiProductsBody }) =>
      patchApiProductsId(id, body),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApiProductsId(id),
  });

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    inlineUpload.isUploading;

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

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

  function removeFile(fileId: string) {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    setIsDirty(true);
  }

  async function handleSave(
    overrideStatus?: string,
  ): Promise<ProductMutationResult> {
    const hasImage = !!coverImageFile || !!initial?.product.images?.length;
    const status =
      overrideStatus ?? resolveStatus(info, blocks, info.status, hasImage);
    const payload = buildPayload(
      info,
      variations,
      blocks,
      highlightAttributes,
      status,
    );

    if (productId) {
      await updateMutation.mutateAsync({ id: productId, body: payload });
    } else {
      const result = await createMutation.mutateAsync(payload);
      setProductId(result.id);
    }

    setLastSavedAt(new Date());
    setIsDirty(false);
    return { id: productId ?? "", slug: info.slug, status };
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
        resolveStatus(
          info,
          blocks,
          info.status,
          !!coverImageFile || !!initial?.product.images?.length,
        ),
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
      await deleteMutation.mutateAsync(productId);
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
            <div className="relative h-36 w-full">
              <Image
                src={info.cover_image_url}
                alt={info.name}
                fill
                className="object-cover"
              />
            </div>
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
              isLoading={deleteMutation.isPending}
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
            onCoverFile={setCoverImageFile}
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
        saveDraftLabel="Salvar rascunho"
        draftSavedPrefix="Salvo às"
      />
    </div>
  );
}
