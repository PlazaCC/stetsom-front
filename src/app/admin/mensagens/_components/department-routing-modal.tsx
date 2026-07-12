"use client";

import { getGetApiConfigQueryKey, patchApiConfig } from "@/api/stetsom";
import type { DepartmentConfigItem } from "@/api/stetsom/model";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface DepartmentRoutingModalProps {
  onClose: () => void;
  initialDepartments: DepartmentConfigItem[];
}

function slugify(label: string): string {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function newKey() {
  return crypto.randomUUID();
}

type DraftRow = DepartmentConfigItem & { _key: string };

export function DepartmentRoutingModal({
  onClose,
  initialDepartments,
}: DepartmentRoutingModalProps) {
  const queryClient = useQueryClient();
  const [rows, setRows] = useState<DraftRow[]>(() =>
    initialDepartments.map((d) => ({ ...d, _key: d.slug || newKey() })),
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const saveMutation = useMutation({
    mutationFn: () =>
      patchApiConfig({
        contact_departments: rows.map(({ slug, label, email }) => ({
          slug,
          label,
          email,
        })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetApiConfigQueryKey() });
      onClose();
    },
  });

  function updateRow(
    key: string,
    field: keyof DepartmentConfigItem,
    value: string,
  ) {
    setRows((prev) =>
      prev.map((r) => {
        if (r._key !== key) return r;
        if (field === "label") {
          const updated = { ...r, label: value };
          if (r.slug === "" || r.slug === slugify(r.label)) {
            updated.slug = slugify(value);
          }
          return updated;
        }
        return { ...r, [field]: value };
      }),
    );
  }

  function addRow() {
    setRows((prev) => [
      ...prev,
      { slug: "", label: "", email: "", _key: newKey() },
    ]);
  }

  function removeRow(key: string) {
    setRows((prev) => prev.filter((r) => r._key !== key));
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="routing-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-cms-overlay p-4"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-2xl flex-col rounded-card border border-border bg-card shadow-cms-card-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2
            id="routing-modal-title"
            className="text-base font-bold text-foreground"
          >
            Configurar encaminhamento
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto px-6 py-4">
          <p className="mb-4 text-sm text-muted-foreground">
            Cada departamento recebe os e-mails do formulário de contato do
            site. O slug é usado internamente; o label aparece no formulário
            público.
          </p>

          {rows.length > 0 && (
            <div className="mb-2 grid grid-cols-[1fr_1fr_1.5fr_auto] gap-2 px-1 text-xs font-medium text-muted-foreground">
              <span>Slug</span>
              <span>Label</span>
              <span>E-mail de destino</span>
              <span />
            </div>
          )}

          <div className="space-y-2">
            {rows.map((row) => (
              <div
                key={row._key}
                className="grid grid-cols-[1fr_1fr_1.5fr_auto] items-center gap-2"
              >
                <input
                  type="text"
                  value={row.slug}
                  onChange={(e) => updateRow(row._key, "slug", e.target.value)}
                  placeholder="comercial"
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:outline-none"
                />
                <input
                  type="text"
                  value={row.label}
                  onChange={(e) => updateRow(row._key, "label", e.target.value)}
                  placeholder="Comercial"
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:outline-none"
                />
                <input
                  type="email"
                  value={row.email}
                  onChange={(e) => updateRow(row._key, "email", e.target.value)}
                  placeholder="comercial@stetsom.com.br"
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeRow(row._key)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>

          {rows.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhum departamento configurado.
            </p>
          )}

          <button
            type="button"
            onClick={addRow}
            className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <Plus className="size-4" />
            Adicionar departamento
          </button>
        </div>

        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saveMutation.isPending}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-60"
          >
            {saveMutation.isPending ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
