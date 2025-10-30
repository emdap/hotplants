import { bboxPolygon } from "@turf/turf";
import { BBox, Feature, GeoJsonProperties, Polygon } from "geojson";
import { LocationData } from "./customSchemaTypes";

export type LocationWithBoundingBox = Omit<
  LocationData,
  "boundingbox" | "lat" | "lon"
> & {
  bboxPoly: Feature<Polygon, GeoJsonProperties>;
  lat: number;
  lon: number;
};

export const validateLocationData = (
  location?: LocationData
): null | LocationWithBoundingBox => {
  if (
    !location ||
    !location.boundingbox ||
    location.lat === undefined ||
    location.lon === undefined
  ) {
    return null;
  }

  const bboxNumbers = location.boundingbox.map(Number);
  const boundingBox: BBox = [
    bboxNumbers[2],
    bboxNumbers[0],
    bboxNumbers[3],
    bboxNumbers[1],
  ];

  return {
    ...location,
    lat: Number(location.lat),
    lon: Number(location.lon),
    bboxPoly: bboxPolygon(boundingBox),
  };
};
