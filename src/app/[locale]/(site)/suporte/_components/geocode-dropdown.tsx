"use client";

import type { GeocodeSuggestion } from "@/lib/geocode";
import { Loader2, Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

interface GeocodeDropdownProps {
  geocodeLoading: boolean;
  suggestions: GeocodeSuggestion[];
  query: string;
  onSelect: (suggestion: GeocodeSuggestion) => void;
}

export function GeocodeDropdown({
  geocodeLoading,
  suggestions,
  query,
  onSelect,
}: GeocodeDropdownProps) {
  const t = useTranslations("Support.serviceCenters");
  const locale = useLocale();

  if (query.length < 2) return null;

  if (geocodeLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-xs text-icon-muted">
        <Loader2 size={12} className="animate-spin" />
        <span>{t("searchingLocations")}</span>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-xs text-icon-muted">
        <X size={12} />
        <span>{t("noLocationsFound")}</span>
      </div>
    );
  }

  const countryNames = new Intl.DisplayNames([locale], { type: "region" });

  return suggestions.map((s, i) => (
    <button
      key={`${s.lat}-${s.lng}-${i}`}
      type="button"
      onClick={() => onSelect(s)}
      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
    >
      <Search size={12} className="shrink-0 text-icon-muted" />
      <span className="flex min-w-0 flex-col">
        <span>{s.displayName}</span>
        {s.countryCode && (
          <span className="text-xs text-text-subtle">
            {countryNames.of(s.countryCode) ?? s.countryCode}
          </span>
        )}
      </span>
    </button>
  ));
}
