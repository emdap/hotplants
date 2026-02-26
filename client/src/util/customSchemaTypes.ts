import { PlantDataInput } from "generated/graphql/graphql";
import type * as Hotplants from "../generated/schemas/hotplants";
import type * as Nominatim from "../generated/schemas/nominatim";

export type LocationData =
  Nominatim.components["schemas"]["OSMGeocodeJson"][number];

export type LocationCoord = [number, number];

export type PlantSearchParams =
  Hotplants.components["schemas"]["PlantSearchParams"];

export type OptionalSearchParamKey = "commonName" | "scientificName";

export type PlantDataFilter = Pick<PlantDataInput, OptionalSearchParamKey> &
  Omit<PlantDataInput, keyof PlantSearchParams>;

export type PlantArrayValues =
  Hotplants.components["schemas"]["PlantArrayValuesDocument"];
