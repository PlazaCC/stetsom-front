"use client";

import type { ProductDetailViewData } from "@/app/[locale]/(site)/produtos/[slug]/_components/product-detail-view";
import { cn } from "@/lib/utils";
import { ExternalLink, Maximize2, Monitor, Smartphone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/** Same-origin route that renders the product view from the pushed model. */
const FRAME_URL = "/preview-produto";
const READY_MESSAGE = "stetsom-preview-ready";
const MODEL_MESSAGE = "stetsom-preview-model";
const HEIGHT_MESSAGE = "stetsom-preview-height";
/** Debounce model pushes so fast typing does not flood the iframe. */
const PUSH_DELAY_MS = 150;
/** Fallback iframe height before the frame reports its content height. */
const FALLBACK_FRAME_HEIGHT = 640;

type Device = "mobile" | "desktop";

interface PreviewPanelProps {
  model: ProductDetailViewData;
  hasSavedProduct: boolean;
  /** `/api/draft` URL that opens the real page in Draft Mode. Null when unsaved. */
  realPageHref: string | null;
}

const iconButton =
  "rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

function DeviceToggle({
  device,
  onChange,
}: {
  device: Device;
  onChange: (device: Device) => void;
}) {
  return (
    <div className="inline-flex rounded-md border border-border p-0.5">
      {(
        [
          { id: "mobile", icon: Smartphone },
          { id: "desktop", icon: Monitor },
        ] as const
      ).map(({ id, icon: Icon }) => (
        <button
          key={id}
          type="button"
          aria-label={id}
          onClick={() => onChange(id)}
          className={cn(
            "rounded p-1.5 transition-colors",
            device === id
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  );
}

export function PreviewPanel({
  model,
  hasSavedProduct,
  realPageHref,
}: PreviewPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [device, setDevice] = useState<Device>("desktop");
  const [frameHeight, setFrameHeight] = useState(FALLBACK_FRAME_HEIGHT);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const modelRef = useRef(model);

  useEffect(() => {
    modelRef.current = model;
  }, [model]);

  // Reply to the iframe handshake with the latest model, and track the height it
  // reports so the inline frame fits its content without an internal scrollbar.
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { type?: string; height?: number };
      if (data?.type === READY_MESSAGE) {
        iframeRef.current?.contentWindow?.postMessage(
          { type: MODEL_MESSAGE, model: modelRef.current },
          window.location.origin,
        );
      } else if (
        data?.type === HEIGHT_MESSAGE &&
        typeof data.height === "number"
      ) {
        setFrameHeight(Math.max(data.height, FALLBACK_FRAME_HEIGHT));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Push edits live (debounced). Harmless if the frame is not mounted yet.
  useEffect(() => {
    const id = setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(
        { type: MODEL_MESSAGE, model },
        window.location.origin,
      );
    }, PUSH_DELAY_MS);
    return () => clearTimeout(id);
  }, [model]);

  function openRealPage() {
    if (realPageHref) window.open(realPageHref, "_blank", "noopener");
  }

  const realPageButton = hasSavedProduct && realPageHref && (
    <button
      type="button"
      onClick={openRealPage}
      className={iconButton}
      title="Abrir página real em nova aba"
    >
      <ExternalLink className="size-4" />
    </button>
  );

  if (expanded) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-base font-semibold text-foreground">Preview</h2>
          <div className="flex items-center gap-2">
            <DeviceToggle device={device} onChange={setDevice} />
            {realPageButton}
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className={cn(iconButton, "ml-1")}
              aria-label="Reduzir"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
        <div
          className={cn(
            "flex flex-1 overflow-hidden",
            device === "mobile" && "justify-center bg-muted py-4",
          )}
        >
          <div
            className={cn(
              "overflow-hidden bg-white",
              device === "mobile"
                ? "h-full w-[375px] rounded-md shadow-sm"
                : "h-full w-full",
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

  return (
    <div className="rounded-[16px] border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold text-foreground">Preview</h2>
        <div className="flex items-center gap-2">
          {realPageButton}
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className={iconButton}
            title="Expandir"
          >
            <Maximize2 className="size-4" />
          </button>
        </div>
      </div>
      {/* Inline frame is sized to its content so the only scroll is the app
          shell's <main>. The device preview has no internal scrollbar. */}
      <div className="flex justify-center bg-muted p-3">
        <iframe
          ref={iframeRef}
          src={FRAME_URL}
          title="Preview do produto"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          style={{ height: frameHeight }}
          className="w-[375px] rounded-md border-0 bg-white shadow-sm"
        />
      </div>
    </div>
  );
}
