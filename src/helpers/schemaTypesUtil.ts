import { bboxPolygon } from "@turf/turf";
import { BBox, Feature, Polygon } from "geojson";
import { LocationData } from "./customSchemaTypes";

export type LocationWithPolygon = {
  displayName: string;
  locationSource: "search" | "map";
  boundingPolygon: Feature<Polygon>;
};

export const validateNominatimLocation = (
  location?: LocationData
): null | LocationWithPolygon => {
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
  const boundingPolygon = bboxPolygon(boundingBox);

  return {
    displayName: location.display_name,
    locationSource: "search",
    boundingPolygon,
  };
};
