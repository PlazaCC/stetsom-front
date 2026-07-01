"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const SECTION_IDS = ["specifications", "related"] as const;

// Offset to account for the sticky nav height when computing active section
const SCROLL_OFFSET = 160;

export function StickySectionNav() {
  const t = useTranslations("ProductDetail");
  const [activeSection, setActiveSection] = useState<string>("overview");

  const sections = [
    { id: "overview", label: t("overview") },
    { id: "specifications", label: t("specifications") },
    { id: "related", label: t("related") },
  ] as const;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY < 200) {
        setActiveSection("overview");
        return;
      }

      // Walk sections bottom-up; first one whose top is at or above the
      // current scroll position (accounting for the sticky nav) is active.
      for (const id of [...SECTION_IDS].reverse()) {
        const el = document.getElementById(id);
        if (el && scrollY >= el.offsetTop - SCROLL_OFFSET) {
          setActiveSection(id);
          return;
        }
      }

      setActiveSection("overview");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    if (id === "overview") {
      window.scrollTo({ top: 0 });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 152;
    window.scrollTo({ top });
  };

  return (
    <div className="sticky top-16 z-40 w-full border-t border-zinc-200 bg-white">
      <div className="flex justify-center gap-5 px-5 py-4 lg:px-42.5">
        {sections.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => scrollTo(id)}
            className={cn(
              "relative pb-1 font-sans text-base font-medium tracking-wide uppercase transition-colors",
              activeSection === id
                ? "text-brand-dark"
                : "text-muted-foreground hover:text-brand-dark",
            )}
          >
            {label}
            {activeSection === id && (
              <motion.div
                layoutId="section-indicator"
                className="absolute bottom-0 left-0 h-0.5 w-full bg-brand-dark"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
