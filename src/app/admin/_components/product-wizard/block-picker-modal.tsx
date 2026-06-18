"use client";

import { cn } from "@/lib/utils";
import {
  Box,
  Code,
  FileText,
  ImageIcon,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

interface BlockOption {
  key: string;
  type: string;
  data?: Record<string, unknown>;
  label: string;
  description: string;
  icon: LucideIcon;
}

const OPTIONS: BlockOption[] = [
  {
    key: "image-full",
    type: "IMAGE",
    data: { layout: "full" },
    label: "Imagem Full",
    description: "Imagem que vai tomar a tela horizontal toda do layout.",
    icon: ImageIcon,
  },
  {
    key: "image-side",
    type: "IMAGE",
    data: { layout: "side" },
    label: "Imagem Side",
    description: "Imagem lateral ao conteúdo do produto.",
    icon: ImageIcon,
  },
  {
    key: "video",
    type: "VIDEO",
    label: "Vídeo",
    description: "Exibe um vídeo incorporado por link (youtube / vimeo).",
    icon: Video,
  },
  {
    key: "html",
    type: "HTML",
    label: "Seção livre (HTML)",
    description: "Permite inserir um conteúdo HTML personalizado.",
    icon: Code,
  },
  {
    key: "model3d",
    type: "MODEL3D",
    label: "Arquivo 3D",
    description: "Exibe um modelo 3d interativo (.glb / .gltf).",
    icon: Box,
  },
  {
    key: "text",
    type: "TEXT",
    label: "Texto / Descritiva",
    description: "Bloco de texto rico para a página do produto.",
    icon: FileText,
  },
];

interface BlockPickerModalProps {
  onAdd: (type: string, data?: Record<string, unknown>) => void;
  onClose: () => void;
}

/** Figma "Adicione um bloco" modal: a 2 by 3 card grid, select then advance. */
export function BlockPickerModal({ onAdd, onClose }: BlockPickerModalProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const chosen = OPTIONS.find((o) => o.key === selected);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-cms-overlay p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-[16px] border border-border bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Adicione um bloco
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Selecione os blocos que irão complementar a página do produto,
              como artes complementares e vídeo.
            </p>
          </div>
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="rounded p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 p-6 sm:grid-cols-3">
          {OPTIONS.map((o) => {
            const Icon = o.icon;
            const active = o.key === selected;
            return (
              <button
                key={o.key}
                type="button"
                onClick={() => setSelected(o.key)}
                className={cn(
                  "flex flex-col gap-2 rounded-md border p-4 text-left transition-colors",
                  active
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                )}
              >
                <Icon
                  className={cn(
                    "size-6",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <span className="text-sm font-medium text-foreground">
                  {o.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {o.description}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!chosen}
            onClick={() => {
              if (chosen) {
                onAdd(chosen.type, chosen.data);
                onClose();
              }
            }}
            className="rounded-md bg-foreground px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Avançar
          </button>
        </div>
      </div>
    </div>
  );
}
