"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { isValidCoordinate } from "@/lib/geocode";
import maplibregl, {
  type Map as MlMap,
  type Marker as MlMarker,
} from "maplibre-gl";
import { useEffect, useMemo, useRef } from "react";

interface LocationMapPickerProps {
  lat: number | null;
  lng: number | null;
  onLocationRequest: (lat: number, lng: number) => void;
}

const DEFAULT_CENTER: [number, number] = [-46.6333, -23.5505];

export function LocationMapPicker({
  lat,
  lng,
  onLocationRequest,
}: LocationMapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  const markerRef = useRef<MlMarker | null>(null);
  const onLocationRequestRef = useRef(onLocationRequest);
  const point = useMemo(
    () =>
      isValidCoordinate(lat, lng) ? ([lng, lat] as [number, number]) : null,
    [lat, lng],
  );

  useEffect(() => {
    onLocationRequestRef.current = onLocationRequest;
  }, [onLocationRequest]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/bright",
      center: point ?? DEFAULT_CENTER,
      zoom: point ? 14 : 4,
      cooperativeGestures: true,
    });
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right",
    );
    map.on("click", (event) =>
      onLocationRequestRef.current(event.lngLat.lat, event.lngLat.lng),
    );
    mapRef.current = map;
    return () => {
      markerRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
    // Picker is initialized once; coordinates are synchronized below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markerRef.current?.remove();
    markerRef.current = null;
    if (!point) return;
    const element = document.createElement("div");
    element.className =
      "size-5 rounded-full border-2 border-white bg-brand shadow-lg";
    markerRef.current = new maplibregl.Marker({ element, draggable: true })
      .setLngLat(point)
      .addTo(map);
    markerRef.current.on("dragend", () => {
      const position = markerRef.current?.getLngLat();
      if (position) onLocationRequestRef.current(position.lat, position.lng);
    });
    map.easeTo({
      center: point,
      zoom: Math.max(map.getZoom(), 14),
      duration: 450,
    });
  }, [lat, lng, point]);

  return (
    <div className="relative h-64 overflow-hidden rounded-md border border-border bg-muted">
      <div ref={containerRef} className="size-full" />
      {!point && (
        <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded bg-white/90 px-3 py-2 text-xs text-text-subtle shadow-sm">
          Clique no mapa para posicionar o parceiro ou informe as coordenadas
          abaixo.
        </div>
      )}
    </div>
  );
}
