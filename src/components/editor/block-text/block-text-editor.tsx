"use client";

/* eslint-disable react-hooks/refs -- `editor` and `editor.mount` are ProseKit's
   editor object and mount ref-callback, not React refs; this is ProseKit's
   documented usage and is safe to reference in render. */

import "prosekit/basic/style.css";

import { createEditor } from "prosekit/core";
import { ProseKit, useDocChange, useEditor } from "prosekit/react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { BLOCK_TEXT_PROSE, toBlockTextHtml } from "@/lib/utils/block-text";
import { defineBlockTextExtension, type BlockTextExtension } from "./extension";
import { BlockTextToolbar } from "./toolbar";

interface BlockTextEditorProps {
  /** Initial content: HTML, or legacy plain text (converted on load). */
  initialContent?: string;
  /** Fired with the current HTML on every edit; an empty document is "". */
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

function ChangeBridge({ onChange }: { onChange: (html: string) => void }) {
  const editor = useEditor<BlockTextExtension>();
  useDocChange((doc) => {
    // An emptied editor still holds one paragraph; save nothing instead.
    if (!doc.textContent.trim()) return onChange("");
    // getDocHTML wraps the content in the doc's own <div>; the block stores
    // only what is inside it.
    onChange(editor.getDocHTML().replace(/^<div>([\s\S]*)<\/div>$/, "$1"));
  });
  return null;
}

/**
 * ProseKit editor for the product TEXT block. Uncontrolled: seeded once from
 * `initialContent`, so remount it (`key`) to load another block. Legacy plain
 * text is shown as paragraphs but only saved as HTML once it is edited.
 */
export function BlockTextEditor({
  initialContent,
  onChange,
  placeholder = "Conteúdo do bloco…",
  className,
}: BlockTextEditorProps) {
  const editor = useMemo(
    () =>
      createEditor({
        extension: defineBlockTextExtension(placeholder),
        defaultContent: toBlockTextHtml(initialContent ?? "") || undefined,
      }),
    // Seeded once on mount; the parent remounts via `key` to change content.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <ProseKit editor={editor}>
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-md border border-border bg-background",
          className,
        )}
      >
        <BlockTextToolbar />
        <div
          ref={editor.mount}
          className={cn(
            "ProseMirror min-h-40 px-4 py-3 text-sm outline-none",
            BLOCK_TEXT_PROSE,
          )}
        />
        <ChangeBridge onChange={onChange} />
      </div>
    </ProseKit>
  );
}
