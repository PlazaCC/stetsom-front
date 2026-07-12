"use client";

import { HomePageView } from "@/app/[locale]/(site)/_components/home-page-view";
import { AboutPageView } from "@/app/[locale]/(site)/sobre/_components/about-page-view";
import { SupportPageView } from "@/app/[locale]/(site)/suporte/_components/support-page-view";
import {
  PAGE_PREVIEW_INTENT,
  PAGE_PREVIEW_MODEL,
  PAGE_PREVIEW_READY,
  PAGE_PREVIEW_SELECTION,
  parsePageEditorTarget,
  type PageEditorTarget,
  type PagePreviewModel,
} from "@/app/admin/paginas/_components/page-editor-target";
import { usePreviewFrame } from "@/hooks/use-preview-frame";
import { useEffect, useRef } from "react";

const MESSAGE_TYPES = {
  ready: PAGE_PREVIEW_READY,
  model: PAGE_PREVIEW_MODEL,
  selection: PAGE_PREVIEW_SELECTION,
  intent: PAGE_PREVIEW_INTENT,
};

const EDITOR_STYLE = `
[data-editor-target]{cursor:pointer;}
[data-editor-target]:hover{outline:2px dashed var(--color-primary);outline-offset:-2px;}
[data-editor-active="true"]{outline:2px solid var(--color-primary);outline-offset:-2px;}
a { pointer-events: none !important; }
`;

export default function PreviewPaginaPage() {
  const { model, selection, emitIntent } = usePreviewFrame<
    PagePreviewModel,
    PageEditorTarget
  >(MESSAGE_TYPES);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const nodes = root.querySelectorAll<HTMLElement>("[data-editor-target]");
    nodes.forEach((node) => {
      const target = parsePageEditorTarget(node.dataset.editorTarget ?? null);
      node.dataset.editorActive =
        !!selection && !!target && target === selection ? "true" : "false";
    });
  }, [selection, model]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !selection) return;
    const nodes = root.querySelectorAll<HTMLElement>("[data-editor-target]");
    for (const node of nodes) {
      const target = parsePageEditorTarget(node.dataset.editorTarget ?? null);
      if (target === selection) {
        node.scrollIntoView({ behavior: "smooth", block: "nearest" });
        break;
      }
    }
  }, [selection]);

  function handleClick(event: React.MouseEvent) {
    const raw = event.target as HTMLElement;
    const el = raw.closest<HTMLElement>("[data-editor-target]");
    if (!el) return;
    const target = parsePageEditorTarget(el.dataset.editorTarget ?? null);
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
      {model.pageId === "home" && <HomePageView data={model.data} editable />}
      {model.pageId === "about" && <AboutPageView data={model.data} editable />}
      {model.pageId === "support" && (
        <SupportPageView data={model.data} editable />
      )}
    </div>
  );
}
