"use client";

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
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative h-full w-full cursor-pointer overflow-hidden rounded-sm transition-all duration-500 lg:rounded-2xl",
        isActive &&
          "ring-[0.8px] ring-[linear-gradient(156deg,rgba(96,93,93,1)_0%,rgba(175,174,174,1)_100%)] lg:ring-[1px]",
      )}
    >
      {/* Image or fallback */}
      <div className="absolute inset-0 bg-surface-elevated">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.imageAlt ?? event.title}
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

      <div className="absolute top-2 right-4.5 left-4.5 z-10 flex flex-col items-start gap-[-5px]">
        <span
          className={cn(
            "text-left font-sans-condensed text-display-sm leading-none font-black transition-colors duration-500",
            isActive ? "text-brand" : "text-[#980313]/60",
          )}
          style={isActive ? { WebkitTextStroke: "1px #121212" } : undefined}
        >
          {event.year}
        </span>
        <span
          className={cn(
            "text-left font-sans-condensed text-[30px] leading-tight font-black uppercase transition-all duration-500",
            isActive ? "text-white" : "text-white/40",
          )}
        >
          {event.title}
        </span>
      </div>

      {isActive && (
        <p className="absolute right-3.5 bottom-4 left-3.5 z-10 text-left text-sm leading-normal text-text-subtle-dark transition-opacity duration-500">
          {event.description}
        </p>
      )}

      {isActive && (
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-5 h-24 bg-linear-to-t from-black/60 to-transparent" />
      )}
    </button>
  );
}
