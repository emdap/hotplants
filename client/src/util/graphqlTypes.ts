import {
  PlantDataInput,
  PlantSizeRangeInput,
  SearchRecord,
  SearchRecordBooleanFilterField,
} from "generated/graphql/graphql";

export type PlantDataFilter = Omit<PlantDataInput, "boundingPolyCoords">;

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
