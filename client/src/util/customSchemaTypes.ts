import type * as Nominatim from "../generated/schemas/nominatim";

export type LocationData =
  Nominatim.components["schemas"]["OSMGeocodeJson"][number];

export type LocationCoord = [number, number];
