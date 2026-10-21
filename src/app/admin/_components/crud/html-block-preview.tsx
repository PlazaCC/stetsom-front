"use client";

import { sanitizeBlockHtml } from "@/lib/utils/block-html";
import { TriangleAlert } from "lucide-react";
import { useId } from "react";

/**
 * Renders the free-HTML block the way the site does (same sanitizing, CSS
 * scoped to the block) inside the editor's "Pré-visualizar" tab.
 */
export function HtmlBlockPreview({ html }: { html: string }) {
  const scope = `html-preview-${useId().replace(/[^\w-]/g, "")}`;
  const result = sanitizeBlockHtml(html, scope);

  return (
    <div className="space-y-2">
      {result.removedContent && (
        <p className="flex items-start gap-1.5 rounded-md bg-amber-50 px-2 py-1.5 text-xs text-amber-800">
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
          Parte do código foi removida por segurança (scripts, iframes, eventos
          como onclick ou links para folhas de estilo externas).
        </p>
      )}
      {result.css && <style dangerouslySetInnerHTML={{ __html: result.css }} />}
      <div
        data-block-scope={scope}
        className="blockHtml overflow-auto rounded-md border border-border bg-white p-3 text-sm"
        dangerouslySetInnerHTML={{ __html: result.html }}
      />
    </div>
  );
}
