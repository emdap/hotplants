import { PlantDataInput } from "generated/graphql/graphql";
import type * as Hotplants from "../generated/schemas/hotplants";
import type * as Nominatim from "../generated/schemas/nominatim";

export type LocationData =
  Nominatim.components["schemas"]["OSMGeocodeJson"][number];

export type LocationCoord = [number, number];

export type PlantSearchParams =
  Hotplants.components["schemas"]["PlantSearchParams"];
export type PlantLocationParams = Required<PlantSearchParams>["location"];
export type PlantNameParam = Required<PlantSearchParams>["plantName"];

export type OptionalSearchParamKey = "commonName" | "scientificName";

export type PlantDataFilter = Omit<PlantDataInput, "boundingPolyCoords">;

export type PlantArrayValues =
  // TODO: Omitted habitats from BE as well, not scraping good values
  Omit<Hotplants.components["schemas"]["PlantArrayValuesDocument"], "habitats">;
