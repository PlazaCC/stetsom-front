"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { toValidLatLng, type Bounds, type LatLng } from "@/lib/geocode";
import maplibregl, {
  type GeoJSONSource,
  type Map as MlMap,
  type Marker as MlMarker,
  type Popup as MlPopup,
} from "maplibre-gl";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getLocationsBounds,
  getMappableLocations,
  toFeatureCollection,
} from "./service-center-map-data";
import type { PartnerLocation } from "@/api/stetsom/model";

const SP_CENTER: [number, number] = [-46.6333, -23.5505];
const MAP_STYLE = "https://tiles.openfreemap.org/styles/bright";
const SOURCE_ID = "service-centers";
const CLUSTERS_LAYER = "service-center-clusters";
const CLUSTER_COUNT_LAYER = "service-center-cluster-count";
const POINTS_LAYER = "service-center-points";
const POINTS_HIT_LAYER = "service-center-points-hit";
const SELECTED_LAYER = "service-center-selected";
const CLUSTER_MAX_ZOOM = 12;
const SEARCH_PIN_CLASS =
  "size-4 rounded-full border-2 border-white bg-blue-500 shadow-md";

type MapStatus = "loading" | "ready" | "unavailable";

function isGpuInitializationError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === "GPUInitializationError" ||
      error.constructor.name === "GPUInitializationError")
  );
}

interface ServiceCenterMapProps {
  locations: PartnerLocation[];
  searchLocation: LatLng | null;
  selectedId: string | null;
  onSelectLocation: (id: string) => void;
  onBoundsChange?: (bounds: Bounds) => void;
  fitAllTrigger: number;
}

function buildPopupContent(loc: PartnerLocation): HTMLElement {
  const container = document.createElement("div");
  const name = document.createElement("strong");
  name.className = "text-sm";
  name.textContent = loc.name;
  container.appendChild(name);

  const lines = [
    loc.address,
    loc.city ? `${loc.city}, ${loc.state}` : undefined,
    loc.phone,
  ].filter((line): line is string => Boolean(line));

  for (const line of lines) {
    container.appendChild(document.createElement("br"));
    const span = document.createElement("span");
    span.className = "text-xs";
    span.textContent = line;
    container.appendChild(span);
  }

  return container;
}

function addDataLayers(
  map: MlMap,
  data: ReturnType<typeof toFeatureCollection>,
) {
  map.addSource(SOURCE_ID, {
    type: "geojson",
    data,
    cluster: true,
    clusterMaxZoom: CLUSTER_MAX_ZOOM,
    clusterRadius: 52,
    promoteId: "id",
  });

  map.addLayer({
    id: CLUSTERS_LAYER,
    type: "circle",
    source: SOURCE_ID,
    filter: ["has", "point_count"],
    paint: {
      "circle-color": "rgb(232, 19, 42)",
      "circle-radius": ["step", ["get", "point_count"], 20, 10, 24, 50, 30],
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 2,
    },
  });

  map.addLayer({
    id: CLUSTER_COUNT_LAYER,
    type: "symbol",
    source: SOURCE_ID,
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["Noto Sans Bold"],
      "text-size": 12,
      "text-allow-overlap": true,
    },
    paint: { "text-color": "#ffffff" },
  });

  map.addLayer({
    id: POINTS_HIT_LAYER,
    type: "circle",
    source: SOURCE_ID,
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#000000",
      "circle-opacity": 0,
      "circle-radius": 18,
    },
  });

  map.addLayer({
    id: POINTS_LAYER,
    type: "circle",
    source: SOURCE_ID,
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "rgb(232, 19, 42)",
      "circle-radius": 7,
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 2,
    },
  });

  map.addLayer({
    id: SELECTED_LAYER,
    type: "circle",
    source: SOURCE_ID,
    filter: ["==", ["get", "id"], ""],
    paint: {
      "circle-color": "rgb(18, 18, 18)",
      "circle-radius": 9,
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 3,
    },
  });
}

