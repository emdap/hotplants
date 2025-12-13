import { PlantDataInput } from "generated/graphql/graphql";

export type FilterInputType =
  | "text"
  | "number"
  | "checkbox"
  | "select"
  | "range";

type BaseFilterInput<
  T extends FilterInputType,
  K extends keyof PlantDataInput
> = {
  plantDataKey: K;
  label: string;
  inputType: T;
  isEnabled?: boolean;
  advancedFilter?: boolean;
};

type FilterSelectInput<K extends keyof PlantDataInput> = BaseFilterInput<
  "select",
  K
> & {
  defaultOptions?: string[];
  freeform?: boolean;
};

type FilterRangeInput<K extends keyof PlantDataInput> = BaseFilterInput<
  "range",
  K
> & {
  minMaxValue: [number, number];
};

export type FilterInput<
  T extends FilterInputType = FilterInputType,
  K extends keyof PlantDataInput = keyof PlantDataInput
> = T extends "select"
  ? FilterSelectInput<K>
  : T extends "range"
  ? FilterRangeInput<K>
  : BaseFilterInput<T, K>;

const FILTER_MAPPING: FilterInput[] = [
  {
    plantDataKey: "scientificName",
    label: "Scientific name",
    inputType: "text",
    isEnabled: true,
  },
  {
    plantDataKey: "commonName",
    label: "Common name",
    inputType: "text",
    isEnabled: true,
  },
  {
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
    isEnabled: true,
  },
  {
    plantDataKey: "isPerennial",
    label: "Perennial",
    inputType: "checkbox",
    isEnabled: true,
  },
  {
    plantDataKey: "physicalCharactersticsDump",
    label: "Description keyword search",
    inputType: "text",
    isEnabled: true,
  },

  // TODO: Better filters for these on BE -- min/max, select unit?
  {
    plantDataKey: "height",
    label: "Plant height (cm)",
    inputType: "number",
    advancedFilter: true,
  },
  {
    plantDataKey: "spread",
    label: "Plant spread (cm)",
    inputType: "number",
    advancedFilter: true,
  },

  {
    plantDataKey: "bloomTimes",
    label: "Bloom time",
    inputType: "select",
  },
  {
    plantDataKey: "lightLevels",
    label: "Light level",
    inputType: "select",
    advancedFilter: true,
  },
  {
    plantDataKey: "habitat",
    label: "Habitat",
    inputType: "select",
  },
  {
    plantDataKey: "hardiness",
    label: "Hardiness Zones",
    inputType: "range",
    minMaxValue: [0, 9],
    advancedFilter: true,
  },
  {
    plantDataKey: "soilTypes",
    label: "Soil type",
    inputType: "select",
    advancedFilter: true,
  },
];

export const ENABLED_FILTERS = FILTER_MAPPING.filter(
  ({ isEnabled }) => isEnabled
);
