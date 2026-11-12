import type { GeocodeResult } from "@/api/stetsom/model";

export type LatLng = { lat: number; lng: number };

export function isValidCoordinate(lat: unknown, lng: unknown): lat is number {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

export function toValidLatLng(lat: unknown, lng: unknown): LatLng | null {
  return isValidCoordinate(lat, lng) ? { lat, lng: lng as number } : null;
}

export type GeocodeSuggestion = Omit<
  GeocodeResult,
  "id" | "kind" | "match_precision" | "lat" | "lng"
> & {
  id?: GeocodeResult["id"];
  kind?: GeocodeResult["kind"];
  match_precision?: GeocodeResult["match_precision"];
  lat?: number;
  lng?: number;
};
