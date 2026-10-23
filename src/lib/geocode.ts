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

export type Bounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};

export type GeocodeSuggestion = {
  displayName: string;
  city: string;
  state: string;
  lat?: number;
  lng?: number;
};

export function maskCep(digits: string): string {
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
}

export function isLikelyCep(value: string): boolean {
  const cleaned = value.replace(/\D/g, "");
  if (!cleaned) return false;
  const digits = value.replace(/[^0-9]/g, "").length;
  const letters = value.replace(/[^a-zA-Z]/g, "").length;
  return digits > 0 && letters === 0;
}

export function extractCepDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 8);
}

export function formatCepInput(value: string): string {
  const digits = extractCepDigits(value);
  const masked = maskCep(digits);
  if (value.endsWith("-") && digits.length <= 5) return masked + "-";
  return masked;
}
