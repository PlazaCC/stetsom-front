"use client";

import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import { AdminSuccessPage } from "@/app/admin/_components/crud/admin-success-page";
import { AdminSaveBar } from "@/app/admin/_components/crud/admin-save-bar";
import { SectionFormRenderer } from "@/app/admin/paginas/_components/section-form-renderer";
import {
  useAdminPageSections,
  useUpdatePageSection,
} from "@/hooks/use-admin-pages";
import { useInlineUpload } from "@/hooks/use-inline-upload";
import type { PageId, PageSection, UploadFileInput } from "@/lib/api/contracts";
import { CheckCircle2, FileText } from "lucide-react";
import Link from "next/link";
import { use, useRef, useState } from "react";

interface PageParams {
  pageId: string;
  sectionId: string;
}

const PAGE_PUBLIC_HREFS: Record<string, string> = {
  home: "/",
  catalog: "/produtos",
  about: "/sobre",
  support: "/suporte",
};

export default function AdminSectionEditorPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { pageId, sectionId } = use(params);
  const { data, isLoading } = useAdminPageSections(pageId as PageId);
  const updateSection = useUpdatePageSection();
  const inlineUpload = useInlineUpload();

  const [localData, setLocalData] = useState<Record<string, unknown> | null>(
    null,
  );
  const [uploads, setUploads] = useState<Record<string, UploadFileInput>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [success, setSuccess] = useState(false);
  const fileMapRef = useRef<Map<string, File>>(new Map());

  const section = data?.sections.find((s) => s.id === sectionId);

  function handleChange(data: Record<string, unknown>) {
    setLocalData(data);
    setIsDirty(true);
  }

  function handleFileChange(fieldKey: string, file: File | null) {
    if (file) {
      fileMapRef.current.set(fieldKey, file);
      setUploads((prev) => ({
        ...prev,
        [fieldKey]: {
          fileName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
        },
      }));
    } else {
      fileMapRef.current.delete(fieldKey);
      setUploads((prev) => {
        const next = { ...prev };
        delete next[fieldKey];
        return next;
      });
    }
    setIsDirty(true);
  }

  async function handleSave() {
    if (!section || !localData) return;
    const result = await updateSection.mutateAsync({
      id: sectionId,
      data: localData,
      _uploads: Object.keys(uploads).length > 0 ? uploads : undefined,
    });

    if (result.uploads && fileMapRef.current.size > 0) {
      await inlineUpload.upload(result.uploads, fileMapRef.current);
    }

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

  if (!section) {
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

  const displaySection: PageSection = localData
    ? { ...section, data: localData }
    : section;

  return (
    <AdminListPage
      title={section.name}
      icon={FileText}
      toolbar={
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/paginas/${pageId}`}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ← {data?.label ?? pageId}
          </Link>
        </div>
      }
    >
      {updateSection.isError && (
        <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {updateSection.error?.message ?? "Erro ao salvar. Tente novamente."}
        </div>
      )}

      <SectionFormRenderer
        section={displaySection}
        onChange={handleChange}
        onFileChange={handleFileChange}
      />

      <AdminSaveBar
        onPublish={handleSave}
        isLoading={updateSection.isPending}
        isDirty={isDirty}
        draftSavedAt={savedAt}
        publishLabel="Salvar alterações"
      />
    </AdminListPage>
  );
}
