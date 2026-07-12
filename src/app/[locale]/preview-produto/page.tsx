"use client";

import {
  ProductDetailView,
  type ProductDetailViewData,
} from "@/app/[locale]/(site)/produtos/[slug]/_components/product-detail-view";
import {
  escapeTarget,
  parseEditorTarget,
  selectionMatches,
  PREVIEW_INTENT,
  PREVIEW_MODEL,
  PREVIEW_READY,
  PREVIEW_SELECTION,
  type EditorTarget,
} from "@/app/admin/_components/product-wizard/editor-target";
import { usePreviewFrame } from "@/hooks/use-preview-frame";
import { useEffect, useRef } from "react";
import { PreviewEditorOverlay } from "./_components/preview-editor-overlay";

const MESSAGE_TYPES = {
  ready: PREVIEW_READY,
  model: PREVIEW_MODEL,
  selection: PREVIEW_SELECTION,
  intent: PREVIEW_INTENT,
};

/**
 * Iframe target for the CMS product editor's live canvas. It renders the real
 * public product view from a model pushed by the parent editor over
 * `postMessage`, and reports edit intents back when the author clicks a region.
 * Living under `[locale]` (not `(site)`) gives it the `NextIntlClientProvider`
 * and fonts without the public Header/Footer chrome.
 *
 * The iframe is same-origin, so `blob:` cover images created by the editor
 * render here without an upload round-trip. The frame is a real viewport that
 * scrolls internally — it does not report its height.
 */

/** Editor affordances: pointer + hover/selected outline on editable regions. */
const EDITOR_STYLE = `
[data-editor-target]{cursor:pointer;}
[data-editor-target]:hover{outline:2px dashed var(--color-primary);outline-offset:-2px;}
[data-editor-active="true"]{outline:2px solid var(--color-primary);outline-offset:-2px;}
a { pointer-events: none !important; }
`;

export default function PreviewProdutoPage() {
  const { model, selection, emitIntent } = usePreviewFrame<
    ProductDetailViewData,
    EditorTarget
  >(MESSAGE_TYPES);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<EditorTarget | null>(null);

  useEffect(() => {
    selectionRef.current = selection;
  }, [selection]);

  // Outline the regions that match the active selection (field-precise).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const nodes = root.querySelectorAll<HTMLElement>("[data-editor-target]");
    nodes.forEach((node) => {
      const target = parseEditorTarget(node.dataset.editorTarget ?? null);
      const active =
        !!selection && !!target && selectionMatches(selection, target);
      node.dataset.editorActive = active ? "true" : "false";
    });
  }, [selection, model]);

  // Scroll the selected region into view. Keyed on `selection` only so live
  // model pushes (typing) do not keep yanking the canvas.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !selection) return;
    const nodes = root.querySelectorAll<HTMLElement>("[data-editor-target]");
    for (const node of nodes) {
      const target = parseEditorTarget(node.dataset.editorTarget ?? null);
      if (target && selectionMatches(selection, target)) {
        node.scrollIntoView({ behavior: "smooth", block: "nearest" });
        break;
      }
    }
  }, [selection]);

  // Escape collapses a drill-in selection back to its section root.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const current = selectionRef.current;
      if (!current) return;
      const next = escapeTarget(current);
      if (next !== current) emitIntent(next);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [emitIntent]);

  // Report the clicked region up. In editor mode, suppress link navigation and
  // button actions so a click selects rather than acts. Overlay controls handle
  // their own clicks.
  function handleClick(event: React.MouseEvent) {
    const raw = event.target as HTMLElement;
    if (raw.closest("[data-overlay-control]")) return;
    const el = raw.closest<HTMLElement>("[data-editor-target]");
    if (!el) return;
    const target = parseEditorTarget(el.dataset.editorTarget ?? null);
    if (!target) return;
    event.preventDefault();
    event.stopPropagation();
    emitIntent(target);
  }

  if (!model) {
    return (
      <div className="flex items-center justify-center bg-white py-20 text-sm text-muted-foreground">
        Carregando preview…
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="relative bg-white"
      onClickCapture={handleClick}
    >
      <style dangerouslySetInnerHTML={{ __html: EDITOR_STYLE }} />
      <ProductDetailView data={model} previewMode editable />
      <PreviewEditorOverlay
        rootRef={rootRef}
        recomputeKey={model}
        selection={selection}
        emitIntent={emitIntent}
      />
    </div>
  );
}
