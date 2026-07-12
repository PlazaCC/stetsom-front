"use client";

import { usePreviewBridge } from "@/hooks/use-preview-bridge";
import { cn } from "@/lib/utils";
import { Monitor, Smartphone } from "lucide-react";
import {
  PAGE_PREVIEW_INTENT,
  PAGE_PREVIEW_MODEL,
  PAGE_PREVIEW_READY,
  PAGE_PREVIEW_SELECTION,
  type PageEditorTarget,
  type PagePreviewModel,
} from "./page-editor-target";

const FRAME_URL = "/preview-pagina";

const MESSAGE_TYPES = {
  ready: PAGE_PREVIEW_READY,
  model: PAGE_PREVIEW_MODEL,
  selection: PAGE_PREVIEW_SELECTION,
  intent: PAGE_PREVIEW_INTENT,
};

type Device = "mobile" | "desktop";

interface PagePreviewCanvasProps {
  model: PagePreviewModel;
  selection: PageEditorTarget;
  onIntent: (target: PageEditorTarget) => void;
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

export function PagePreviewCanvas({
  model,
  selection,
  onIntent,
  device,
  onDeviceChange,
}: PagePreviewCanvasProps) {
  const iframeRef = usePreviewBridge<PagePreviewModel, PageEditorTarget>(
    MESSAGE_TYPES,
    model,
    selection,
    onIntent,
  );

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
            title="Preview da página"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            className="h-full w-full border-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
}
