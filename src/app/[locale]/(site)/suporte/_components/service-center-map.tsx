"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import type { PartnerLocation } from "@/api/stetsom/model";
import maplibregl, {
  type Map as MlMap,
  type Marker as MlMarker,
  type Popup as MlPopup,
} from "maplibre-gl";
import { useEffect, useRef } from "react";

const SP_CENTER: [number, number] = [-46.6333, -23.5505];

const MAP_STYLE = "https://tiles.openfreemap.org/styles/bright";

const PIN_CLASS =
  "size-5 cursor-pointer rounded-full border-2 border-white bg-brand shadow-md transition-transform hover:scale-110";
const SEARCH_PIN_CLASS =
  "size-4 rounded-full border-2 border-white bg-blue-500 shadow-md";

type LatLng = { lat: number; lng: number };
type Bounds = { north: number; south: number; east: number; west: number };

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

interface ServiceCenterMapProps {
  locations: PartnerLocation[];
  searchLocation: LatLng | null;
  selectedId: string | null;
  onSelectLocation: (id: string) => void;
  onBoundsChange?: (bounds: Bounds) => void;
  fitAllTrigger: number;
}

export function ServiceCenterMap({
  locations,
  searchLocation,
  selectedId,
  onSelectLocation,
  onBoundsChange,
  fitAllTrigger,
}: ServiceCenterMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  const markersRef = useRef<Map<string, MlMarker>>(new Map());
  const searchMarkerRef = useRef<MlMarker | null>(null);
  const popupRef = useRef<MlPopup | null>(null);
  const onSelectRef = useRef(onSelectLocation);
  const onBoundsRef = useRef(onBoundsChange);

  useEffect(() => {
    onSelectRef.current = onSelectLocation;
    onBoundsRef.current = onBoundsChange;
  });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: SP_CENTER,
      zoom: 8,
      cooperativeGestures: true,
    });
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right",
    );

    const emitBounds = () => {
      const b = map.getBounds();
      onBoundsRef.current?.({
        north: b.getNorth(),
        south: b.getSouth(),
        east: b.getEast(),
        west: b.getWest(),
      });
    };

    emitBounds();
    map.on("move", emitBounds);
    mapRef.current = map;
    const markers = markersRef.current;

    return () => {
      map.remove();
      mapRef.current = null;
      markers.clear();
      searchMarkerRef.current = null;
      popupRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const marker of markersRef.current.values()) marker.remove();
    markersRef.current.clear();
    popupRef.current?.remove();
    popupRef.current = null;

    const withCoords = locations.filter(
      (loc) => loc.lat != null && loc.lng != null,
    );

    for (const loc of withCoords) {
      const wrapper = document.createElement("div");
      const el = document.createElement("button");
      el.type = "button";
      el.className = PIN_CLASS;
      el.setAttribute("aria-label", loc.name);
      el.addEventListener("click", (event) => {
        event.stopPropagation();
        popupRef.current?.remove();
        onSelectRef.current(loc.id);

        if (loc.lat != null && loc.lng != null) {
          map.flyTo({
            center: [loc.lng, loc.lat],
            zoom: Math.max(map.getZoom(), 10),
            duration: 800,
            essential: true,
          });
        }

        const popup = new maplibregl.Popup({ closeButton: false, offset: 18 })
          .setLngLat([loc.lng as number, loc.lat as number])
          .setDOMContent(buildPopupContent(loc))
          .addTo(map);
        popupRef.current = popup;
      });
      wrapper.appendChild(el);

      const marker = new maplibregl.Marker({ element: wrapper })
        .setLngLat([loc.lng as number, loc.lat as number])
        .addTo(map);
      markersRef.current.set(loc.id, marker);
    }
  }, [locations]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (searchMarkerRef.current) {
      searchMarkerRef.current.remove();
      searchMarkerRef.current = null;
    }

    if (searchLocation) {
      const el = document.createElement("div");
      el.className = SEARCH_PIN_CLASS;
      searchMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([searchLocation.lng, searchLocation.lat])
        .addTo(map);

      map.flyTo({
        center: [searchLocation.lng, searchLocation.lat],
        zoom: 10,
        duration: 800,
        essential: true,
      });
    }
  }, [searchLocation]);

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

    const loc = locations.find((l) => l.id === selectedId);
    if (loc?.lat != null && loc?.lng != null) {
      map.flyTo({
        center: [loc.lng, loc.lat],
        zoom: Math.max(map.getZoom(), 10),
        duration: 800,
        essential: true,
      });
    }
  }, [selectedId, locations]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || fitAllTrigger === 0) return;

    if (searchLocation) {
      map.flyTo({
        center: [searchLocation.lng, searchLocation.lat],
        zoom: 10,
        duration: 800,
        essential: true,
      });
    } else {
      map.flyTo({
        center: SP_CENTER,
        zoom: 8,
        duration: 800,
        essential: true,
      });
    }
  }, [fitAllTrigger, searchLocation]);

  return (
    <div
      ref={containerRef}
      className="h-100 w-full overflow-hidden rounded-2xl bg-muted lg:h-150"
    />
  );
}
