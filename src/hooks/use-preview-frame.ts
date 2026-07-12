"use client";

import { useCallback, useEffect, useState } from "react";
import type { PreviewBridgeMessageTypes } from "./use-preview-bridge";

/**
 * Iframe/child side of a live-preview bridge — the counterpart to
 * `usePreviewBridge`. Announces readiness on mount, retries every 250ms until
 * the first model arrives (covers dev remounts / slow frame loads where the
 * parent's listener isn't attached yet on the initial announce), and exposes
 * `emitIntent` for reporting clicked editable regions back up.
 */
export function usePreviewFrame<TModel, TSelection>(
  types: PreviewBridgeMessageTypes,
) {
  const [model, setModel] = useState<TModel | null>(null);
  const [selection, setSelection] = useState<TSelection | null>(null);

  useEffect(() => {
    let received = false;

    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      const data = event.data as {
        type?: string;
        model?: TModel;
        selection?: TSelection;
      };
      if (data?.type === types.model && data.model) {
        received = true;
        setModel(data.model);
      } else if (data?.type === types.selection) {
        setSelection(data.selection ?? null);
      }
    }
    window.addEventListener("message", onMessage);

    const announce = () =>
      window.parent?.postMessage({ type: types.ready }, window.location.origin);

    announce();
    const handshake = setInterval(() => {
      if (received) {
        clearInterval(handshake);
        return;
      }
      announce();
    }, 250);

    return () => {
      window.removeEventListener("message", onMessage);
      clearInterval(handshake);
    };
  }, [types.ready, types.model, types.selection]);

  const emitIntent = useCallback(
    (target: TSelection) => {
      window.parent?.postMessage(
        { type: types.intent, target },
        window.location.origin,
      );
    },
    [types.intent],
  );

  return { model, selection, emitIntent };
}
