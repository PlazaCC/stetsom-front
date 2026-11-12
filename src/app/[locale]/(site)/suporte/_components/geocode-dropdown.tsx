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

  const formatSuggestion = (suggestion: GeocodeSuggestion) => {
    const country = suggestion.country_code
      ? new Intl.DisplayNames([locale], { type: "region" }).of(
          suggestion.country_code,
        )
      : suggestion.country_name;
    const place = [suggestion.city, country].filter(Boolean).join(", ");

    if (suggestion.match_precision === "APPROXIMATE") {
      return [t("approximateArea"), place].filter(Boolean).join(" · ");
    }
    if (suggestion.kind === "POSTAL_CODE") {
      const label =
        suggestion.country_code === "BR"
          ? t("postalCodeBrazil")
          : t("postalCode");
      return [
        `${label} ${suggestion.postal_code ?? suggestion.displayName}`,
        place,
      ]
        .filter(Boolean)
        .join(" · ");
    }
    const kind =
      suggestion.kind === "REGION"
        ? t("locationTypeRegion")
        : t("locationTypeCity");
    return [suggestion.displayName, [kind, country].filter(Boolean).join(", ")]
      .filter(Boolean)
      .join(" · ");
  };

  if (query.trim().length < 2) return null;
  if (geocodeLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-xs text-icon-muted">
        <Loader2 size={12} className="animate-spin" />
        <span>{t("searchingCities")}</span>
      </div>
    );
  }
  if (suggestions.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-xs text-icon-muted">
        <X size={12} />
        <span>{t("noCitiesFound")}</span>
      </div>
    );
  }

  return (
    <div role="listbox" aria-label={t("searchSuggestionsLabel")}>
      {suggestions.map((suggestion, index) => {
        const label = formatSuggestion(suggestion);
        return (
          <button
            key={`${suggestion.id ?? suggestion.lat}-${suggestion.lng}-${index}`}
            type="button"
            role="option"
            aria-selected={false}
            aria-label={label}
            onClick={() => onSelect(suggestion)}
            className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
          >
            <Search size={12} className="mt-0.5 shrink-0 text-icon-muted" />
            <span className="min-w-0 truncate">{label}</span>
          </button>
        );
      })}
      <p className="border-t border-border px-3 py-1.5 text-[10px] text-text-subtle">
        {t("geonamesAttribution")}
      </p>
    </div>
  );
}
