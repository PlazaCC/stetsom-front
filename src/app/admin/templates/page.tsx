"use client";

import { AdminConfirmDialog } from "@/app/admin/_components/crud/admin-confirm-dialog";
import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/app/admin/_components/crud/admin-data-table";
import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import {
  AdminInput,
  AdminLabel,
  AdminSelect,
} from "@/app/admin/_components/crud/admin-input";
import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import {
  useGetApiTemplates,
  getGetApiTemplatesQueryKey,
  useGetApiAttributes,
  useGetApiCategories,
  postApiTemplates,
  patchApiTemplatesId,
  deleteApiTemplatesId,
} from "@/api/stetsom";
import type { Template } from "@/api/stetsom";
import type {
  PostApiTemplatesBody,
  PatchApiTemplatesIdBody,
  TemplateAttrInput,
} from "@/api/stetsom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GripVertical, LayoutTemplate, Plus, X } from "lucide-react";
import { useState } from "react";

interface TemplateFormProps {
  template?: Template;
  onClose: () => void;
  onSave: (data: PostApiTemplatesBody | PatchApiTemplatesIdBody) => void;
  isPending: boolean;
}

function TemplateForm({
  template,
  onClose,
  onSave,
  isPending,
}: TemplateFormProps) {
  const { data: categories = [] } = useGetApiCategories();
  const { data: allAttributes = [] } = useGetApiAttributes();
  const [pt, setPt] = useState(template?.name.pt ?? "");
  const [en, setEn] = useState(template?.name.en ?? "");
  const [es, setEs] = useState(template?.name.es ?? "");
  const [categoryId, setCategoryId] = useState(
    template?.category_id ?? categories[0]?.id ?? "",
  );
  const [selectedAttrIds, setSelectedAttrIds] = useState<string[]>(
    () =>
      template?.attributes
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((a) => a.attribute_id) ?? [],
  );

  const availableAttributes = allAttributes.filter(
    (a) => !selectedAttrIds.includes(a.id),
  );

  function addAttribute(attrId: string) {
    setSelectedAttrIds((prev) => [...prev, attrId]);
  }

  function removeAttribute(attrId: string) {
    setSelectedAttrIds((prev) => prev.filter((id) => id !== attrId));
  }

  function moveUp(attrId: string) {
    setSelectedAttrIds((prev) => {
      const idx = prev.indexOf(attrId);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }

  function moveDown(attrId: string) {
    setSelectedAttrIds((prev) => {
      const idx = prev.indexOf(attrId);
      if (idx === -1 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const attributes: TemplateAttrInput[] = selectedAttrIds.map((id, i) => ({
      attribute_id: id,
      order: i,
    }));
    onSave({
      name: { pt, en: en || undefined, es: es || undefined },
      category_id: categoryId,
      attributes: attributes.length > 0 ? attributes : undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cms-overlay p-4">
      <div className="w-full max-w-lg">
        <AdminFormSection
          title={template ? "Editar Template" : "Novo Template"}
          className="shadow-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <AdminLabel>
                Nome (PT) <span className="text-destructive">*</span>
              </AdminLabel>
              <AdminInput
                required
                value={pt}
                onChange={(e) => setPt(e.target.value)}
              />
            </div>
            <div>
              <AdminLabel>Nome (EN)</AdminLabel>
              <AdminInput value={en} onChange={(e) => setEn(e.target.value)} />
            </div>
            <div>
              <AdminLabel>Nome (ES)</AdminLabel>
              <AdminInput value={es} onChange={(e) => setEs(e.target.value)} />
            </div>
            <div>
              <AdminLabel>Categoria</AdminLabel>
              <AdminSelect
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {categories.length === 0 && (
                  <option value="">Nenhuma categoria</option>
                )}
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name.pt}
                  </option>
                ))}
              </AdminSelect>
            </div>
            <div>
              <AdminLabel>Atributos</AdminLabel>
              <div className="space-y-1 rounded-md border border-border bg-card p-3">
                {selectedAttrIds.length === 0 && (
                  <p className="py-2 text-center text-xs text-muted-foreground">
                    Nenhum atributo selecionado
                  </p>
                )}
                {selectedAttrIds.map((attrId) => {
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
                        onClick={() => moveUp(attrId)}
                        disabled={selectedAttrIds.indexOf(attrId) === 0}
                        className="text-xs text-muted-foreground disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDown(attrId)}
                        disabled={
                          selectedAttrIds.indexOf(attrId) ===
                          selectedAttrIds.length - 1
                        }
                        className="text-xs text-muted-foreground disabled:opacity-30"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeAttribute(attrId)}
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
                  <AdminLabel className="text-xs text-muted-foreground">
                    Adicionar atributo
                  </AdminLabel>
                  <AdminSelect
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        addAttribute(e.target.value);
                        e.target.value = "";
                      }
                    }}
                  >
                    <option value="">Selecione...</option>
                    {availableAttributes.map((attr) => (
                      <option key={attr.id} value={attr.id}>
                        {attr.name.pt}
                      </option>
                    ))}
                  </AdminSelect>
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-md border border-border py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 rounded-md bg-foreground py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80 disabled:opacity-60"
              >
                {isPending ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </AdminFormSection>
      </div>
    </div>
  );
}

export default function AdminTemplatesPage() {
  const queryClient = useQueryClient();
  const { data: templates = [], isLoading } = useGetApiTemplates();
  const { data: categories = [] } = useGetApiCategories();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Template | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Template | undefined>();

  const createMutation = useMutation({
    mutationFn: (body: PostApiTemplatesBody) => postApiTemplates(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getGetApiTemplatesQueryKey(),
      });
      closeForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: PatchApiTemplatesIdBody }) =>
      patchApiTemplatesId(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getGetApiTemplatesQueryKey(),
      });
      closeForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApiTemplatesId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getGetApiTemplatesQueryKey(),
      });
      setDeleteTarget(undefined);
    },
  });

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(t: Template) {
    setEditing(t);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(undefined);
  }

  function handleSave(data: PostApiTemplatesBody | PatchApiTemplatesIdBody) {
    if (editing) {
      updateMutation.mutate({
        id: editing.id,
        body: data as PatchApiTemplatesIdBody,
      });
    } else {
      createMutation.mutate(data as PostApiTemplatesBody);
    }
  }

  function getCategoryName(t: Template): string {
    if (!t.category_id) return "—";
    const cat = categories.find((c) => c.id === t.category_id);
    return cat?.name.pt ?? "—";
  }

  const columns: AdminTableColumn<Template>[] = [
    {
      key: "name.pt",
      header: "Nome (PT)",
      render: (t) => (
        <span className="font-medium text-foreground">{t.name.pt}</span>
      ),
    },
    {
      key: "attributes",
      header: "Atributos",
      render: (t) => (
        <span className="text-muted-foreground">{t.attributes.length}</span>
      ),
    },
    {
      key: "category",
      header: "Categoria",
      render: (t) => (
        <span className="text-muted-foreground">{getCategoryName(t)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "text-right",
      className: "text-right",
      render: (t) => (
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => openEdit(t)}
            className="text-xs font-medium text-brand hover:underline"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(t)}
            className="text-xs font-medium text-destructive hover:underline"
          >
            Excluir
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminListPage
        title="Templates"
        icon={LayoutTemplate}
        action={
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80"
          >
            <Plus className="size-4" />
            Novo template
          </button>
        }
      >
        <AdminDataTable
          columns={columns}
          data={templates}
          isLoading={isLoading}
          keyExtractor={(t) => t.id}
          emptyTitle="Nenhum template cadastrado"
          emptyDescription="Templates definem os atributos técnicos de cada categoria."
        />
      </AdminListPage>

      {formOpen && (
        <TemplateForm
          template={editing}
          onClose={closeForm}
          onSave={handleSave}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <AdminConfirmDialog
        open={!!deleteTarget}
        title="Excluir template?"
        description={`${deleteTarget?.name.pt} será removido permanentemente.`}
        confirmLabel="Excluir"
        destructive
        isPending={deleteMutation.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteMutation.mutate(deleteTarget.id);
        }}
        onCancel={() => setDeleteTarget(undefined)}
      />
    </>
  );
}
