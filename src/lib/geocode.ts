export type LatLng = { lat: number; lng: number };

export function toRad(value: number) {
  return (value * Math.PI) / 180;
}

export function haversineKm(a: LatLng, b: LatLng) {
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
  lat: number;
  lng: number;
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
