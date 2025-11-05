import { PlantDataInput } from "generated/graphql/graphql";

type FilterInputType = "text" | "number" | "select" | "boolean" | "range";

type BaseFilterInput<T extends FilterInputType = FilterInputType> = {
  label: string;
  inputType: T;
};

type FilterSelectInput = BaseFilterInput<"select"> & {
  defaultOptions?: string[];
  freeform?: boolean;
};

type FilterRangeInput = BaseFilterInput<"range"> & {
  minMaxValue: [number, number];
};

type FilterInput = BaseFilterInput | FilterSelectInput | FilterRangeInput;

type HiddenFilterKey =
  | "_id"
  | "boundingPolyCoords"
  | "addedTimestamp"
  | "updatedTimestamp"
  | "scrapeSources"
  | "maturityTime"
  | "uses";

type FilterKey = Omit<PlantDataInput, HiddenFilterKey>;

export const FILTER_MAPPING: Record<keyof FilterKey, FilterInput> = {
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
  habitat: { label: "Habitat", inputType: "select" },
  hardiness: {
    label: "Hardiness Zones",
    inputType: "range",
    minMaxValue: [0, 9],
  },
  height: { label: "Plant height (cm)", inputType: "number" },
  spread: { label: "Plant spread (cm)", inputType: "number" },
  isPerennial: { label: "Perennial", inputType: "boolean" },
  lightLevels: { label: "Light level", inputType: "select" },
  soilTypes: { label: "Soil type", inputType: "select" },
  scientificName: { label: "Scientific name", inputType: "text" },
  physicalCharactersticsDump: {
    label: "Search description",
    inputType: "text",
  },
};
