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
        "relative h-full w-full cursor-pointer overflow-hidden rounded-2xl transition-all duration-500",
        isActive &&
          "ring-1 ring-[length:1px] ring-[linear-gradient(156deg,rgba(96,93,93,1)_0%,rgba(175,174,174,1)_100%)]",
      )}
    >
      {/* Placeholder — replace with Image when API images are available */}
      <div className="absolute inset-0 flex items-center justify-center bg-surface-elevated">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          className="text-icon-muted"
        >
          <path
            d="M16 6v20M6 16h20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* TODO: Restore when API images arrive
      {event.image ? (
        <Image
          src={event.image}
          alt={event.imageAlt ?? event.title}
          fill
          className="object-cover"
          sizes={isActive ? "421px" : "292px"}
        />
      ) : (
        <div className="absolute inset-0 bg-surface-elevated" />
      )}


      {/* Year + Title overlay — positioned top-left */}
      <div className="absolute top-2 right-[18px] left-[18px] z-10 flex flex-col items-start gap-[-5px]">
        <span
          className={cn(
            "text-left font-sans-condensed text-[40px] leading-none font-black transition-colors duration-500",
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

      {/* Description — visible only on active card */}
      {isActive && (
        <p
          className={cn(
            "absolute right-[14px] bottom-[16px] left-[14px] z-10 text-left text-sm leading-normal text-text-subtle-dark transition-opacity duration-500",
          )}
        >
          {event.description}
        </p>
      )}

      {/* Bottom fade gradient for description readability */}
      {isActive && (
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-[5] h-24 bg-linear-to-t from-black/60 to-transparent" />
      )}
    </button>
  );
}
