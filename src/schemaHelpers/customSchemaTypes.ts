import type * as Gbif from "../generated/schemas/gbif";
import type * as Nominatim from "../generated/schemas/nominatim";

export type PlantSearchFiltersNormalized = Omit<
  Required<Gbif.operations["searchOccurrence"]["parameters"]>["query"],
  "limit"
>;

export type LocationData =
  Nominatim.components["schemas"]["OSMGeocodeJson"][number];

export type LocationCoord = [number, number];
