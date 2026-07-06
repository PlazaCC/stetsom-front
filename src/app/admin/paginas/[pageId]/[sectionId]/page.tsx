"use client";

import {
  patchApiPagesSlugBlocksBlockId,
  useGetApiPagesSlugCms,
} from "@/api/stetsom";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import { AdminSuccessPage } from "@/app/admin/_components/crud/admin-success-page";
import { EditorFooter } from "@/app/admin/_components/crud/editor-footer";
import { findSectionDef } from "@/app/admin/paginas/_components/section-field-spec";
import { SectionFormRenderer } from "@/app/admin/paginas/_components/section-form-renderer";
import { CheckCircle2, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { PAGE_PUBLIC_HREFS } from "../../_components/page-constants";

interface PageParams {
  pageId: string;
  sectionId: string;
}

export default function AdminSectionEditorPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { pageId, sectionId } = use(params);
  const router = useRouter();
  const { data: page, isLoading } = useGetApiPagesSlugCms(pageId);
  const [localData, setLocalData] = useState<Record<string, unknown> | null>(
    null,
  );
  const [isDirty, setIsDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const block = page?.blocks.find((b) => b.section_id === sectionId);

  function handleChange(data: Record<string, unknown>) {
    setLocalData(data);
    setIsDirty(true);
  }

  async function handleSave() {
    if (!block || !localData) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await patchApiPagesSlugBlocksBlockId(pageId, block.block_id, {
        data: localData,
      });
      setSavedAt(new Date());
      setIsDirty(false);
      setSuccess(true);
    } catch {
      setSaveError("Erro ao salvar. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  }

  const publicHref = PAGE_PUBLIC_HREFS[pageId] ?? `/${pageId}`;

  if (success) {
    return (
      <AdminSuccessPage
        className="px-4 py-4 lg:px-11.75 lg:py-7.25"
        icon={CheckCircle2}
        title="Seção atualizada com sucesso!"
        subtitle="A alteração está visível no site imediatamente."
        actions={[
          {
            label: "Ver página no site",
            href: publicHref,
            variant: "secondary",
            external: true,
          },
          {
            label: "Continuar editando",
            onClick: () => setSuccess(false),
            variant: "outline",
          },
          {
            label: "Editar outra seção",
            href: `/admin/paginas/${pageId}`,
            variant: "outline",
          },
          {
            label: "Voltar às páginas",
            href: "/admin/paginas",
            variant: "ghost",
          },
        ]}
      />
    );
  }

  if (isLoading) {
    return (
      <AdminPageLayout>
        <div className="h-64 animate-pulse rounded-[12px] bg-muted" />
      </AdminPageLayout>
    );
  }

  if (!block) {
    return (
      <AdminPageLayout>
        <p className="text-sm text-muted-foreground">
          A seção solicitada não existe ou não pôde ser carregada.
        </p>
        <Link
          href={`/admin/paginas/${pageId}`}
          className="mt-4 inline-block text-sm text-primary hover:underline"
        >
          ← Voltar às seções
        </Link>
      </AdminPageLayout>
    );
  }

  const def = findSectionDef(pageId, block.section_id);
  const sectionData = localData ?? block.data ?? {};

  return (
    <AdminPageLayout
      footer={
        <EditorFooter
          onBack={() => router.push(`/admin/paginas/${pageId}`)}
          backLabel={`← ${page?.title?.pt ?? pageId}`}
          statusText={
            savedAt
              ? `Salvo às ${savedAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
              : undefined
          }
          onPrimary={handleSave}
          primaryLabel="Salvar alterações"
          isPrimaryLoading={isSaving}
          isPrimaryDisabled={!isDirty}
        />
      }
    >
      {def?.autoNote && (
        <div className="mb-4 flex items-start gap-3 rounded-md border border-border bg-muted/40 px-4 py-3">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{def.autoNote}</p>
        </div>
      )}

      {def ? (
        <SectionFormRenderer
          fields={def.fields}
          data={sectionData}
          onChange={handleChange}
        />
      ) : (
        <p className="text-sm text-muted-foreground">
          Esta seção ({block.section_id}) não possui editor configurado.
        </p>
      )}

      {saveError && (
        <p className="mt-3 text-sm text-destructive">{saveError}</p>
      )}
    </AdminPageLayout>
  );
}
