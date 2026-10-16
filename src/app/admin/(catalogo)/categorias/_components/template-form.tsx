"use client";

import {
  deleteApiTemplatesId,
  getGetApiTemplatesQueryKey,
  patchApiTemplatesId,
  postApiTemplates,
  useGetApiAttributeGroups,
  useGetApiAttributes,
  useGetApiCategories,
  useGetApiTemplates,
} from "@/api/stetsom";
import type {
  Attribute,
  I18nString,
  TemplateGroupInput,
} from "@/api/stetsom/model";
import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import { AdminLabel } from "@/app/admin/_components/crud/admin-input";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import { EditorFooter } from "@/app/admin/_components/crud/editor-footer";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { SortableList } from "@/app/admin/_components/crud/sortable-list";
import {
  downloadTemplateSpecSheet,
  specSheetFilename,
} from "@/app/admin/_components/spec-sheets/download-spec-sheet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileSpreadsheet, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TemplateFormProps {
  mode: "create" | "edit";
  categoryId: string;
  templateId?: string;
}

/** One section of the template while editing: a group and its attributes. */
interface EditorGroup {
  group_id: string;
  attribute_ids: string[];
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
      initialGroups={
        template?.groups
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((group) => ({
            group_id: group.group_id,
            attribute_ids: group.attributes
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((a) => a.attribute_id),
          })) ?? []
      }
    />
  );
}

interface TemplateFormInnerProps {
  categoryId: string;
  templateId?: string;
  isEdit: boolean;
  initialName: I18nString;
  initialGroups: EditorGroup[];
}

