import { ComplexListboxOption } from "designSystem/listbox/StyledListboxOptions";
import { capitalize } from "lodash";
import { Entries } from "type-fest";
import { PlantArrayValues, PlantDataFilter } from "util/customSchemaTypes";

export type PlantDataKey = keyof PlantDataFilter;

type SelectValueType = "string" | "color" | "boolean" | "number";
export type SelectInput = `select-${SelectValueType}`;

export type FilterInputType =
  | SelectInput
  | "text"
  | "number"
  | "checkbox"
  | "range";

type FilterBase<
  K extends PlantDataKey = PlantDataKey,
  T extends FilterInputType = FilterInputType,
> = {
  plantDataKey: K;
  label: string;
  inputType: T;
  order?: number;
};

export type FilterInput<
  K extends PlantDataKey = PlantDataKey,
  T extends FilterInputType = FilterInputType,
> = FilterBase<K, T> &
  (T extends SelectInput
    ? FilterSelectInput<T>
    : T extends "range" | "number"
      ? FilterNumberInput
      : { inputType: T });

type FilterSelectInput<S extends SelectInput = "select-string"> = {
  multiselect?: boolean;
} & (S extends "select-string"
  ? {
      options?: string[];
      freeform?: boolean;
    }
  : { options: ComplexListboxOption[]; freeform?: false });

type FilterNumberInput = {
  minValue?: number;
  maxValue?: number;
};

export type FilterDict<T extends PlantDataKey = PlantDataKey> = {
  [key in T]?: FilterInput<key>;
};

export const DYNAMIC_FILTER_DICT: Required<FilterDict<keyof PlantArrayValues>> =
  {
    bloomColors: {
      plantDataKey: "bloomColors",
      label: "Bloom colors",
      inputType: "select-color",
      multiselect: true,
    },
    bloomTimes: {
      plantDataKey: "bloomTimes",
      label: "Bloom time",
      inputType: "select-string",
      multiselect: true,
    },
    lightLevels: {
      plantDataKey: "lightLevels",
      label: "Light level",
      inputType: "select-string",
      multiselect: true,
    },
    habitats: {
      plantDataKey: "habitats",
      label: "Habitat",
      inputType: "select-string",
      multiselect: true,
    },
    hardiness: {
      plantDataKey: "hardiness",
      label: "USDA Hardiness Zone",
      inputType: "select-number",
      multiselect: true,
    },
    soilTypes: {
      plantDataKey: "soilTypes",
      label: "Soil type",
      inputType: "select-string",
      multiselect: true,
    },
  };

export const STATIC_FILTER_DICT: FilterDict = {
  scientificName: {
    plantDataKey: "scientificName",
    label: "Scientific name contains",
    inputType: "text",
  },
  commonName: {
    plantDataKey: "commonName",
    label: "Common name contains",
    inputType: "text",
  },
  isPerennial: {
    plantDataKey: "isPerennial",
    label: "Perennial",
    inputType: "select-boolean",
    options: [
      { label: "Perennials only", value: true },
      { label: "Annuals only", value: false },
      { label: "Show all", value: false },
    ],
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
    inputType: "range",
    minValue: 0,
  },
  spread: {
    plantDataKey: "spread",
    label: "Plant spread (cm)",
    inputType: "range",
    minValue: 0,
  },
};

export const NON_SPECIFIED_OPTION: ComplexListboxOption = {
  label: "None specified",
  value: null,
};

export const constructDynamicFilters = (filterValues: PlantArrayValues) =>
  (
    Object.entries(filterValues) as Entries<PlantArrayValues>
  ).reduce<FilterDict>((prev, [key, values]) => {
    if (values && key in DYNAMIC_FILTER_DICT) {
      const options = [...values].sort().map((value): ComplexListboxOption => {
        if (typeof value === "string") {
          return { label: capitalize(value), value };
        }
        return { label: String(value), value };
      });
      options.push(NON_SPECIFIED_OPTION);

      (prev[key] as FilterInput<typeof key>) = {
        ...DYNAMIC_FILTER_DICT[key],
        options,
      };
    }

    return prev;
  }, {});

export const getSortedFilterEntries = (filterDict: FilterDict) =>
  (Object.entries(filterDict) as Entries<PlantDataFilter>).sort(
    ([_a, { order: orderA }], [_b, { order: orderB }]) =>
      (orderA ?? 0) - (orderB ?? 0),
  );
