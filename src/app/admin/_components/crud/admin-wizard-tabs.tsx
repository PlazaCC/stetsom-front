"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export interface AdminWizardTab {
  label: string;
}

interface AdminWizardTabsProps {
  tabs: AdminWizardTab[];
  activeIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

/**
 * In-page tab bar for the product wizard. Unlike the route-based `AdminTabs`,
 * these tabs switch the active panel via local state — any tab is reachable at
 * any time (free navigation), so there is no done/pending progression.
 */
export function AdminWizardTabs({
  tabs,
  activeIndex,
  onSelect,
  className,
}: AdminWizardTabsProps) {
  return (
    <div className={cn("flex items-center gap-4 lg:px-11.75", className)}>
      {tabs.map((tab, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(index)}
            className={cn(
              "relative flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span>{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId="tab-slider"
                className="absolute bottom-0 left-0 h-0.5 w-full bg-brand"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
