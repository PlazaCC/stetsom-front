"use client";

import type { Editor } from "prosekit/core";
import { useEditorDerivedValue } from "prosekit/react";
import {
  Bold,
  Heading3,
  Heading4,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Pilcrow,
  Redo2,
  Underline as UnderlineIcon,
  Undo2,
  Unlink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlockTextExtension } from "./extension";

type Item = { isActive: boolean; canExec: boolean; command: () => void };

function getItems(editor: Editor<BlockTextExtension>) {
  const isHeading = editor.nodes.heading.isActive();
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
    paragraph: {
      isActive: editor.nodes.paragraph.isActive() && !isHeading,
      canExec: editor.commands.setParagraph.canExec(),
      command: () => editor.commands.setParagraph(),
    },
    heading3: {
      isActive: editor.nodes.heading.isActive({ level: 3 }),
      canExec: editor.commands.toggleHeading.canExec({ level: 3 }),
      command: () => editor.commands.toggleHeading({ level: 3 }),
    },
    heading4: {
      isActive: editor.nodes.heading.isActive({ level: 4 }),
      canExec: editor.commands.toggleHeading.canExec({ level: 4 }),
      command: () => editor.commands.toggleHeading({ level: 4 }),
    },
    bold: {
      isActive: editor.marks.bold.isActive(),
      canExec: editor.commands.toggleBold.canExec(),
      command: () => editor.commands.toggleBold(),
    },
    semibold: {
      isActive: editor.marks.semibold.isActive(),
      canExec: editor.commands.toggleSemibold.canExec(),
      command: () => editor.commands.toggleSemibold(),
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
        "flex h-8 min-w-8 shrink-0 items-center justify-center rounded px-1.5 transition-colors disabled:opacity-40",
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

export function BlockTextToolbar() {
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
      <ToolbarButton item={items.paragraph} label="Parágrafo">
        <Pilcrow className="size-4" />
      </ToolbarButton>
      <ToolbarButton item={items.heading3} label="Subtítulo">
        <Heading3 className="size-4" />
      </ToolbarButton>
      <ToolbarButton item={items.heading4} label="Subtítulo menor">
        <Heading4 className="size-4" />
      </ToolbarButton>
      <Divider />
      <ToolbarButton item={items.bold} label="Negrito (Ctrl+B)">
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton item={items.semibold} label="Semi-negrito (Ctrl+Shift+B)">
        <span className="text-xs font-semibold">Semi</span>
      </ToolbarButton>
      <ToolbarButton item={items.italic} label="Itálico">
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton item={items.underline} label="Sublinhado">
        <UnderlineIcon className="size-4" />
      </ToolbarButton>
      <Divider />
      <ToolbarButton item={items.bulletList} label="Lista">
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton item={items.orderedList} label="Lista numerada">
        <ListOrdered className="size-4" />
      </ToolbarButton>
      <Divider />
      <ToolbarButton item={items.link} label="Link">
        {items.link.isActive ? (
          <Unlink className="size-4" />
        ) : (
          <LinkIcon className="size-4" />
        )}
      </ToolbarButton>
    </div>
  );
}
