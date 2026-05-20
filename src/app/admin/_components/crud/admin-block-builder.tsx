"use client";

import { cn } from "@/lib/utils";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

export function AdminBlockBuilder({
  value,
  onChange,
  className,
}: AdminBlockBuilderProps) {
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showTypeMenu) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowTypeMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTypeMenu]);

  function addBlock(type: BlockType) {
    const next: DraftBlock = {
      id: generateId(),
      type,
      data: { ...DEFAULT_DATA[type] },
      order: value.length + 1,
    };
    onChange([...value, next]);
    setShowTypeMenu(false);
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
    <div className={cn("space-y-3", className)}>
      {value.length === 0 && (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-10">
          <p className="text-sm text-muted-foreground">
            Nenhum bloco adicionado. Clique em &ldquo;Adicionar bloco&rdquo;.
          </p>
        </div>
      )}

      {value.map((block) => (
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
            <GripVertical className="size-4 cursor-grab shrink-0 text-muted-foreground active:cursor-grabbing" />
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
      ))}

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setShowTypeMenu((v) => !v)}
          className="flex items-center gap-2 rounded-md border border-dashed border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-brand hover:text-brand"
        >
          <Plus className="size-4" />
          Adicionar bloco
        </button>

        {showTypeMenu && (
          <div className="absolute left-0 top-full z-10 mt-1 w-48 rounded-lg border border-border bg-card shadow-md">
            {(["TEXT", "IMAGE", "VIDEO"] as BlockType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => addBlock(type)}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted first:rounded-t-lg last:rounded-b-lg"
              >
                {BLOCK_LABELS[type]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
