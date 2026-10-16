"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { Play, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface QualityVideoHeroProps {
  label?: string;
  title: string;
  /** Muted loop played behind the title. */
  backgroundVideoUrl?: string;
  /** Video opened by the Play button; falls back to the background loop. */
  fullVideoUrl?: string;
  /** Poster for the loop and fallback when there is no video. */
  posterUrl?: string;
  posterAlt?: string;
  playLabel?: string;
}

export function QualityVideoHero({
  label,
  title,
  backgroundVideoUrl,
  fullVideoUrl,
  posterUrl,
  posterAlt = "",
  playLabel,
}: Readonly<QualityVideoHeroProps>) {
  const t = useTranslations("About");
  const backgroundRef = useRef<HTMLVideoElement>(null);
  const [playerOpen, setPlayerOpen] = useState(false);

  const playerUrl = fullVideoUrl || backgroundVideoUrl;

  console.log("title", title);

  // Respect reduced-motion: keep the poster frame instead of looping.
  useEffect(() => {
    const video = backgroundRef.current;
    if (!video) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (query.matches) video.pause();
      else void video.play().catch(() => {});
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [backgroundVideoUrl]);

  // Pause the loop while the full video is playing.
  useEffect(() => {
    const video = backgroundRef.current;
    if (!video) return;
    if (playerOpen) video.pause();
    else if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      void video.play().catch(() => {});
    }
  }, [playerOpen]);

  const closePlayer = useCallback(() => setPlayerOpen(false), []);

  return (
    <section className="relative flex h-120 items-center justify-center overflow-hidden bg-brand-dark lg:h-[80vh]">
      {backgroundVideoUrl ? (
        <video
          ref={backgroundRef}
          src={backgroundVideoUrl}
          poster={posterUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : posterUrl ? (
        <Image
          src={posterUrl}
          alt={posterAlt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      ) : null}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex w-full flex-col items-center px-4 text-center">
        {/* {label && <SectionLabel label={label} />} */}
        <h2
          className="mt-3 font-sans-condensed text-5xl leading-none font-black text-balance text-white uppercase lg:text-display-2xl"
          dangerouslySetInnerHTML={{ __html: title.split("\n").join("<br />") }}
        >
          {/* {title.split("\n").join(" ")} */}
        </h2>

        {playerUrl && (
          <button
            type="button"
            onClick={() => setPlayerOpen(true)}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3 font-sans-condensed text-base font-bold text-white uppercase transition-colors hover:bg-white hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Play className="size-4 fill-current" aria-hidden="true" />
            {playLabel || t("playVideo")}
          </button>
        )}
      </div>

      {playerOpen && playerUrl && (
        <FullscreenPlayer
          src={playerUrl}
          title={title.split("\n").join(" ")}
          closeLabel={t("closeVideo")}
          onClose={closePlayer}
        />
      )}
    </section>
  );
}

interface FullscreenPlayerProps {
  src: string;
  title: string;
  closeLabel: string;
  onClose: () => void;
}

function FullscreenPlayer({
  src,
  title,
  closeLabel,
  onClose,
}: Readonly<FullscreenPlayerProps>) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    // Browser fullscreen when supported; the fixed overlay already covers the
    // viewport where it isn't (e.g. iOS Safari).
    overlay?.requestFullscreen?.().catch(() => {});

    const onFullscreenChange = () => {
      if (!document.fullscreenElement) onClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("keydown", onKeyDown);
      if (document.fullscreenElement === overlay) {
        void document.exitFullscreen().catch(() => {});
      }
    };
  }, [onClose]);

  return createPortal(
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-60 flex items-center justify-center bg-black"
    >
      <video
        src={src}
        controls
        autoPlay
        playsInline
        className="h-full w-full object-contain"
      />
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="absolute top-4 right-4 flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand focus-visible:outline-2 focus-visible:outline-white"
      >
        <X className="size-6" aria-hidden="true" />
      </button>
    </div>,
    document.body,
  );
}
