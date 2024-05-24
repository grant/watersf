import { UserLocation } from "../geolocation";

export type ResourceType = "drinking_water" | "restroom";

// An extended version of the WaterResource interface that includes
export interface WaterResourceComputed extends WaterResource {
  distance: number;
}

// Must follow the same structure as the data.json file
export interface WaterResource {
  name?: string;
  uid: string;
  resource_type?: string;
  water_fountain: string;
  bottle_filler: string;
  jug_filler: string;
  dog_fountain: string;
  latitude?: string;
  longitude?: string;
  address?: string;
  city?: string;
  state?: string;
  access?: string;
  source: string;
  point?: Point;
  supervisor_district?: string;
  analysis_neighborhood?: string;
  data_as_of: string;
  data_loaded_at: string;
}

export interface Point {
  type: string;
  coordinates: number[];
}

// Import data from data.json. Some of the data is undefined. The TS interface above is accurate for the data.
// eslint-disable-next-line @typescript-eslint/no-var-requires
import data from "./data.json";
const waterResources: WaterResource[] = data;

export function getResults(
  userLocation: UserLocation | null,
  resourceType: ResourceType
): WaterResourceComputed[] {
  if (!userLocation) {
    return [];
  }

  // Filter the water resources by the resource type, e.g. drinking_water or restroom
  const waterResourcesOfType = waterResources.filter(
    (resource: WaterResource) => {
      return resource.resource_type === resourceType;
    }
  );

  // Sort the water resources by distance from the user's location
  waterResourcesOfType.sort((a: WaterResource, b: WaterResource) => {
    if (!a.latitude || !a.longitude) {
      return 1;
    }
    if (!b.latitude || !b.longitude) {
      return -1;
    }
    const distanceA = Math.sqrt(
      Math.pow(userLocation.latitude - parseFloat(a.latitude), 2) +
        Math.pow(userLocation.longitude - parseFloat(a.longitude), 2)
    );
    const distanceB = Math.sqrt(
      Math.pow(userLocation.latitude - parseFloat(b.latitude), 2) +
        Math.pow(userLocation.longitude - parseFloat(b.longitude), 2)
    );
    return distanceA - distanceB;
  });

  // Only return the top 10 closest results
  const waterResults = waterResourcesOfType.slice(0, 10);

  // Add the distance to the user's location to the results
  const waterResultsComputed = waterResults.map((resource: WaterResource) => {
    if (!resource.latitude || !resource.longitude) {
      return resource;
    }
    const distance = getDistanceFromLatLonInKm(
      userLocation.latitude,
      userLocation.longitude,
      parseFloat(resource.latitude),
      parseFloat(resource.longitude)
    );
    return {
      ...resource,
      distance,
    };
  }) as WaterResourceComputed[];

  return waterResultsComputed;
}

// https://stackoverflow.com/a/27943
function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
