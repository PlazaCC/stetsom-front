"use client";

import {
  ProductDetailView,
  type ProductDetailViewData,
} from "@/app/[locale]/(site)/produtos/[slug]/_components/product-detail-view";
import { useEffect, useState } from "react";

/**
 * Iframe target for the CMS product wizard live preview. It renders the real
 * public product view from a model pushed by the parent wizard over
 * `postMessage`. Living under `[locale]` (not `(site)`) gives it the
 * `NextIntlClientProvider` and fonts without the public Header/Footer chrome.
 *
 * The iframe is same-origin, so `blob:` cover images created by the wizard
 * render here without an upload round-trip.
 */
const READY_MESSAGE = "stetsom-preview-ready";
const MODEL_MESSAGE = "stetsom-preview-model";
const HEIGHT_MESSAGE = "stetsom-preview-height";

export default function PreviewProdutoPage() {
  const [model, setModel] = useState<ProductDetailViewData | null>(null);

  useEffect(() => {
    let received = false;

    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      const data = event.data as {
        type?: string;
        model?: ProductDetailViewData;
      };
      if (data?.type === MODEL_MESSAGE && data.model) {
        received = true;
        setModel(data.model);
      }
    }
    window.addEventListener("message", onMessage);

    const announce = () =>
      window.parent?.postMessage(
        { type: READY_MESSAGE },
        window.location.origin,
      );

    // Re-announce until the first model arrives. The parent's listener may not
    // be attached yet on the initial announce (dev remounts, slow frame load).
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
  }, []);

  // Report the rendered content height so the parent can size the iframe to fit.
  // This keeps the preview inside the app shell's single scroll — the frame has
  // no internal scrollbar of its own. Avoid `100vh`/`min-h-screen` content here,
  // or the measurement would track the iframe viewport and feed back on itself.
  useEffect(() => {
    let last = 0;
    function report() {
      const height = Math.ceil(document.documentElement.scrollHeight);
      if (Math.abs(height - last) < 2) return;
      last = height;
      window.parent?.postMessage(
        { type: HEIGHT_MESSAGE, height },
        window.location.origin,
      );
    }
    const observer = new ResizeObserver(report);
    observer.observe(document.documentElement);
    report();
    return () => observer.disconnect();
  }, []);

  if (!model) {
    return (
      <div className="flex items-center justify-center bg-white py-20 text-sm text-muted-foreground">
        Carregando preview…
      </div>
    );
  }

  return (
    <div className="bg-white">
      <ProductDetailView data={model} previewMode />
    </div>
  );
}
