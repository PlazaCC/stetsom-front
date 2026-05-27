"use client";

import type { PageSection } from "@/lib/api/contracts";
import { cn } from "@/lib/utils";
import { Mail, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface Department {
  id: string;
  label: string;
  email: string;
}

interface ContactConfigData {
  label?: string;
  title?: string;
  description?: string;
  departments: Department[];
}

interface Props {
  section: PageSection;
  onChange: (data: Record<string, unknown>) => void;
}

export function SectionFormContactConfig({ section, onChange }: Props) {
  const raw = section.data as unknown as ContactConfigData;
  const [data, setData] = useState<ContactConfigData>({
    ...raw,
    departments: raw.departments ?? [],
  });

  function updateRoot(patch: Partial<ContactConfigData>) {
    const next = { ...data, ...patch };
    setData(next);
    onChange(next as Record<string, unknown>);
  }

  function updateDept(idx: number, patch: Partial<Department>) {
    const next = data.departments.map((d, i) =>
      i === idx ? { ...d, ...patch } : d,
    );
    updateRoot({ departments: next });
  }

  function addDept() {
    const next = [
      ...data.departments,
      { id: crypto.randomUUID(), label: "", email: "" },
    ];
    updateRoot({ departments: next });
  }

  function removeDept(idx: number) {
    updateRoot({ departments: data.departments.filter((_, i) => i !== idx) });
  }

  return (
    <div className="space-y-4">
      {/* Textos */}
      <div className="rounded-[12px] border border-border bg-card p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Textos do formulário
        </p>
        <FieldGroup label="Label / Eyebrow">
          <input
            type="text"
            value={data.label ?? ""}
            onChange={(e) => updateRoot({ label: e.target.value })}
            placeholder="ex: Fale Conosco"
            className={inputClass}
          />
        </FieldGroup>
        <FieldGroup label="Título">
          <input
            type="text"
            value={data.title ?? ""}
            onChange={(e) => updateRoot({ title: e.target.value })}
            placeholder="ex: Entre em contato"
            className={inputClass}
          />
        </FieldGroup>
        <FieldGroup label="Descrição">
          <textarea
            rows={2}
            value={data.description ?? ""}
            onChange={(e) => updateRoot({ description: e.target.value })}
            placeholder="Preencha o formulário e entraremos em contato em breve."
            className={cn(inputClass, "h-auto py-2")}
          />
        </FieldGroup>
      </div>

      {/* Departamentos */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">
            Departamentos ({data.departments.length})
          </p>
          <p className="text-xs text-muted-foreground">
            Cada departamento aparece como opção no select do formulário.
          </p>
        </div>
        <button
          type="button"
          onClick={addDept}
          className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Plus className="size-3.5" />
          Adicionar
        </button>
      </div>

      {data.departments.length === 0 && (
        <div className="rounded-[12px] border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum departamento cadastrado.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {data.departments.map((dept, idx) => (
          <div
            key={dept.id}
            className="flex items-end gap-3 rounded-[12px] border border-border bg-card px-4 py-3"
          >
            <Mail className="mb-2 size-4 shrink-0 text-cyan-500" />
            <div className="flex-1 space-y-1">
              <label className="block text-xs font-medium text-muted-foreground">
                Nome do departamento
              </label>
              <input
                type="text"
                value={dept.label}
                onChange={(e) => updateDept(idx, { label: e.target.value })}
                placeholder="ex: Suporte Técnico"
                className={inputClass}
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="block text-xs font-medium text-muted-foreground">
                E-mail destino
              </label>
              <input
                type="email"
                value={dept.email}
                onChange={(e) => updateDept(idx, { email: e.target.value })}
                placeholder="suporte@stetsom.com.br"
                className={inputClass}
              />
            </div>
            <button
              type="button"
              onClick={() => removeDept(idx)}
              className="mb-0.5 flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass = cn(
  "h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground",
  "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-brand",
);
