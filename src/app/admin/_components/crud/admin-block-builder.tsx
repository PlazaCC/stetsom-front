"use client";

import { cn } from "@/lib/utils";
import {
  FileText,
  GripVertical,
  Image,
  Plus,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";
import { AdminInput, AdminSelect } from "./admin-input";
import { AdminRichText } from "./admin-rich-text";

export type BlockType = "TEXT" | "IMAGE" | "VIDEO";

export type DraftBlock = {
  id: string;
  type: BlockType;
  data: Record<string, unknown>;
  order: number;
};

interface AdminBlockBuilderProps {
  value: DraftBlock[];
  onChange: (blocks: DraftBlock[]) => void;
  className?: string;
}

const BLOCK_LABELS: Record<BlockType, string> = {
  TEXT: "Texto",
  IMAGE: "Imagem",
  VIDEO: "Vídeo",
};

const BLOCK_DESCRIPTIONS: Record<BlockType, string> = {
  TEXT: "Título e parágrafo com alinhamento configurável.",
  IMAGE: "Uma ou mais imagens com legenda e layout.",
  VIDEO: "Incorpore um vídeo do YouTube ou Vimeo.",
};

const BLOCK_ICONS: Record<BlockType, React.ElementType> = {
  TEXT: FileText,
  IMAGE: Image,
  VIDEO: Video,
};

function generateId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const DEFAULT_DATA: Record<BlockType, Record<string, unknown>> = {
  TEXT: { title: "", content: "", align: "left" },
  IMAGE: { images: "", caption: "", layout: "default" },
  VIDEO: { video_url: "", title: "", description: "" },
};

const blockLabelClass = "mb-1 block text-xs font-medium text-muted-foreground";

function TextBlockForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className={blockLabelClass}>Título (opcional)</label>
        <AdminInput
          value={(data.title as string) ?? ""}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          placeholder="Título do bloco"
        />
      </div>
      <div>
        <label className={blockLabelClass}>Conteúdo</label>
        <AdminRichText
          value={(data.content as string) ?? ""}
          onChange={(v) => onChange({ ...data, content: v })}
          placeholder="Conteúdo do bloco de texto..."
        />
      </div>
      <div>
        <label className={blockLabelClass}>Alinhamento</label>
        <AdminSelect
          value={(data.align as string) ?? "left"}
          onChange={(e) => onChange({ ...data, align: e.target.value })}
        >
          <option value="left">Esquerda</option>
          <option value="center">Centro</option>
          <option value="right">Direita</option>
        </AdminSelect>
      </div>
    </div>
  );
}

function ImageBlockForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className={blockLabelClass}>URL da imagem</label>
        <AdminInput
          value={(data.images as string) ?? ""}
          onChange={(e) => onChange({ ...data, images: e.target.value })}
          placeholder="/uploads/imagem.png ou https://..."
        />
      </div>
      <div>
        <label className={blockLabelClass}>Legenda (opcional)</label>
        <AdminInput
          value={(data.caption as string) ?? ""}
          onChange={(e) => onChange({ ...data, caption: e.target.value })}
          placeholder="Legenda da imagem"
        />
      </div>
      <div>
        <label className={blockLabelClass}>Layout</label>
        <AdminSelect
          value={(data.layout as string) ?? "default"}
          onChange={(e) => onChange({ ...data, layout: e.target.value })}
        >
          <option value="default">Padrão</option>
          <option value="single">Simples</option>
          <option value="grid">Grade</option>
          <option value="carousel">Carrossel</option>
        </AdminSelect>
      </div>
    </div>
  );
}

