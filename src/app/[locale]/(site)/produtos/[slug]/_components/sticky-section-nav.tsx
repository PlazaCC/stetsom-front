"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const SECTION_IDS = ["specifications", "related"] as const;

export function StickySectionNav() {
  const t = useTranslations("ProductDetail");
  const [activeSection, setActiveSection] = useState<string>("overview");

  const sections = [
    { id: "overview", label: t("overview") },
    { id: "specifications", label: t("specifications") },
    { id: "related", label: t("related") },
  ] as const;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-112px 0px -60% 0px", threshold: 0 },
    );

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    // "overview" has no section element — it represents the top of the page.
    const handleScroll = () => {
      if (window.scrollY < 200) setActiveSection("overview");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavClick =
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (id === "overview") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

  return (
    <div className="sticky top-22 z-40 w-full border-t border-zinc-200 bg-white">
      <div className="flex justify-center gap-5 px-5 py-4 lg:px-42.5">
        {sections.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={handleNavClick(id)}
            className={cn(
              "border-b-2 pb-1 font-sans text-base font-medium tracking-wide uppercase transition-colors",
              activeSection === id
                ? "border-brand-dark text-brand-dark"
                : "border-transparent text-muted-foreground hover:text-brand-dark",
            )}
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
