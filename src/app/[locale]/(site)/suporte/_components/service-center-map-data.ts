import type { PartnerLocation } from "@/api/stetsom/model";
import { isValidCoordinate } from "@/lib/geocode";

type PointGeometry = { type: "Point"; coordinates: [number, number] };
type ServiceCenterProperties = {
  id: string;
  name: string;
  city: string;
  state: string;
};
export type ServiceCenterFeature = {
  type: "Feature";
  id: string;
  properties: ServiceCenterProperties;
  geometry: PointGeometry;
};

export type MappablePartnerLocation = PartnerLocation & {
  lat: number;
  lng: number;
};

export type ServiceCenterFeatureCollection = {
  type: "FeatureCollection";
  features: ServiceCenterFeature[];
};

export function getMappableLocations(
  locations: PartnerLocation[],
): MappablePartnerLocation[] {
  return locations.flatMap((location) => {
    if (!isValidCoordinate(location.lat, location.lng)) return [];
    return [
      { ...location, lat: location.lat as number, lng: location.lng as number },
    ];
  });
}

export function toFeatureCollection(
  locations: MappablePartnerLocation[],
): ServiceCenterFeatureCollection {
  return {
    type: "FeatureCollection",
    features: locations.map((location) => ({
      type: "Feature",
      id: location.id,
      properties: {
        id: location.id,
        name: location.name,
        city: location.city,
        state: location.state,
      },
      geometry: {
        type: "Point",
        coordinates: [location.lng, location.lat],
      },
    })),
  };
}

export function getLocationsBounds(locations: MappablePartnerLocation[]) {
  if (locations.length === 0) return null;

  return locations.reduce(
    (bounds, location) => ({
      north: Math.max(bounds.north, location.lat),
      south: Math.min(bounds.south, location.lat),
      east: Math.max(bounds.east, location.lng),
      west: Math.min(bounds.west, location.lng),
    }),
    {
      north: locations[0].lat,
      south: locations[0].lat,
      east: locations[0].lng,
      west: locations[0].lng,
    },
  );
}
