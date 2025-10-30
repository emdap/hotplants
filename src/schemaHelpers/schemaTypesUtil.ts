import { LocationData } from "./customSchemaTypes";

export type LocationWithBoundingBox = Omit<
  LocationData,
  "boundingbox" | "lat" | "lon"
> & {
  boundingBox: number[];
  lat: number;
  lon: number;
};

export const validateLocationData = (
  location?: LocationData
): null | LocationWithBoundingBox => {
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

  return {
    ...location,
    lat: Number(location.lat),
    lon: Number(location.lon),
    boundingBox: [
      bboxNumbers[2],
      bboxNumbers[0],
      bboxNumbers[3],
      bboxNumbers[1],
    ],
  };
};
