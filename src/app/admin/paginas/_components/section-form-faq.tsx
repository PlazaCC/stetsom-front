"use client";

import type { PageSection } from "@/lib/api/contracts";
import { cn } from "@/lib/utils";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { FieldGroup, inputClass, EmptyState } from "./form-utils";

interface FaqItem {
  id: string;
  q: string;
  a: string;
}

interface FaqData {
  label?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  supportButtonLabel?: string;
  items: FaqItem[];
}

interface Props {
  section: PageSection;
  onChange: (data: Record<string, unknown>) => void;
}

export function SectionFormFaq({ section, onChange }: Props) {
  const raw = section.data as unknown as FaqData;
  const [data, setData] = useState<FaqData>({ ...raw, items: raw.items ?? [] });
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  function updateRoot(patch: Partial<FaqData>) {
    const next = { ...data, ...patch };
    setData(next);
    onChange(next as Record<string, unknown>);
  }

  function updateItem(idx: number, patch: Partial<FaqItem>) {
    const next = data.items.map((item, i) =>
      i === idx ? { ...item, ...patch } : item,
    );
    updateRoot({ items: next });
  }

  function addItem() {
    const next = [...data.items, { id: crypto.randomUUID(), q: "", a: "" }];
    updateRoot({ items: next });
    setOpenIdx(next.length - 1);
  }

  function removeItem(idx: number) {
    const next = data.items.filter((_, i) => i !== idx);
    updateRoot({ items: next });
    if (openIdx !== null && openIdx >= next.length) {
      setOpenIdx(next.length > 0 ? next.length - 1 : null);
    }
  }

  return (
    <div className="space-y-4">
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
              placeholder="ex: Dúvidas frequentes"
              className={inputClass}
            />
          </FieldGroup>
          <FieldGroup label="Título">
            <input
              type="text"
              value={data.title ?? ""}
              onChange={(e) => updateRoot({ title: e.target.value })}
              placeholder="ex: Perguntas e Respostas"
              className={inputClass}
            />
          </FieldGroup>
          <FieldGroup label="Subtítulo">
            <input
              type="text"
              value={data.subtitle ?? ""}
              onChange={(e) => updateRoot({ subtitle: e.target.value })}
              placeholder="ex: Tem dúvidas? A gente responde."
              className={inputClass}
            />
          </FieldGroup>
          <FieldGroup label="Label do CTA / Botão de Suporte">
            <input
              type="text"
              value={data.ctaLabel ?? data.supportButtonLabel ?? ""}
              onChange={(e) =>
                updateRoot({
                  ctaLabel: e.target.value,
                  supportButtonLabel: e.target.value,
                })
              }
              placeholder="ex: Falar com suporte"
              className={inputClass}
            />
          </FieldGroup>
          {data.ctaHref !== undefined && (
            <FieldGroup label="Link do CTA">
              <input
                type="text"
                value={data.ctaHref}
                onChange={(e) => updateRoot({ ctaHref: e.target.value })}
                placeholder="/suporte"
                className={inputClass}
              />
            </FieldGroup>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          Perguntas ({data.items.length})
        </p>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Plus className="size-3.5" />
          Adicionar pergunta
        </button>
      </div>

      {data.items.length === 0 && (
        <EmptyState
          title="Nenhuma pergunta cadastrada"
          description='Clique em "Adicionar pergunta" para começar.'
        />
      )}

      <div className="space-y-2">
        {data.items.map((item, idx) => (
          <div
            key={item.id}
            className="rounded-[12px] border border-border bg-card overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <button
                type="button"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="flex flex-1 items-center gap-2 text-left"
              >
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform",
                    openIdx === idx && "rotate-180",
                  )}
                />
                <p className="text-sm font-medium text-foreground">
                  {item.q || `Pergunta ${idx + 1}`}
                </p>
              </button>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>

            {openIdx === idx && (
              <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
                <FieldGroup label="Pergunta *">
                  <input
                    type="text"
                    value={item.q}
                    onChange={(e) => updateItem(idx, { q: e.target.value })}
                    placeholder="Qual a potência real dos amplificadores?"
                    className={inputClass}
                  />
                </FieldGroup>
                <FieldGroup label="Resposta *">
                  <textarea
                    rows={3}
                    value={item.a}
                    onChange={(e) => updateItem(idx, { a: e.target.value })}
                    placeholder="A potência informada é sempre a potência RMS real..."
                    className={cn(inputClass, "h-auto py-2")}
                  />
                </FieldGroup>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
