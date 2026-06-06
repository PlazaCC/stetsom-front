"use client";

import { Container } from "@/components/ui/container";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { TimelineCheckpoint } from "./timeline-checkpoint";
import { TimelineProgressBar } from "./timeline-progress-bar";

type TimelineEvent = {
  id?: string;
  year: string;
  title: string;
  shortTitle?: string;
  description: string;
  image?: string;
  imageAlt?: string;
};

interface CompanyTimelineProps {
  events: TimelineEvent[];
  initialActiveIndex?: number;
}

export function CompanyTimeline({
  events,
  initialActiveIndex = 0,
}: CompanyTimelineProps) {
  const t = useTranslations("About");
  const safeInitialIndex = Math.min(
    Math.max(initialActiveIndex, 0),
    Math.max(events.length - 1, 0),
  );
  const [activeIndex, setActiveIndex] = useState(safeInitialIndex);

  const handlePrevious = useCallback(() => {
    if (!events.length) return;
    setActiveIndex((prev) => (prev - 1 + events.length) % events.length);
  }, [events.length]);

  const handleNext = useCallback(() => {
    if (!events.length) return;
    setActiveIndex((prev) => (prev + 1) % events.length);
  }, [events.length]);

  const handleCheckpointClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!events.length) {
        return;
      }

      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrevious, events.length]);

  if (!events.length) {
    return null;
  }

  const selectedIndex = Math.min(activeIndex, events.length - 1);
  const activeEvent = events[selectedIndex];
  const progressPercent =
    events.length <= 1 ? 0 : (selectedIndex / (events.length - 1)) * 100;

  return (
    <section className="relative bg-brand-dark py-20 overflow-hidden">
      <div className="absolute inset-0 bg-radial-dark-alt" />
      <Container className="relative z-10">
        <div className="space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex-1">
              <div className="mb-2 font-sans-condensed text-sm font-black uppercase tracking-wide text-brand">
                {t("timelineLabel")}
              </div>
              <h2 className="font-sans-condensed text-5xl font-black leading-none text-white lg:text-display-lg">
                {t("timelineTitle")
                  .split("\n")
                  .map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
              </h2>
              <p className="mt-4 max-w-md text-sm text-text-subtle-dark lg:text-base">
                {t("timelineDescription")}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePrevious}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-brand text-brand transition-all hover:bg-brand hover:text-white"
                aria-label={t("timelinePrevious")}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-brand text-brand transition-all hover:bg-brand hover:text-white"
                aria-label={t("timelineNext")}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative h-20">
              <TimelineProgressBar progressPercent={progressPercent} />

              <div className="relative w-full h-full">
                {events.map((event, index) => {
                  const leftPercent =
                    events.length === 1
                      ? 50
                      : (index / (events.length - 1)) * 100;
                  return (
                    <TimelineCheckpoint
                      key={event.id ?? index}
                      event={event}
                      index={index}
                      isActive={index === activeIndex}
                      leftPercent={leftPercent}
                      onClick={handleCheckpointClick}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative w-full aspect-video bg-surface-elevated rounded-sm overflow-hidden">
              {activeEvent.image ? (
                <Image
                  src={activeEvent.image}
                  alt={activeEvent.title}
                  fill
                  className="object-cover transition-opacity duration-500"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-text-subtle text-sm">
                  Sem imagem
                </div>
              )}
            </div>

            <div className="transition-all duration-500 space-y-4">
              <div>
                <h3 className="font-sans-condensed font-black text-display-xl lg:text-display-2xl text-brand leading-none mb-2">
                  {activeEvent.year}
                </h3>
                <h4 className="font-sans-condensed font-black text-[28px] lg:text-[32px] text-white uppercase">
                  {activeEvent.title}
                </h4>
              </div>

              <p className="text-base text-text-subtle-dark">
                {activeEvent.description}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
