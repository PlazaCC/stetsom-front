"use client";

import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import { AdminPanel } from "@/app/admin/_components/admin-panel";
import { AdminSaveBar } from "@/app/admin/_components/crud/admin-save-bar";
import {
  BlockBuilder,
  type DraftBlock,
} from "@/app/admin/_components/crud/block-builder";
import { PRODUCT_BLOCK_REGISTRY } from "@/app/admin/_components/crud/product-block-registry";
import { AdminDeleteAction } from "@/app/admin/_components/crud/admin-delete-action";
import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import type { AdminStep } from "@/app/admin/_components/crud/admin-step-indicator";
import { AdminWizardPage } from "@/app/admin/_components/crud/admin-wizard-page";
import { ProductWizardStepFiles } from "@/app/admin/_components/product-wizard-step-files";
import { ProductWizardStepPublish } from "@/app/admin/_components/product-wizard-step-publish";
import { ProductWizardStepSpecs } from "@/app/admin/_components/product-wizard-step-specs";
import { ProductWizardStepSuccess } from "@/app/admin/_components/product-wizard-step-success";
import type { ProductInfo } from "@/app/admin/_components/product-wizard-step1";
import { ProductWizardStep1 } from "@/app/admin/_components/product-wizard-step1";
import type {
  WizardProductFile,
  WizardProductVariation,
} from "@/app/admin/_components/product-wizard-types";
import {
  deleteApiProductsId,
  deleteApiProductsIdBlocksBlockId,
  patchApiProductsId,
  patchApiProductsIdBlocksBlockId,
  postApiProducts,
  postApiProductsIdBlocks,
  useGetApiAttributes,
  useGetApiCategories,
  useGetApiTemplates,
} from "@/api/stetsom";
import type {
  CmsProductDetailPayload,
  PostApiProductsBody,
  PostApiProductsIdBlocksBodyData,
  PostApiProductsIdBlocksBodyType,
} from "@/api/stetsom/model";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { useInlineUpload } from "@/hooks/use-inline-upload";
import { useMutation } from "@tanstack/react-query";
import { Package } from "lucide-react";
import Image from "next/image";
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
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildInitialInfo(detail?: CmsProductDetailPayload): ProductInfo {
  const base: ProductInfo = {
    name: { pt: "" },
    slug: { pt: "" },
    description: { pt: "" },
    sku: "",
    category_id: "",
    subcategory_id: "",
    template_id: "",
    status: "DRAFT",
    is_featured: false,
    is_spotlight: false,
    badge: "",
    cover_image_url: "",
    additional_images: [],
    video_url: "",
    launch_date: new Date().toISOString().split("T")[0],
    launch_time: "00:00",
  };
  if (!detail) return base;

  const p = detail.product;
  return {
    ...base,
    name: p.name ?? { pt: "" },
    slug: p.slug ?? { pt: "" },
    description: p.description ?? { pt: "" },
    sku: p.sku ?? "",
    category_id: p.category_id,
    subcategory_id: p.line_id ?? "",
    template_id: p.template_id ?? "",
    status: p.is_discontinued
      ? "DISCONTINUED"
      : p.status === "DRAFT"
        ? "DRAFT"
        : p.status === "SCHEDULED"
          ? "SCHEDULED"
          : "ACTIVE",
    is_featured: p.is_featured ?? false,
    is_spotlight: p.is_spotlight ?? false,
    cover_image_url: p.images?.[0]?.image_url ?? "",
    launch_date: p.launch_date?.split("T")[0] ?? base.launch_date,
  };
}

function buildInitialVariations(
  detail?: CmsProductDetailPayload,
): WizardProductVariation[] {
  if (!detail || detail.product.variants.length === 0) {
    return [{ id: "variation-default", label: "Padrão", order: 0, specs: [] }];
  }
  return [...detail.product.variants]
    .sort((a, b) => a.order - b.order)
    .map((v) => ({
      id: v.variant_id,
      label: v.name,
      order: v.order,
      specs: v.attributes
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((a, i) => ({
          id: `attr-${v.variant_id}-${a.attribute_id}-${i}`,
          attribute_id: a.attribute_id,
          attribute_name: a.attribute_name,
          value: a.value ?? { pt: "" },
          order: a.order,
          highlighted: a.highlighted,
        })),
    }));
}

