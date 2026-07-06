"use client";

import type { PartnerLocation } from "@/api/stetsom/model";
import { PartnerLocationType } from "@/api/stetsom/model";
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { LocateFixed, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

const ServiceCenterMap = dynamic(
  () => import("./service-center-map").then((m) => m.ServiceCenterMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-100 w-full animate-pulse rounded-2xl bg-muted lg:h-150" />
    ),
  },
);

const TYPE_FILTERS = [
  PartnerLocationType.SERVICE_CENTER,
  PartnerLocationType.REPRESENTATIVE,
] as const;

type LatLng = { lat: number; lng: number };
type GeoStatus = "idle" | "loading" | "denied";

const GEO_OPTS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 10000,
  maximumAge: 300000,
};

interface ServiceCentersExplorerProps {
  serviceCenters: PartnerLocation[];
}

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

function haversineKm(a: LatLng, b: LatLng) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function ServiceCentersExplorer({
  serviceCenters,
}: ServiceCentersExplorerProps) {
  const t = useTranslations("Support.serviceCenters");

  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<PartnerLocationType | null>(
    null,
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");

  const scrollRef = useRef<HTMLDivElement>(null);
  const prevSelectedRef = useRef<string | null>(null);

  const handleGeoSuccess = (pos: GeolocationPosition) => {
    setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    setGeoStatus("idle");
  };
  const handleGeoError = () => setGeoStatus("denied");

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      setGeoStatus("denied");
      return;
    }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      handleGeoSuccess,
      handleGeoError,
      GEO_OPTS,
    );
  };

  // Ask for the user's location on mount to surface nearby results. State is
  // only set from the async geolocation callbacks, never synchronously here.
  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      handleGeoSuccess,
      handleGeoError,
      GEO_OPTS,
    );
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = serviceCenters.filter((p) => {
      if (activeType && p.type !== activeType) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.zip.toLowerCase().includes(q)
      );
    });

    if (!userLocation) return base;

    return [...base].sort((a, b) => {
      const da =
        a.lat != null && a.lng != null
          ? haversineKm(userLocation, { lat: a.lat, lng: a.lng })
          : Number.POSITIVE_INFINITY;
      const db =
        b.lat != null && b.lng != null
          ? haversineKm(userLocation, { lat: b.lat, lng: b.lng })
          : Number.POSITIVE_INFINITY;
      return da - db;
    });
  }, [serviceCenters, query, activeType, userLocation]);

  // Locations with coordinates feed the map pins; mirror the active filters.
  const mappable = useMemo(
    () => filtered.filter((p) => p.lat != null && p.lng != null),
    [filtered],
  );

  // React Compiler can't memoize TanStack Virtual's returned functions; opting
  // this hook out is expected and safe — its output is only used locally here.
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 100,
    overscan: 8,
    getItemKey: (index) => filtered[index].id,
  });

  const resetScroll = () => rowVirtualizer.scrollToOffset(0);

  // Scroll the selected card into view, but only when the selection itself
  // changes (e.g. a pin click) — not on every filter/sort change.
  useEffect(() => {
    if (selectedId && selectedId !== prevSelectedRef.current) {
      const index = filtered.findIndex((p) => p.id === selectedId);
      if (index >= 0) rowVirtualizer.scrollToIndex(index, { align: "auto" });
    }
    prevSelectedRef.current = selectedId;
  }, [selectedId, filtered, rowVirtualizer]);

  const virtualRows = rowVirtualizer.getVirtualItems();

  return (
    <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:gap-8">
      <div className="flex h-125 flex-col gap-3 lg:h-150 lg:w-96">
        <div className="flex h-10 items-center gap-2 border border-border bg-white px-3">
          <MapPin size={14} className="shrink-0 text-icon-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetScroll();
            }}
            placeholder={t("searchPlaceholder")}
            className="flex-1 border-none bg-transparent text-sm outline-none placeholder:text-icon-muted"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          {TYPE_FILTERS.map((type) => {
            const active = activeType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setActiveType(active ? null : type);
                  resetScroll();
                }}
                className="flex items-center gap-2 text-sm"
              >
                <span
                  className={cn(
                    "size-3 rounded-full border-2 transition-colors",
                    active
                      ? "border-brand bg-brand"
                      : "border-icon-muted bg-transparent",
                  )}
                />
                <span
                  className={cn(
                    active
                      ? "font-semibold text-brand-dark"
                      : "text-text-subtle",
                  )}
                >
                  {type === PartnerLocationType.SERVICE_CENTER
                    ? t("typeServiceCenter")
                    : t("typeRepresentative")}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={requestLocation}
            className="flex items-center gap-1.5 text-2xs font-bold tracking-[0.6px] text-brand uppercase transition-colors hover:text-brand-dark"
          >
            <LocateFixed size={14} className="shrink-0" />
            {geoStatus === "loading" ? t("locating") : t("useMyLocation")}
          </button>
          <span className="text-2xs text-text-subtle">
            {t("resultsCount", { count: filtered.length })}
          </span>
        </div>

        {geoStatus === "denied" && (
          <p className="text-2xs text-text-subtle">{t("locationDenied")}</p>
        )}

        {filtered.length === 0 ? (
          <p className="border border-border bg-white px-4 py-3 text-sm text-text-subtle">
            {t("noResults")}
          </p>
        ) : (
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
            <div
              className="relative w-full"
              style={{ height: rowVirtualizer.getTotalSize() }}
            >
              {virtualRows.map((virtualRow) => {
                const posto = filtered[virtualRow.index];
                const distance =
                  userLocation && posto.lat != null && posto.lng != null
                    ? haversineKm(userLocation, {
                        lat: posto.lat,
                        lng: posto.lng,
                      })
                    : null;
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
                      onClick={() => setSelectedId(posto.id)}
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
                      {distance != null && (
                        <p className="font-sans text-2xs tracking-wide text-icon-muted uppercase">
                          {t("distanceAway", { km: distance.toFixed(1) })}
                        </p>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1">
        <ServiceCenterMap
          locations={mappable}
          userLocation={userLocation}
          selectedId={selectedId}
          onSelectLocation={setSelectedId}
        />
      </div>
    </div>
  );
}
