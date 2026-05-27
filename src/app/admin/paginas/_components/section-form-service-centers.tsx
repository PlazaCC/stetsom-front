"use client";

import type { PageSection } from "@/lib/api/contracts";
import { cn } from "@/lib/utils";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface ServiceCenter {
  id: string;
  name: string;
  address: string;
  phone: string;
  state?: string;
}

interface ServiceCentersData {
  label?: string;
  title?: string;
  centers: ServiceCenter[];
}

interface Props {
  section: PageSection;
  onChange: (data: Record<string, unknown>) => void;
}

export function SectionFormServiceCenters({ section, onChange }: Props) {
  const raw = section.data as unknown as ServiceCentersData;
  const [data, setData] = useState<ServiceCentersData>({
    ...raw,
    centers: raw.centers ?? [],
  });

  function updateRoot(patch: Partial<ServiceCentersData>) {
    const next = { ...data, ...patch };
    setData(next);
    onChange(next as Record<string, unknown>);
  }

  function updateCenter(idx: number, patch: Partial<ServiceCenter>) {
    const next = data.centers.map((c, i) =>
      i === idx ? { ...c, ...patch } : c,
    );
    updateRoot({ centers: next });
  }

  function addCenter() {
    const next = [
      ...data.centers,
      { id: crypto.randomUUID(), name: "", address: "", phone: "", state: "" },
    ];
    updateRoot({ centers: next });
  }

  function removeCenter(idx: number) {
    updateRoot({ centers: data.centers.filter((_, i) => i !== idx) });
  }

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="rounded-[12px] border border-border bg-card p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Cabeçalho
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <FieldGroup label="Label / Eyebrow">
            <input
              type="text"
              value={data.label ?? ""}
              onChange={(e) => updateRoot({ label: e.target.value })}
              placeholder="ex: Assistência Técnica"
              className={inputClass}
            />
          </FieldGroup>
          <FieldGroup label="Título">
            <input
              type="text"
              value={data.title ?? ""}
              onChange={(e) => updateRoot({ title: e.target.value })}
              placeholder="ex: Postos Autorizados"
              className={inputClass}
            />
          </FieldGroup>
        </div>
      </div>

      {/* Postos */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          Postos autorizados ({data.centers.length})
        </p>
        <button
          type="button"
          onClick={addCenter}
          className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Plus className="size-3.5" />
          Adicionar posto
        </button>
      </div>

      {data.centers.length === 0 && (
        <div className="rounded-[12px] border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum posto cadastrado.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {data.centers.map((center, idx) => (
          <div
            key={center.id}
            className="rounded-[12px] border border-border bg-card p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-red-500" />
                <p className="text-sm font-medium text-foreground">
                  {center.name || `Posto ${idx + 1}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeCenter(idx)}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <FieldGroup label="Nome *">
                <input
                  type="text"
                  value={center.name}
                  onChange={(e) => updateCenter(idx, { name: e.target.value })}
                  placeholder="Stetsom SP Centro"
                  className={inputClass}
                />
              </FieldGroup>
              <FieldGroup label="Telefone">
                <input
                  type="tel"
                  value={center.phone}
                  onChange={(e) => updateCenter(idx, { phone: e.target.value })}
                  placeholder="(11) 3000-0001"
                  className={inputClass}
                />
              </FieldGroup>
              <FieldGroup label="Endereço completo *" className="sm:col-span-2">
                <input
                  type="text"
                  value={center.address}
                  onChange={(e) =>
                    updateCenter(idx, { address: e.target.value })
                  }
                  placeholder="R. Exemplo, 100 – Centro, São Paulo – SP"
                  className={inputClass}
                />
              </FieldGroup>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FieldGroup({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
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
