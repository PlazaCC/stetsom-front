"use client";

import {
  parseEditorTarget,
  selectionMatches,
  targetLabel,
  type EditorTarget,
} from "@/app/admin/_components/product-wizard/editor-target";
import { Pencil, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface Slot {
  index: number;
  top: number;
  centerX: number;
  empty: boolean;
}

interface Region {
  target: EditorTarget;
  box: Box;
}

interface PreviewEditorOverlayProps {
  /** The content root (`position: relative`) the overlay is positioned within. */
  rootRef: React.RefObject<HTMLElement | null>;
  /** Changes whenever the model is pushed, so measurements recompute. */
  recomputeKey: unknown;
  /** Currently selected target, rendered with a persistent label badge. */
  selection: EditorTarget | null;
  emitIntent: (target: EditorTarget) => void;
}

/** Document-relative box of `el` measured against the overlay root. */
function boxOf(el: HTMLElement, rootRect: DOMRect): Box {
  const r = el.getBoundingClientRect();
  return {
    top: r.top - rootRect.top,
    left: r.left - rootRect.left,
    width: r.width,
    height: r.height,
  };
}

/**
 * Elementor-style affordance layer rendered inside the preview frame. It labels
 * the hovered region with an "Editar" button, marks the selected region with a
 * persistent badge, and offers "+" buttons to insert blocks. The layer is
 * pointer-through except for its controls.
 */
export function PreviewEditorOverlay({
  rootRef,
  recomputeKey,
  selection,
  emitIntent,
}: PreviewEditorOverlayProps) {
  const [hover, setHover] = useState<Region | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selected, setSelected] = useState<Region | null>(null);

  const measure = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const rootRect = root.getBoundingClientRect();

    // Insert slots: one above each block (index = position) plus a trailing one.
    const blocks = Array.from(
      root.querySelectorAll<HTMLElement>('[data-editor-target^="block:"]'),
    );
    const nextSlots: Slot[] = [];
    blocks.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      nextSlots.push({
        index: i,
        top: r.top - rootRect.top,
        centerX: r.left - rootRect.left + r.width / 2,
        empty: false,
      });
    });
    const last = blocks[blocks.length - 1];
    if (last) {
      const r = last.getBoundingClientRect();
      nextSlots.push({
        index: blocks.length,
        top: r.bottom - rootRect.top,
        centerX: r.left - rootRect.left + r.width / 2,
        empty: false,
      });
    } else {
      // No blocks yet: offer to add the first one where blocks render, just
      // above the specifications section.
      const specs = root.querySelector<HTMLElement>("#specifications");
      const anchor = specs?.getBoundingClientRect();
      nextSlots.push({
        index: 0,
        top: anchor ? anchor.top - rootRect.top : rootRect.height,
        centerX: rootRect.width / 2,
        empty: true,
      });
    }
    setSlots(nextSlots);

    // Selected region box (first element matching the selection).
    if (selection) {
      const match = Array.from(
        root.querySelectorAll<HTMLElement>("[data-editor-target]"),
      ).find((node) => {
        const target = parseEditorTarget(node.dataset.editorTarget ?? null);
        return target && selectionMatches(selection, target);
      });
      setSelected(
        match ? { target: selection, box: boxOf(match, rootRect) } : null,
      );
    } else {
      setSelected(null);
    }
  }, [rootRef, selection]);

  // Recompute on model change, selection change, content and window resize.
  useEffect(() => {
    measure();
    const root = rootRef.current;
    if (!root) return;
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, recomputeKey, rootRef]);

  // Track the hovered region. Skip our own controls so the affordance stays put
  // while the cursor moves onto it.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    function onOver(event: MouseEvent) {
      const el = event.target as HTMLElement;
      if (el.closest("[data-overlay-control]")) return;
      const region = el.closest<HTMLElement>("[data-editor-target]");
      const parsed = region
        ? parseEditorTarget(region.dataset.editorTarget ?? null)
        : null;
      if (!region || !parsed) {
        setHover(null);
        return;
      }
      setHover({
        target: parsed,
        box: boxOf(region, root!.getBoundingClientRect()),
      });
    }
    function onLeave() {
      setHover(null);
    }
    root.addEventListener("mouseover", onOver);
    root.addEventListener("mouseleave", onLeave);
    return () => {
      root.removeEventListener("mouseover", onOver);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, [rootRef]);

  return (
    <div className="pointer-events-none absolute inset-0 z-40">
      {selected && (
        <span
          style={{ top: selected.box.top, left: selected.box.left }}
          className="absolute inline-flex -translate-y-full items-center gap-1 rounded-t-md bg-primary px-2 py-0.5 text-2xs font-semibold text-white"
        >
          <Pencil className="size-3" />
          {targetLabel(selected.target)}
        </span>
      )}

      {hover && (
        <button
          type="button"
          data-overlay-control
          onClick={() => emitIntent(hover.target)}
          style={{
            top: hover.box.top,
            left: hover.box.left + hover.box.width,
            transform: "translate(-100%, 0)",
          }}
          className="pointer-events-auto absolute inline-flex items-center gap-1 rounded-b-md bg-primary px-2 py-1 text-2xs font-semibold text-white shadow-sm"
        >
          <Pencil className="size-3" />
          Editar {targetLabel(hover.target)}
        </button>
      )}

      {slots.map((slot) =>
        slot.empty ? (
          <button
            key={`slot-${slot.index}`}
            type="button"
            data-overlay-control
            onClick={() => emitIntent({ kind: "addBlock", index: slot.index })}
            style={{
              top: slot.top,
              left: slot.centerX,
              transform: "translate(-50%, -50%)",
            }}
            className="pointer-events-auto absolute inline-flex items-center gap-1.5 rounded-full border-2 border-dashed border-primary bg-white px-3 py-1.5 text-xs font-semibold text-primary shadow-sm transition-colors hover:bg-primary hover:text-white"
          >
            <Plus className="size-4" />
            Adicionar primeiro bloco
          </button>
        ) : (
          <button
            key={`slot-${slot.index}`}
            type="button"
            data-overlay-control
            aria-label="Adicionar bloco aqui"
            title="Inserir bloco aqui"
            onClick={() => emitIntent({ kind: "addBlock", index: slot.index })}
            style={{
              top: slot.top,
              left: slot.centerX,
              transform: "translate(-50%, -50%)",
            }}
            className="pointer-events-auto absolute inline-flex size-7 items-center justify-center rounded-full border-2 border-dashed border-primary bg-white text-primary opacity-50 shadow-sm transition-opacity hover:opacity-100"
          >
            <Plus className="size-4" />
          </button>
        ),
      )}
    </div>
  );
}
