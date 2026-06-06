"use client";

import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import { AdminSuccessPage } from "@/app/admin/_components/crud/admin-success-page";
import { AdminSaveBar } from "@/app/admin/_components/crud/admin-save-bar";
import { SectionFormRenderer } from "@/app/admin/paginas/_components/section-form-renderer";
import {
  useGetApiPagesSlugCms,
  patchApiPagesSlugBlocksBlockId,
} from "@/api/stetsom";
import { CheckCircle2, FileText } from "lucide-react";
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

  const block = page?.blocks.find((b) => b.block_id === sectionId);

  function handleChange(data: Record<string, unknown>) {
    setLocalData(data);
    setIsDirty(true);
  }

  async function handleSave() {
    if (!block || !localData) return;
    await patchApiPagesSlugBlocksBlockId(pageId, sectionId, {
      data: localData,
    });
    setSavedAt(new Date());
    setIsDirty(false);
    setSuccess(true);
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
          className="mt-4 inline-block text-sm text-brand hover:underline"
        >
          ← Voltar às seções
        </Link>
      </AdminListPage>
    );
  }

  const displaySection = localData
    ? {
        id: block.block_id,
        type: block.type,
        order: block.order,
        data: localData,
        block_id: block.block_id,
      }
    : {
        id: block.block_id,
        type: block.type,
        order: block.order,
        data: block.data,
        block_id: block.block_id,
      };

  return (
    <AdminListPage
      title={block.type}
      icon={FileText}
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
      <SectionFormRenderer section={displaySection} onChange={handleChange} />

      <AdminSaveBar
        onPublish={handleSave}
        isLoading={false}
        isDirty={isDirty}
        draftSavedAt={savedAt}
        publishLabel="Salvar alterações"
        draftSavedPrefix="Salvo às"
      />
    </AdminListPage>
  );
}
