"use client";

import type { PartnerLocation } from "@/api/stetsom/model";
import { PublicEmptyState } from "@/components/ui/public-empty-state";
import { cn } from "@/lib/utils";
import {
  type Bounds,
  type GeocodeSuggestion,
  type LatLng,
  extractCepDigits,
  formatCepInput,
  isLikelyCep,
  toValidLatLng,
} from "@/lib/geocode";
import { useVirtualizer } from "@tanstack/react-virtual";
import { LocateFixed, MapPin, Search, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GeocodeDropdown } from "./geocode-dropdown";
import { getMappableLocations } from "./service-center-map-data";

const ServiceCenterMap = dynamic(
  () => import("./service-center-map").then((m) => m.ServiceCenterMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-75 w-full animate-pulse rounded-2xl bg-muted sm:h-100 lg:h-150" />
    ),
  },
);

/**
 * `denied` is the user refusing; `unavailable` covers a device with no fix and a
 * page served over plain HTTP, where the API rejects outright; `timeout` is a fix
 * that never arrived. They were previously collapsed into one "permission denied"
 * message, which misreported the last two.
 */
type GeoStatus =
  | "idle"
  | "loading"
  | "denied"
  | "unavailable"
  | "timeout"
  | "unsupported";

const GEO_OPTS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 10000,
  maximumAge: 300000,
};

interface ServiceCentersExplorerProps {
  serviceCenters: PartnerLocation[];
}

