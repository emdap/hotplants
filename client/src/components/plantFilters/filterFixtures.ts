import { PlantDataKey } from "util/customSchemaTypes";

export type FilterInputType =
  | "text"
  | "number"
  | "checkbox"
  | "select"
  | "range";

// Keep filter type defs to all PlantDataKeys
type BaseFilterInput<K extends PlantDataKey, T extends FilterInputType> = {
  plantDataKey: K;
  label: string;
  inputType: T;
  isEnabled?: boolean;
  isDisabled?: boolean;
  advancedFilter?: boolean;
};

type FilterSelectInput<K extends PlantDataKey> = BaseFilterInput<
  K,
  "select"
> & {
  defaultOptions?: string[];
  freeform?: boolean;
};

type FilterRangeInput<K extends PlantDataKey> = BaseFilterInput<K, "range"> & {
  minMaxValue: [number, number];
};

export type FilterInput<
  K extends PlantDataKey = PlantDataKey,
  T extends FilterInputType = FilterInputType,
> = T extends "select"
  ? FilterSelectInput<K>
  : T extends "range"
    ? FilterRangeInput<K>
    : BaseFilterInput<K, T>;

export const FILTER_DICT: { [key in PlantDataKey]?: FilterInput<key> } = {
  scientificName: {
    plantDataKey: "scientificName",
    label: "Scientific name",
    inputType: "text",
  },
  commonName: {
    plantDataKey: "commonName",
    label: "Common name",
    inputType: "text",
  },
  bloomColors: {
    plantDataKey: "bloomColors",
    label: "Bloom colors",
    inputType: "select",
    defaultOptions: [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple",
      "white",
    ],
    freeform: true,
  },
  isPerennial: {
    plantDataKey: "isPerennial",
    label: "Perennial",
    inputType: "checkbox",
  },
  physicalCharactersticsDump: {
    plantDataKey: "physicalCharactersticsDump",
    label: "Description keyword search",
    inputType: "text",
  },

  // TODO: Better filters for these on BE -- min/max, select unit?
  height: {
    plantDataKey: "height",
    label: "Plant height (cm)",
    inputType: "number",
    advancedFilter: true,
    isDisabled: true,
  },
  spread: {
    plantDataKey: "spread",
    label: "Plant spread (cm)",
    inputType: "number",
    advancedFilter: true,
    isDisabled: true,
  },
  bloomTimes: {
    plantDataKey: "bloomTimes",
    label: "Bloom time",
    inputType: "select",
    isDisabled: true,
  },
  lightLevels: {
    plantDataKey: "lightLevels",
    label: "Light level",
    inputType: "select",
    advancedFilter: true,
    isDisabled: true,
  },
  habitat: {
    plantDataKey: "habitat",
    label: "Habitat",
    inputType: "select",
    isDisabled: true,
  },
  hardiness: {
    plantDataKey: "hardiness",
    label: "Hardiness Zones",
    inputType: "range",
    minMaxValue: [0, 9],
    advancedFilter: true,
    isDisabled: true,
  },
  soilTypes: {
    plantDataKey: "soilTypes",
    label: "Soil type",
    inputType: "select",
    advancedFilter: true,
    isDisabled: true,
  },
};

export const OPTIONAL_SEARCH_PARAM_KEYS = [
  "commonName",
  "scientificName",
] as const;
export const OPTIONAL_SEARCH_PARAM_FILTERS = OPTIONAL_SEARCH_PARAM_KEYS.flatMap(
  (key) => FILTER_DICT[key] ?? [],
);

export const ENABLED_FILTERS = Object.values(FILTER_DICT).filter(
  ({ isDisabled }) => !isDisabled,
);
