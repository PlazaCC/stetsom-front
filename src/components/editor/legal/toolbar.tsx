"use client";

import type { Editor } from "prosekit/core";
import { useEditorDerivedValue } from "prosekit/react";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
  Unlink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LegalExtension } from "./extension";

type Item = { isActive: boolean; canExec: boolean; command: () => void };

function getItems(editor: Editor<LegalExtension>) {
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
    heading1: {
      isActive: editor.nodes.heading.isActive({ level: 1 }),
      canExec: editor.commands.toggleHeading.canExec({ level: 1 }),
      command: () => editor.commands.toggleHeading({ level: 1 }),
    },
    heading2: {
      isActive: editor.nodes.heading.isActive({ level: 2 }),
      canExec: editor.commands.toggleHeading.canExec({ level: 2 }),
      command: () => editor.commands.toggleHeading({ level: 2 }),
    },
    heading3: {
      isActive: editor.nodes.heading.isActive({ level: 3 }),
      canExec: editor.commands.toggleHeading.canExec({ level: 3 }),
      command: () => editor.commands.toggleHeading({ level: 3 }),
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
    horizontalRule: {
      isActive: false,
      canExec: editor.commands.insertHorizontalRule.canExec(),
      command: () => editor.commands.insertHorizontalRule(),
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
        "flex size-8 shrink-0 items-center justify-center rounded transition-colors disabled:opacity-40",
        item.isActive
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

const Divider = () => <span className="mx-0.5 h-5 w-px shrink-0 bg-border" />;

export function LegalToolbar() {
  const items = useEditorDerivedValue(getItems);

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border p-1.5">
      <ToolbarButton item={items.undo} label="Desfazer">
        <Undo2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton item={items.redo} label="Refazer">
        <Redo2 className="size-4" />
      </ToolbarButton>
      <Divider />
      <ToolbarButton item={items.bold} label="Negrito">
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton item={items.italic} label="Itálico">
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton item={items.underline} label="Sublinhado">
        <UnderlineIcon className="size-4" />
      </ToolbarButton>
      <ToolbarButton item={items.strike} label="Tachado">
        <Strikethrough className="size-4" />
      </ToolbarButton>
      <Divider />
      <ToolbarButton item={items.heading1} label="Título 1">
        <Heading1 className="size-4" />
      </ToolbarButton>
      <ToolbarButton item={items.heading2} label="Título 2">
        <Heading2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton item={items.heading3} label="Título 3">
        <Heading3 className="size-4" />
      </ToolbarButton>
      <Divider />
      <ToolbarButton item={items.bulletList} label="Lista">
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton item={items.orderedList} label="Lista numerada">
        <ListOrdered className="size-4" />
      </ToolbarButton>
      <ToolbarButton item={items.blockquote} label="Citação">
        <Quote className="size-4" />
      </ToolbarButton>
      <Divider />
      <ToolbarButton item={items.link} label="Link">
        {items.link.isActive ? (
          <Unlink className="size-4" />
        ) : (
          <LinkIcon className="size-4" />
        )}
      </ToolbarButton>
      <ToolbarButton item={items.horizontalRule} label="Divisor">
        <Minus className="size-4" />
      </ToolbarButton>
    </div>
  );
}