function buildInitialBlocks(detail?: CmsProductDetailPayload): DraftBlock[] {
  if (!detail) return [];
  return detail.product.page_blocks
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((b) => ({
      id: b.block_id,
      type: b.type,
      data: (b.data ?? {}) as Record<string, unknown>,
      order: b.order,
    }));
}

function buildPayload(
  info: ProductInfo,
  variations: WizardProductVariation[],
  status: string,
): PostApiProductsBody {
  const launchDate = info.launch_date
    ? new Date(`${info.launch_date}T${info.launch_time}:00`).toISOString()
    : new Date().toISOString();

  const highlightIds = new Set<string>();
  for (const v of variations) {
    for (const s of v.specs) {
      if (s.highlighted && s.attribute_id) highlightIds.add(s.attribute_id);
    }
  }

  return {
    name: info.name,
    slug: info.slug.pt ? info.slug : { pt: slugify(info.name.pt) },
    description: info.description.pt ? info.description : undefined,
    category_id: info.category_id,
    line_id: info.subcategory_id || null,
    template_id: info.template_id || null,
    status:
      status === "ACTIVE"
        ? "PUBLISHED"
        : status === "SCHEDULED"
          ? "SCHEDULED"
          : "DRAFT",
    is_discontinued: status === "DISCONTINUED",
    is_featured: info.is_featured,
    is_spotlight: info.is_spotlight,
    launch_date: launchDate,
    highlight_attributes: [...highlightIds],
    available_locales: ["pt"],
    variants: variations.map((v) => ({
      variant_id: v.id.startsWith("variation-") ? undefined : v.id,
      name: v.label,
      order: v.order,
      attributes: v.specs
        .filter((s) => s.attribute_id)
        .map((s) => ({
          attribute_id: s.attribute_id,
          value: s.value,
          order: s.order,
          highlighted: s.highlighted,
        })),
    })),
  };
}

