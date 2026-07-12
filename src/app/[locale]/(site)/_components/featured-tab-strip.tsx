"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

type FeaturedTab = {
  id: string;
  label: string;
  categorySlug?: string;
};

interface FeaturedTabStripProps {
  tabs: FeaturedTab[];
  activeTab: FeaturedTab;
  onSelect: (tab: FeaturedTab) => void;
  ctaHref: string;
  ctaLabel: string;
}

export function FeaturedTabStrip({
  tabs,
  activeTab,
  onSelect,
  ctaHref,
  ctaLabel,
}: FeaturedTabStripProps) {
  return (
    <>
      {tabs.length > 1 && (
        <div
          role="tablist"
          className="inline-flex items-center gap-0 overflow-x-auto rounded-lg bg-muted p-1"
        >
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              role="tab"
              onClick={() => onSelect(tab)}
              aria-selected={activeTab.id === tab.id}
              className={cn(
                "shrink-0 rounded-md px-3 py-1.5 text-center font-sans text-sm leading-5 font-medium transition-all",
                activeTab.id === tab.id
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
      <Link
        href={ctaHref}
        className="mb-2.5 ml-4 inline-flex items-center gap-2 px-2 font-sans-condensed text-base font-medium text-brand"
      >
        <span>{ctaLabel}</span>
        <ArrowRight className="inline-block size-4" strokeWidth={2.5} />
      </Link>
    </>
  );
}
