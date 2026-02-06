import { bboxPolygon, coordAll, simplify } from "@turf/turf";
import type { paths } from "generated/schemas/nominatim";
import { BBox, Polygon, Position } from "geojson";
import createClient from "openapi-fetch";
import { LocationData, PlantSearchParams } from "./customSchemaTypes";

export type LocationSearchParams = Pick<
  PlantSearchParams,
  "locationName" | "locationSource" | "boundingPolyCoords"
>;

const locationClient = createClient<paths>({
  baseUrl: "https://nominatim.openstreetmap.org",
});

export const lookupLocationInput = (input: string) =>
  locationClient.GET("/search", {
    params: {
      query: {
        format: "json",
        polygon_geojson: 1,
        polygon_threshold: 0.5,
        q: input,
      },
    },
  });

export const MAX_POLYGON_POINTS = 20;
const MAX_SIMPLIFY_TRIES = 5;

const simplifyPolygon = (polygon: Polygon, attempt = 0) => {
  if (attempt >= MAX_SIMPLIFY_TRIES) {
    return null;
  }

  const coords = coordAll(polygon);

  if (coords.length > MAX_POLYGON_POINTS) {
    const simplified = simplify(polygon, {
      tolerance: 0.01,
      highQuality: true,
    });

    return simplifyPolygon(simplified, attempt + 1);
  } else {
    return polygon;
  }
};

const convertNominatimGeojson = (location: LocationData) => {
  if (!location?.display_name || !location?.boundingbox || !location?.geojson) {
    return null;
  }

  if (location.geojson.type === "Polygon") {
    const simplified = simplifyPolygon(location.geojson);
    if (simplified) {
      return simplified.coordinates;
    }
  }

  const bboxNumbers = location.boundingbox.map(Number);
  const boundingBox: BBox = [
    bboxNumbers[2],
    bboxNumbers[0],
    bboxNumbers[3],
    bboxNumbers[1],
  ];

  return bboxPolygon(boundingBox).geometry.coordinates;
};

export const validateNominatimLocation = (
  location?: LocationData,
): null | LocationSearchParams => {
  if (!location?.display_name) {
    return null;
  }

  const boundingPolyCoords = convertNominatimGeojson(location);

  return (
    boundingPolyCoords && {
      locationName: location.display_name,
      locationSource: "search",
      boundingPolyCoords,
    }
  );
};

export const customLocationDisplay = (
  location: Partial<LocationSearchParams>,
) => `Custom Location: (${location.locationName ?? "N/A"})`;

export const crossesMeridian = (coordinates: Position[]) => {
  const hasCoords: Record<string, boolean> = {
    ["180"]: false,
    ["-180"]: false,
  };
  return coordinates.some(([lng]) => {
    const lngKey = String(lng);
    if (lngKey in hasCoords) {
      hasCoords[lngKey] = true;
      if (hasCoords["180"] && hasCoords["-180"]) {
        return true;
      }
    }
  });
};