function resolveStatus(
  info: ProductInfo,
  blocks: DraftBlock[],
  desiredStatus: string,
  hasImage: boolean,
): string {
  const hasRequired =
    !!info.name.pt && !!info.category_id && hasImage && blocks.length > 0;
  return hasRequired ? desiredStatus : "DRAFT";
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
  const [blocks, setBlocks] = useState<DraftBlock[]>(
    buildInitialBlocks(initial),
  );
  const [files] = useState<WizardProductFile[]>([]);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  const [productId, setProductId] = useState<string | null>(
    initial?.product.id ?? null,
  );
  const [initialBlockIds] = useState<string[]>(() =>
    (initial?.product.page_blocks ?? []).map((b) => b.block_id),
  );
  const [isDirty, setIsDirty] = useState(mode === "edit");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [publishedResult, setPublishedResult] =
    useState<ProductMutationResult | null>(null);

  const categoriesQuery = useGetApiCategories();
  const templatesQuery = useGetApiTemplates();
  const attributesQuery = useGetApiAttributes();
  const rawCategories = categoriesQuery.data ?? [];

  const categories = rawCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
  }));
  const subcategories = rawCategories.flatMap((cat) =>
    cat.lines.map((line) => ({
      id: line.line_id,
      name: line.name,
      slug: line.slug,
      category_id: cat.id,
    })),
  );
  const templates = (templatesQuery.data ?? []).map((t) => ({
    id: t.id,
    name: t.name.pt,
    category_id: t.category_id,
  }));

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

  function patchInfo(patch: Partial<ProductInfo>) {
    setInfo((prev) => {
      const next = { ...prev, ...patch };
      if (patch.name && mode === "create" && !prev.slug.pt) {
        next.slug = { pt: slugify(patch.name.pt) };
      }
      return next;
    });
    setIsDirty(true);
  }

  /** Reconcile product page-blocks via the block sub-resource endpoints. */
  async function syncBlocks(id: string) {
    const currentIds = new Set(blocks.map((b) => b.id));
    const removed = initialBlockIds.filter((bid) => !currentIds.has(bid));
    await Promise.all(
      removed.map((bid) => deleteApiProductsIdBlocksBlockId(id, bid)),
    );
    for (const block of blocks) {
      const body = {
        type: block.type as PostApiProductsIdBlocksBodyType,
        order: block.order,
        data: block.data as PostApiProductsIdBlocksBodyData,
      };
      if (initialBlockIds.includes(block.id)) {
        await patchApiProductsIdBlocksBlockId(id, block.id, body);
      } else {
        await postApiProductsIdBlocks(id, body);
      }
    }
  }

  async function handleSave(
    overrideStatus?: string,
  ): Promise<ProductMutationResult> {
    const hasImage = !!coverImageFile || !!initial?.product.images?.length;
    const status =
      overrideStatus ?? resolveStatus(info, blocks, info.status, hasImage);
    const payload = buildPayload(info, variations, status);

    let id = productId;
    if (id) {
      await updateMutation.mutateAsync({ id, body: payload });
    } else {
      const result = await createMutation.mutateAsync(payload);
      id = result.id;
      setProductId(result.id);
    }

    if (id) await syncBlocks(id);

    setLastSavedAt(new Date());
    setIsDirty(false);
    return { id: id ?? "", slug: info.slug.pt, status };
  }

  async function handleSaveDraft() {
    try {
      await handleSave("DRAFT");
      adminToast.draft(info.name.pt || undefined);
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
      const hasImage = !!coverImageFile || !!initial?.product.images?.length;
      const result = await handleSave(
        resolveStatus(info, blocks, info.status, hasImage),
      );
      if (result.status === "DRAFT") {
        adminToast.draft(info.name.pt || undefined);
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
      adminToast.deleted(info.name.pt || undefined);
      router.push("/admin/produtos");
    } catch {
      adminToast.error("Erro ao excluir produto");
    }
  }

  const title =
    mode === "create" ? "Novo Produto" : `Editar: ${info.name.pt || "Produto"}`;

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
                alt={info.name.pt}
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
              {info.name.pt || "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="shrink-0 text-muted-foreground">Status</dt>
            <dd className="font-medium text-foreground">
              {info.status === "ACTIVE"
                ? "Ativo"
                : info.status === "SCHEDULED"
                  ? "Agendado"
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
              {info.slug.pt || "—"}
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
              confirmTitle={`Excluir "${info.name.pt}"?`}
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
            templates={templates}
            onPatch={patchInfo}
            onCoverFile={setCoverImageFile}
          />
        )}

        {step === 2 && (
          <ProductWizardStepSpecs
            variations={variations}
            activeVariationId={activeVariationId}
            attributes={attributesQuery.data ?? []}
            onVariationsChange={(v) => {
              setVariations(v);
              setIsDirty(true);
            }}
            onActiveVariationChange={setActiveVariationId}
          />
        )}

        {step === 3 && <ProductWizardStepFiles files={files} />}

        {step === 4 && (
          <div className="space-y-6">
            <AdminFormSection
              title="Blocos de conteúdo"
              description="Adicione e organize os blocos de conteúdo da página do produto."
            >
              <BlockBuilder
                registry={PRODUCT_BLOCK_REGISTRY}
                value={blocks}
                onChange={(b) => {
                  setBlocks(b);
                  setIsDirty(true);
                }}
              />
            </AdminFormSection>

            <ProductWizardStepPublish
              info={info}
              specs={activeSpecs}
              categoryName={category?.name}
              subcategoryName={subcategory?.name}
              onPatch={patchInfo}
            />
          </div>
        )}
      </AdminWizardPage>

      <AdminSaveBarWrapper
        step={step}
        onBack={handleBack}
        onNext={handleNext}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        isSaving={isSaving}
        isDirty={isDirty}
        lastSavedAt={lastSavedAt}
        mode={mode}
      />
    </div>
  );
}

function AdminSaveBarWrapper({
  step,
  onBack,
  onNext,
  onSaveDraft,
  onPublish,
  isSaving,
  isDirty,
  lastSavedAt,
  mode,
}: {
  step: Step;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  isSaving: boolean;
  isDirty: boolean;
  lastSavedAt: Date | null;
  mode: "create" | "edit";
}) {
  return (
    <AdminSaveBar
      onBack={step > 1 ? onBack : undefined}
      onNext={step < 4 ? onNext : undefined}
      onSaveDraft={onSaveDraft}
      onPublish={step === 4 ? onPublish : undefined}
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
  );
}
