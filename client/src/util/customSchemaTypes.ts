import {
  PlantDataInput,
  PlantSizeRangeInput,
  SearchRecord,
  SearchRecordBooleanFilterField,
} from "generated/graphql/graphql";
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

// Re-defining ListboxValue, don't want design system to depend on this file, or vice-versa
export type PrimitiveValue = string | boolean | number | null;

// TODO: Should fix these types on the BE to make the types more generic, and add
// specific config/types for the filters
export type FilterValue =
  | PrimitiveValue
  | PrimitiveValue[]
  | ComplexFilterValue
  | PlantSizeRangeInput;

export type ComplexFilterValue = {
  value?: PrimitiveValue[] | null;
  matchAll?: boolean | null;
};

export type SearchRecordFilterInput = {
  field: keyof SearchRecord | SearchRecordBooleanFilterField;
  value: FilterValue;
};
