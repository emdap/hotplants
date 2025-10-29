import type * as Gbif from "./gbif";
import type * as Nominatim from "./nominatim";

export type PlantSearchFiltersNormalized = Omit<
  Required<Gbif.operations["searchOccurrence"]["parameters"]>["query"],
  "limit"
>;

type LocationData = Nominatim.components["schemas"]["OSMGeocodeJson"][number];

export type LocationWithBoundingBox = LocationData &
  Required<Pick<LocationData, "boundingbox" | "lat" | "lon">>;

export const validateLocationData = (location?: LocationData) => {
  if (
    !location ||
    !location.display_name ||
    !location.boundingbox ||
    location.lat === undefined ||
    location.lon === undefined
  ) {
    return null;
  }
  return location as LocationWithBoundingBox;
};
