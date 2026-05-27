"use client";

import type { PageSection } from "@/lib/api/contracts";
import { cn } from "@/lib/utils";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  shortTitle: string;
  description: string;
  image?: string;
}

interface TimelineData {
  label?: string;
  title?: string;
  events: TimelineEvent[];
}

interface Props {
  section: PageSection;
  onChange: (data: Record<string, unknown>) => void;
}

export function SectionFormTimeline({ section, onChange }: Props) {
  const raw = section.data as unknown as TimelineData;
  const [data, setData] = useState<TimelineData>({
    ...raw,
    events: raw.events ?? [],
  });
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  function updateRoot(patch: Partial<TimelineData>) {
    const next = { ...data, ...patch };
    setData(next);
    onChange(next as Record<string, unknown>);
  }

  function updateEvent(idx: number, patch: Partial<TimelineEvent>) {
    const next = data.events.map((e, i) =>
      i === idx ? { ...e, ...patch } : e,
    );
    updateRoot({ events: next });
  }

  function addEvent() {
    const next = [
      ...data.events,
      {
        id: crypto.randomUUID(),
        year: new Date().getFullYear(),
        title: "",
        shortTitle: "",
        description: "",
      },
    ];
    updateRoot({ events: next });
    setOpenIdx(next.length - 1);
  }

  function removeEvent(idx: number) {
    const next = data.events.filter((_, i) => i !== idx);
    updateRoot({ events: next });
    if (openIdx !== null && openIdx >= next.length) {
      setOpenIdx(next.length > 0 ? next.length - 1 : null);
    }
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
              placeholder="ex: Nossa História"
              className={inputClass}
            />
          </FieldGroup>
          <FieldGroup label="Título">
            <input
              type="text"
              value={data.title ?? ""}
              onChange={(e) => updateRoot({ title: e.target.value })}
              placeholder="ex: 35 ANOS DE EVOLUÇÃO"
              className={inputClass}
            />
          </FieldGroup>
        </div>
      </div>

      {/* Eventos */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          Marcos ({data.events.length})
        </p>
        <button
          type="button"
          onClick={addEvent}
          className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Plus className="size-3.5" />
          Adicionar marco
        </button>
      </div>

      {data.events.length === 0 && (
        <div className="rounded-[12px] border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum marco na linha do tempo.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {data.events
          .slice()
          .sort((a, b) => a.year - b.year)
          .map((event, sortedIdx) => {
            const origIdx = data.events.findIndex((e) => e.id === event.id);
            return (
              <div
                key={event.id}
                className="rounded-[12px] border border-border bg-card overflow-hidden"
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-muted-foreground">
                    {event.year}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenIdx(openIdx === sortedIdx ? null : sortedIdx)
                    }
                    className="flex flex-1 items-center gap-2 text-left"
                  >
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 text-muted-foreground transition-transform",
                        openIdx === sortedIdx && "rotate-180",
                      )}
                    />
                    <p className="text-sm font-medium text-foreground">
                      {event.title || `Marco ${sortedIdx + 1}`}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeEvent(origIdx)}
                    className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>

                {openIdx === sortedIdx && (
                  <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <FieldGroup label="Ano *">
                        <input
                          type="number"
                          value={event.year}
                          onChange={(e) =>
                            updateEvent(origIdx, {
                              year: Number(e.target.value),
                            })
                          }
                          className={inputClass}
                        />
                      </FieldGroup>
                      <FieldGroup label="Título completo *">
                        <input
                          type="text"
                          value={event.title}
                          onChange={(e) =>
                            updateEvent(origIdx, { title: e.target.value })
                          }
                          placeholder="Fundação da Stetsom"
                          className={inputClass}
                        />
                      </FieldGroup>
                      <FieldGroup label="Título curto">
                        <input
                          type="text"
                          value={event.shortTitle}
                          onChange={(e) =>
                            updateEvent(origIdx, { shortTitle: e.target.value })
                          }
                          placeholder="Fundação"
                          className={inputClass}
                        />
                      </FieldGroup>
                    </div>
                    <FieldGroup label="Descrição *">
                      <textarea
                        rows={2}
                        value={event.description}
                        onChange={(e) =>
                          updateEvent(origIdx, { description: e.target.value })
                        }
                        placeholder="A Stetsom é fundada em São Paulo com foco em amplificadores automotivos."
                        className={cn(inputClass, "h-auto py-2")}
                      />
                    </FieldGroup>
                    <FieldGroup label="Imagem (URL)">
                      <input
                        type="text"
                        value={event.image ?? ""}
                        onChange={(e) =>
                          updateEvent(origIdx, { image: e.target.value })
                        }
                        placeholder="/figma-assets/raw/..."
                        className={inputClass}
                      />
                    </FieldGroup>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      <p className="text-xs text-muted-foreground">
        Os marcos são ordenados automaticamente por ano na página pública.
      </p>
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
