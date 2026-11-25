"use client";

import type { Editor } from "prosekit/core";
import { useEditorDerivedValue } from "prosekit/react";
import {
  Bold,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RICH_COLORS, type BlockTextExtension } from "./extension";
import type { BlockTextEditorVariant } from "./block-text-editor";

type Item = { isActive: boolean; canExec: boolean; command: () => void };

const TITLE_OPTIONS = [
  { value: "h2", label: "Título 2", level: 2 },
  { value: "h3", label: "Título 3", level: 3 },
  { value: "h4", label: "Título 4", level: 4 },
  { value: "h5", label: "Título 5", level: 5 },
] as const;

function getItems(editor: Editor<BlockTextExtension>) {
  const activeTitle = TITLE_OPTIONS.find(({ level }) =>
    editor.nodes.heading.isActive({ level }),
  );
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
      isActive: editor.nodes.paragraph.isActive() && !activeTitle,
      canExec: editor.commands.setParagraph.canExec(),
      command: () => editor.commands.setParagraph(),
    },
    title: {
      value: activeTitle?.value ?? "paragraph",
      command: (value: string) =>
        value === "paragraph"
          ? editor.commands.setParagraph()
          : editor.commands.setHeading({ level: Number(value.slice(1)) }),
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

export function BlockTextToolbar({
  variant,
}: {
  variant: BlockTextEditorVariant;
}) {
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
      {variant === "full" && (
        <>
          <ToolbarButton item={items.paragraph} label="Parágrafo">
            <Pilcrow className="size-4" />
          </ToolbarButton>
          <Select
            value={items.title.value}
            onValueChange={(value) => {
              if (value) items.title.command(value);
            }}
          >
            <SelectTrigger
              size="sm"
              className="h-8 w-32 justify-between gap-1 px-2 text-xs font-medium"
              aria-label="Escolher nível do título"
            >
              <SelectValue placeholder="Título" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paragraph">Parágrafo</SelectItem>
              {TITLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Divider />
        </>
      )}
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
      {variant !== "title" && (
        <>
          <Divider />
          <ToolbarButton item={items.bulletList} label="Lista">
            <List className="size-4" />
          </ToolbarButton>
          <ToolbarButton item={items.orderedList} label="Lista numerada">
            <ListOrdered className="size-4" />
          </ToolbarButton>
        </>
      )}
      <ColorPicker />
      {variant !== "title" && (
        <>
          <Divider />
          <ToolbarButton item={items.link} label="Link">
            {items.link.isActive ? (
              <Unlink className="size-4" />
            ) : (
              <LinkIcon className="size-4" />
            )}
          </ToolbarButton>
        </>
      )}
    </div>
  );
}

function getColor(editor: Editor<BlockTextExtension>) {
  return {
    color:
      RICH_COLORS.find(({ value }) =>
        editor.marks.brandColor.isActive({ color: value }),
      )?.value ?? "default",
    setColor: (value: string) =>
      value === "default"
        ? editor.commands.removeBrandColor()
        : editor.commands.setBrandColor(value),
  };
}

function ColorPicker() {
  const { color, setColor } = useEditorDerivedValue(getColor);
  return (
    <Select
      value={color}
      onValueChange={(value) => {
        if (value) setColor(value);
      }}
    >
      <SelectTrigger size="sm" className="w-36" aria-label="Cor do texto">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Cor padrão</SelectItem>
        {RICH_COLORS.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            <span className={`rich-color-${value}`}>●</span> {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
