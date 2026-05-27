"use client";

import type { PageSection } from "@/lib/api/contracts";
import { cn } from "@/lib/utils";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { FieldGroup, inputClass, EmptyState } from "./form-utils";

interface SupportCard {
  id: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: string;
}

interface SupportCardsData {
  cards: SupportCard[];
}

interface Props {
  section: PageSection;
  onChange: (data: Record<string, unknown>) => void;
}

const ICON_SUGGESTIONS = [
  "message-circle",
  "mail",
  "map-pin",
  "phone",
  "headphones",
  "life-buoy",
];

export function SectionFormSupportCards({ section, onChange }: Props) {
  const raw = section.data as unknown as SupportCardsData;
  const [cards, setCards] = useState<SupportCard[]>(raw.cards ?? []);
  const [openIdx, setOpenIdx] = useState<number | null>(
    cards.length > 0 ? 0 : null,
  );

  function update(next: SupportCard[]) {
    setCards(next);
    onChange({ cards: next });
  }

  function updateCard(idx: number, patch: Partial<SupportCard>) {
    update(cards.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  }

  function addCard() {
    const next = [
      ...cards,
      {
        id: crypto.randomUUID(),
        title: "",
        description: "",
        cta: "",
        href: "",
        icon: "message-circle",
      },
    ];
    update(next);
    setOpenIdx(next.length - 1);
  }

  function removeCard(idx: number) {
    const next = cards.filter((_, i) => i !== idx);
    update(next);
    if (openIdx !== null && openIdx >= next.length) {
      setOpenIdx(next.length > 0 ? next.length - 1 : null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          Canais ({cards.length})
        </p>
        <button
          type="button"
          onClick={addCard}
          className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Plus className="size-3.5" />
          Adicionar canal
        </button>
      </div>

      {cards.length === 0 && (
        <EmptyState
          title="Nenhum canal cadastrado."
          description='Clique em "Adicionar canal" para começar.'
        />
      )}

      <div className="space-y-2">
        {cards.map((card, idx) => (
          <SupportCardEditor
            key={card.id}
            card={card}
            idx={idx}
            isOpen={openIdx === idx}
            onToggle={() => setOpenIdx(openIdx === idx ? null : idx)}
            onUpdate={(patch) => updateCard(idx, patch)}
            onRemove={() => removeCard(idx)}
          />
        ))}
      </div>

      <IconDatalist />
    </div>
  );
}

interface SupportCardEditorProps {
  card: SupportCard;
  idx: number;
  isOpen: boolean;
  onToggle: () => void;
  onUpdate: (patch: Partial<SupportCard>) => void;
  onRemove: () => void;
}

function SupportCardEditor({
  card,
  idx,
  isOpen,
  onToggle,
  onUpdate,
  onRemove,
}: SupportCardEditorProps) {
  return (
    <div className="rounded-[12px] border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={onToggle}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform",
              isOpen && "rotate-180",
            )}
          />
          <p className="text-sm font-medium text-foreground">
            {card.title || `Canal ${idx + 1}`}
          </p>
          {card.icon && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
              {card.icon}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldGroup label="Título *">
              <input
                type="text"
                value={card.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="ex: WhatsApp"
                className={inputClass}
              />
            </FieldGroup>
            <FieldGroup label="Ícone (Lucide name)">
              <input
                type="text"
                list="icon-suggestions"
                value={card.icon}
                onChange={(e) => onUpdate({ icon: e.target.value })}
                placeholder="ex: message-circle"
                className={inputClass}
              />
            </FieldGroup>
          </div>
          <FieldGroup label="Descrição">
            <textarea
              rows={2}
              value={card.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Atendimento rápido pelo WhatsApp em horário comercial."
              className={cn(inputClass, "h-auto py-2")}
            />
          </FieldGroup>
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldGroup label="Label do botão">
              <input
                type="text"
                value={card.cta}
                onChange={(e) => onUpdate({ cta: e.target.value })}
                placeholder="ex: Chamar no WhatsApp"
                className={inputClass}
              />
            </FieldGroup>
            <FieldGroup label="Link do botão *">
              <input
                type="text"
                value={card.href}
                onChange={(e) => onUpdate({ href: e.target.value })}
                placeholder="https://wa.me/... ou mailto:..."
                className={inputClass}
              />
            </FieldGroup>
          </div>
        </div>
      )}
    </div>
  );
}

function IconDatalist() {
  return (
    <datalist id="icon-suggestions">
      {ICON_SUGGESTIONS.map((icon) => (
        <option key={icon} value={icon} />
      ))}
    </datalist>
  );
}
