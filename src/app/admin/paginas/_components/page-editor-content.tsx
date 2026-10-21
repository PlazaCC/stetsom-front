"use client";

import {
  getGetApiPagesSlugCmsQueryKey,
  patchApiPagesSlugBlocksBlockId,
  postApiPagesSlugBlocks,
  useGetApiBanners,
  useGetApiBannersActive,
  useGetApiContactDepartments,
  useGetApiPagesSlugCms,
  useGetApiPartnerLocations,
  useGetApiPagesSlug,
  useGetApiCategories,
  useGetApiProducts,
} from "@/api/stetsom";
import { useGetApiFaqs } from "@/api/stetsom/endpoints/faq-public/faq-public";
import type { PageBlock } from "@/api/stetsom/model";
import { SetRouteLabel } from "@/app/admin/_components/admin-route-meta";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import {
  EditorSectionNav,
  type NavItem,
} from "@/app/admin/_components/crud/editor-section-nav";
import { EditorFooter } from "@/app/admin/_components/crud/editor-footer";
import { ProductEditorLayout } from "@/app/admin/_components/product-wizard/product-editor-layout";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { getApiErrorMessage } from "@/lib/api/error-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ExternalLink,
  Info,
  LayoutTemplate,
  Megaphone,
  Package,
  Pointer,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BannersSummaryPanel } from "./banners-summary-panel";
import { buildPagePreviewModel } from "./build-page-preview-model";
import { hasInvalidFeaturedTabs } from "./featured-tabs-validation";
import { PAGE_LABELS, PAGE_PUBLIC_HREFS } from "./page-constants";
import type { PageEditorTarget } from "./page-editor-target";
import { PagePreviewCanvas } from "./page-preview-canvas";
import {
  findSectionDef,
  getPageSections,
  getSectionNavEntries,
  sectionIdOfTarget,
  toNavTarget,
} from "./section-field-spec";
import { hasInvalidFields } from "./section-field-validation";
import { SectionFormRenderer } from "./section-form-renderer";

const BANNERS_TARGET = "__banners__";
type Device = "mobile" | "desktop";

interface PageEditorContentProps {
  pageId: string;
}

