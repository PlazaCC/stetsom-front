"use client";

/* eslint-disable react-hooks/refs -- `editor` and `editor.mount` are ProseKit's
   editor object and mount ref-callback, not React refs; this is ProseKit's
   documented usage and is safe to reference in render. */

import "prosekit/basic/style.css";
import "prosekit/basic/typography.css";

import { createEditor } from "prosekit/core";
import { ProseKit, useDocChange, useEditor } from "prosekit/react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { defineLegalExtension, type LegalExtension } from "./extension";
import { LegalToolbar } from "./toolbar";

interface LegalEditorProps {
  /** Initial HTML content (loaded once on mount). */
  initialHTML?: string;
  /** Fired with the current HTML on every document change. */
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
}

/** Bridges ProseKit doc changes to the `onChange` prop as HTML. */
function ChangeBridge({ onChange }: { onChange?: (html: string) => void }) {
  const editor = useEditor<LegalExtension>();
  useDocChange(() => {
    onChange?.(editor.getDocHTML());
  });
  return null;
}

/**
 * Slim ProseKit rich-text editor for legal page content. Uncontrolled: seeded
 * once from `initialHTML` and reports edits as HTML via `onChange`. Remount it
 * (e.g. `key={locale}`) to load different initial content. Grows with content
 * so the admin shell owns the scroll (no nested scrollbar).
 */
export function LegalEditor({
  initialHTML,
  onChange,
  placeholder = "Escreva o conteúdo…",
  className,
}: LegalEditorProps) {
  const editor = useMemo(
    () =>
      createEditor({
        extension: defineLegalExtension(placeholder),
        defaultContent: initialHTML || undefined,
      }),
    // Seeded once on mount; parent remounts via `key` to change content.
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
        <LegalToolbar />
        <div
          ref={editor.mount}
          className="ProseMirror min-h-48 px-4 py-3 text-sm outline-none [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
        />
        <ChangeBridge onChange={onChange} />
      </div>
    </ProseKit>
  );
}
