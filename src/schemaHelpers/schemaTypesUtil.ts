import { bboxPolygon, centroid } from "@turf/turf";
import { BBox, Feature, Point, Polygon } from "geojson";
import { LocationData } from "./customSchemaTypes";

export type LocationWithPolygon = {
  displayName?: string;
  locationSource: "search" | "map";
  boundingPolygon: Feature<Polygon>;
  centerPoint: Feature<Point>;
};

export const validateNominatimLocation = (
  location?: LocationData
): null | LocationWithPolygon => {
  if (
    !location ||
    !location.display_name ||
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
  const boundingPolygon = bboxPolygon(boundingBox);

  return {
    displayName: location.display_name,
    locationSource: "search",
    boundingPolygon,
    centerPoint: centroid(boundingPolygon),
  };
};
