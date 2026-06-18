"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import type { PartnerLocation } from "@/api/stetsom/model";
import maplibregl, {
  type Map as MlMap,
  type Marker as MlMarker,
  type StyleSpecification,
} from "maplibre-gl";
import { useEffect, useRef } from "react";

// Geographic center of Brazil — initial view before results/geolocation load.
const BRAZIL_CENTER: [number, number] = [-51.9253, -14.235];

// Free OpenStreetMap raster tiles — no API token required. Swap the `tiles`
// URL for a provider style (Mapbox, MapTiler) if usage limits become an issue.

export const mapStyleLight = {
  version: 8,
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    "base-tiles": {
      type: "raster",
      tiles: ["https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution:
        "Map data &copy; <a target='_blank' href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors, © <a target='_blank' href=\"https://carto.com/attributions\">CARTO</a>",
    },
  },
  layers: [{ id: "base-map", type: "raster", source: "base-tiles" }],
};

const MAP_STYLE: StyleSpecification = {
  version: 8,
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    "base-tiles": {
      type: "raster",
      tiles: ["https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution:
        "Map data &copy; <a target='_blank' href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors, © <a target='_blank' href=\"https://carto.com/attributions\">CARTO</a>",
    },
  },
  layers: [{ id: "base-map", type: "raster", source: "base-tiles" }],
};

const PIN_CLASS =
  "size-5 cursor-pointer rounded-full border-2 border-white bg-brand shadow-md transition-transform hover:scale-110";
const USER_PIN_CLASS =
  "size-4 rounded-full border-2 border-white bg-blue-500 shadow-md";

type LatLng = { lat: number; lng: number };

interface ServiceCenterMapProps {
  locations: PartnerLocation[];
  userLocation: LatLng | null;
  selectedId: string | null;
  onSelectLocation: (id: string) => void;
}

export function ServiceCenterMap({
  locations,
  userLocation,
  selectedId,
  onSelectLocation,
}: ServiceCenterMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  const markersRef = useRef<Map<string, MlMarker>>(new Map());
  const userMarkerRef = useRef<MlMarker | null>(null);
  // Keep the latest callback without re-binding marker listeners on each render.
  const onSelectRef = useRef(onSelectLocation);
  useEffect(() => {
    onSelectRef.current = onSelectLocation;
  });

  // Initialize the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const markers = markersRef.current;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: BRAZIL_CENTER,
      zoom: 3.2,
      cooperativeGestures: true,
    });
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right",
    );
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markers.clear();
      userMarkerRef.current = null;
    };
  }, []);

  // Render a marker per location and fit the view to the visible set.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const marker of markersRef.current.values()) marker.remove();
    markersRef.current.clear();

    const withCoords = locations.filter(
      (loc) => loc.lat != null && loc.lng != null,
    );

    for (const loc of withCoords) {
      // MapLibre drives the wrapper's `transform` for positioning. The hover
      // scale lives on the inner button so it never fights that transform.
      const wrapper = document.createElement("div");
      const el = document.createElement("button");
      el.type = "button";
      el.className = PIN_CLASS;
      el.setAttribute("aria-label", loc.name);
      el.addEventListener("click", (event) => {
        event.stopPropagation();
        onSelectRef.current(loc.id);
      });
      wrapper.appendChild(el);

      const marker = new maplibregl.Marker({ element: wrapper })
        .setLngLat([loc.lng as number, loc.lat as number])
        .addTo(map);
      markersRef.current.set(loc.id, marker);
    }

    if (withCoords.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      for (const loc of withCoords) {
        bounds.extend([loc.lng as number, loc.lat as number]);
      }
      if (userLocation) bounds.extend([userLocation.lng, userLocation.lat]);
      map.fitBounds(bounds, { padding: 64, maxZoom: 10, duration: 600 });
    }
    // userLocation intentionally excluded — its own effect handles recentering.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations]);

  // Place / move the user marker and recenter when geolocation resolves.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation) return;

    const lngLat: [number, number] = [userLocation.lng, userLocation.lat];
    if (userMarkerRef.current) {
      userMarkerRef.current.setLngLat(lngLat);
    } else {
      const el = document.createElement("div");
      el.className = USER_PIN_CLASS;
      userMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat(lngLat)
        .addTo(map);
    }
    map.flyTo({ center: lngLat, zoom: 9, duration: 800 });
  }, [userLocation]);

  // Highlight the selected pin and pan the map so it sits at the center.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const [id, marker] of markersRef.current.entries()) {
      const el = marker.getElement().firstElementChild;
      if (!el) continue;
      const selected = id === selectedId;
      el.classList.toggle("bg-brand-dark", selected);
      el.classList.toggle("ring-2", selected);
      el.classList.toggle("ring-brand-dark", selected);
    }

    if (!selectedId) return;
    const marker = markersRef.current.get(selectedId);
    if (!marker) return;
    map.flyTo({
      center: marker.getLngLat(),
      zoom: Math.max(map.getZoom(), 12),
      duration: 1000,
      essential: true,
    });
  }, [selectedId]);

  return (
    <div
      ref={containerRef}
      className="h-100 w-full overflow-hidden rounded-2xl bg-muted lg:h-150"
    />
  );
}
