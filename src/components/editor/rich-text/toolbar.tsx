"use client";

import type { Editor } from "prosekit/core";
import { useEditorDerivedValue } from "prosekit/react";
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
  Unlink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentExtension, RichTextProfile } from "./extension";

type Item = { isActive: boolean; canExec: boolean; command: () => void };

/**
 * Reads command state off the editor.
 *
 * Typed against `ContentExtension` because it is the superset; the block
 * commands are simply never rendered for the inline profile, whose schema does
 * not define them.
 */
function getItems(editor: Editor<ContentExtension>) {
  return {
    undo: {
      isActive: false,
      canExec: editor.commands.undo.canExec(),
      command: () => editor.commands.undo(),
    },
    redo: {
      isActive: false,
      canExec: editor.commands.redo.canExec(),
      command: () => editor.commands.redo(),
    },
    bold: {
      isActive: editor.marks.bold.isActive(),
      canExec: editor.commands.toggleBold.canExec(),
      command: () => editor.commands.toggleBold(),
    },
    italic: {
      isActive: editor.marks.italic.isActive(),
      canExec: editor.commands.toggleItalic.canExec(),
      command: () => editor.commands.toggleItalic(),
    },
    underline: {
      isActive: editor.marks.underline.isActive(),
      canExec: editor.commands.toggleUnderline.canExec(),
      command: () => editor.commands.toggleUnderline(),
    },
    strike: {
      isActive: editor.marks.strike.isActive(),
      canExec: editor.commands.toggleStrike.canExec(),
      command: () => editor.commands.toggleStrike(),
    },
    bulletList: {
      isActive: editor.nodes.list.isActive({ kind: "bullet" }),
      canExec: editor.commands.toggleList.canExec({ kind: "bullet" }),
      command: () => editor.commands.toggleList({ kind: "bullet" }),
    },
    orderedList: {
      isActive: editor.nodes.list.isActive({ kind: "ordered" }),
      canExec: editor.commands.toggleList.canExec({ kind: "ordered" }),
      command: () => editor.commands.toggleList({ kind: "ordered" }),
    },
    blockquote: {
      isActive: editor.nodes.blockquote.isActive(),
      canExec: editor.commands.toggleBlockquote.canExec(),
      command: () => editor.commands.toggleBlockquote(),
    },
    link: {
      isActive: editor.marks.link.isActive(),
      canExec: editor.commands.addLink.canExec({ href: "" }),
      command: () => {
        if (editor.marks.link.isActive()) {
          editor.commands.removeLink();
          return;
        }
        const href = window.prompt("URL do link:");
        if (href) editor.commands.addLink({ href });
      },
    },
  };
}

function ToolbarButton({
  item,
  label,
  children,
}: {
  item: Item;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={item.isActive}
      disabled={!item.canExec}
      onMouseDown={(e) => e.preventDefault()}
      onClick={item.command}
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded transition-colors disabled:opacity-40",
        item.isActive
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

const Divider = () => <span className="mx-0.5 h-4 w-px shrink-0 bg-border" />;

export function RichTextToolbar({ profile }: { profile: RichTextProfile }) {
  const items = useEditorDerivedValue(getItems);

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border p-1">
      <ToolbarButton item={items.undo} label="Desfazer">
        <Undo2 className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton item={items.redo} label="Refazer">
        <Redo2 className="size-3.5" />
      </ToolbarButton>
      <Divider />
      <ToolbarButton item={items.bold} label="Negrito">
        <Bold className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton item={items.italic} label="Itálico">
        <Italic className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton item={items.underline} label="Sublinhado">
        <UnderlineIcon className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton item={items.strike} label="Tachado">
        <Strikethrough className="size-3.5" />
      </ToolbarButton>

      {profile === "content" && (
        <>
          <Divider />
          <ToolbarButton item={items.bulletList} label="Lista">
            <List className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton item={items.orderedList} label="Lista numerada">
            <ListOrdered className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton item={items.blockquote} label="Citação">
            <Quote className="size-3.5" />
          </ToolbarButton>
        </>
      )}

      <Divider />
      <ToolbarButton item={items.link} label="Link">
        {items.link.isActive ? (
          <Unlink className="size-3.5" />
        ) : (
          <LinkIcon className="size-3.5" />
        )}
      </ToolbarButton>
    </div>
  );
}
