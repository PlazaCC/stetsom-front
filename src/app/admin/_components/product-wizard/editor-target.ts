/**
 * Shared protocol between the product editor (`wizard.tsx` / `preview-canvas.tsx`)
 * and the live preview iframe (`[locale]/preview-produto/page.tsx`).
 *
 * The editor is an Elementor-style split view: the preview is the canvas on the
 * left, a 320px contextual panel is on the right. Clicking a region in the
 * preview reports an intent up; the editor pushes the model and the current
 * selection down so the preview can highlight the active region.
 */

/** Top-level panel sections. The navigator highlights one of these at a time. */
export type EditorSection =
  | "general"
  | "specs"
  | "files"
  | "publish"
  | "blocks";

/** The drill-in fields of the general section. Undefined = the section overview. */
export type GeneralField = "title" | "description" | "category" | "images";

/**
 * What the editor panel is currently focused on. Page regions resolve to a
 * section (general carries a specific field); blocks carry their id so the
 * panel opens that block's editor.
 */
export type EditorTarget =
  | { kind: "general"; field?: GeneralField }
  | { kind: "specs" }
  | { kind: "files" }
  | { kind: "publish" }
  | { kind: "blocks" }
  | { kind: "block"; blockId: string }
  | { kind: "addBlock"; index: number };

/** Down: editor → iframe. */
export const PREVIEW_READY = "stetsom-preview-ready";
export const PREVIEW_MODEL = "stetsom-preview-model";
export const PREVIEW_SELECTION = "stetsom-preview-selection";
/** Up: iframe → editor. */
export const PREVIEW_INTENT = "stetsom-preview-intent";

/** Map any target to the panel section that owns it. */
export function targetToSection(target: EditorTarget): EditorSection {
  switch (target.kind) {
    case "general":
    case "specs":
    case "files":
    case "publish":
      return target.kind;
    case "blocks":
    case "block":
    case "addBlock":
      return "blocks";
  }
}

/** The default target a navigator section opens to. */
export function sectionToTarget(section: EditorSection): EditorTarget {
  return { kind: section };
}

/**
 * Parse a `data-editor-target` attribute value into a target. General regions
 * resolve to a specific field so the panel can drill straight in; blocks carry
 * their id.
 */
export function parseEditorTarget(raw: string | null): EditorTarget | null {
  if (!raw) return null;
  if (raw.startsWith("block:")) {
    return { kind: "block", blockId: raw.slice("block:".length) };
  }
  switch (raw) {
    case "title":
    case "description":
    case "category":
    case "images":
      return { kind: "general", field: raw };
    case "specs":
    case "highlights":
      return { kind: "specs" };
    case "files":
      return { kind: "files" };
    default:
      return null;
  }
}

/** Human label for a target, shown on the canvas affordances. */
export function targetLabel(target: EditorTarget): string {
  switch (target.kind) {
    case "general":
      switch (target.field) {
        case "title":
          return "Título";
        case "description":
          return "Descrição";
        case "category":
          return "Categoria";
        case "images":
          return "Imagens";
        default:
          return "Dados gerais";
      }
    case "specs":
      return "Especificações";
    case "files":
      return "Arquivos";
    case "publish":
      return "Publicação";
    case "blocks":
      return "Blocos";
    case "block":
      return "Bloco";
    case "addBlock":
      return "Novo bloco";
  }
}

/** Does the current selection refer to the same editable element as `target`? */
export function selectionMatches(
  selection: EditorTarget,
  target: EditorTarget,
): boolean {
  if (selection.kind === "block") {
    return target.kind === "block" && selection.blockId === target.blockId;
  }
  if (selection.kind === "general") {
    return (
      target.kind === "general" &&
      selection.field !== undefined &&
      selection.field === target.field
    );
  }
  return targetToSection(selection) === targetToSection(target);
}

/**
 * Escape collapses a drill-in selection back to its section root: a general
 * field returns to the general overview, a block returns to the block list.
 * Returns the same reference when there is nothing to collapse.
 */
export function escapeTarget(target: EditorTarget): EditorTarget {
  if (target.kind === "general" && target.field) return { kind: "general" };
  if (target.kind === "block" || target.kind === "addBlock") {
    return { kind: "blocks" };
  }
  return target;
}
