"use client";

import { useEffect, useRef, type RefObject } from "react";

/** The four postMessage type strings a preview bridge protocol needs. */
export interface PreviewBridgeMessageTypes {
  /** Down: editor → iframe, initial handshake reply trigger. Up: iframe → editor, announces mount. */
  ready: string;
  /** Down: editor → iframe, pushes the current draft model. */
  model: string;
  /** Down: editor → iframe, pushes the current panel selection. */
  selection: string;
  /** Up: iframe → editor, reports a clicked editable region. */
  intent: string;
}

const DEFAULT_PUSH_DELAY_MS = 150;

/**
 * Parent/editor side of a live-preview iframe bridge. Generic over the model
 * pushed down and the selection shape shared between panel and iframe — the
 * product wizard and the page editor each supply their own message-type
 * strings and target shape, sharing this same handshake/debounce/origin-check
 * plumbing instead of re-implementing it.
 *
 * Returns a ref to attach to the `<iframe>` element.
 */
export function usePreviewBridge<TModel, TSelection>(
  types: PreviewBridgeMessageTypes,
  model: TModel,
  selection: TSelection,
  onIntent: (target: TSelection) => void,
  pushDelayMs = DEFAULT_PUSH_DELAY_MS,
): RefObject<HTMLIFrameElement | null> {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const modelRef = useRef(model);
  const selectionRef = useRef(selection);
  const onIntentRef = useRef(onIntent);

  useEffect(() => {
    modelRef.current = model;
  }, [model]);
  useEffect(() => {
    selectionRef.current = selection;
  }, [selection]);
  useEffect(() => {
    onIntentRef.current = onIntent;
  }, [onIntent]);

  // Reply to the iframe handshake with the latest model + selection, and surface
  // edit intents reported from clicks inside the frame.
  useEffect(() => {
    function post(type: string, payload: Record<string, unknown>) {
      iframeRef.current?.contentWindow?.postMessage(
        { type, ...payload },
        window.location.origin,
      );
    }
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { type?: string; target?: TSelection };
      if (data?.type === types.ready) {
        post(types.model, { model: modelRef.current });
        post(types.selection, { selection: selectionRef.current });
      } else if (data?.type === types.intent && data.target) {
        onIntentRef.current(data.target);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [types.ready, types.model, types.selection, types.intent]);

  // Push edits live (debounced). Harmless if the frame is not mounted yet.
  useEffect(() => {
    const id = setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(
        { type: types.model, model },
        window.location.origin,
      );
    }, pushDelayMs);
    return () => clearTimeout(id);
  }, [model, types.model, pushDelayMs]);

  // Mirror selection so the frame can highlight the active region.
  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: types.selection, selection },
      window.location.origin,
    );
  }, [selection, types.selection]);

  return iframeRef;
}
