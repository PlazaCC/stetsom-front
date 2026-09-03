"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect } from "react";

/**
 * Fullscreen gallery viewer (Mercado Livre style): dark backdrop, centered
 * large image, `n/total` counter, prev/next arrows and a thumbnail strip.
 * Keyboard: Escape closes, arrow keys navigate. Body scroll is locked while open.
 */

/** `next/image` does not accept `blob:` sources, so the live preview falls back to `<img>`. */
function LightboxImage({
  src,
  alt,
  className,
  sizes,
  priority,
  previewMode,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  previewMode?: boolean;
}) {
  if (previewMode) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={cn("absolute inset-0 h-full w-full", className)}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}

interface ProductLightboxProps {
  images: string[];
  index: number;
  alt: string;
  previewMode?: boolean;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

export function ProductLightbox({
  images,
  index,
  alt,
  previewMode = false,
  onIndexChange,
  onClose,
}: ProductLightboxProps) {
  const t = useTranslations("ProductDetail");
  const total = images.length;
  const safeIndex = total > 0 ? index : 0;
  const activeImage = images[safeIndex];

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      onIndexChange(((next % total) + total) % total);
    },
    [total, onIndexChange],
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goTo(safeIndex - 1);
      else if (e.key === "ArrowRight") goTo(safeIndex + 1);
    };
    window.addEventListener("keydown", handleKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [safeIndex, goTo, onClose]);

  if (total === 0) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("photoCounter", { current: safeIndex + 1, total })}
      className="fixed inset-0 z-200 flex flex-col bg-neutral-950/95 backdrop-blur-sm"
    >
      {/* Top bar — counter + close */}
      <div className="flex shrink-0 items-center justify-between px-4 py-3 text-white sm:px-6">
        <span className="font-sans text-sm font-semibold tabular-nums">
          {safeIndex + 1}/{total}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("lightboxClose")}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
        >
          <XIcon size={24} />
        </button>
      </div>

      {/* Main image */}
      <div className="relative min-h-0 flex-1 px-12 sm:px-20">
        <LightboxImage
          src={activeImage}
          alt={alt}
          priority
          sizes="100vw"
          className="object-contain"
          previewMode={previewMode}
        />

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(safeIndex - 1)}
              aria-label={t("lightboxPrevious")}
              className="absolute top-1/2 left-2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 sm:left-4"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              type="button"
              onClick={() => goTo(safeIndex + 1)}
              aria-label={t("lightboxNext")}
              className="absolute top-1/2 right-2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 sm:right-4"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {total > 1 && (
        <div className="flex shrink-0 items-center justify-center gap-2 overflow-x-auto px-4 py-4">
          {images.map((image, i) => (
            <button
              key={`${image}-${i}`}
              type="button"
              aria-pressed={i === safeIndex}
              aria-label={t("thumbnail", { name: alt, index: i + 1 })}
              onClick={() => goTo(i)}
              className={cn(
                "relative h-14 w-14 shrink-0 overflow-hidden rounded",
                i === safeIndex
                  ? "border-2 border-white"
                  : "border border-white/30 opacity-70 transition-opacity hover:opacity-100",
              )}
            >
              <LightboxImage
                src={image}
                alt={`${alt} ${i + 1}`}
                sizes="56px"
                className="object-cover"
                previewMode={previewMode}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
