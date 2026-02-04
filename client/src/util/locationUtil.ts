import { bboxPolygon } from "@turf/turf";
import type { paths } from "generated/schemas/nominatim";
import { BBox } from "geojson";
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
        q: input,
      },
    },
  });

export const validateNominatimLocation = (
  location?: LocationData,
): null | LocationSearchParams => {
  if (!location?.display_name || !location?.boundingbox) {
    return null;
  }

  // Converting into a bounding box/polygon for more consistent results
  // Raw polygons from nominatim are sometimes too long
  const bboxNumbers = location.boundingbox.map(Number);
  const boundingBox: BBox = [
    bboxNumbers[2],
    bboxNumbers[0],
    bboxNumbers[3],
    bboxNumbers[1],
  ];
  const boundingPolyCoords = bboxPolygon(boundingBox).geometry.coordinates;

  return {
    locationName: location.display_name,
    locationSource: "search",
    boundingPolyCoords,
  };
};

export const customLocationDisplay = (
  location: Partial<LocationSearchParams>,
) => `Custom Location: (${location.locationName ?? "N/A"})`;
