"use client";

import {
  patchApiPagesSlugBlocksBlockId,
  useGetApiPagesSlugCms,
} from "@/api/stetsom";
import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import { AdminSaveBar } from "@/app/admin/_components/crud/admin-save-bar";
import { AdminSuccessPage } from "@/app/admin/_components/crud/admin-success-page";
import { findSectionDef } from "@/app/admin/paginas/_components/section-field-spec";
import { SectionFormRenderer } from "@/app/admin/paginas/_components/section-form-renderer";
import { CheckCircle2, FileText, Info } from "lucide-react";
import Link from "next/link";
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
      <AdminListPage title="Carregando..." icon={FileText}>
        <div className="h-64 animate-pulse rounded-[12px] bg-muted" />
      </AdminListPage>
    );
  }

  if (!block) {
    return (
      <AdminListPage title="Seção não encontrada" icon={FileText}>
        <p className="text-sm text-muted-foreground">
          A seção solicitada não existe ou não pôde ser carregada.
        </p>
        <Link
          href={`/admin/paginas/${pageId}`}
          className="mt-4 inline-block text-sm text-primary hover:underline"
        >
          ← Voltar às seções
        </Link>
      </AdminListPage>
    );
  }

  const def = findSectionDef(pageId, block.section_id);
  const sectionData = localData ?? block.data ?? {};

  return (
    <AdminListPage
      title={def?.label ?? block.section_id}
      icon={def?.icon ?? FileText}
      toolbar={
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/paginas/${pageId}`}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ← {page?.title?.pt ?? pageId}
          </Link>
        </div>
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

      <AdminSaveBar
        onPublish={handleSave}
        isLoading={isSaving}
        isDirty={isDirty}
        draftSavedAt={savedAt}
        publishLabel="Salvar alterações"
        draftSavedPrefix="Salvo às"
      />
    </AdminListPage>
  );
}
