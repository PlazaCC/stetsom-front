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
import {
  AdminWizardTabs,
  type AdminWizardTab,
} from "@/app/admin/_components/crud/admin-wizard-tabs";
import { AdminWizardPage } from "@/app/admin/_components/crud/admin-wizard-page";
import { ProductWizardStepFiles } from "@/app/admin/_components/product-wizard-step-files";
import { ProductWizardStepImages } from "@/app/admin/_components/product-wizard-step-images";
import { ProductWizardStepPublish } from "@/app/admin/_components/product-wizard-step-publish";
import { ProductWizardStepSpecs } from "@/app/admin/_components/product-wizard-step-specs";
import { ProductWizardStepSuccess } from "@/app/admin/_components/product-wizard-step-success";
import type { ProductInfo } from "@/app/admin/_components/product-wizard-step1";
import { ProductWizardStep1 } from "@/app/admin/_components/product-wizard-step1";
import type {
  WizardProductFile,
  WizardProductImage,
  WizardProductVariation,
} from "@/app/admin/_components/product-wizard-types";
import {
  deleteApiProductsId,
  deleteApiProductsIdBlocksBlockId,
  deleteApiProductsIdImagesImageId,
  patchApiProductsId,
  patchApiProductsIdBlocksBlockId,
  patchApiProductsIdImagesImageId,
  postApiProducts,
  postApiProductsIdBlocks,
  postApiProductsIdFiles,
  postApiProductsIdImages,
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
import { slugify } from "@/lib/utils/slugify";
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

type Tab = 1 | 2 | 3 | 4 | 5;

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
    is_discontinued: false,
    is_featured: false,
    is_spotlight: false,
    launch_date: new Date().toISOString().split("T")[0],
    launch_time: "00:00",
    available_locales: ["pt"],
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
    status: p.status,
    is_discontinued: p.is_discontinued,
    is_featured: p.is_featured ?? false,
    is_spotlight: p.is_spotlight ?? false,
    launch_date: p.launch_date?.split("T")[0] ?? base.launch_date,
    available_locales: (p.available_locales as ("pt" | "en" | "es")[]) ?? [
      "pt",
    ],
  };
}

