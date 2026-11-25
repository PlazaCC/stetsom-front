"use client";

import { RichText } from "@/components/editor/block-text/rich-text";

import { cn } from "@/lib/utils";
import Image from "next/image";

export type TimelineCarouselEvent = {
  id?: string;
  year: string;
  title: string;
  shortTitle?: string;
  description: string;
  image?: string;
  imageAlt?: string;
};

interface TimelineCarouselCardProps {
  event: TimelineCarouselEvent;
  isActive: boolean;
  onClick: () => void;
}

export function TimelineCarouselCard({
  event,
  isActive,
  onClick,
}: TimelineCarouselCardProps) {
  return (
    <div
      className={cn(
        "relative h-full w-full cursor-pointer overflow-hidden rounded-sm transition-all duration-500 lg:rounded-2xl",
        isActive &&
          "ring-[0.8px] ring-[linear-gradient(156deg,rgba(96,93,93,1)_0%,rgba(175,174,174,1)_100%)] lg:ring-[1px]",
      )}
    >
      <button
        type="button"
        aria-label={event.title.replace(/<[^>]*>/g, " ")}
        onClick={onClick}
        className="absolute inset-0 z-10"
      />
      {/* Image or fallback */}
      <div className="absolute inset-0 bg-surface-elevated">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.imageAlt ?? event.title.replace(/<[^>]*>/g, " ")}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 335px, 421px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M16 6v20M6 16h20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Gradient overlay for image readability */}
      {event.image && (
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
      )}

      {/* Dark overlay on active card for extra legibility */}
      {isActive && (
        <div className="pointer-events-none absolute inset-0 bg-black/40" />
      )}

      <div className="pointer-events-none absolute top-2 right-4.5 left-4.5 z-20 flex flex-col items-start gap-[-5px] [&_a]:pointer-events-auto">
        <span
          className={cn(
            "text-left font-sans-condensed text-display-sm leading-none font-black transition-colors duration-500",
            isActive ? "text-brand" : "text-[#980313]/60",
          )}
          // A centred stroke drawn over the fill shows the variable font's
          // overlapping contours as jagged seams. Painting the stroke first
          // lets the fill cover its inner half: a 2px stroke leaves a clean
          // 1px outline.
          style={
            isActive
              ? { WebkitTextStroke: "2px #121212", paintOrder: "stroke fill" }
              : undefined
          }
        >
          {event.year}
        </span>
        <div
          className={cn(
            "text-left font-sans-condensed text-[30px] leading-tight font-black uppercase transition-all duration-500",
            isActive ? "text-white" : "text-white/40",
          )}
        >
          <RichText content={event.title} />
        </div>
      </div>

      {isActive && (
        <RichText
          className="pointer-events-none absolute right-3.5 bottom-4 left-3.5 z-20 text-left text-sm leading-normal text-text-subtle-dark transition-opacity duration-500 [&_a]:pointer-events-auto"
          content={event.description}
        />
      )}

      {isActive && (
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-5 h-24 bg-linear-to-t from-black/60 to-transparent" />
      )}
    </div>
  );
}
