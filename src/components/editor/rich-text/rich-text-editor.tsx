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
import {
  defineContentExtension,
  defineInlineExtension,
  type ContentExtension,
  type RichTextProfile,
} from "./extension";
import { RichTextToolbar } from "./toolbar";

interface RichTextEditorProps {
  /** Which capability set to expose. Mirrors the API sanitize profile. */
  profile: RichTextProfile;
  /** Initial HTML (loaded once on mount). */
  initialHTML?: string;
  /** Fired with the current HTML on every document change. */
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
}

/** Bridges ProseKit doc changes to the `onChange` prop as HTML. */
function ChangeBridge({ onChange }: { onChange?: (html: string) => void }) {
  const editor = useEditor<ContentExtension>();
  useDocChange(() => {
    onChange?.(editor.getDocHTML());
  });
  return null;
}

/**
 * Rich-text editor for fields embedded in a form, as opposed to the full-page
 * legal editor.
 *
 * Uncontrolled: seeded once from `initialHTML` and reporting edits as HTML.
 * Remount it (e.g. `key={locale}`) to load different content.
 */
export function RichTextEditor({
  profile,
  initialHTML,
  onChange,
  placeholder = "Escreva…",
  className,
}: RichTextEditorProps) {
  const editor = useMemo(
    () =>
      createEditor({
        extension:
          profile === "content"
            ? defineContentExtension(placeholder)
            : defineInlineExtension(placeholder),
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
        <RichTextToolbar profile={profile} />
        <div
          ref={editor.mount}
          className={cn(
            "ProseMirror px-3 py-2 text-sm outline-none [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6",
            profile === "content" ? "min-h-24" : "min-h-10",
          )}
        />
        <ChangeBridge onChange={onChange} />
      </div>
    </ProseKit>
  );
}