function buildInitialImages(
  detail?: CmsProductDetailPayload,
): WizardProductImage[] {
  if (!detail) return [];
  return [...detail.product.images]
    .sort((a, b) => a.order - b.order)
    .map((img) => ({
      id: img.image_id,
      image_id: img.image_id,
      preview_url: img.image_url ?? "",
      order: img.order,
    }));
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
    status: info.status,
    is_discontinued: info.is_discontinued,
    is_featured: info.is_featured,
    is_spotlight: info.is_spotlight,
    launch_date: launchDate,
    highlight_attributes: [...highlightIds],
    available_locales:
      info.available_locales.length > 0 ? info.available_locales : ["pt"],
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

const TAB_LABELS: Record<Tab, string> = {
  1: "Dados gerais",
  2: "Imagens",
  3: "Especificações técnicas",
  4: "Arquivos",
  5: "Customização",
};

export function ProductWizard({ initial, mode }: ProductWizardProps) {
  const router = useRouter();
  const inlineUpload = useInlineUpload();
  const adminToast = useAdminToast();

  const [activeTab, setActiveTab] = useState<Tab>(1);
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
  const [files, setFiles] = useState<WizardProductFile[]>([]);
  const [newFileIds] = useState<Set<string>>(() => new Set());
  const [images, setImages] = useState<WizardProductImage[]>(
    buildInitialImages(initial),
  );
  const [initialImageIds] = useState<string[]>(() =>
    (initial?.product.images ?? []).map((img) => img.image_id),
  );

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

  const tabs: AdminWizardTab[] = ([1, 2, 3, 4, 5] as Tab[]).map((n) => ({
    label: TAB_LABELS[n],
  }));

  function patchInfo(patch: Partial<ProductInfo>) {
    setInfo((prev) => {
      const next = { ...prev, ...patch };
      if (patch.name && mode === "create" && !prev.slug.pt) {
        next.slug = { pt: slugify(patch.name.pt) };
      }
      return next;
    });
    // Prefill the active variation's specs from the chosen template's
    // attributes (only when it has no specs yet, to avoid clobbering edits).
    if (patch.template_id) {
      const tpl = (templatesQuery.data ?? []).find(
        (t) => t.id === patch.template_id,
      );
      if (tpl) {
        const attrs = attributesQuery.data ?? [];
        const prefilled = [...tpl.attributes]
          .sort((a, b) => a.order - b.order)
          .map((ta, i) => ({
            id: `spec-tpl-${ta.attribute_id}-${i}`,
            attribute_id: ta.attribute_id,
            attribute_name: attrs.find((a) => a.id === ta.attribute_id)?.name,
            value: { pt: "" },
            order: i,
            highlighted: false,
          }));
        setVariations((prev) =>
          prev.map((v) =>
            v.id === activeVariationId && v.specs.length === 0
              ? { ...v, specs: prefilled }
              : v,
          ),
        );
      }
    }
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

  /**
   * Reconcile the product gallery: delete removed images, upload new ones via
   * the presign-on-POST flow, and patch the order of existing ones. Image at
   * order 0 is the catalog cover.
   */
  async function syncImages(id: string) {
    const currentImageIds = new Set(
      images.filter((img) => img.image_id).map((img) => img.image_id as string),
    );
    const removed = initialImageIds.filter((iid) => !currentImageIds.has(iid));
    await Promise.all(
      removed.map((iid) => deleteApiProductsIdImagesImageId(id, iid)),
    );

    for (const [index, img] of images.entries()) {
      if (img.file) {
        const { upload } = await postApiProductsIdImages(id, {
          file: {
            fileName: img.file.name,
            mimeType: img.file.type,
            sizeBytes: img.file.size,
          },
          order: index,
        });
        await fetch(upload.uploadUrl, {
          method: upload.method,
          headers: upload.headers as Record<string, string>,
          body: img.file,
        });
      } else if (img.image_id && img.order !== index) {
        await patchApiProductsIdImagesImageId(id, img.image_id, {
          order: index,
        });
      }
    }
  }

  /** Link newly added library files to the product. */
  async function syncFiles(id: string) {
    const toAdd = files.filter((f) => newFileIds.has(f.id));
    for (const f of toAdd) {
      await postApiProductsIdFiles(id, {
        library_id: f.library_id,
        is_active: f.is_active,
      });
    }
    newFileIds.clear();
  }

  function addFile(file: { library_id: string; file_url: string }) {
    const id = `file-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    newFileIds.add(id);
    setFiles((prev) => [
      ...prev,
      {
        id,
        library_id: file.library_id,
        file_url: file.file_url,
        type: "MANUAL",
        is_active: true,
      },
    ]);
    setIsDirty(true);
  }

  function removeFile(fileId: string) {
    newFileIds.delete(fileId);
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    setIsDirty(true);
  }

  async function handleSave(): Promise<ProductMutationResult> {
    const payload = buildPayload(info, variations);

    let id = productId;
    if (id) {
      await updateMutation.mutateAsync({ id, body: payload });
    } else {
      const result = await createMutation.mutateAsync(payload);
      id = result.id;
      setProductId(result.id);
    }

    if (id) {
      await syncBlocks(id);
      await syncImages(id);
      await syncFiles(id);
    }

    setLastSavedAt(new Date());
    setIsDirty(false);
    return { id: id ?? "", slug: info.slug.pt, status: info.status };
  }

  async function handleSaveDraft() {
    try {
      await handleSave();
      adminToast.draft(info.name.pt || undefined);
    } catch {
      adminToast.error("Erro ao salvar rascunho");
    }
  }

  async function handlePublish() {
    try {
      const result = await handleSave();
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
          {images[0]?.preview_url ? (
            <div className="relative h-36 w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[0].preview_url}
                alt={info.name.pt}
                className="h-full w-full object-cover"
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
              {info.status === "PUBLISHED"
                ? "Publicado"
                : info.status === "SCHEDULED"
                  ? "Agendado"
                  : "Rascunho"}
            </dd>
          </div>
          {info.is_discontinued && (
            <div className="flex justify-between gap-2">
              <dt className="shrink-0 text-muted-foreground">Observação</dt>
              <dd className="text-destructive">Descontinuado</dd>
            </div>
          )}
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
    <div className="flex h-full flex-col">
      <AdminPanel className="flex flex-col justify-between">
        <AdminPageHeader title={title} icon={Package} />
        <AdminWizardTabs
          tabs={tabs}
          activeIndex={activeTab - 1}
          onSelect={(index) => setActiveTab((index + 1) as Tab)}
        />
      </AdminPanel>

      <AdminWizardPage
        aside={previewAside}
        className="flex flex-1 overflow-auto px-4 pb-5 lg:px-11.75"
      >
        {activeTab === 1 && (
          <ProductWizardStep1
            info={info}
            categories={categories}
            subcategories={subcategories}
            templates={templates}
            onPatch={patchInfo}
          />
        )}

        {activeTab === 2 && (
          <ProductWizardStepImages
            images={images}
            onImagesChange={(imgs) => {
              setImages(imgs);
              setIsDirty(true);
            }}
          />
        )}

        {activeTab === 3 && (
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

        {activeTab === 4 && (
          <ProductWizardStepFiles
            files={files}
            onAdd={addFile}
            onRemove={removeFile}
          />
        )}

        {activeTab === 5 && (
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

      <AdminSaveBar
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        isLoading={isSaving}
        isDirty={isDirty}
        draftSavedAt={lastSavedAt}
        publishLabel={
          mode === "create" ? "Publicar produto" : "Salvar alterações"
        }
        saveDraftLabel="Salvar rascunho"
        draftSavedPrefix="Salvo às"
      />
    </div>
  );
}
