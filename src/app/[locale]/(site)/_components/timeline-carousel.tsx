"use client";

import { Container } from "@/components/ui/container";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  TimelineCarouselCard,
  type TimelineCarouselEvent,
} from "./timeline-carousel-card";
import { Progress } from "@/components/ui/progress";

interface TimelineCarouselProps {
  events: TimelineCarouselEvent[];
  initialActiveIndex?: number;
}

export function TimelineCarousel({
  events,
  initialActiveIndex = 0,
}: TimelineCarouselProps) {
  const t = useTranslations("About");

  const safeInitial = Math.min(
    Math.max(initialActiveIndex, 0),
    Math.max(events.length - 1, 0),
  );
  const [activeIndex, setActiveIndex] = useState(safeInitial);

  // Container measurement
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // --- Derived values ---
  const totalEvents = events.length;
  const isDesktop = containerWidth >= 1024;

  // Card sizes
  const cardActiveW = isDesktop ? 421 : 280;
  const cardInactiveW = isDesktop ? 292 : 200;
  const cardGap = isDesktop ? 36 : 12;
  const cardActiveH = 373;
  const cardInactiveH = isDesktop ? 297 : 260;
  const step = cardInactiveW + cardGap;

  // Translate: desktop = edge-stop left-aligned; mobile = centered, no edge-stop
  const edgeStopIndex = isDesktop ? Math.max(totalEvents - 3, 0) : 0;
  const clampedIdx = isDesktop
    ? Math.min(activeIndex, edgeStopIndex)
    : activeIndex;
  const stripOffset = isDesktop
    ? -clampedIdx * step
    : containerWidth > 0
      ? containerWidth / 2 - cardActiveW / 2 - clampedIdx * step
      : 0;

  // --- Navigation ---
  const goTo = useCallback(
    (index: number) => {
      if (!totalEvents) return;
      setActiveIndex(Math.min(Math.max(index, 0), totalEvents - 1));
    },
    [totalEvents],
  );

  const handlePrevious = useCallback(() => {
    if (!totalEvents) return;
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  }, [totalEvents]);

  const handleNext = useCallback(() => {
    if (!totalEvents) return;
    setActiveIndex((prev) => Math.min(prev + 1, totalEvents - 1));
  }, [totalEvents]);

  // --- Keyboard ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!totalEvents) return;
      if (e.key === "ArrowLeft" && activeIndex > 0) handlePrevious();
      else if (e.key === "ArrowRight" && activeIndex < totalEvents - 1)
        handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrevious, activeIndex, totalEvents]);

  // --- Empty state ---
  if (!totalEvents) return null;

  return (
    <section className="relative overflow-hidden bg-brand-dark py-12">
      <div className="bg-radial-dark-alt absolute inset-0" />
      <Container className="relative z-10">
        <div className="flex flex-col gap-9">
          {/* Header */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Left: label + title */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <span className="inline-block h-px w-6 bg-brand" />
                <span className="font-sans-condensed text-base font-normal text-brand uppercase">
                  {t("timelineLabel")}
                </span>
              </div>
              <h2 className="font-sans-condensed text-[40px] leading-none font-black text-white">
                {t("timelineTitle")
                  .split("\n")
                  .map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
              </h2>
            </div>

            {/* Right: description + nav */}
            <div className="flex flex-col items-end gap-4 lg:justify-center">
              <p className="max-w-[335px] text-sm leading-normal text-text-subtle-dark">
                {t("timelineDescription")}
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevious}
                  disabled={activeIndex === 0}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-[#323232] bg-[#1B1B1B] transition-colors hover:border-brand hover:bg-brand disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label={t("timelinePrevious")}
                >
                  <ChevronLeft size={18} className="text-[#828282]" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={activeIndex === totalEvents - 1}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-[#323232] bg-[#1B1B1B] transition-colors hover:border-brand hover:bg-brand disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label={t("timelineNext")}
                >
                  <ChevronRight size={18} className="text-[#828282]" />
                </button>
              </div>
            </div>
          </div>

          {/* Cards — single unified strip for desktop + mobile */}
          <div className="py-6">
            <div
              ref={containerRef}
              className="relative"
              style={{ height: cardActiveH }}
            >
              <div className="absolute inset-0 overflow-visible">
                <motion.div
                  className="flex"
                  style={{ gap: cardGap }}
                  animate={{ x: stripOffset }}
                  transition={{ type: "spring", stiffness: 400, damping: 40 }}
                >
                  {events.map((event, index) => {
                    const isActive = index === activeIndex;
                    return (
                      <motion.div
                        key={event.id ?? index}
                        className="shrink-0"
                        animate={{
                          width: isActive ? cardActiveW : cardInactiveW,
                          height: isActive ? cardActiveH : cardInactiveH,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 40,
                        }}
                      >
                        <TimelineCarouselCard
                          event={event}
                          isActive={isActive}
                          onClick={() => goTo(index)}
                        />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          {totalEvents > 1 && (
            <Progress
              value={(activeIndex / (totalEvents - 1)) * 100}
              className="flex-col items-stretch gap-0 px-[15px]"
              trackClassName="h-0.5 rounded-none bg-[#616161]"
              indicatorClassName="bg-brand"
            />
          )}
        </div>
      </Container>
    </section>
  );
}