export function PageEditorContent({
  pageId,
}: Readonly<PageEditorContentProps>) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const toast = useAdminToast();
  const { data: page, isLoading } = useGetApiPagesSlugCms(pageId);
  const { data: publicPage } = useGetApiPagesSlug(
    pageId,
    { locale: "pt" },
    {
      query: {
        initialData: {
          id: "",
          slug: pageId,
          title: "",
          blocks: [],
          updated_at: "",
        },
        enabled: !!pageId,
      },
    },
  );

  const isHome = pageId === "home";
  const isSupport = pageId === "support";
  const isCatalog = pageId === "catalog";

  const { data: activeBannersRes } = useGetApiBannersActive(
    { locale: "pt" },
    { query: { enabled: isHome } },
  );
  const {
    data: allBannersRes,
    isLoading: areBannersLoading,
    isError: areBannersError,
  } = useGetApiBanners(undefined, { query: { enabled: isHome } });
  const { data: serviceCenters = [] } = useGetApiPartnerLocations(undefined, {
    query: { enabled: isSupport },
  });
  const { data: departments = [] } = useGetApiContactDepartments({
    query: { enabled: isSupport },
  });
  const { data: faqItems = [] } = useGetApiFaqs();
  const { data: previewCategories = [] } = useGetApiCategories(
    { locale: "pt" },
    { query: { enabled: isHome } },
  );
  const { data: previewProducts } = useGetApiProducts(
    {
      locale: "pt",
      status: "PUBLISHED",
      sort: "newest",
      page: 1,
      pageSize: 100,
    },
    { query: { enabled: isHome } },
  );

  const [localBlocks, setLocalBlocks] = useState<PageBlock[] | null>(null);
  const [selection, setSelection] = useState<PageEditorTarget>(null);
  const [sectionDraft, setSectionDraft] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [device, setDevice] = useState<Device>("mobile");
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [showSectionErrors, setShowSectionErrors] = useState(false);

  const blocks =
    localBlocks ??
    (page?.blocks ?? []).slice().sort((a, b) => a.order - b.order);

  const label = page?.title?.pt ?? PAGE_LABELS[pageId] ?? pageId;
  const publicHref = PAGE_PUBLIC_HREFS[pageId] ?? `/${pageId}`;

  const presentIds = new Set(blocks.map((b) => b.section_id));
  const missingDefs = getPageSections(pageId).filter(
    (def) => !presentIds.has(def.section_id),
  );

  // A tab is a section, or one view of it (`values:bases`); see SectionView.
  const navEntries = getSectionNavEntries(
    pageId,
    blocks.map((b) => b.section_id),
  );
  const selectedEntry =
    selection && selection !== BANNERS_TARGET
      ? navEntries.find((entry) => entry.id === selection)
      : undefined;
  const selectedBlock =
    selection && selection !== BANNERS_TARGET
      ? blocks.find((b) => b.section_id === sectionIdOfTarget(selection))
      : undefined;
  const selectedDef = selectedEntry?.def;
  const selectedFields = selectedEntry?.fields ?? [];

  const knownSectionIds = new Set(navEntries.map((e) => e.section_id));
  const navItems: NavItem[] = [
    ...(isHome
      ? [{ id: BANNERS_TARGET, label: "Banners", icon: Megaphone }]
      : []),
    ...navEntries.map((entry) => ({
      id: entry.id,
      label: entry.label,
      icon: entry.icon,
    })),
    // Stored sections without a spec still get a tab (with no editor).
    ...blocks
      .filter((b) => !knownSectionIds.has(b.section_id))
      .map((b) => ({
        id: b.section_id,
        label: b.section_id,
        icon: LayoutTemplate,
      })),
  ];

  function invalidate() {
    setLocalBlocks(null);
    return queryClient.invalidateQueries({
      queryKey: getGetApiPagesSlugCmsQueryKey(pageId),
    });
  }

  function selectSection(target: PageEditorTarget) {
    setSelection(
      target && target !== BANNERS_TARGET
        ? toNavTarget(pageId, target)
        : target,
    );
    setSectionDraft(null);
    setShowAddPanel(false);
    setShowSectionErrors(false);
  }

  const addMutation = useMutation({
    mutationFn: (sectionId: string) => {
      const def = findSectionDef(pageId, sectionId);
      return postApiPagesSlugBlocks(pageId, {
        section_id: sectionId,
        type: def?.type ?? "TEXT",
        order: blocks.length,
      });
    },
    onSuccess: (created) => {
      invalidate();
      selectSection(created.section_id);
    },
    onError: (error) =>
      toast.error(
        "Não foi possível adicionar a seção",
        getApiErrorMessage(error, "Tente novamente."),
      ),
  });

  const saveSectionMutation = useMutation({
    mutationFn: ({
      blockId,
      data,
    }: {
      blockId: string;
      data: Record<string, unknown>;
    }) => patchApiPagesSlugBlocksBlockId(pageId, blockId, { data }),
    onSuccess: () => {
      invalidate();
      setSectionDraft(null);
      setShowSectionErrors(false);
    },
    onError: (error) =>
      toast.error(
        "Não foi possível salvar a seção",
        getApiErrorMessage(error, "Tente novamente."),
      ),
  });

  const draftInvalid =
    !!sectionDraft &&
    !!selectedDef &&
    hasInvalidFields(selectedFields, sectionDraft);

  function handleSaveSection() {
    if (!selectedBlock || !sectionDraft || draftInvalid) return;
    if (selectedDef && hasInvalidFeaturedTabs(selectedFields, sectionDraft)) {
      setShowSectionErrors(true);
      toast.error(
        "Não foi possível salvar a seção",
        "Há abas sem categoria ou sem produtos. Adicione ao menos 1 produto em cada aba ou remova a aba.",
      );
      return;
    }
    saveSectionMutation.mutate({
      blockId: selectedBlock.block_id,
      data: sectionDraft,
    });
  }

  const effectiveBlocks =
    selectedBlock && sectionDraft
      ? blocks.map((b) =>
          b.block_id === selectedBlock.block_id
            ? { ...b, data: sectionDraft }
            : b,
        )
      : blocks;

  const previewModel = buildPagePreviewModel(
    pageId,
    effectiveBlocks,
    activeBannersRes?.items ?? [],
    serviceCenters,
    departments,
    publicPage?.blocks,
    faqItems,
    previewCategories,
    previewProducts?.items ?? [],
  );

  return (
    <AdminPageLayout
      contentClassName="overflow-hidden p-0"
      footer={
        <EditorFooter
          onBack={() => router.push("/admin/paginas")}
          backLabel="← Voltar"
          previewAction={
            selectedBlock
              ? {
                  key: "preview",
                  label: "Ver no site",
                  icon: ExternalLink,
                  onClick: () => window.open(publicHref, "_blank", "noopener"),
                }
              : undefined
          }
          onPrimary={
            selection === BANNERS_TARGET
              ? () => selectSection(null)
              : selectedBlock
                ? handleSaveSection
                : () => {}
          }
          primaryLabel={
            selection === BANNERS_TARGET
              ? "Concluído"
              : saveSectionMutation.isPending
                ? "Salvando..."
                : "Salvar alterações"
          }
          isPrimaryLoading={saveSectionMutation.isPending}
          isPrimaryDisabled={!sectionDraft || draftInvalid}
        />
      }
    >
      <SetRouteLabel label={label} />
      <ProductEditorLayout
        device={device}
        preview={
          previewModel && (
            <PagePreviewCanvas
              model={previewModel}
              selection={selection}
              onIntent={(target) => target && selectSection(target)}
              device={device}
              onDeviceChange={setDevice}
            />
          )
        }
        panel={
          <div className="flex h-full flex-col overflow-hidden">
            <EditorSectionNav
              items={navItems}
              activeId={selection}
              onSelect={(id) => selectSection(id as PageEditorTarget)}
              addItem={
                missingDefs.length > 0
                  ? {
                      label: "Nova",
                      onAdd: () => setShowAddPanel(!showAddPanel),
                    }
                  : undefined
              }
            />

            <div className="@container min-h-0 flex-1 overflow-y-auto p-3">
              {showAddPanel ? (
                <div className="space-y-1.5">
                  <p className="mb-2 text-2xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Seções disponíveis
                  </p>
                  {missingDefs.map((def) => {
                    const Icon = def.icon;
                    return (
                      <button
                        key={def.section_id}
                        type="button"
                        disabled={addMutation.isPending}
                        onClick={() => addMutation.mutate(def.section_id)}
                        className="flex w-full items-center gap-3 rounded-md border border-dashed border-border bg-card px-3 py-2.5 text-left transition-colors hover:border-primary disabled:opacity-50"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                          <Icon className="size-4" />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {def.label}
                        </span>
                        <Plus className="ml-auto size-4 text-primary" />
                      </button>
                    );
                  })}
                </div>
              ) : isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="size-5 animate-spin rounded-full border-2 border-border border-t-primary" />
                </div>
              ) : selection === BANNERS_TARGET ? (
                <BannersSummaryPanel
                  banners={allBannersRes?.items ?? []}
                  isLoading={areBannersLoading}
                  isError={areBannersError}
                />
              ) : selectedBlock ? (
                <>
                  {selectedEntry?.description && (
                    <p className="mb-4 text-sm text-muted-foreground">
                      {selectedEntry.description}
                    </p>
                  )}
                  {selectedDef?.autoNote && (
                    <div className="mb-4 flex items-start gap-3 rounded-md border border-border bg-muted/40 px-4 py-3">
                      <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {selectedDef.autoNote}
                      </p>
                    </div>
                  )}
                  {selectedDef ? (
                    <SectionFormRenderer
                      fields={selectedFields}
                      data={sectionDraft ?? selectedBlock?.data ?? {}}
                      onChange={setSectionDraft}
                      showErrors={showSectionErrors}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Esta seção não possui editor configurado.
                    </p>
                  )}
                </>
              ) : isCatalog ? (
                // The catalog page has no CMS sections: its content is the
                // product catalog itself, so point editors to where it lives.
                <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                  <Package className="mb-4 size-16" />
                  <p className="text-base font-medium">
                    Os produtos são editados no Catálogo
                  </p>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground/70">
                    Esta página lista os produtos publicados. Para cadastrar ou
                    editar um produto, abra Catálogo › Produtos.
                  </p>
                  <div className="mt-6 flex items-center gap-2">
                    <Link
                      href={publicHref}
                      target="_blank"
                      className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      Ver no site
                    </Link>
                    <Link
                      href="/admin/produtos"
                      className="rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80"
                    >
                      Gerenciar produtos
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <Pointer className="mb-4 size-16" />
                  <p className="text-base font-medium">
                    Selecione uma seção para editar
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground/70">
                    Clique em uma seção na barra acima ou no preview ao lado
                  </p>
                </div>
              )}
            </div>
          </div>
        }
      />
    </AdminPageLayout>
  );
}
