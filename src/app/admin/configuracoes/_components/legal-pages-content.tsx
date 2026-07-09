"use client";

import {
  deleteApiLegalPagesId,
  getGetApiLegalPagesQueryKey,
  patchApiLegalPagesId,
  postApiLegalPages,
  useGetApiLegalPages,
} from "@/api/stetsom";
import type { LegalPage } from "@/api/stetsom/model";
import { AdminLabel } from "@/app/admin/_components/crud/admin-input";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import { EditorFooter } from "@/app/admin/_components/crud/editor-footer";
import { StatusBadge } from "@/app/admin/_components/crud/status-badge";
import { LegalEditor } from "@/components/editor/legal/legal-editor";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { getApiErrorMessage } from "@/lib/api/error-utils";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type LocaleKey = "pt" | "en" | "es";

const LOCALES: { key: LocaleKey; label: string }[] = [
  { key: "pt", label: "Português" },
  { key: "en", label: "Inglês" },
  { key: "es", label: "Espanhol" },
];

const NEW_ID = "__new__";

type Draft = {
  id: string | null;
  slug: string;
  title: Record<LocaleKey, string>;
  content: Record<LocaleKey, string>;
  published: boolean;
  order: number;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function draftFromPage(page: LegalPage): Draft {
  return {
    id: page.id,
    slug: page.slug,
    title: {
      pt: page.title.pt ?? "",
      en: page.title.en ?? "",
      es: page.title.es ?? "",
    },
    content: {
      pt: page.content.pt ?? "",
      en: page.content.en ?? "",
      es: page.content.es ?? "",
    },
    published: page.published,
    order: page.order,
  };
}

function emptyDraft(order: number): Draft {
  return {
    id: null,
    slug: "",
    title: { pt: "", en: "", es: "" },
    content: { pt: "", en: "", es: "" },
    published: false,
    order,
  };
}

const sanitize = (html: string) =>
  DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });

export function LegalPagesContent() {
  const queryClient = useQueryClient();
  const listQuery = useGetApiLegalPages();
  const pages = useMemo(() => listQuery.data ?? [], [listQuery.data]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [activeLocale, setActiveLocale] = useState<LocaleKey>("pt");

  function invalidate() {
    return queryClient.invalidateQueries({
      queryKey: getGetApiLegalPagesQueryKey(),
    });
  }

  function selectPage(page: LegalPage) {
    setSelectedId(page.id);
    setDraft(draftFromPage(page));
    setActiveLocale("pt");
  }

  function startNew() {
    const maxOrder = pages.reduce((m, p) => Math.max(m, p.order), -1);
    setSelectedId(NEW_ID);
    setDraft(emptyDraft(maxOrder + 1));
    setActiveLocale("pt");
  }

  const saveMutation = useMutation({
    mutationFn: async (d: Draft) => {
      const title: { pt: string; en?: string; es?: string } = {
        pt: d.title.pt.trim(),
      };
      if (d.title.en.trim()) title.en = d.title.en.trim();
      if (d.title.es.trim()) title.es = d.title.es.trim();

      const content: { pt: string; en?: string; es?: string } = {
        pt: sanitize(d.content.pt),
      };
      if (d.content.en.trim()) content.en = sanitize(d.content.en);
      if (d.content.es.trim()) content.es = sanitize(d.content.es);

      const body = {
        slug: d.slug.trim(),
        title,
        content,
        order: d.order,
        published: d.published,
      };

      return d.id ? patchApiLegalPagesId(d.id, body) : postApiLegalPages(body);
    },
    onSuccess: async (saved) => {
      await invalidate();
      selectPage(saved);
      toast.success("Página salva com sucesso");
    },
    onError: (err) =>
      toast.error("Erro ao salvar", {
        description: getApiErrorMessage(err, "Tente novamente."),
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApiLegalPagesId(id),
    onSuccess: async () => {
      await invalidate();
      setSelectedId(null);
      setDraft(null);
      toast.success("Página removida");
    },
    onError: (err) =>
      toast.error("Erro ao remover", {
        description: getApiErrorMessage(err, "Tente novamente."),
      }),
  });

  const reorderMutation = useMutation({
    mutationFn: async (args: { a: LegalPage; b: LegalPage }) => {
      const tempOrder = -1;
      await patchApiLegalPagesId(args.a.id, { order: tempOrder });
      await patchApiLegalPagesId(args.b.id, { order: args.a.order });
      await patchApiLegalPagesId(args.a.id, { order: args.b.order });
    },
    onSuccess: () => invalidate(),
    onError: (err) => {
      invalidate();
      toast.error("Erro ao reordenar", {
        description: getApiErrorMessage(err, "Tente novamente."),
      });
    },
  });

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= pages.length) return;
    reorderMutation.mutate({ a: pages[index], b: pages[target] });
  }

  function handleTitleChange(value: string) {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = { ...prev, title: { ...prev.title, [activeLocale]: value } };
      // Auto-fill slug from the pt title while it tracks the title.
      if (
        activeLocale === "pt" &&
        (prev.slug === "" || prev.slug === slugify(prev.title.pt))
      ) {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  function handleSave() {
    if (!draft) return;
    if (!draft.slug.trim()) return toast.error("Informe um slug.");
    if (!draft.title.pt.trim())
      return toast.error("O título em português é obrigatório.");
    if (!draft.content.pt.replace(/<[^>]*>/g, "").trim())
      return toast.error("O conteúdo em português é obrigatório.");
    saveMutation.mutate(draft);
  }

  return (
    <AdminPageLayout
      footer={
        draft ? (
          <EditorFooter
            onBack={() => {
              setSelectedId(null);
              setDraft(null);
            }}
            deleteAction={
              draft.id
                ? {
                    label: "Excluir página",
                    confirmTitle: `Excluir "${draft.title.pt || draft.slug}"?`,
                    confirmDescription:
                      "A página será removida permanentemente. Esta ação não pode ser desfeita.",
                    onConfirm: () => deleteMutation.mutate(draft.id!),
                    isLoading: deleteMutation.isPending,
                  }
                : undefined
            }
            onPrimary={handleSave}
            primaryLabel={
              saveMutation.isPending ? "Salvando..." : "Salvar página"
            }
            isPrimaryLoading={saveMutation.isPending}
          />
        ) : undefined
      }
    >
      <div className="flex flex-col items-start gap-5 xl:flex-row">
        {/* List */}
        <aside className="flex w-full flex-col overflow-hidden rounded-[16px] border border-border bg-card xl:w-80 xl:shrink-0">
          <div className="flex items-center justify-between border-b border-border px-6 py-2.5">
            <h2 className="text-sm font-semibold text-foreground">
              Páginas legais
            </h2>
            <button
              type="button"
              onClick={startNew}
              className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-80"
            >
              <Plus className="size-3.5" />
              Nova
            </button>
          </div>

          <div className="flex-1 overflow-auto p-3">
            {listQuery.isLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="size-5 animate-spin rounded-full border-2 border-border border-t-primary" />
              </div>
            ) : pages.length === 0 && selectedId !== NEW_ID ? (
              <p className="rounded-md border border-dashed border-border px-3 py-8 text-center text-xs text-muted-foreground">
                Nenhuma página legal cadastrada.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {pages.map((page, index) => (
                  <li
                    key={page.id}
                    className={cn(
                      "flex items-center gap-1 rounded-md border px-2 py-2",
                      selectedId === page.id
                        ? "border-primary bg-muted"
                        : "border-border",
                    )}
                  >
                    <div className="flex flex-col">
                      <button
                        type="button"
                        aria-label="Mover para cima"
                        disabled={index === 0 || reorderMutation.isPending}
                        onClick={() => move(index, -1)}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <ChevronUp className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Mover para baixo"
                        disabled={
                          index === pages.length - 1 ||
                          reorderMutation.isPending
                        }
                        onClick={() => move(index, 1)}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <ChevronDown className="size-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => selectPage(page)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <span className="block truncate text-sm font-medium text-foreground">
                        {page.title.pt || page.slug}
                      </span>
                      <span className="block truncate text-2xs text-muted-foreground">
                        /{page.slug}
                      </span>
                    </button>
                    <StatusBadge
                      status={page.published ? "PUBLISHED" : "DRAFT"}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* Editor */}
        <div className="min-w-0 flex-1">
          {!draft ? (
            <div className="flex items-center justify-center rounded-[16px] border border-dashed border-border py-20 text-sm text-muted-foreground">
              Selecione uma página ou crie uma nova.
            </div>
          ) : (
            <div className="space-y-4 rounded-[16px] border border-border bg-card p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <AdminLabel>Slug (URL)</AdminLabel>
                  <Input
                    value={draft.slug}
                    onChange={(e) =>
                      setDraft((p) => (p ? { ...p, slug: e.target.value } : p))
                    }
                    placeholder="politica-de-privacidade"
                  />
                </div>
                <div className="flex items-end gap-3 pb-1">
                  <Switch
                    checked={draft.published}
                    onCheckedChange={(v: boolean) =>
                      setDraft((p) => (p ? { ...p, published: v } : p))
                    }
                  />
                  <span className="text-sm text-foreground">
                    {draft.published ? "Publicado" : "Rascunho"}
                  </span>
                </div>
              </div>

              {/* Locale tabs */}
              <div className="flex gap-1 border-b border-border">
                {LOCALES.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveLocale(key)}
                    className={cn(
                      "-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                      activeLocale === key
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {label}
                    {key === "pt" && <span className="text-brand"> *</span>}
                  </button>
                ))}
              </div>

              <div>
                <AdminLabel>Título ({activeLocale.toUpperCase()})</AdminLabel>
                <Input
                  value={draft.title[activeLocale]}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Política de Privacidade"
                />
              </div>

              <div>
                <AdminLabel>Conteúdo ({activeLocale.toUpperCase()})</AdminLabel>
                <LegalEditor
                  key={`${selectedId}-${activeLocale}`}
                  initialHTML={draft.content[activeLocale]}
                  onChange={(html) =>
                    setDraft((p) =>
                      p
                        ? {
                            ...p,
                            content: { ...p.content, [activeLocale]: html },
                          }
                        : p,
                    )
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
}