function VideoBlockForm({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className={blockLabelClass}>URL do vídeo</label>
        <AdminInput
          value={(data.video_url as string) ?? ""}
          onChange={(e) => onChange({ ...data, video_url: e.target.value })}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>
      <div>
        <label className={blockLabelClass}>Título (opcional)</label>
        <AdminInput
          value={(data.title as string) ?? ""}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          placeholder="Título do vídeo"
        />
      </div>
      <div>
        <label className={blockLabelClass}>Descrição (opcional)</label>
        <AdminInput
          value={(data.description as string) ?? ""}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="Breve descrição do vídeo"
        />
      </div>
    </div>
  );
}

function BlockTypeModal({
  onSelect,
  onClose,
}: {
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-cms-overlay p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-[16px] border border-border bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">
            Selecionar tipo de bloco
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="divide-y divide-border">
          {(["TEXT", "IMAGE", "VIDEO"] as BlockType[]).map((type) => {
            const Icon = BLOCK_ICONS[type];
            return (
              <button
                key={type}
                type="button"
                onClick={() => onSelect(type)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-muted"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                  <Icon className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {BLOCK_LABELS[type]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {BLOCK_DESCRIPTIONS[type]}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function AdminBlockBuilder({
  value,
  onChange,
  className,
}: AdminBlockBuilderProps) {
  const [showModal, setShowModal] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  function addBlock(type: BlockType) {
    const next: DraftBlock = {
      id: generateId(),
      type,
      data: { ...DEFAULT_DATA[type] },
      order: value.length + 1,
    };
    onChange([...value, next]);
    setShowModal(false);
  }

  function removeBlock(id: string) {
    onChange(
      value.filter((b) => b.id !== id).map((b, i) => ({ ...b, order: i + 1 })),
    );
  }

  function updateBlockData(id: string, data: Record<string, unknown>) {
    onChange(value.map((b) => (b.id === id ? { ...b, data } : b)));
  }

  function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setOverId(null);
      return;
    }
    const items = [...value];
    const fromIndex = items.findIndex((b) => b.id === draggedId);
    const toIndex = items.findIndex((b) => b.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;
    const [removed] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, removed);
    onChange(items.map((b, i) => ({ ...b, order: i + 1 })));
    setDraggedId(null);
    setOverId(null);
  }

  return (
    <>
      <div className={cn("space-y-3", className)}>
        {value.length === 0 && (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-10">
            <p className="text-sm text-muted-foreground">
              Nenhum bloco adicionado. Clique em &ldquo;Adicionar bloco&rdquo;.
            </p>
          </div>
        )}

        {value.map((block) => {
          const Icon = BLOCK_ICONS[block.type];
          return (
            <div
              key={block.id}
              draggable
              onDragStart={() => setDraggedId(block.id)}
              onDragOver={(e) => {
                e.preventDefault();
                setOverId(block.id);
              }}
              onDrop={() => handleDrop(block.id)}
              onDragEnd={() => {
                setDraggedId(null);
                setOverId(null);
              }}
              className={cn(
                "rounded-[16px] border border-border bg-card transition-opacity",
                draggedId === block.id && "opacity-40",
                overId === block.id && draggedId !== block.id && "border-brand",
              )}
            >
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing" />
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {BLOCK_LABELS[block.type]}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  #{block.order}
                </span>
                <button
                  type="button"
                  onClick={() => removeBlock(block.id)}
                  className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="p-4">
                {block.type === "TEXT" && (
                  <TextBlockForm
                    data={block.data}
                    onChange={(d) => updateBlockData(block.id, d)}
                  />
                )}
                {block.type === "IMAGE" && (
                  <ImageBlockForm
                    data={block.data}
                    onChange={(d) => updateBlockData(block.id, d)}
                  />
                )}
                {block.type === "VIDEO" && (
                  <VideoBlockForm
                    data={block.data}
                    onChange={(d) => updateBlockData(block.id, d)}
                  />
                )}
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-md border border-dashed border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-brand hover:text-brand"
        >
          <Plus className="size-4" />
          Adicionar bloco
        </button>
      </div>

      {showModal && (
        <BlockTypeModal
          onSelect={addBlock}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
