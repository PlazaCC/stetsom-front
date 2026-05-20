"use client";

import { AdminBlockBuilder } from "@/app/admin/_components/crud/admin-block-builder";
import type { DraftBlock } from "@/app/admin/_components/crud/admin-block-builder";
import { AdminFileUpload } from "@/app/admin/_components/crud/admin-file-upload";
import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import { AdminWizardPage } from "@/app/admin/_components/crud/admin-wizard-page";
import type { AdminStep } from "@/app/admin/_components/crud/admin-step-indicator";
import { AdminPanel } from "@/app/admin/_components/admin-panel";
import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import { ProductWizardStep1 } from "@/app/admin/_components/product-wizard-step1";
import type { ProductInfo } from "@/app/admin/_components/product-wizard-step1";
import type { CmsProductDetailPayload } from "@/lib/api/contracts";
import { ArrowLeft, ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ProductWizardProps {
  initial?: CmsProductDetailPayload;
  mode: "create" | "edit";
}

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
      status: "ACTIVE",
      description: "",
      thumbnail_url: "",
      video_url: "",
      launch_date: new Date().toISOString().split("T")[0],
      spec_tags: [],
    };
  }

  const specs = detail.product.specifications;
  return {
    name: detail.product.name,
    slug: detail.product.slug,
    category_id: detail.product.category_id,
    status: detail.product.status,
    description: detail.product.description,
    thumbnail_url: detail.product.thumbnail_url,
    video_url: detail.product.video_url ?? "",
    launch_date: detail.product.launch_date.split("T")[0],
    spec_tags: Object.entries(specs).map(([k, v]) => `${k}: ${String(v)}`),
  };
}

function buildInitialBlocks(detail?: CmsProductDetailPayload): DraftBlock[] {
  if (!detail) return [];
  return detail.blocks.map((b) => ({
    id: b.id,
    type: b.type as "TEXT" | "IMAGE" | "VIDEO",
    data:
      b.type === "IMAGE"
        ? {
            images: (b.data as { images: string[] }).images[0] ?? "",
            caption: (b.data as { caption?: string }).caption ?? "",
            layout: (b.data as { layout?: string }).layout ?? "default",
          }
        : (b.data as Record<string, unknown>),
    order: b.order,
  }));
}

export function ProductWizard({ initial, mode }: ProductWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [info, setInfo] = useState<ProductInfo>(buildInitialInfo(initial));
  const [blocks, setBlocks] = useState<DraftBlock[]>(
    buildInitialBlocks(initial),
  );
  const [saved, setSaved] = useState(false);

  const steps: AdminStep[] = [
    {
      label: "Informações",
      status: step > 1 ? "done" : step === 1 ? "active" : "pending",
    },
    {
      label: "Conteúdo",
      status: step > 2 ? "done" : step === 2 ? "active" : "pending",
    },
    { label: "Arquivos", status: step === 3 ? "active" : "pending" },
  ];

  function updateInfo(key: keyof ProductInfo, value: string | string[]) {
    setInfo((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && mode === "create") {
        next.slug = slugify(value as string);
      }
      return next;
    });
  }

  function handlePublish() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const title =
    mode === "create" ? "Novo Produto" : `Editar: ${info.name || "Produto"}`;

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

      <AdminWizardPage
        steps={steps}
        aside={
          <div className="space-y-4">
            <AdminFormSection title="Navegação">
              <div className="space-y-2">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-border py-2 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    <ArrowLeft className="size-4" />
                    Passo anterior
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => (s + 1) as 2 | 3)}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-foreground py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80"
                  >
                    Próximo passo
                    <ArrowRight className="size-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePublish}
                    className="w-full rounded-md bg-brand py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80"
                  >
                    {saved
                      ? "Salvo!"
                      : mode === "create"
                        ? "Publicar produto"
                        : "Salvar alterações"}
                  </button>
                )}
              </div>
            </AdminFormSection>

            <AdminFormSection title="Resumo">
              <dl className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="font-medium text-foreground">
                    {info.status === "ACTIVE" ? "Ativo" : "Descontinuado"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Blocos</dt>
                  <dd className="font-medium text-foreground">
                    {blocks.length}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Slug</dt>
                  <dd className="truncate font-mono text-foreground">
                    {info.slug || "—"}
                  </dd>
                </div>
              </dl>
            </AdminFormSection>
          </div>
        }
      >
        {step === 1 && <ProductWizardStep1 info={info} onChange={updateInfo} />}

        {step === 2 && (
          <AdminFormSection
            title="Blocos de conteúdo"
            description="Adicione e organize os blocos de conteúdo da página do produto."
          >
            <AdminBlockBuilder value={blocks} onChange={setBlocks} />
          </AdminFormSection>
        )}

        {step === 3 && (
          <>
            <AdminFormSection
              title="Upload de arquivos"
              description="Manuais, catálogos, certificados e imagens adicionais."
            >
              <AdminFileUpload
                multiple
                accept=".pdf,image/*"
                label="Clique ou arraste arquivos para o produto"
                description="PDF (manuais, catálogos) ou imagens"
              />
            </AdminFormSection>

            {initial && initial.files.length > 0 && (
              <AdminFormSection title="Arquivos existentes">
                <ul className="space-y-2">
                  {initial.files.map((file) => (
                    <li
                      key={file.id}
                      className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {file.name ?? file.file_url.split("/").pop()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {file.type} · v{file.version} ·{" "}
                          {file.is_active ? "Ativo" : "Inativo"}
                        </p>
                      </div>
                      <button className="text-xs font-medium text-muted-foreground hover:text-foreground">
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              </AdminFormSection>
            )}
          </>
        )}
      </AdminWizardPage>
    </div>
  );
}
