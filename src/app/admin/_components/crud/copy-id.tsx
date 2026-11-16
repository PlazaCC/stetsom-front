"use client";

import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * A compact, click-to-copy chip for an entity identifier. Handy when someone is
 * assembling the spec spreadsheet by hand and needs the attribute or group id
 * that the import keys on. Falls back to a hidden textarea when the async
 * clipboard API is unavailable (non-secure contexts / older browsers).
 */
export function CopyId({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      return;
    } catch {
      // Falls through to the legacy path below.
    }
    try {
      const area = document.createElement("textarea");
      area.value = value;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      setCopied(true);
    } catch {
      // Clipboard blocked — leave the chip unchanged.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title={copied ? "Copiado!" : `Copiar identificador: ${value}`}
      aria-label={
        copied ? "Identificador copiado" : `Copiar identificador ${value}`
      }
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground",
        className,
      )}
    >
      <span className="max-w-[9rem] truncate">{value}</span>
      {copied ? (
        <Check className="size-3.5 shrink-0 text-green-600" aria-hidden />
      ) : (
        <Copy
          className="size-3.5 shrink-0 opacity-60 transition-opacity group-hover:opacity-100"
          aria-hidden
        />
      )}
    </button>
  );
}
