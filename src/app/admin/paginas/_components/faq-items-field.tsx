"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteApiFaqsId,
  getGetApiFaqsAdminQueryKey,
  patchApiFaqsId,
  patchApiFaqsReorder,
  postApiFaqs,
  useGetApiFaqsAdmin,
} from "@/api/stetsom/endpoints/faq/faq";
import type { I18nString } from "@/api/stetsom/model";
import { AdminConfirmDialog } from "@/app/admin/_components/crud/admin-confirm-dialog";
import { AdminEmptyState } from "@/app/admin/_components/crud/admin-empty-state";
import { AdminLabel } from "@/app/admin/_components/crud/admin-input";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { SortableList } from "@/app/admin/_components/crud/sortable-list";
import { Button } from "@/components/ui/button";
import { Check, CircleHelp, Plus, Trash2, X } from "lucide-react";
import type { FieldSpec } from "./section-field-spec";

interface FaqItemsFieldProps {
  field: Extract<FieldSpec, { kind: "faq-items" }>;
}

type FaqMutationBody = { q: I18nString; a: I18nString; order?: number };

export function FaqItemsField({ field }: Readonly<FaqItemsFieldProps>) {
  const queryClient = useQueryClient();
  const queryKey = getGetApiFaqsAdminQueryKey();
  const { data: items = [], isError, isLoading } = useGetApiFaqsAdmin();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQ, setEditQ] = useState<I18nString>({ pt: "" });
  const [editA, setEditA] = useState<I18nString>({ pt: "" });
  const [newQ, setNewQ] = useState<I18nString>({ pt: "" });
  const [newA, setNewA] = useState<I18nString>({ pt: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: (body: FaqMutationBody) => postApiFaqs(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setIsAdding(false);
      setNewQ({ pt: "" });
      setNewA({ pt: "" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Partial<FaqMutationBody>;
    }) => patchApiFaqsId(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApiFaqsId(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const reorderMutation = useMutation({
    mutationFn: (reorderItems: { id: string; order: number }[]) =>
      patchApiFaqsReorder({ items: reorderItems }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  function handleReorder(orderedItems: typeof items) {
    reorderMutation.mutate(
      orderedItems.map((item, index) => ({ id: item.id, order: index })),
    );
  }

  function startEdit(item: (typeof items)[number]) {
    setEditingId(item.id);
    setEditQ(item.q);
    setEditA(item.a);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function saveEdit(id: string) {
    updateMutation.mutate({ id, body: { q: editQ, a: editA } });
  }

  function handleAdd() {
    createMutation.mutate({ q: newQ, a: newA });
  }

  const addButton = (
    <Button
      size="sm"
      variant="outline"
      className={items.length > 0 ? "w-full" : undefined}
      onClick={() => setIsAdding(true)}
    >
      <Plus className="size-4" />
      {field.addLabel}
    </Button>
  );

  return (
    <div className="space-y-3">
      <AdminLabel>{field.label}</AdminLabel>

      {isLoading ? (
        <p
          role="status"
          className="py-6 text-center text-sm text-muted-foreground"
        >
          Carregando perguntas...
        </p>
      ) : isError ? (
        <p role="alert" className="py-6 text-center text-sm text-destructive">
          Não foi possível carregar as perguntas.
        </p>
      ) : items.length === 0 && !isAdding ? (
        <AdminEmptyState
          title="Nenhuma pergunta cadastrada"
          description="Sem perguntas, esta seção não exibirá conteúdo no site."
          icon={CircleHelp}
          action={addButton}
          className="py-8 [&_svg]:size-8"
        />
      ) : (
        <SortableList
          items={items}
          getId={(item) => item.id}
          onReorder={handleReorder}
          renderItem={(item, handle) => (
            <div className="flex items-start gap-3 rounded border border-border p-3">
              <div className="mt-2">{handle}</div>

              {editingId === item.id ? (
                <div className="flex-1 space-y-2">
                  <I18nInput
                    label="Pergunta"
                    value={editQ}
                    onChange={setEditQ}
                  />
                  <I18nInput
                    label="Resposta"
                    multiline
                    value={editA}
                    onChange={setEditA}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => saveEdit(item.id)}>
                      <Check className="size-4" />
                      Salvar
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                      <X className="size-4" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.q.pt}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {item.a.pt}
                  </p>
                </div>
              )}

              <div className="flex gap-1">
                {editingId !== item.id && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEdit(item)}
                  >
                    Editar
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setDeleteTarget(item.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          )}
        />
      )}

      <AdminConfirmDialog
        open={deleteTarget !== null}
        title="Remover esta pergunta?"
        description="Esta ação não pode ser desfeita."
        confirmLabel="Remover"
        destructive
        isPending={deleteMutation.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteMutation.mutate(deleteTarget, {
            onSuccess: () => setDeleteTarget(null),
          });
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      {isAdding ? (
        <div className="space-y-2 rounded border border-dashed border-border p-3">
          <I18nInput label="Pergunta" value={newQ} onChange={setNewQ} />
          <I18nInput
            multiline
            label="Resposta"
            value={newA}
            onChange={setNewA}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd}>
              <Check className="size-4" />
              Adicionar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsAdding(false);
                setNewQ({ pt: "" });
                setNewA({ pt: "" });
              }}
            >
              <X className="size-4" />
              Cancelar
            </Button>
          </div>
        </div>
      ) : !isLoading && !isError && items.length > 0 ? (
        addButton
      ) : null}
    </div>
  );
}