export function ServiceCenterMap({
  locations,
  searchLocation,
  selectedId,
  onSelectLocation,
  onBoundsChange,
  fitAllTrigger,
}: ServiceCenterMapProps) {
  const t = useTranslations("Support.serviceCenters");
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  const popupRef = useRef<MlPopup | null>(null);
  const searchMarkerRef = useRef<MlMarker | null>(null);
  const onSelectRef = useRef(onSelectLocation);
  const onBoundsRef = useRef(onBoundsChange);
  const locationMapRef = useRef(new Map<string, PartnerLocation>());
  const [status, setStatus] = useState<MapStatus>("loading");
  const mappable = useMemo(() => getMappableLocations(locations), [locations]);

  useEffect(() => {
    onSelectRef.current = onSelectLocation;
    onBoundsRef.current = onBoundsChange;
  });

  useEffect(() => {
    locationMapRef.current = new Map(
      locations.map((location) => [location.id, location]),
    );
  }, [locations]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let map: MlMap;
    try {
      map = new maplibregl.Map({
        container: containerRef.current,
        style: MAP_STYLE,
        center: SP_CENTER,
        zoom: 4,
        cooperativeGestures: true,
        locale: {
          "Map.Title": t("mapAriaLabel"),
          "NavigationControl.ZoomIn": t("zoomIn"),
          "NavigationControl.ZoomOut": t("zoomOut"),
          "NavigationControl.ResetBearing": t("resetBearing"),
          "Popup.Close": t("closePopup"),
          "CooperativeGesturesHandler.WindowsHelpText": t(
            "cooperativeGesturesWindows",
          ),
          "CooperativeGesturesHandler.MacHelpText": t("cooperativeGesturesMac"),
          "CooperativeGesturesHandler.MobileHelpText": t(
            "cooperativeGesturesMobile",
          ),
        },
      });
    } catch (error) {
      if (isGpuInitializationError(error)) {
        setTimeout(() => setStatus("unavailable"), 0);
        return;
      }
      throw error;
    }

    mapRef.current = map;
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right",
    );

    let hasLoaded = false;
    const emitBounds = () => {
      const bounds = map.getBounds();
      onBoundsRef.current?.({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      });
    };

    const handleError = (event: { error?: unknown }) => {
      if (isGpuInitializationError(event.error)) {
        setTimeout(() => setStatus("unavailable"), 0);
        return;
      }
      console.error(event.error);
      if (!hasLoaded) {
        setTimeout(() => setStatus("unavailable"), 0);
      }
    };

    map.on("error", handleError);
    map.on("moveend", emitBounds);
    map.on("load", () => {
      hasLoaded = true;
      addDataLayers(map, toFeatureCollection(mappable));
      setStatus("ready");
      const bounds = getLocationsBounds(mappable);
      if (bounds) {
        map.fitBounds(
          [
            [bounds.west, bounds.south],
            [bounds.east, bounds.north],
          ],
          { padding: 40, maxZoom: 8, duration: 0 },
        );
      } else {
        emitBounds();
      }
    });

    const setCursor = (cursor: string) => {
      map.getCanvas().style.cursor = cursor;
    };
    map.on("mouseenter", CLUSTERS_LAYER, () => setCursor("pointer"));
    map.on("mouseleave", CLUSTERS_LAYER, () => setCursor(""));
    map.on("mouseenter", POINTS_HIT_LAYER, () => setCursor("pointer"));
    map.on("mouseleave", POINTS_HIT_LAYER, () => setCursor(""));

    map.on("click", CLUSTERS_LAYER, async (event) => {
      const feature = map.queryRenderedFeatures(event.point, {
        layers: [CLUSTERS_LAYER],
      })[0];
      const clusterId = feature?.properties?.cluster_id;
      const coordinates =
        feature?.geometry?.type === "Point"
          ? feature.geometry.coordinates
          : null;
      const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
      if (source && clusterId != null && coordinates) {
        const zoom = await source.getClusterExpansionZoom(Number(clusterId));
        map.easeTo({ center: coordinates as [number, number], zoom });
      }
    });

    map.on("click", POINTS_HIT_LAYER, (event) => {
      const feature = map.queryRenderedFeatures(event.point, {
        layers: [POINTS_HIT_LAYER],
      })[0];
      const id = feature?.properties?.id;
      const coordinates =
        feature?.geometry?.type === "Point"
          ? feature.geometry.coordinates
          : null;
      const location =
        typeof id === "string" ? locationMapRef.current.get(id) : undefined;
      if (!location || !coordinates) return;

      popupRef.current?.remove();
      onSelectRef.current(location.id);
      popupRef.current = new maplibregl.Popup({ closeButton: true, offset: 18 })
        .setLngLat(coordinates as [number, number])
        .setDOMContent(buildPopupContent(location))
        .addTo(map);
    });

    return () => {
      popupRef.current?.remove();
      searchMarkerRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
    // The map is intentionally initialized once. Labels are fixed for the page locale.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== "ready") return;
    const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
    source?.setData(toFeatureCollection(mappable));
  }, [locations, mappable, status]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== "ready") return;
    map.setFilter(SELECTED_LAYER, ["==", ["get", "id"], selectedId ?? ""]);

    if (!selectedId) return;
    const location = locationMapRef.current.get(selectedId);
    const coordinates = location
      ? toValidLatLng(location.lat, location.lng)
      : null;
    if (coordinates) {
      map.flyTo({
        center: [coordinates.lng, coordinates.lat],
        zoom: Math.max(map.getZoom(), CLUSTER_MAX_ZOOM + 1),
        duration: 800,
      });
    }
  }, [selectedId, status]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== "ready") return;

    searchMarkerRef.current?.remove();
    searchMarkerRef.current = null;
    popupRef.current?.remove();

    if (!searchLocation) return;
    const element = document.createElement("div");
    element.className = SEARCH_PIN_CLASS;
    searchMarkerRef.current = new maplibregl.Marker({ element })
      .setLngLat([searchLocation.lng, searchLocation.lat])
      .addTo(map);
    map.flyTo({
      center: [searchLocation.lng, searchLocation.lat],
      zoom: 10,
      duration: 800,
    });
  }, [searchLocation, status]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== "ready" || fitAllTrigger === 0) return;
    const bounds = getLocationsBounds(mappable);
    if (!bounds) return;
    popupRef.current?.remove();
    map.fitBounds(
      [
        [bounds.west, bounds.south],
        [bounds.east, bounds.north],
      ],
      { padding: 40, maxZoom: 8, duration: 800 },
    );
  }, [fitAllTrigger, mappable, status]);

  return (
    <div className="relative h-75 w-full overflow-hidden rounded-2xl bg-muted sm:h-100 lg:h-150">
      <div ref={containerRef} className="size-full" />
      {status === "loading" && (
        <div
          className="absolute inset-0 animate-pulse bg-muted"
          aria-hidden="true"
        />
      )}
      {status === "unavailable" && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted px-6 text-center text-sm text-text-subtle">
          {t("mapUnavailable")}
        </div>
      )}
    </div>
  );
}