function TemplateFormInner({
  categoryId,
  templateId,
  isEdit,
  initialName,
  initialGroups,
}: TemplateFormInnerProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useAdminToast();
  const { data: allAttributes = [] } = useGetApiAttributes();
  const { data: allGroups = [] } = useGetApiAttributeGroups();
  const { data: categories = [] } = useGetApiCategories();
  const categoryName =
    categories.find((c) => c.id === categoryId)?.name ?? "Categoria";

  const [name, setName] = useState<I18nString>(initialName);
  const [groups, setGroups] = useState<EditorGroup[]>(initialGroups);
  const [isDirty, setIsDirty] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Categories no longer have a per-id route — deep-link with a query param.
  const backHref = `/admin/categorias?category=${categoryId}`;

  // An attribute sits in exactly one group, so the pickers only offer the
  // attributes and groups not placed yet.
  const usedAttributeIds = new Set(groups.flatMap((g) => g.attribute_ids));
  const availableAttributes = allAttributes.filter(
    (a) => !usedAttributeIds.has(a.id),
  );
  const availableGroups = allGroups.filter(
    (g) => !groups.some((eg) => eg.group_id === g.id),
  );

  function update(next: (prev: EditorGroup[]) => EditorGroup[]) {
    setGroups(next);
    setIsDirty(true);
  }

  function updateGroup(groupId: string, attributeIds: string[]) {
    update((prev) =>
      prev.map((g) =>
        g.group_id === groupId ? { ...g, attribute_ids: attributeIds } : g,
      ),
    );
  }

  function moveAttribute(attributeId: string, from: string, to: string) {
    update((prev) =>
      prev.map((g) => {
        if (g.group_id === from) {
          return {
            ...g,
            attribute_ids: g.attribute_ids.filter((id) => id !== attributeId),
          };
        }
        if (g.group_id === to) {
          return { ...g, attribute_ids: [...g.attribute_ids, attributeId] };
        }
        return g;
      }),
    );
  }

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getGetApiTemplatesQueryKey() });
  }

  const createMutation = useMutation({
    mutationFn: (payload: TemplateGroupInput[]) =>
      postApiTemplates({ name, category_id: categoryId, groups: payload }),
    onSuccess: () => {
      invalidate();
      toast.success("Template criado");
      router.push(backHref);
    },
    onError: (e) => toast.apiError(e, "Não foi possível criar o template"),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: TemplateGroupInput[]) =>
      patchApiTemplatesId(templateId as string, { name, groups: payload }),
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

  function groupName(groupId: string) {
    return allGroups.find((g) => g.id === groupId)?.name.pt ?? "Grupo";
  }

  function handleSave() {
    const empty = groups.find((g) => g.attribute_ids.length === 0);
    if (empty) {
      toast.error(
        `O grupo "${groupName(empty.group_id)}" está vazio`,
        "Adicione atributos a ele ou remova o grupo.",
      );
      return;
    }
    const payload: TemplateGroupInput[] = groups.map((group, order) => ({
      group_id: group.group_id,
      order,
      attributes: group.attribute_ids.map((attribute_id, attrOrder) => ({
        attribute_id,
        order: attrOrder,
      })),
    }));
    if (isEdit) updateMutation.mutate(payload);
    else createMutation.mutate(payload);
  }

  async function handleDownload() {
    if (!templateId) return;
    setIsDownloading(true);
    try {
      await downloadTemplateSpecSheet(templateId, {
        filename: specSheetFilename(name.pt),
      });
    } catch (error) {
      toast.apiError(error, "Não foi possível gerar a planilha");
    } finally {
      setIsDownloading(false);
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
        description={`Atributos técnicos da categoria "${categoryName}", organizados em grupos.`}
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
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
              <AdminLabel className="mb-0">Grupos e atributos</AdminLabel>
              {isEdit && templateId && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={isDownloading || isDirty}
                  title={
                    isDirty
                      ? "Salve o template antes de baixar a planilha"
                      : undefined
                  }
                >
                  <FileSpreadsheet className="size-4" />
                  {isDownloading ? "Gerando…" : "Baixar planilha modelo"}
                </Button>
              )}
            </div>
            <p className="mb-3 text-xs text-muted-foreground">
              Cada grupo vira uma seção da tabela de especificações. Todo
              atributo pertence a um único grupo.{" "}
              <Link
                href="/admin/grupos-atributos"
                className="font-medium text-primary hover:underline"
              >
                Gerenciar grupos
              </Link>
            </p>

            {groups.length === 0 && (
              <p className="rounded-md border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                Nenhum grupo adicionado. Comece adicionando um grupo abaixo.
              </p>
            )}

            <SortableList
              items={groups}
              getId={(g) => g.group_id}
              onReorder={(next) => update(() => next)}
              renderItem={(group, handle) => (
                <TemplateGroupCard
                  name={groupName(group.group_id)}
                  handle={handle}
                  attributeIds={group.attribute_ids}
                  allAttributes={allAttributes}
                  availableAttributes={availableAttributes}
                  otherGroups={groups
                    .filter((g) => g.group_id !== group.group_id)
                    .map((g) => ({
                      id: g.group_id,
                      name: groupName(g.group_id),
                    }))}
                  onChange={(ids) => updateGroup(group.group_id, ids)}
                  onMoveAttribute={(attributeId, to) =>
                    moveAttribute(attributeId, group.group_id, to)
                  }
                  onRemove={() =>
                    update((prev) =>
                      prev.filter((g) => g.group_id !== group.group_id),
                    )
                  }
                />
              )}
            />

            {availableGroups.length > 0 && (
              <div className="mt-3">
                <Select
                  value=""
                  onValueChange={(value) => {
                    if (value) {
                      update((prev) => [
                        ...prev,
                        { group_id: value, attribute_ids: [] },
                      ]);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Adicionar grupo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name.pt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {allGroups.length === 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                Nenhum grupo cadastrado.{" "}
                <Link
                  href="/admin/grupos-atributos"
                  className="font-medium text-primary hover:underline"
                >
                  Cadastre os grupos
                </Link>{" "}
                antes de montar o template.
              </p>
            )}
          </div>
        </form>
      </AdminFormSection>
    </AdminPageLayout>
  );
}

interface TemplateGroupCardProps {
  name: string;
  handle: React.ReactNode;
  attributeIds: string[];
  allAttributes: Attribute[];
  availableAttributes: Attribute[];
  otherGroups: Array<{ id: string; name: string }>;
  onChange: (attributeIds: string[]) => void;
  onMoveAttribute: (attributeId: string, toGroupId: string) => void;
  onRemove: () => void;
}

function TemplateGroupCard({
  name,
  handle,
  attributeIds,
  allAttributes,
  availableAttributes,
  otherGroups,
  onChange,
  onMoveAttribute,
  onRemove,
}: TemplateGroupCardProps) {
  return (
    <div className="rounded-md border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        {handle}
        <span className="flex-1 text-sm font-semibold text-foreground">
          {name}
        </span>
        <span className="text-xs text-muted-foreground">
          {attributeIds.length} atributo(s)
        </span>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remover o grupo ${name}`}
          className="text-destructive hover:opacity-80"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="space-y-1 p-2">
        {attributeIds.length === 0 && (
          <p className="py-2 text-center text-xs text-muted-foreground">
            Nenhum atributo neste grupo
          </p>
        )}
        <SortableList
          items={attributeIds}
          getId={(id) => id}
          onReorder={onChange}
          className="space-y-1"
          renderItem={(attributeId, attributeHandle) => {
            const attribute = allAttributes.find((a) => a.id === attributeId);
            return (
              <div className="flex items-center gap-2 rounded bg-muted/50 px-2 py-1.5">
                {attributeHandle}
                <span className="flex-1 text-sm text-foreground">
                  {attribute?.name.pt ?? attributeId}
                </span>
                {attribute?.type === "MATRIX" && (
                  <span className="rounded bg-muted px-1.5 py-0.5 text-2xs font-medium text-muted-foreground uppercase">
                    Matriz
                  </span>
                )}
                {otherGroups.length > 0 && (
                  <Select
                    value=""
                    onValueChange={(to) => {
                      if (to) onMoveAttribute(attributeId, to);
                    }}
                  >
                    <SelectTrigger
                      size="sm"
                      className="h-7 w-auto gap-1 border-none bg-transparent px-1.5 text-xs text-muted-foreground shadow-none"
                      aria-label="Mover para outro grupo"
                    >
                      <SelectValue placeholder="Mover" />
                    </SelectTrigger>
                    <SelectContent>
                      {otherGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <button
                  type="button"
                  onClick={() =>
                    onChange(attributeIds.filter((id) => id !== attributeId))
                  }
                  aria-label="Remover atributo"
                  className="text-destructive hover:opacity-80"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            );
          }}
        />
        {availableAttributes.length > 0 && (
          <Select
            value=""
            onValueChange={(value) => {
              if (value) onChange([...attributeIds, value]);
            }}
          >
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="Adicionar atributo ao grupo..." />
            </SelectTrigger>
            <SelectContent>
              {availableAttributes.map((attribute) => (
                <SelectItem key={attribute.id} value={attribute.id}>
                  {attribute.name.pt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}
