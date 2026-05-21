"use client";

import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import { AdminPanel } from "@/app/admin/_components/admin-panel";
import type { DraftBlock } from "@/app/admin/_components/crud/admin-block-builder";
import { AdminBlockBuilder } from "@/app/admin/_components/crud/admin-block-builder";
import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import type { AdminStep } from "@/app/admin/_components/crud/admin-step-indicator";
import { AdminWizardPage } from "@/app/admin/_components/crud/admin-wizard-page";
import { ProductWizardStepFiles } from "@/app/admin/_components/product-wizard-step-files";
import { ProductWizardStepPublish } from "@/app/admin/_components/product-wizard-step-publish";
import { ProductWizardStepSpecs } from "@/app/admin/_components/product-wizard-step-specs";
import type { ProductInfo } from "@/app/admin/_components/product-wizard-step1";
import { ProductWizardStep1 } from "@/app/admin/_components/product-wizard-step1";
import type {
  CmsProductDetailPayload,
  ProductVariation,
} from "@/lib/api/contracts";
import {
  useCatalogCategories,
  useCatalogSubcategories,
} from "@/hooks/use-catalog";
import { ArrowLeft, ArrowRight, Check, Package } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
    return [
      {
        id: "variation-default",
        label: "1 Ohm",
        order: 1,
        specs: [],
      },
    ];
  }

  const variations = [...detail.product.variations].sort(
    (a, b) => a.order - b.order,
  );

  if (variations.length > 0) {
    return variations;
  }

  return [
    {
      id: "variation-default",
      label: "Padrão",
      order: 1,
      specs: [],
    },
  ];
}

function buildInitialHighlights(detail?: CmsProductDetailPayload): string[] {
  if (!detail) return [];
  return detail.product.highlight_attributes;
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

const STEP_LABELS: Record<Step, string> = {
  1: "Dados gerais",
  2: "Especificações técnicas",
  3: "Arquivos",
  4: "Customização",
};

export function ProductWizard({ initial, mode }: ProductWizardProps) {
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
  const [saved, setSaved] = useState(false);

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
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  function handlePublish() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const title =
    mode === "create" ? "Novo Produto" : `Editar: ${info.name || "Produto"}`;

  const category = categories.find((c) => c.id === info.category_id);
  const subcategory = subcategories.find((s) => s.id === info.subcategory_id);
  const activeVariation =
    variations.find((variation) => variation.id === activeVariationId) ??
    variations[0];
  const activeSpecs = activeVariation?.specs ?? [];

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
              {info.status === "ACTIVE" ? "Ativo" : "Descontinuado"}
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
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      <AdminPanel className="flex items-center justify-between p-5">
        <AdminPageHeader title={title} icon={Package} />
        <Link
          href="/admin/produtos"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
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

      {/* Bottom action bar */}
      <AdminPanel className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-2">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as Step)}
              className="flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <ArrowLeft className="size-4" />
              Anterior
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Etapa {step} de 4 — {STEP_LABELS[step]}
          </span>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as Step)}
              className="flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80"
            >
              Próxima etapa
              <ArrowRight className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              className="flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80"
            >
              {saved ? (
                <>
                  <Check className="size-4" />
                  Salvo!
                </>
              ) : mode === "create" ? (
                "Publicar produto"
              ) : (
                "Salvar alterações"
              )}
            </button>
          )}
        </div>
      </AdminPanel>
    </div>
  );
}