export function ServiceCentersExplorer({
  serviceCenters,
}: ServiceCentersExplorerProps) {
  const t = useTranslations("Support.serviceCenters");

  const [query, setQuery] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<GeocodeSuggestion | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [geocodeLoading, setGeocodeLoading] = useState(false);
  const [isCepMode, setIsCepMode] = useState(false);
  const [viewportBounds, setViewportBounds] = useState<Bounds | null>(null);
  const [fitAllCount, setFitAllCount] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleGeoSuccess = (pos: GeolocationPosition) => {
    setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    setSelectedLocation({
      displayName: t("currentLocation"),
      city: "",
      state: "",
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    });
    setQuery(t("currentLocation"));
    setGeoStatus("idle");
  };
  const handleGeoError = (err: GeolocationPositionError) => {
    if (err.code === 1) {
      setGeoStatus("denied");
      return;
    }
    if (err.code === 3) {
      setGeoStatus("timeout");
      return;
    }
    setGeoStatus("unavailable");
  };

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      setGeoStatus("unsupported");
      return;
    }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      handleGeoSuccess,
      handleGeoError,
      GEO_OPTS,
    );
  };

  const geoMessage =
    geoStatus === "denied"
      ? t("locationDenied")
      : geoStatus === "timeout"
        ? t("locationTimeout")
        : geoStatus === "unavailable"
          ? t("locationUnavailable")
          : geoStatus === "unsupported"
            ? t("locationUnsupported")
            : null;

  const cepDigits = extractCepDigits(query);
  const cepComplete = cepDigits.length === 8;
  const missingCount = 8 - cepDigits.length;
  const showDropdown =
    suggestionsOpen || geocodeLoading || (isCepMode && cepDigits.length > 0);

  const fetchGeocode = useCallback(async (q: string) => {
    const raw = extractCepDigits(q);
    const searchQuery = isLikelyCep(q) && raw.length >= 3 ? raw : q;
    if (searchQuery.trim().length < (isLikelyCep(q) ? 3 : 2)) {
      setSuggestions([]);
      setSuggestionsOpen(false);
      return;
    }
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setGeocodeLoading(true);
    try {
      const res = await fetch(
        `/api/bff/geocode/search?q=${encodeURIComponent(searchQuery)}`,
        { signal: controller.signal },
      );
      if (!res.ok) {
        setSuggestions([]);
        return;
      }
      const data: { results: GeocodeSuggestion[] } = await res.json();
      setSuggestions(data.results);
      setSuggestionsOpen(true);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setSuggestions([]);
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
        setGeocodeLoading(false);
      }
    }
  }, []);

  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleInputChange = (raw: string) => {
    abortControllerRef.current?.abort();
    const cepMode = isLikelyCep(raw) && raw !== t("currentLocation");
    setIsCepMode(cepMode);

    if (cepMode) {
      const formatted = formatCepInput(raw);
      setQuery(formatted);
    } else {
      setQuery(raw);
    }

    setSelectedLocation(null);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    const minLength = cepMode ? 3 : 2;
    if (
      raw.replace(/\D/g, "").length >= minLength ||
      (!cepMode && raw.length >= minLength)
    ) {
      debounceTimer.current = setTimeout(() => fetchGeocode(raw), 300);
    } else {
      setSuggestions([]);
      setSuggestionsOpen(false);
    }
  };

  const selectSuggestion = (suggestion: GeocodeSuggestion) => {
    setQuery(suggestion.displayName);
    setIsCepMode(false);
    setSelectedLocation(suggestion);
    setSelectedId(null);
    setSuggestionsOpen(false);
    resetScroll();
  };

  const searchLocation: LatLng | null = useMemo(() => {
    if (selectedLocation && !selectedLocation.city && userLocation)
      return userLocation;
    if (selectedLocation) {
      return toValidLatLng(selectedLocation.lat, selectedLocation.lng);
    }
    return null;
  }, [selectedLocation, userLocation]);

  // Location search only navigates the map. The map owns the viewport filter;
  // therefore the full active collection must remain available to it regardless
  // of the selected city, CEP, or current user location.
  const mappable = useMemo(
    () => getMappableLocations(serviceCenters),
    [serviceCenters],
  );

  const visibleFiltered: PartnerLocation[] = useMemo(() => {
    if (!viewportBounds) return mappable;
    return mappable.filter(
      (p) =>
        p.lat >= viewportBounds.south &&
        p.lat <= viewportBounds.north &&
        p.lng >= viewportBounds.west &&
        p.lng <= viewportBounds.east,
    );
  }, [mappable, viewportBounds]);

  const reordered: PartnerLocation[] = useMemo(() => {
    if (selectedId) {
      const item = visibleFiltered.find((p) => p.id === selectedId);
      return item ? [item] : visibleFiltered;
    }
    return visibleFiltered;
  }, [visibleFiltered, selectedId]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: reordered.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 100,
    overscan: 8,
    getItemKey: (index) => reordered[index].id,
  });

  const resetScroll = () => rowVirtualizer.scrollToOffset(0);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      abortControllerRef.current?.abort();
    };
  }, []);

  const virtualRows = rowVirtualizer.getVirtualItems();

  if (serviceCenters.length === 0) {
    return (
      <PublicEmptyState
        icon={MapPin}
        title={t("emptyNetworkTitle")}
        description={t("emptyNetworkDescription")}
        className="mt-8 min-h-225 lg:min-h-150"
      />
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:gap-8">
      {/* On phones the map leads: the list is filtered by the visible area, so
          burying the map under a tall list hides the control that drives it.
          Desktop keeps the list on the left via `lg:order-*`. */}
      <div className="order-2 flex h-100 flex-col gap-3 lg:order-1 lg:h-150 lg:w-96">
        <div className="relative">
          <div className="flex h-10 items-center gap-2 border border-border bg-white px-3">
            <Search size={14} className="shrink-0 text-icon-muted" />
            <input
              ref={inputRef}
              type="text"
              inputMode={isCepMode ? "numeric" : "text"}
              value={query}
              onChange={(e) => {
                handleInputChange(e.target.value);
                resetScroll();
              }}
              onFocus={() => {
                if (suggestions.length > 0 || isCepMode)
                  setSuggestionsOpen(true);
              }}
              placeholder={t("searchLocationPlaceholder")}
              className="flex-1 border-none bg-transparent text-sm outline-none placeholder:text-icon-muted"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSelectedLocation(null);
                  setSuggestions([]);
                  setSuggestionsOpen(false);
                  setIsCepMode(false);
                  if (debounceTimer.current) {
                    clearTimeout(debounceTimer.current);
                    debounceTimer.current = undefined;
                  }
                  abortControllerRef.current?.abort();
                  inputRef.current?.focus();
                }}
                aria-label={t("clearSearch")}
                className="flex min-h-11 min-w-11 items-center justify-center"
              >
                <X size={14} className="text-icon-muted" />
              </button>
            )}
          </div>

          {showDropdown && (
            <div className="absolute top-full right-0 left-0 z-10 mt-1 max-h-48 overflow-y-auto border border-border bg-white shadow-lg">
              <GeocodeDropdown
                isCepMode={isCepMode}
                geocodeLoading={geocodeLoading}
                cepComplete={cepComplete}
                missingCount={missingCount}
                suggestions={suggestions}
                query={query}
                onSelect={(s) => {
                  selectSuggestion(s);
                  resetScroll();
                }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={requestLocation}
            disabled={geoStatus === "loading"}
            className="flex items-center gap-1.5 text-2xs font-bold tracking-[0.6px] text-brand uppercase transition-colors hover:text-brand-dark"
          >
            <LocateFixed size={14} className="shrink-0" />
            {geoStatus === "loading" ? t("locating") : t("useMyLocation")}
          </button>
          <span className="text-2xs text-text-subtle">
            {t("resultsCount", {
              count: visibleFiltered.length,
            })}
          </span>
        </div>

        {geoMessage && (
          <p className="text-2xs text-text-subtle">{geoMessage}</p>
        )}

        {mappable.length === 0 ? (
          <p className="border border-border bg-white px-4 py-3 text-sm text-text-subtle">
            {t("noResults")}
          </p>
        ) : visibleFiltered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 border border-border bg-white px-6 py-12">
            <Search size={48} className="text-icon-muted" />
            <p className="text-center text-sm leading-relaxed text-text-subtle">
              {t("emptyStateHint")}
            </p>
          </div>
        ) : (
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
            <div
              className="relative w-full"
              style={{ height: rowVirtualizer.getTotalSize() }}
            >
              {virtualRows.map((virtualRow) => {
                const posto = reordered[virtualRow.index];
                return (
                  <div
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    className="absolute top-0 left-0 w-full pb-2"
                    style={{ transform: `translateY(${virtualRow.start}px)` }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(posto.id);
                      }}
                      className={cn(
                        "flex w-full flex-col gap-0.5 border bg-white px-4 py-3 text-left transition-colors",
                        selectedId === posto.id
                          ? "border-brand"
                          : "border-border hover:border-brand/50",
                      )}
                    >
                      <p className="font-sans text-sm font-semibold text-brand-dark">
                        {posto.name}
                      </p>
                      <p className="font-sans text-xs text-text-subtle">
                        {posto.address}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        {posto.phone && (
                          <p className="font-sans text-xs text-brand">
                            {posto.phone}
                          </p>
                        )}
                        {posto.phone2 && (
                          <p className="font-sans text-xs text-text-subtle">
                            {posto.phone2}
                          </p>
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
            {selectedId ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedId(null);
                  setFitAllCount((c) => c + 1);
                }}
                className="flex w-full items-center justify-center gap-1.5 border border-dashed border-border bg-white px-4 py-2 text-xs text-brand transition-colors hover:text-brand-dark"
              >
                {t("showAll")}
              </button>
            ) : null}
          </div>
        )}
      </div>

      <div className="order-1 flex-1 lg:order-2">
        <ServiceCenterMap
          locations={mappable}
          searchLocation={searchLocation}
          selectedId={selectedId}
          onSelectLocation={(id) => {
            setSelectedId(id);
          }}
          onBoundsChange={setViewportBounds}
          fitAllTrigger={fitAllCount}
        />
      </div>
    </div>
  );
}
