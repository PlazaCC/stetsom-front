"use client";

import type { ProductDetailViewData } from "@/app/[locale]/(site)/produtos/[slug]/_components/product-detail-view";
import { cn } from "@/lib/utils";
import { Monitor, Smartphone } from "lucide-react";
import { useEffect, useRef } from "react";
import {
  PREVIEW_INTENT,
  PREVIEW_MODEL,
  PREVIEW_READY,
  PREVIEW_SELECTION,
  type EditorTarget,
} from "./editor-target";

/** Same-origin route that renders the product view from the pushed model. */
const FRAME_URL = "/preview-produto";
/** Debounce model pushes so fast typing does not flood the iframe. */
const PUSH_DELAY_MS = 150;

type Device = "mobile" | "desktop";

interface PreviewCanvasProps {
  model: ProductDetailViewData;
  /** Current panel selection, mirrored into the frame to highlight the region. */
  selection: EditorTarget;
  /** A region/block was clicked in the preview. */
  onIntent: (target: EditorTarget) => void;
  device: Device;
  onDeviceChange: (device: Device) => void;
}

function DeviceToggle({
  device,
  onChange,
}: {
  device: Device;
  onChange: (device: Device) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-md bg-muted">
      {(
        [
          { id: "mobile", icon: Smartphone, label: "Mobile" },
          { id: "desktop", icon: Monitor, label: "Desktop" },
        ] as const
      ).map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          type="button"
          aria-label={id}
          onClick={() => onChange(id)}
          className={cn(
            "flex flex-col items-center gap-1 rounded px-1 py-1.5 text-2xs font-medium transition-colors",
            device === id
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <Icon className="size-4" />
          {label}
        </button>
      ))}
    </div>
  );
}

export function PreviewCanvas({
  model,
  selection,
  onIntent,
  device,
  onDeviceChange,
}: PreviewCanvasProps) {
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
      const data = event.data as { type?: string; target?: EditorTarget };
      if (data?.type === PREVIEW_READY) {
        post(PREVIEW_MODEL, { model: modelRef.current });
        post(PREVIEW_SELECTION, { selection: selectionRef.current });
      } else if (data?.type === PREVIEW_INTENT && data.target) {
        onIntentRef.current(data.target);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Push edits live (debounced). Harmless if the frame is not mounted yet.
  useEffect(() => {
    const id = setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(
        { type: PREVIEW_MODEL, model },
        window.location.origin,
      );
    }, PUSH_DELAY_MS);
    return () => clearTimeout(id);
  }, [model]);

  // Mirror selection so the frame can highlight the active region.
  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: PREVIEW_SELECTION, selection },
      window.location.origin,
    );
  }, [selection]);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-muted">
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-card px-2 py-2">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Pré-visualização
        </span>
        <div className="flex items-center gap-2">
          <DeviceToggle device={device} onChange={onDeviceChange} />
        </div>
      </div>

      {/* The canvas scrolls internally — the iframe is a real viewport, not
          sized to its content. See admin-shell-scroll.md (editor exception). */}
      <div
        className={cn(
          "flex flex-1 overflow-hidden",
          device === "mobile" ? "justify-center overflow-x-hidden py-4" : "",
        )}
      >
        <div
          className={cn(
            "h-full overflow-hidden bg-white",
            device === "mobile" ? "w-[375px] rounded-md shadow-sm" : "w-full",
          )}
        >
          <iframe
            ref={iframeRef}
            src={FRAME_URL}
            title="Preview do produto"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            className="h-full w-full border-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
}
