"use client";

import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import { AdminLabel } from "@/app/admin/_components/crud/admin-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import { EditorFooter } from "@/app/admin/_components/crud/editor-footer";
import {
  deleteApiTemplatesId,
  getGetApiTemplatesQueryKey,
  patchApiTemplatesId,
  postApiTemplates,
  useGetApiAttributes,
  useGetApiCategories,
  useGetApiTemplates,
} from "@/api/stetsom";
import type { I18nString, TemplateAttrInput } from "@/api/stetsom/model";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GripVertical, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TemplateFormProps {
  mode: "create" | "edit";
  categoryId: string;
  templateId?: string;
}

/**
 * Templates have no GET-by-id endpoint — the editor reads the template from the
 * list. Waits for the list before rendering so initial state is correct.
 */
export function TemplateForm({
  mode,
  categoryId,
  templateId,
}: TemplateFormProps) {
  const isEdit = mode === "edit";
  const { data: templates = [], isLoading } = useGetApiTemplates();
  const template = templateId
    ? templates.find((t) => t.id === templateId)
    : undefined;

  if (isEdit && isLoading && !template) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-sm text-muted-foreground">Carregando…</p>
      </div>
    );
  }

  if (isEdit && !template) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-sm text-muted-foreground">
          Template não encontrado.
        </p>
      </div>
    );
  }

  return (
    <TemplateFormInner
      categoryId={categoryId}
      templateId={templateId}
      isEdit={isEdit}
      initialName={template?.name ?? { pt: "" }}
      initialAttrIds={
        template?.attributes
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((a) => a.attribute_id) ?? []
      }
    />
  );
}

interface TemplateFormInnerProps {
  categoryId: string;
  templateId?: string;
  isEdit: boolean;
  initialName: I18nString;
  initialAttrIds: string[];
}

function TemplateFormInner({
  categoryId,
  templateId,
  isEdit,
  initialName,
  initialAttrIds,
}: TemplateFormInnerProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useAdminToast();
  const { data: allAttributes = [] } = useGetApiAttributes();
  const { data: categories = [] } = useGetApiCategories();
  const categoryName =
    categories.find((c) => c.id === categoryId)?.name ?? "Categoria";

  const [name, setName] = useState<I18nString>(initialName);
  const [selectedAttrIds, setSelectedAttrIds] =
    useState<string[]>(initialAttrIds);

  const backHref = `/admin/categorias/${categoryId}`;
  const availableAttributes = allAttributes.filter(
    (a) => !selectedAttrIds.includes(a.id),
  );

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getGetApiTemplatesQueryKey() });
  }

  const createMutation = useMutation({
    mutationFn: (attributes: TemplateAttrInput[]) =>
      postApiTemplates({
        name,
        category_id: categoryId,
        attributes: attributes.length > 0 ? attributes : undefined,
      }),
    onSuccess: () => {
      invalidate();
      toast.success("Template criado");
      router.push(backHref);
    },
    onError: (e) => toast.apiError(e, "Não foi possível criar o template"),
  });

  const updateMutation = useMutation({
    mutationFn: (attributes: TemplateAttrInput[]) =>
      patchApiTemplatesId(templateId as string, {
        name,
        attributes,
      }),
    onSuccess: () => {
      invalidate();
      toast.success("Template salvo");
      router.push(backHref);
    },
    onError: (e) => toast.apiError(e, "Não foi possível salvar o template"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteApiTemplatesId(templateId as string),
    onSuccess: () => {
      invalidate();
      toast.deleted(name.pt);
      router.push(backHref);
    },
    onError: (e) => toast.apiError(e, "Não foi possível excluir o template"),
  });

  function move(attrId: string, dir: -1 | 1) {
    setSelectedAttrIds((prev) => {
      const idx = prev.indexOf(attrId);
      const target = idx + dir;
      if (idx === -1 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  function handleSave() {
    const attributes: TemplateAttrInput[] = selectedAttrIds.map((id, i) => ({
      attribute_id: id,
      order: i,
    }));
    if (isEdit) {
      updateMutation.mutate(attributes);
    } else {
      createMutation.mutate(attributes);
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminPageLayout
      footer={
        <EditorFooter
          onBack={() => router.push(backHref)}
          deleteAction={
            isEdit && templateId
              ? {
                  label: "Excluir template",
                  confirmTitle: `Excluir "${name.pt}"?`,
                  confirmDescription:
                    "O template será removido permanentemente. Esta ação não pode ser desfeita.",
                  onConfirm: () => deleteMutation.mutate(),
                  isLoading: deleteMutation.isPending,
                }
              : undefined
          }
          onPrimary={handleSave}
          primaryLabel={isPending ? "Salvando..." : "Salvar"}
          isPrimaryLoading={isPending}
        />
      }
    >
      <AdminFormSection
        title="Dados do template"
        description={`Atributos técnicos da categoria "${categoryName}".`}
        className="h-auto flex-none overflow-visible"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-4"
        >
          <div>
            <AdminLabel>Categoria</AdminLabel>
            <p className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground">
              {categoryName}
            </p>
          </div>
          <I18nInput label="Nome" required value={name} onChange={setName} />
          <div>
            <AdminLabel>Atributos</AdminLabel>
            <div className="space-y-1 rounded-md border border-border bg-card p-3">
              {selectedAttrIds.length === 0 && (
                <p className="py-2 text-center text-xs text-muted-foreground">
                  Nenhum atributo selecionado
                </p>
              )}
              {selectedAttrIds.map((attrId, idx) => {
                const attr = allAttributes.find((a) => a.id === attrId);
                return (
                  <div
                    key={attrId}
                    className="flex items-center gap-2 rounded bg-muted/50 px-2 py-1.5"
                  >
                    <GripVertical className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="flex-1 text-sm text-foreground">
                      {attr?.name.pt ?? attrId}
                    </span>
                    <button
                      type="button"
                      onClick={() => move(attrId, -1)}
                      disabled={idx === 0}
                      className="text-xs text-muted-foreground disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(attrId, 1)}
                      disabled={idx === selectedAttrIds.length - 1}
                      className="text-xs text-muted-foreground disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedAttrIds((prev) =>
                          prev.filter((id) => id !== attrId),
                        )
                      }
                      className="text-destructive hover:opacity-80"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
            {availableAttributes.length > 0 && (
              <div className="mt-2">
                <Select
                  value=""
                  onValueChange={(value) => {
                    if (value) {
                      setSelectedAttrIds((prev) => [...prev, value]);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Adicionar atributo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAttributes.map((attr) => (
                      <SelectItem key={attr.id} value={attr.id}>
                        {attr.name.pt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </form>
      </AdminFormSection>
    </AdminPageLayout>
  );
}
