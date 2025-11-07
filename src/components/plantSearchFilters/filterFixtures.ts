import { PlantDataInput } from "generated/graphql/graphql";

export type FilterInputType =
  | "text"
  | "number"
  | "checkbox"
  | "select"
  | "range";

type BaseFilterInput<T extends FilterInputType = FilterInputType> = {
  label: string;
  inputType: T;
  advancedFilter?: boolean;
  order?: number;
};

type FilterSelectInput = BaseFilterInput<"select"> & {
  defaultOptions?: string[];
  freeform?: boolean;
};

type FilterRangeInput = BaseFilterInput<"range"> & {
  minMaxValue: [number, number];
};

export type FilterInput<T extends FilterInputType = FilterInputType> =
  T extends "select"
    ? FilterSelectInput
    : T extends "range"
    ? FilterRangeInput
    : BaseFilterInput<T>;

type HiddenFilterKey =
  | "_id"
  | "boundingPolyCoords"
  | "addedTimestamp"
  | "updatedTimestamp"
  | "scrapeSources"
  | "maturityTime"
  | "uses";

export type PlantDataFilter = Omit<PlantDataInput, HiddenFilterKey>;

const FILTER_MAPPING: Record<keyof PlantDataFilter, FilterInput> = {
  commonName: { label: "Common name", inputType: "text" },
  bloomColors: {
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
  bloomTimes: {
    label: "Bloom time",
    inputType: "select",
  },

  // TODO: Better filters for these on BE -- min/max, select unit?
  height: {
    label: "Plant height (cm)",
    inputType: "number",
    advancedFilter: true,
  },
  spread: {
    label: "Plant spread (cm)",
    inputType: "number",
    advancedFilter: true,
  },

  isPerennial: {
    label: "Perennial",
    inputType: "checkbox",
  },
  lightLevels: {
    label: "Light level",
    inputType: "select",
    advancedFilter: true,
  },

  scientificName: {
    label: "Scientific name",
    inputType: "text",
    advancedFilter: true,
  },
  habitat: { label: "Habitat", inputType: "select" },
  hardiness: {
    label: "Hardiness Zones",
    inputType: "range",
    minMaxValue: [0, 9],
    advancedFilter: true,
  },
  soilTypes: {
    label: "Soil type",
    inputType: "select",
    advancedFilter: true,
  },
  physicalCharactersticsDump: {
    label: "Search description",
    inputType: "text",
  },
};

export const FILTERS = Object.entries(FILTER_MAPPING).sort(
  ([, { advancedFilter }]) => (advancedFilter ? 1 : -1)
) as [keyof PlantDataFilter, FilterInput][];

export const FIRST_ADVANCED_FILTER_INDEX = FILTERS.findIndex(
  ([, { advancedFilter }]) => advancedFilter
);
